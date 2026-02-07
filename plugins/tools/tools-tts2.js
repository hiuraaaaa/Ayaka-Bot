import axios from 'axios';

let handler = async (m, { text, conn, command}) => {

    if (!text) return m.reply(`text nya mana?\n*Contoh:* .${command} hai aku ipah`)
    let response = await axios.get(`https://skizo.tech/api/tts?apikey=${global.skizo}&text=${text}&voice=darma`);
    
    let { status, url } = response.data
    
    if (status === 200 && url) {
    conn.sendFile(m.chat, url, '', '', m, null)
    } else {
    m.reply(eror)
    }
}
handler.tags = ['tools']
handler.help = ['tts2']
handler.command = /^(tts2)/i

handler.register = true
handler.limit = true

export default handler;