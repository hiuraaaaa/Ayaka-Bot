import fetch from 'node-fetch';
import uploadImage from '../lib/uploadImage2.js';

let handler = async (m, { conn, usedPrefix, command, text }) => {
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';


    if (!mime || !mime.startsWith('video')) throw 'Kirim/Reply video dengan caption .reminivideo';

    m.reply('Tunggu sebentar...');

    try {
        let media = await q.download();
        let url = await uploadImage(media);

        let response = await fetch(`https://api.alyachan.dev/api/remini-video?video=${encodeURIComponent(url)}&apikey=kontol`);
        if (!response.ok) throw 'Gagal menghubungi API';

        let result = await response.json();

        if (!result.status) throw 'Gagal memproses video.';

        let videoUrl = result.data.url;
        let filename = result.data.filename;
        let duration = result.data.duration;
        let size = result.data.size;
        let width = result.data.width;
        let height = result.data.height;

        let caption = `🎀 Sukses Remini Video!\n\n📌 Filename: ${filename}\n📩 Duration: ${duration}s\n📄 Size: ${size} bytes\n🧸 Resolution: ${width}x${height}\n`;

        await conn.sendFile(m.chat, videoUrl, filename, caption, m);

    } catch (e) {
        console.error(e);
        m.reply('Terjadi kesalahan saat menggunakan fitur Remini Video. Silakan coba lagi nanti.');
    }
}

handler.help = ['reminivideo'];
handler.tags = ['ai'];
handler.command = /^(reminivideo)$/i;
handler.register = true;

export default handler;