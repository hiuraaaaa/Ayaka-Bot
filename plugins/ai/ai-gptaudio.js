import axios from 'axios';

const handler = async (m, { conn, text, usedPrefix, command }) => {
    // Pastikan ada teks query yang diberikan oleh pengguna setelah query tersembunyi
    if (!text) {
        throw `Hai! Saya bisa bicara. Coba tanyakan sesuatu.\n\nContoh: *${usedPrefix}${command} Siapa pencipta WhatsApp?*`;
    }

    // Gabungkan query tersembunyi dengan input pengguna
    const fullQuery = `gunakan bahasa indonesia : ${text}`;

    // Ambil domain dan API Key Maelyn dari global.maelyn di config.js
    const maelynDomain = global.maelyn.domain;
    const maelynApiKey = global.maelyn.key;

    // Lakukan validasi dasar untuk memastikan konfigurasi ada
    if (!maelynDomain || !maelynApiKey) {
        throw 'API Key atau Domain Maelyn untuk ChatGPT Audio belum diatur di config.js! Mohon hubungi pemilik bot.';
    }

    await conn.sendMessage(m.chat, { react: { text: '🍏', key: m.key } }); // Reaksi loading

    try {
        // Encode the full query for URL safety
        const encodedQuery = encodeURIComponent(fullQuery);
        // Build the API URL
        const apiUrl = `${maelynDomain}/api/chatgpt/audio?q=${encodedQuery}&model=nova&apikey=${maelynApiKey}`;

        // Send GET request to the Maelyn API
        const response = await axios.get(apiUrl);
        const { status, result, code } = response.data;

        if (status === 'Success' && code === 200 && result?.url) {
            await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } }); // Reaksi sukses

            // Send the audio file
            await conn.sendMessage(m.chat, { 
                audio: { url: result.url },
                mimetype: result.type,
                ptt: true // Set ptt (push to talk) to true if you want it to appear as a voice message
            }, { quoted: m });
        } else {
            await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } }); // Reaksi gagal
            m.reply(`❌ Gagal mendapatkan respons audio dari ChatGPT. Respon API: ${JSON.stringify(response.data)}`);
        }
    } catch (e) {
        console.error(e);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } }); // Reaksi error
        m.reply(`Terjadi kesalahan saat menghubungi ChatGPT Audio API: ${e.message}`);
    }
};

handler.help = ['chataudio', 'gptaudio'];
handler.tags = ['ai', 'audio'];
handler.command = /^(chataudio|gptaudio)$/i; // Menggunakan regex untuk beberapa alias
handler.limit = true; // Batasi penggunaan jika perlu
handler.premium = false; // Hanya untuk pengguna non-premium jika perlu

export default handler;