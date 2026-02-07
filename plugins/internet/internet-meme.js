import axios from 'axios';

let handler = async (m, { conn, text, command }) => { 
     
     let response = `https://api.lolhuman.xyz/api/meme/darkjoke?apikey=${global.lol}`
   //  let { status, result } = response.data;
     
     if (response) {
     
     conn.sendFile(m.chat, response, 'eror.jpg', '*✅ Sukses*', m)
     } else return m.reply(eror)
     
}
handler.tags = ['internet']
handler.help = ['meme']
handler.command = /^(meme|mim)/i
handler.limit = 1

export default handler