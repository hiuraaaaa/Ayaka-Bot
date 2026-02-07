import axios from 'axios'

let handler = async (m, { text, conn }) => {
        
        if (!text) return conn.reply(m.chat, `Codenya mana?\nContoh: .encode <code>`, m)
        let response = await axios.get(`https://api.betabotz.eu.org/api/tools/base?encode=${encodeURIComponent(text)}&type=base64&apikey=${lann}`)
        const { status, result } = response.data
        
        if (status && result) {
           const { type, string, encode } = result
           conn.reply(m.chat, encode, m)
           } else return conn.reply(m.chat, `Maaf, sedang eror.`, m)
}
handler.tags = ['tools']
handler.help = ['encode <codenya>']
handler.command = /^(encode)/i
handler.premium = true

export default handler