let handler = async (m, { conn }) => {
  const url = wibu.getRandom()

  await conn.sendMessage(m.chat, {
    audio: { url },
    mimetype: 'audio/mpeg',
    ptt: true
  }, { quoted: m })
}

handler.customPrefix = /^(wibu|Wibu|dasar wibu)$/i
handler.command = new RegExp()

export default handler

const wibu = [
  "https://files.catbox.moe/j7xh7x.mp3",
  "https://files.catbox.moe/ekqvhg.mp3"
]