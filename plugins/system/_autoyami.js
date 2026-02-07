import axios from 'axios';

async function characterAi(text, chat_Id) {
    let charId = 'kwsYvpyLp0JzX9p7E3qwjga1KOlAWEaSBeXKTaq6U-U';

    try {
        let response = await axios({
            method: "POST",
            url: "https://api.apigratis.site/cai/send_message",
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                external_id: charId,
                message: text,
                chat_id: chat_Id
            })
        });

        let result = response.data.result
        let replies = result.replies
        let chatId = result.chat_id
        let ipah = {
            status: true,
            creator: 'NiLann4youc',
            text: replies[0].text,
            sessionId: chatId
          }
    //      console.log(ipah)
          return ipah;
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        return error;
    }
    return;
}

let handler = m => m;

handler.before = async (m, { isOwner, conn, text}) => {
    let chat = global.db.data.chats[m.chat];
    if (chat.autoRyo && !chat.isBanned) {
        if (!isOwner) return;
        if (/^.*false|disnable|(turn)?off|0/i.test(m.text)) return;
        if (!m.text) return;
        if (!m.quoted || !m.quoted.fromMe) return;
        try {
        let user = global.db.data.users[m.sender]
        let result = await characterAi(m.text, user.sessionId)
        let message = result.text

        //const { success, result } = response.data;

        if (message.split('').length > 1) {
            m.reply(message)
        } else {
            return m.reply(`Ada masalah dalam mengambil jawaban.`);
        }
    } catch (error) {
        console.error(error);
        return m.reply(`Terjadi kesalahan dalam komunikasi dengan server.`);
    }
    }
    return true;
}

export default handler;