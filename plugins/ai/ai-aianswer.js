import axios from 'axios';

// Fungsi untuk mendapatkan jawaban AI dari API
const aiAnswer = {
    chat: async function(input) {
        try {
            const response = await axios.post('https://aianswer.pro/api',
                { question: input },
                {
                    headers: {
                        'content-type': 'application/json',
                        'origin': 'https://aianswer.pro',
                        'referer': 'https://aianswer.pro/',
                        'user-agent': 'Postify/1.0.0'
                    }
                }
            );
            return {
                creator: 'Ponta Gellooo',
                status: 'success',
                code: 200,
                data: response.data
            };
        } catch (error) {
            return {
                creator: 'Ponta Gellooo',
                status: 'error',
                code: error.response ? error.response.status : 500,
                message: error.message
            };
        }
    }
};

// Handler untuk menangani input dan memberikan respon
const ponta = async (m, { text, conn }) => {
    const prompt = text.trim();

    if (!prompt) {
        return m.reply("Mau nanya apa?");
    }
    
    await conn.sendMessage(m.chat, { react: { text: '🎨', key: m.key } });

    try {
        // Menggunakan fungsi ponta untuk mendapatkan jawaban
        const response = await aiAnswer.chat(prompt);
        
        if (response.status === 'success') {
            const message = response.data.answer || 'Tidak ada respons yang diterima dari model.';
            
            // Mengirim pesan dengan jawaban dari AI
            await m.reply(message);
        } else {
            await m.reply('Gagal mendapatkan respons dari AI Answer.');
        }
    } catch (error) {
        console.error(error);
        await m.reply('Terjadi kesalahan saat memproses permintaan Anda.');
    }
};

// Detail perintah handler
ponta.command = ['aianswer'];
ponta.help = ['aianswer'];
ponta.tags = ['ai'];
ponta.limit = 1;

export default ponta;