let handler = async (m, { conn }) => {
  // React emoji 🍏 saat mulai proses
  await conn.sendMessage(m.chat, {
    react: {
      text: '🍏',
      key: m.key
    }
  })

  try {
    await conn.sendMessage(m.chat, {
      image: { url: 'https://coffee.alexflipnote.dev/random' },
      caption: '☕️ Nikmati kopinya!',
    }, { quoted: m })
  } catch (e) {
    await conn.sendMessage(m.chat, {
      text: '⚠️ Gagal mengambil gambar kopi',
    }, { quoted: m })
  }
}

handler.help = ['coffee', 'kopi']
handler.tags = ['fun']
handler.command = /^(coffee|kopi)$/i

export default handler