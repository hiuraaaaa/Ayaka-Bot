import fs from 'fs'
import fetch from 'node-fetch'
let handler = async(m, { conn, text, groupMetadata }) => {
   
   let pesan = `*\`<> Lann4youOfc <>\`:*\n`
   let suc = `✓ Success mengirim hidetag ke grup
☁️ Lann4you!`
 const participants = (m.isGroup ? groupMetadata.participants: ['120363372238443653@g.us']) || []
 
    conn.sendMessage('120363372238443653@g.us', { text: pesan + text, mentions: participants.map(a => a.id) }, {quoted:flok})
    conn.reply(m.chat, suc, m)
    }
handler.help = ['gckomunitas']
handler.tags = ['owner']
handler.command = ['gckomunitas']

handler.group = false
handler.owner = true

export default handler