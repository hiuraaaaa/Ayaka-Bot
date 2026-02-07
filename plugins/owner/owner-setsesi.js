let handler = async(m, { conn, text }) => {
  if (!text) throw `No Prefix detected...`
  global.sesiId = text
  await m.reply(`Sukses Set SessionsId`)
}
handler.help = ['setsesi']
handler.tags = ['owner']
handler.command = /^(setsesi)$/i

handler.rowner = true

export default handler