let handler = async (m, { conn }) => {
  const url = baka.getRandom()

  await conn.sendMessage(m.chat, {
    audio: { url },
    mimetype: 'audio/mpeg',
    ptt: true
  }, { quoted: m })
}

handler.customPrefix = /^(yamete|yamate|yameteh|yametekudasai|yametehkudasai|yamete kudasai|yameteh kudasai)$/i
handler.command = new RegExp()

export default handler

const baka = [
  "https://files.catbox.moe/mq5m09.mp3"
]