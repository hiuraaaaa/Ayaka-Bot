import axios from 'axios';

const handler = async (m, { conn, text, usedPrefix, command }) => {
    // Pastikan ada teks query yang diberikan oleh pengguna
    if (!text) {
        throw `Hai! Saya adalah Felo AI. Ada yang ingin kamu tanyakan?\n\nContoh: *${usedPrefix}${command} Jelaskan tentang fotosintesis.*`;
    }

    // Ambil domain dan API Key Maelyn dari global.maelyn di config.js
    const maelynDomain = global.maelyn.domain;
    const maelynApiKey = global.maelyn.key;

    // Lakukan validasi dasar untuk memastikan konfigurasi ada
    if (!maelynDomain || !maelynApiKey) {
        throw 'API Key atau Domain Maelyn untuk Felo AI belum diatur di config.js! Mohon hubungi pemilik bot.';
    }

    await conn.sendMessage(m.chat, { react: { text: '🍏', key: m.key } }); // Reaksi loading

    try {
        // Encode the query for URL safety
        const encodedQuery = encodeURIComponent(text);
        // Build the API URL
        const apiUrl = `${maelynDomain}/api/felo/chat?q=${encodedQuery}&apikey=${maelynApiKey}`;

        // Send GET request to the Maelyn API
        const response = await axios.get(apiUrl);
        const { status, result, code } = response.data;

        if (status === 'Success' && code === 200 && result?.content) {
            let replyText = `✨ *Felo AI*\n\n${result.content}`;

            // Tambahkan sumber jika ada
            if (result.sources && result.sources.length > 0) {
                replyText += `\n\n*Sumber:*\n`;
                result.sources.forEach((source, index) => {
                    replyText += `${index + 1}. ${source}\n`;
                });
            }

            await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } }); // Reaksi sukses
            m.reply(replyText);
        } else {
            await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } }); // Reaksi gagal
            m.reply(`❌ Gagal mendapatkan respons dari Felo AI. Respon API: ${JSON.stringify(response.data)}`);
        }
    } catch (e) {
        console.error(e);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } }); // Reaksi error
        m.reply(`Terjadi kesalahan saat menghubungi Felo AI API: ${e.message}`);
    }
};

handler.help = ['felochat', 'feloai'];
handler.tags = ['ai'];
handler.command = /^(felochat|feloai)$/i; // Menggunakan regex untuk beberapa alias
handler.limit = true; // Batasi penggunaan jika perlu
handler.premium = false; // Hanya untuk pengguna non-premium jika perlu

export default handler;