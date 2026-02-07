import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Gunakan format: ${usedPrefix}${command} <nama sound>\n\nContoh: *${usedPrefix}${command} spongebob*`;

    try {
        await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

        const apiUrl = `https://fastrestapis.fasturl.cloud/search/soundmeme?name=${encodeURIComponent(text)}`;
        const { data } = await axios.get(apiUrl);

        if (data.status !== 200 || !data.result.length) {
            throw '❌ Sound tidak ditemukan.';
        }

        // Kirim audio dari result pertama
        const firstResult = data.result[0];
        await conn.sendMessage(m.chat, {
            audio: { url: firstResult.url },
            mimetype: 'audio/mpeg',
            fileName: `${firstResult.name}.mp3`,
            ptt: true // Kirim sebagai voice note
        }, { quoted: m });

        // Buat daftar link sisanya
        if (data.result.length > 1) {
            const otherLinks = data.result.slice(1).map((v, i) => `${i + 2}. *${v.name}*\n${v.url}`).join('\n\n');
            await conn.reply(m.chat, `📋 Berikut daftar sound lainnya:\n\n${otherLinks}`, m);
        }

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (err) {
        console.error(err);
        await conn.reply(m.chat, '❌ Gagal mengambil sound. Coba lagi nanti.', m);
    }
};

handler.help = ['soundmeme <nama>'];
handler.tags = ['audio'];
handler.command = /^soundmeme$/i;
handler.limit = 3;
handler.register = true;

export default handler;