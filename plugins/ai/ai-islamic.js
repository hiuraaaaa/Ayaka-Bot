import axios from 'axios'

let handler = async (m, { text, command }) => {
  if (!text) return m.reply('❓ Pertanyaannya mana?\n\nContoh: .tanyaislam apa hukum pacaran dalam Islam?')

  try {
    const res = await axios.post(
      'https://vercel-server-psi-ten.vercel.app/chat',
      {
        text,
        array: [
          {
            content: "What is Islam? Tell with reference to a Quran Ayat and explanation.",
            text: text
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'origin': 'https://islamandai.com',
          'referer': 'https://islamandai.com',
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
        }
      }
    )

    let result = res.data?.result
    if (!result) throw '❌ Jawaban tidak ditemukan!'

    await m.reply(`📘 *Jawaban Islami:*\n\n${result}`)
  } catch (err) {
    console.error(err)
    m.reply('❌ Terjadi kesalahan saat mengambil jawaban.')
  }
}

handler.command = ['tanyaislam','islamicai']
handler.help = ['tanyaislam <pertanyaan>']
handler.tags = ['islam']
handler.register = true
handler.limit = 2

export default handler