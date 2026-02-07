let handler = async (m, { conn }) => {
  const url = love.getRandom()

  await conn.sendMessage(m.chat, {
    audio: { url },
    mimetype: 'audio/mpeg',
    ptt: true
  }, { quoted: m })
}

handler.customPrefix = /^(lopyou|lopyu|loveyou|love|lope| love you|i love you|i love u|love you|love u|i love)$/i
handler.command = new RegExp()

export default handler

const love = [
  "https://files.catbox.moe/086y28.mp3",
  "https://files.catbox.moe/vkuswg.mp3"
]