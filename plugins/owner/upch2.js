import uploadImage from '../lib/uploadImage.js';
import uploadFile from '../lib/uploadFile2.js';

let handler = async (m, { conn, args, text }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    let isMedia = /image|video|audio/.test(mime);

    if (!args[0]) throw 'Masukkan ID channel yang valid!\n\nContoh:\n.upch 123@newster';
    let recipient = args[0].trim();
    if (!recipient.includes('@')) throw 'Format ID channel tidak valid!';

    let message = text.replace(recipient, '').trim();
    if (!message && !isMedia) throw 'Masukkan pesan atau reply media yang ingin dikirim!';

    let messageOptions = { text: message };

    if (isMedia) {
        m.reply('Sedang memproses media, mohon tunggu...');
        try {
            let media = await q.download();
            if (!media) throw 'Media tidak dapat diunduh, silakan coba lagi.';

            let url;
            if (/image/.test(mime)) {
                url = await uploadImage(media);
            } else {
                url = await uploadFile(media);
            }
            if (!url) throw 'Gagal mendapatkan URL media, silakan coba lagi.';

            messageOptions = {
                caption: message || '',
                [mime.includes('image') ? 'image' : mime.includes('video') ? 'video' : 'audio']: { url }
            };
        } catch (err) {
            console.error(err);
            return m.reply(`Gagal mengunggah media: ${err.message || err}. Silakan coba lagi.`);
        }
    }

    try {
        await conn.sendMessage(recipient, messageOptions);
        m.reply('Pesan berhasil dikirim ke channel!');
    } catch (err) {
        console.error(err);
        return m.reply(`Gagal mengirim pesan: ${err.message || err}. Silakan coba lagi.`);
    }
};

handler.help = ['upch'];
handler.tags = ['owner'];
handler.command = /^(upch2)$/i;
handler.rowner = true;

export default handler;