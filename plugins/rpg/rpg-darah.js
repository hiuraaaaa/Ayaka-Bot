import { generateWAMessageFromContent } from '@adiwajshing/baileys'
let handler = async(m, { conn, text, usedPrefix, command }) => {
    let user = global.db.data.users[m.sender]
    let health = global.db.data.users[m.sender].health
    let healt = global.db.data.users[m.sender].healt
    let nuy = `Darah kamu ${healt}🩸`
      m.reply( nuy )
    }
handler.tags = ['rpg']
handler.help = ['darah']
handler.command = /^(darah)$/i

export default handler