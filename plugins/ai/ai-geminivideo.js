import axios from 'axios';
import FormData from 'form-data';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';

    if (!mime) throw `Kirim video dengan caption *${usedPrefix}${command}* atau reply video dengan *${usedPrefix}${command}*`;
    if (!/video\//.test(mime)) throw `File yang kamu kirim bukan video!`;

    try {
        await conn.sendMessage(m.chat, { react: { text: '🍊', key: m.key } });

        // Download video
        const videoBuffer = await q.download();

        // Upload ke Catbox
        const form = new FormData();
        form.append('reqtype', 'fileupload');
        form.append('fileToUpload', videoBuffer, 'video.mp4');

        const catboxRes = await axios.post('https://catbox.moe/user/api.php', form, {
            headers: form.getHeaders(),
        });

        const catboxUrl = catboxRes.data;
        if (!catboxUrl.includes('catbox.moe')) throw 'Gagal upload ke Catbox.';

        // Siapkan teks untuk query q
        const queryText = text ? text.trim() : 'Video Apa Ini';

        // Kirim ke API Maelyn
        const apiUrl = `https://api.maelyn.sbs/api/gemini/video?q=${encodeURIComponent(queryText)}&url=${encodeURIComponent(catboxUrl)}&apikey=ubed2407`;
        const { data } = await axios.get(apiUrl);

        if (data.status !== 'Success' || data.code !== 200) throw 'Gagal mendapatkan deskripsi video.';

        const videoDescription = data.result;

        await conn.reply(m.chat, `🎬 *Deskripsi Video:*\n\n${videoDescription}`, m);

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (error) {
        console.error(error);
        await conn.reply(m.chat, '❌ Terjadi kesalahan. Coba lagi nanti.', m);
    }
};

handler.help = ['geminivideo [teks opsional]'];
handler.tags = ['ai', 'tools'];
handler.command = /^(geminivideo)$/i;
handler.limit = 3;
handler.register = true;
handler.premium = false;

export default handler;