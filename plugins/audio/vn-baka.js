let handler = async (m, { conn }) => {
  const url = baka.getRandom()

  await conn.sendMessage(m.chat, {
    audio: { url },
    mimetype: 'audio/mp4',
    ptt: true
  }, { quoted: m })
}

handler.customPrefix = /^(Baka|baka)$/i
handler.command = new RegExp()

export default handler

const baka = [
  "https://files.catbox.moe/vu9yhd.mp3",
  "https://files.catbox.moe/wt319e.mp3"
]