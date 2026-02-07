import fetch from 'node-fetch';
// PLUGINS
let handler = async (m, { conn, from, usedPrefix, command, text, reply }) => {    
        if (!text) return m.reply('input text nya');
            try {
                const apiUrl = `https://restapii.rioooxdzz.web.id/api/metaai?message=${encodeURIComponent(text)}`;
                const response = await fetch(apiUrl);
                const mark = await response.json();

                const ress = mark.result.meta || 'Maaf, saya tidak bisa memahami permintaan Anda.';

                await conn.sendMessage(m.chat, { text: ress }, {quoted:m});
                
} catch (error) {
    console.error("Terjadi kesalahan:", error.message);
}
}
handler.help = ['aimeta'];
handler.tags = ['ai'];
handler.register = true;
handler.command = /^(aimeta)$/i;

export default handler;