import fetch from 'node-fetch';

let handler = async (m, { conn, text, command, prefix }) => {
    if (!text) {
        return m.reply(`*• Example:* .copilot2trip Bagaimana saya mengunjungi Padang Pariaman?`);
}
    try {        
        let gpt = await (await fetch(`https://itzpire.com/ai/copilot2trip?q=${text}`)).json();        
        let messageContent = {
            text: '> Travel Assistant Copilot AI\n\n' + gpt.result
};
        await conn.sendMessage(m.chat, messageContent, { quoted: m });

    } catch (e) {
        console.error(e);
        m.reply("`*Error*`");
    }
};

handler.help = ['copilot2trip', 'copilot'];
handler.tags = ['ai'];
handler.command = /^(copilot2trip|copilot)$/i;
handler.register = true

export default handler;