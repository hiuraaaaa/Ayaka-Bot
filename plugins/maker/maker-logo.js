import axios from 'axios';

let handler = async (m, { conn, text, command }) => { 
     if (!text) return m.reply(`Contoh: .logo Lann4you!`)
     if (text.split('').length > 15) return m.reply(`Maks Text Hanya 15`)
     let response = `https://api.lolhuman.xyz/api/ephoto1/fpslogo?apikey=${global.lol}&text=${text}`
   //  let { status, result } = response.data;
     
     if (response) {
     
     conn.sendFile(m.chat, response, 'eror.jpg', '*✅ Sukses*', m)
     } else return m.reply(eror)
     
}
handler.tags = ['maker']
handler.help = ['logo']
handler.command = /^(logo)/i
handler.limit = 5

export default handler