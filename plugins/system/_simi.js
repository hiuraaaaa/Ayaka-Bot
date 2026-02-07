import axios from 'axios'
let handler = m => m

handler.before = async (m) => {
    let chat = global.db.data.chats[m.chat]
    if (chat.simi && !chat.isBanned ) {
        if (/^.*false|disnable|(turn)?off|0/i.test(m.text)) return
        if (!m.text) return
        const response = await axios.get(`https://aemt.me/simi?text=${encodeURIComponent(m.text)}`);
    const { status, result } = response.data;

    if (status && result) {
      await conn.reply(m.chat, result, m);
    }
        return !0
    }
    return true
}
export default handler