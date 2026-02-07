/*
 
# Fitur : Get Invite Group via ID
# Type : Plugins ESM
# Created by : https://whatsapp.com/channel/0029Vb2qri6JkK72MIrI8F1Z
# Api : native baileys (groupInviteCode)
 
   ⚠️ _Note_ ⚠️
jangan hapus wm ini banggg
 
*/
 
export async function handler(m, { conn, text, args, usedPrefix, command }) {
  try {
    let idgc = args[0]
    if (!idgc) throw `Contoh:\n${usedPrefix + command} 120363xxxxxxx@g.us`
 
    let code = await conn.groupInviteCode(idgc)
    let url = `https://chat.whatsapp.com/${code}`
 
    await m.reply(`Berhasil dapat link:\n${url}`)
  } catch (e) {
    if (e?.output?.statusCode === 401 || /not-authorized/i.test(e.message)) {
      m.reply(`aku bukannn admin di group ituuu T~T`)
    } else {
      m.reply(`❌ Error\nLogs error : ${e.message}`)
    }
  }
}
 
handler.command = /^idgc2$/i
handler.help = ['idgc2 <idgc>']
handler.tags = ['group', 'owner']
handler.rowner = true
export default handler