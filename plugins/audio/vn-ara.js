let handler = async (m, { conn }) => {
  const url = ara.getRandom()

  await conn.sendMessage(m.chat, {
    audio: { url },
    mimetype: 'audio/mp4',
    ptt: true
  }, { quoted: m })
}

handler.customPrefix = /^(Ara ara|ara ara|Ara|ara)$/i
handler.command = new RegExp()

export default handler

const ara = [
  "https://c.termai.cc/a42/7ONnZZw.mp3",
  "https://c.termai.cc/a73/Has1C.mp3",
  "https://c.termai.cc/a50/qn1RN.mp3",
  "https://c.termai.cc/a5/0uI8t.mp3",
]