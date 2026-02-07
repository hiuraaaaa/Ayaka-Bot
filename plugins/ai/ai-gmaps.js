import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Gunakan format: ${usedPrefix}${command} <asal> <tujuan>\n\nContoh: *${usedPrefix}${command} Jakarta Bandung*`;

    try {
        await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

        const [from, to] = text.split(' ');
        if (!from || !to) throw `Format salah! Gunakan format: ${usedPrefix}${command} <asal> <tujuan>`;

        const apiUrl = `https://fastrestapis.fasturl.cloud/search/gmaps?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&language=Id`;
        const { data } = await axios.get(apiUrl);

        if (data.status !== 200 || !data.result || !data.result.mapUrl) {
            throw '❌ Gagal mengambil rute dari Google Maps.';
        }

        // Kirim link rute Google Maps
        await conn.sendMessage(m.chat, {
            text: `🔗 Rute dari *${from}* ke *${to}*:\n\n${data.result.mapUrl}`,
        }, { quoted: m });

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (err) {
        console.error(err);
        await conn.reply(m.chat, '❌ Terjadi kesalahan saat mengambil rute Google Maps. Coba lagi nanti.', m);
    }
};

handler.help = ['gmaps <asal> <tujuan>'];
handler.tags = ['tools'];
handler.command = /^gmaps$/i;
handler.limit = 3;
handler.register = true;

export default handler;