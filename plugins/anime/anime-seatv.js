import axios from 'axios';

const handler = async (m, { conn, usedPrefix, command }) => {
    // Ambil domain dan API Key Maelyn dari global.maelyn di config.js
    const maelynDomain = global.maelyn.domain;
    const maelynApiKey = global.maelyn.key;

    // Lakukan validasi dasar untuk memastikan konfigurasi ada
    if (!maelynDomain || !maelynApiKey) {
        throw 'API Key atau Domain Maelyn belum diatur di config.js! Mohon hubungi pemilik bot.';
    }

    await conn.sendMessage(m.chat, { react: { text: '🍏', key: m.key } }); // Reaksi loading

    try {
        const apiUrl = `${maelynDomain}/api/seatv/schedule?apikey=${maelynApiKey}`;
        const response = await axios.get(apiUrl);
        const { status, result, code } = response.data;

        if (status === 'Success' && code === 200 && result) {
            let replyText = `🗓️ *Jadwal Anime SeaTV*\n\n`;

            // Jadwal Hari Ini
            if (result.today && result.today.results.length > 0) {
                replyText += `*📺 Tayang Hari Ini (${result.today.day.toUpperCase()}):*\n`;
                result.today.results.forEach((anime, index) => {
                    replyText += `• ${anime.title}\n`;
                });
                replyText += `\n`;
            } else {
                replyText += `*📺 Tidak ada jadwal tayang hari ini.*\n\n`;
            }

            // Jadwal Mendatang
            if (result.upcoming && result.upcoming.results.length > 0) {
                replyText += `*🔜 Jadwal Mendatang (${result.upcoming.day.toUpperCase()}):*\n`;
                result.upcoming.results.forEach((anime, index) => {
                    replyText += `• ${anime.title}\n`;
                });
            } else {
                replyText += `*🔜 Tidak ada jadwal mendatang yang tersedia.*\n`;
            }

            replyText += `\n_Ubed Bot_`;

            await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } }); // Reaksi sukses
            m.reply(replyText);
        } else {
            await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } }); // Reaksi gagal
            m.reply(`❌ Gagal mengambil jadwal anime. Respon API: ${JSON.stringify(response.data)}`);
        }
    } catch (e) {
        console.error(e);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } }); // Reaksi error
        m.reply(`Terjadi kesalahan saat menghubungi SeaTV Schedule API: ${e.message}`);
    }
};

handler.help = ['seatvschedule', 'jadwalanime'];
handler.tags = ['anime', 'info'];
handler.command = /^(seatvschedule|jadwalanime)$/i;
handler.limit = true; // Batasi penggunaan jika perlu
handler.premium = false; // Hanya untuk pengguna non-premium jika perlu

export default handler;