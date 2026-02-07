let handler = async (m, { conn }) => {
  const url = audio.getRandom()

  await conn.sendMessage(m.chat, {
    audio: { url },
    mimetype: 'audio/mpeg',
    ptt: true
  }, { quoted: m })
}

handler.customPrefix = /^(bot|ping|p|hi|hai|hey|halo|helo|hello|hi Ayaka|hai Ayaka|halo Ayaka|helo Ayaka|hello Ayaka|haloo|halooo|haloooo|halooooo|)$/i
handler.command = new RegExp()

export default handler

const audio = [
  "https://files.catbox.moe/bvsscm.mp3",
  "https://files.catbox.moe/0u7bzh.opus",
  "https://files.catbox.moe/aglsr6.opus",
  "https://files.catbox.moe/fhte8b.opus"
]