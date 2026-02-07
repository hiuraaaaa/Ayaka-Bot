import axios from 'axios';

let handler = m => m;

handler.before = async (m, { isOwner, conn, text}) => {
    let chat = global.db.data.chats[m.chat];
    if (chat.autoFrieren && !chat.isBanned) {
        if (!isOwner) return;
        if (/^.*false|disnable|(turn)?off|0/i.test(m.text)) return;
        if (!m.text) return;
        try {
        let response = await axios.get(`https://skizoasia.xyz/api/cai/chat?apikey=${global.skizo}&characterId=t2k6pgS4o5KZQ7wFlH2SiWae2UBxzBsiS0BOrVhkXoc&text=${m.text}&sessionId=&token=e152219fa520212ad983b65072ee4a932a19fc79`);

        const { success, result } = response.data;

        if (success && result) {
            const { text, srcCharacterName, urlAvatar, sessionId } = result
            const ipah = result.text
            m.reply(ipah)
        } else {
            return m.reply(`Ada masalah dalam mengambil jawaban.`);
        }
    } catch (error) {
        console.error(error);
        return m.reply(`Terjadi kesalahan dalam komunikasi dengan server.`);
    }
    }
    return true;
};

export default handler;