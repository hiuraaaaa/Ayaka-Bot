import axios from 'axios';

let handler = async (m, { conn, text, command }) => { 
     if (!text) return m.reply(`Contoh: .creatememe ih jawir`)
     if (text.split('').length > 100) return m.reply(`Maks Text Hanya 100`)
     let response = `https://api.lolhuman.xyz/api/meme4?apikey=${global.lol}&text=${text}`
   //  let { status, result } = response.data;
     
     if (response) {
     
     conn.sendFile(m.chat, response, 'eror.jpg', '*✅ Sukses*', m)
     } else return m.reply(eror)
     
}
handler.tags = ['internet']
handler.help = ['creatememe']
handler.command = /^(bikinmeme|creatememe)/i
handler.limit = 1

export default handler