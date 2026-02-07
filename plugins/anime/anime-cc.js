import axios from 'axios'
let handler = async(m, { conn, usedPrefix, command }) => {
let ccanime = (await axios.get(`https://raw.githubusercontent.com/ClayzaAubert/library/main/media/cosplayercina.json`)).data  
let cc = await ccanime[Math.floor(ccanime.length * Math.random())]
conn.sendFile(m.chat, cc, 'error.jpg', `*ekhmmmm😋*`, m)}
//conn.sendButton(m.chat, "*Siiiuuuuuu*", author, ronaldo, [['⚽ NEXT ⚽', `${usedPrefix + command}`]], m)}
handler.help = ['ccanime']
handler.tags = ['anime']
handler.command = /^(cc|ccanime)$/i
export default handler