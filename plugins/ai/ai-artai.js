let handler = async (m, { conn, text }) => {
  if (!text) {
    return m.reply('Masukkan prompt.\nContoh: .artai Cute Girl')
  }

  // Kirim reaksi emoji 🍏
  await conn.sendMessage(m.chat, {
    react: { text: '🍏', key: m.key }
  })

  // Kirim gambar dari AI
  await conn.sendMessage(m.chat, {
    image: { url: `https://www.abella.icu/art-ai?q=${encodeURIComponent(text)}` },
    caption: `🎨 Hasil AI untuk: *${text}*`
  }, { quoted: m })
}

handler.help = ['artai']
handler.tags = ['ai']
handler.command = ['artai']

export default handler