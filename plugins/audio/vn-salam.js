let handler = async (m, { conn }) => {
  const url = salam.getRandom()

  await conn.sendMessage(m.chat, {
    audio: { url },
    mimetype: 'audio/mpeg',
    ptt: true
  }, { quoted: m })
}

handler.customPrefix = /^(assalamualaikum|assalamu'alaikum|salam|asalamualaikum|assalam|asalam|salom|shalom)$/i
handler.command = new RegExp()

export default handler

const salam = [
  "https://files.catbox.moe/v96yld.opus"
]