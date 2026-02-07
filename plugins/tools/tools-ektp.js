import axios from 'axios'

let handler = async (m, { conn, args, usedPrefix, command, text }) => {
  const defaultPhoto = 'https://telegra.ph/file/265c67209dd7c0b7a0d33.jpg'

  let user = m.mentionedJid?.[0] || m.quoted?.sender || m.sender

  if (!text) {
    return m.reply(`📌 *Format Salah!*\n\nGunakan:\n${usedPrefix + command} provinsi|kota|nik|ttl|jenis_kelamin|gol_darah|alamat|rt/rw|kel/desa|kecamatan|agama|status|pekerjaan|kewarganegaraan|masa_berlaku|terbuat @tag\n\n📍 *Contoh:*\n${usedPrefix + command} JAWA BARAT|BANDUNG|1234567890123456|Bandung, 01-01-1990|Laki-laki|O|Jl. Contoh No. 123|001/002|Sukajadi|Sukajadi|Islam|Belum Kawin|Pegawai Swasta|WNI|Seumur Hidup|01-01-2023 @tag`)
  }

  try {

    let nama = (await conn.getName(user))?.split(' ').slice(0, 2).join(' ') || 'User'
    let ppUrl = await conn.profilePictureUrl(user, 'image').catch(() => defaultPhoto)

    let input = text.replace(/@[\d]+/, '').trim().split('|').map(s => s.trim())
    if (input.length < 16) return m.reply('⚠️ Format tidak valid. Harus ada 16 data dipisahkan dengan tanda "|".')

    let [
      provinsi, kota, nik, ttl, jenis_kelamin, golongan_darah,
      alamat, rtrw, kel_desa, kecamatan, agama, status,
      pekerjaan, kewarganegaraan, masa_berlaku, terbuat
    ] = input.map(v => encodeURIComponent(v))

    const url = `https://api.siputzx.my.id/api/m/ektp?provinsi=${provinsi}&kota=${kota}&nik=${nik}&nama=${encodeURIComponent(nama)}&ttl=${ttl}&jenis_kelamin=${jenis_kelamin}&golongan_darah=${golongan_darah}&alamat=${alamat}&rt%2Frw=${rtrw}&kel%2Fdesa=${kel_desa}&kecamatan=${kecamatan}&agama=${agama}&status=${status}&pekerjaan=${pekerjaan}&kewarganegaraan=${kewarganegaraan}&masa_berlaku=${masa_berlaku}&terbuat=${terbuat}&pas_photo=${encodeURIComponent(ppUrl)}`

    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      headers: { 'Accept': '*/*' }
    })

    const imageBuffer = response.data

    await conn.sendMessage(m.chat, {
      image: imageBuffer,
      caption: `🪪 *eKTP berhasil dibuat untuk* @${user.split('@')[0]}`,
      mentions: [user]
    }, { quoted: m })

  } catch (e) {
    console.error('[eKTP Error]', e)
    m.reply('❌ Gagal membuat eKTP. Pastikan format valid atau coba beberapa saat lagi.')
  }
}

handler.help = ['ektp <data>|... @tag']
handler.tags = ['tools']
handler.command = ['ektp']
handler.register = true

export default handler