import axios from 'axios';
import * as cheerio from 'cheerio';
const { proto, generateWAMessageFromContent } = (await import("@adiwajshing/baileys")).default;

const handler = async (m, { conn, command }) => {
  async function getCerpen() {
    try {
      const res = await axios.get("http://cerpenmu.com/100-cerpen-kiriman-terbaru")
      const $ = cheerio.load(res.data)
      const hasil = []

      $("a[title]").each((_, el) => {
        const judul = $(el).attr("title")
        const link = $(el).attr("href")
        hasil.push({ judul, link })
      })

      return hasil
    } catch (err) {
      console.error("Gagal mengambil cerpen:", err)
      return []
    }
  }

  const rs = await getCerpen()
  if (rs.length === 0) {
    return conn.sendMessage(m.chat, { text: "Maaf, belum bisa mengambil daftar cerpen saat ini." }, { quoted: m })
  }

  const cerpenRandom = rs.sort(() => Math.random() - 0.5).slice(0, 5)
  const hasilText = cerpenRandom.map((a, i) => `*${i + 1}. ${a.judul}*\n_Baca selengkapnya:_ ${a.link}`).join("\n\n")

  const caption = `*Cerpen Pilihan Hari Ini*\n\nBacalah kisah-kisah pendek yang penuh makna, lucu, menyentuh hati, dan inspiratif:\n\n${hasilText}\n\n_Tekan tombol di bawah untuk mendapatkan cerpen lainnya!_`

  return conn.sendMessage(m.chat, {
    text: caption,
    buttons: [
      { buttonId: `.cerpen`, buttonText: { displayText: 'Ambil Cerpen Lagi' }, type: 1 }
    ],
    headerType: 1
  }, { quoted: m })
}

handler.command = ['cerpen']
handler.tags = ['internet']
handler.help = ['cerpen']

export default handler