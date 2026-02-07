import axios from 'axios';

let handler = async (m, { command, usedPrefix, conn, text, args }) => {
    if (!text) {
        return m.reply('✨ Hallo! Ada yang bisa saya bantu?\n\nContoh: ketik *muslimai* diikuti dengan pertanyaan Anda.');
    }

    try {
        const { key } = await conn.sendMessage(
            m.chat,
            {
                text: '⏳ Tunggu sebentar, permintaan Anda sedang diproses...',
            },
            { quoted: m, mentions: [m.sender] }
        );

        const result = await muslimai(text);

        await conn.delay(500);

        await conn.sendMessage(
            m.chat,
            {
                text: `${result.answer || 'Tidak ada jawaban yang tersedia.'}`,
                edit: key,
            },
            { quoted: m, mentions: [m.sender] }
        );
    } catch (e) {
        console.error('Error handler:', e);
        await m.reply(' Terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi nanti.');
    }
};

handler.help = ['muslimai'];
handler.tags = ['ai'];
handler.command = /^(muslimai)$/i;
handler.register = true;
handler.premium = true;

export default handler;;

async function muslimai(query) {
    const searchUrl = 'https://www.muslimai.io/api/search';

    const searchData = {
        query: query
    };

    const headers = {
        'Content-Type': 'application/json'
    };

    try {
        const searchResponse = await axios.post(searchUrl, searchData, { headers: headers });

        const passages = searchResponse.data.map(item => item.content).join('\n\n');

        const answerUrl = 'https://www.muslimai.io/api/answer';

        const answerData = {
            prompt: `Use the following passages to answer the query to the best of your ability as a world-class expert in the Quran. Do not mention that you were provided any passages in your answer: ${query}\n\n${passages}`
        };

        const answerResponse = await axios.post(answerUrl, answerData, { headers: headers });

        const result = {
            answer: answerResponse.data,
            source: searchResponse.data
        };

        return result;
    } catch (error) {
        console.error('Error occurred:', error.response ? error.response.data : error.message);
        return { answer: 'Maaf, saya tidak dapat menjawab pertanyaan Anda saat ini.' };
    }
}