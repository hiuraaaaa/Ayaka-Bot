let handler = async (m, { conn }) => {
  const url = baka.getRandom()

  await conn.sendMessage(m.chat, {
    audio: { url },
    mimetype: 'audio/mpeg',
    ptt: true
  }, { quoted: m })
}

handler.customPrefix = /^(anjay|anjai|anjayy)$/i
handler.command = new RegExp()

export default handler

const baka = [
  "https://files.catbox.moe/f8fme5.mp3"
]