import axios from 'axios';

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    let prompt = text || '';
    
    if (!mime && !args[1]) throw `Kirim gambar dengan caption *${usedPrefix}${command} <prompt>* atau reply gambar dengan caption prompt!`;
    if (!/image\/(jpe?g|png)/.test(mime)) throw `File yang kamu kirim bukan gambar!`;

    try {
        await conn.sendMessage(m.chat, { react: { text: '🖌️', key: m.key } });

        const imgBuffer = await q.download();

        // Upload ke catbox
        const FormData = (await import('form-data')).default;
        const form = new FormData();
        form.append('reqtype', 'fileupload');
        form.append('fileToUpload', imgBuffer, 'image.jpg');

        const catbox = await axios.post('https://catbox.moe/user/api.php', form, {
            headers: form.getHeaders(),
        });

        const imageUrl = catbox.data;
        if (!imageUrl.includes('catbox.moe')) throw 'Gagal upload gambar.';

        // Panggil API Ubed dan ambil buffer gambar
        const apiUrl = `https://api.ubed.my.id/ai/sticker?apikey=ubed2407&prompt=${encodeURIComponent(prompt)}&imageUrl=${encodeURIComponent(imageUrl)}`;
        const { data } = await axios.get(apiUrl, { responseType: 'arraybuffer' });

        // Kirim sebagai gambar biasa
        await conn.sendMessage(m.chat, {
            image: data,
            caption: `Hasil AI untuk prompt:\n*${prompt}*`
        }, { quoted: m });

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.error(e);
        m.reply('❌ Terjadi kesalahan saat membuat gambar AI.');
    }
};

handler.help = ['aisticker <prompt>'];
handler.tags = ['ai'];
handler.command = /^aisticker$/i;
handler.limit = true;
handler.premium = false;

export default handler;