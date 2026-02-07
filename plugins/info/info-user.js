import fs from 'fs'
import moment from 'moment-timezone'

let handler = async (m, { usedPrefix, command, conn, text }) => {
  let mentionedJid = [m.sender]
let name = conn.getName(m.sender)
    let totalreg = Object.keys(global.db.data.users).length
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
    let kon = `乂 *D A T A  U S E R*
    
👥 *User Di Database ${totalreg.toLocaleString()}*
📇 *User Yang Terdaftar ${rtotalreg.toLocaleString()}*`
    await conn.reply(m.chat, kon, flok)
}
handler.help = ['user']
handler.tags = ['main']
handler.command = /^(pengguna|(jumlah)?database|user)$/i

export default handler