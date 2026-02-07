import fetch from 'node-fetch';
import FormData from 'form-data';

const handler = async (m, { conn, args, usedPrefix, command, text }) => {
    if (!text) return conn.reply(m.chat, `Contoh: *${usedPrefix + command} Siapa presiden pertama Indonesia?*\nAtau reply gambar dengan perintah yang sama untuk deskripsi.`, m);

    let imageUrl = null;

    // Cek apakah ada gambar (dari reply)
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    if (mime.startsWith('image/')) {
        try {
            // Download gambar
            let img = await q.download?.();
            if (!img) throw 'Gagal download gambar';

            // Upload ke Catbox
            const form = new FormData();
            form.append('reqtype', 'fileupload');
            form.append('fileToUpload', img, 'image.jpg');

            let uploadRes = await fetch('https://catbox.moe/user/api.php', {
                method: 'POST',
                body: form,
            });

            imageUrl = await uploadRes.text();
            if (!imageUrl.startsWith('http')) throw 'Gagal upload gambar ke Catbox';
        } catch (e) {
            console.error(e);
            return conn.reply(m.chat, 'Gagal mengolah gambar, pastikan kirim/reply gambar dengan benar.', m);
        }
    }

    // Buat URL API
    const apiUrl = `https://fastrestapis.fasturl.cloud/aillm/gpt-4o?ask=${encodeURIComponent(text)}${imageUrl ? `&imageUrl=${encodeURIComponent(imageUrl)}` : ''}`;

    try {
        const res = await fetch(apiUrl);
        const json = await res.json();

        if (json.status !== 200) throw json;

        // Gaya khas Ubed
        let result = json.result
            .replace(/Hi(?:,)?/i, 'Halo cuy,')
            .replace(/I'm just a program.*?but/i, 'Aku emang cuma bot doang, tapi tenang')
            .replace(/How can I assist you today\?/i, 'Ada yang bisa Ubed bantuin hari ini?')
            .replace(/Gambar menunjukkan/i, 'Jadi nih di gambarnya keliatan')
            .replace(/seorang wanita/i, 'cewek')
            .replace(/dengan pose/i, 'lagi pose')
            .replace(/terlihat/i, 'keliatan')
            .replace(/Latar belakang/i, 'Backgroundnya');

        conn.reply(m.chat, `*Ubed bilang:*\n${result}`, m);
    } catch (e) {
        console.error(e);
        conn.reply(m.chat, 'Ubed lagi error nih, coba beberapa saat lagi ya!', m);
    }
};

handler.command = ['gpt4o', 'deskripsigambar'];
handler.help = ['gpt4o <teks atau pertanyaan>'];
handler.tags = ['ai'];

export default handler;