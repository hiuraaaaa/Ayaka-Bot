import moment from 'moment-timezone'
import PhoneNum from 'awesome-phonenumber'

let handler = async (m, { conn }) => {
  let text = m.quoted?.text || m.text
  if (!text) throw '❗ Balas pesan berisi daftar nomor\nFormat: satu nomor per baris.'

  let numbers = [...new Set(text.match(/\d+/g))]
  if (!numbers.length) throw '❌ Tidak ada nomor valid ditemukan.'

  await m.reply(`🔍 Mengecek *${numbers.length}* nomor...⏳`)

  let akunBisnis = []
  let akunBiasa = []

  // Diubah → nomor bio dipisah berdasarkan tahun
  let bioPerTahun = {}

  let totalCek = 0

  for (let num of numbers) {
    let clean = num.replace(/\D/g, '')
    let jid = clean + '@s.whatsapp.net'

    try {
      let info = await conn.onWhatsApp(jid)
      if (info?.[0]?.exists) {

        // Cek bisnis
        let bisnis = await conn.getBusinessProfile(jid).catch(_ => null)

        // Cek bio
        let bioData = await conn.fetchStatus(jid).catch(_ => null)
        let bio = null
        let tanggalBio = null

        if (bioData) {
          if (Array.isArray(bioData) && bioData[0]?.status) {
            bio = bioData[0].status?.status || null
            tanggalBio = bioData[0].status?.setAt || null
          } else {
            bio = bioData.status || null
            tanggalBio = bioData.setAt || null
          }
        }

        // Jika ada bio → kelompokkan berdasarkan tahun
        if (bio && tanggalBio) {

          let date = new Date(tanggalBio)
          let tahun = date.getFullYear()

          let tanggalFormat = date.toLocaleString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          })

          if (!bioPerTahun[tahun]) bioPerTahun[tahun] = []

          bioPerTahun[tahun].push(
`📌 *+${clean}*
Jenis : ${bisnis ? "Akun Bisnis" : "Akun Biasa"}
Bio   : ${bio}
🕒 Dibuat : ${tanggalFormat}`
          )

        } else {
          // Tidak ada bio → masukkan ke kategori masing-masing
          if (bisnis) akunBisnis.push(`+${clean}`)
          else akunBiasa.push(`+${clean}`)
        }

        totalCek++
      }

      await new Promise(res => setTimeout(res, 300))

    } catch (_) {
      continue
    }
  }

  let waktu = moment().tz('Asia/Jakarta').format('HH:mm:ss')

  let caption = `*📋 Hasil Cek WhatsApp*\n\n`

  // Bagian bisnis tanpa bio
  if (akunBisnis.length) {
    caption += `🏢 *Akun Bisnis (${akunBisnis.length})*\n${akunBisnis.join('\n')}\n\n`
  }

  // Bagian biasa tanpa bio
  if (akunBiasa.length) {
    caption += `✅ *Akun Biasa (${akunBiasa.length})*\n${akunBiasa.join('\n')}\n\n`
  }

  // Bagian nomor dengan bio per tahun
  let tahunList = Object.keys(bioPerTahun).sort((a, b) => a - b)

  if (tahunList.length) {
    caption += `📝 *Nomor Dengan Bio (${tahunList.reduce((acc, t) => acc + bioPerTahun[t].length, 0)})*\n\n`

    for (let tahun of tahunList) {
      caption += `📆 *${tahun}*\n${bioPerTahun[tahun].join('\n\n')}\n\n`
    }
  }

  caption += `📊 Total Aktif: ${totalCek}\n🕒 ${waktu} WIB`

  if (totalCek === 0) caption = '❌ Tidak ada nomor aktif.'

  await conn.sendMessage(m.chat, { text: caption.trim() }, { quoted: m })
}

handler.help = ['ceknomaktif']
handler.tags = ['tools']
handler.command = /^(ceknomaktif)$/i

export default handler