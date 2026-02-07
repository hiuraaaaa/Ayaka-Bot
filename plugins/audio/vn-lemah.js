let handler = async (m, { conn }) => {
  const url = "https://files.catbox.moe/87ej79.mp3"

  await conn.sendMessage(m.chat, {
    audio: { url },
    mimetype: 'audio/mpeg',
    ptt: true
  }, { quoted: m })
}

handler.customPrefix = /^(lemah|dasar lemah|lemah lu|lemah amat)$/i
handler.command = new RegExp()

export default handler