import axios from 'axios';

async function venicechat(question) {
    try {
        if (!question) throw new Error('Pertanyaan tidak boleh kosong');
        
        const { data } = await axios.request({
            method: 'POST',
            url: 'https://outerface.venice.ai/api/inference/chat',
            headers: {
                accept: '*/*',
                'content-type': 'application/json',
                origin: 'https://venice.ai',
                referer: 'https://venice.ai/',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'user-agent': 'Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0',
                'x-venice-version': 'interface@20250523.214528+393d253'
            },
            data: JSON.stringify({
                requestId: 'nekorinn_bot_user',
                modelId: 'dolphin-3.0-mistral-24b',
                prompt: [
                    {
                        content: question,
                        role: 'user'
                    }
                ],
                systemPrompt: '',
                conversationType: 'text',
                temperature: 0.8,
                webEnabled: true,
                topP: 0.9,
                isCharacter: false,
                clientProcessingTime: 15
            })
        });
        
        const chunks = data.split('\n').filter(chunk => chunk.trim() !== '').map(chunk => {
            try {
                return JSON.parse(chunk);
            } catch (e) {
                console.warn("Gagal parse chunk JSON:", chunk, e);
                return null;
            }
        }).filter(parsedChunk => parsedChunk !== null);

        const result = chunks.map(chunk => chunk.content).join('');
        
        if (!result || result.trim() === '') {
            throw new Error('Tidak ada konten yang ditemukan dari respons AI.');
        }
        return result;

    } catch (error) {
        console.error("Error dalam fungsi venicechat:", error.message);
        if (error.response && error.response.data) {
            console.error("Data error dari API Venice:", error.response.data);
            throw new Error(`Gagal menghubungi Venice AI: ${error.message} - ${JSON.stringify(error.response.data)}`);
        }
        throw new Error(`Gagal mendapatkan hasil dari Venice AI: ${error.message}`);
    }
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Silakan masukkan pertanyaan Anda.\n\nContoh: *${usedPrefix}${command} Apa kabar?*`;

    try {
        await conn.sendMessage(m.chat, { react: { text: '🧠', key: m.key } });

        const question = text;
        const response = await venicechat(question);

        await m.reply(response);

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (err) {
        console.error("Error dalam handler veniceai:", err);
        try {
            await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        } catch (reactErr) {
            console.error("Gagal mengirim reaksi error:", reactErr);
        }
        
        let errorMessage = `❌ Maaf, terjadi kesalahan: ${err.message || 'Tidak dapat memproses permintaan Anda saat ini.'}`;
        await conn.reply(m.chat, errorMessage, m);
    }
};

handler.help = ['veniceai <pertanyaan>', 'venice <pertanyaan>'];
handler.tags = ['ai', 'internet'];
handler.command = /^(veniceai|venice)$/i;
handler.limit = true;
 handler.register = true;
 handler.premium = false;

export default handler;