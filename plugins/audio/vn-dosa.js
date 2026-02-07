let handler = async (m, { conn }) => {
  const url = dosa.getRandom()

  await conn.sendMessage(m.chat, {
    audio: { url },
    mimetype: 'audio/mpeg',
    ptt: true
  }, { quoted: m })
}

handler.customPrefix = /^(anj|kontol|ngentod|asu|anjing|puki|babi|bokep|bagi hentai|mau coli|mau colmek|mau ngocok|bagi bokep|coli|bokep|hentai|nonton bokep|nonton hentai|nyari bokep|nyari hentai)$/i
handler.command = new RegExp()

export default handler

const dosa = [
  "https://files.catbox.moe/qgfp90.mp3",
  "https://files.catbox.moe/5si5mo.mp3"
]