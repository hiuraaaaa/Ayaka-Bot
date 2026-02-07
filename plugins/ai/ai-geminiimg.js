import uploadImage from '../lib/uploadImage.js';
import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
    try {
        // Check if the message contains an image
        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || '';
        if (!mime || !mime.startsWith('image')) throw 'Kirim/Reply Gambar Dengan Caption *<pertanyaan>*';

        // React with a clock emoji while processing
        await conn.sendMessage(m.chat, { react: { text: '🕐', key: m.key } });

        // Download and upload the image to get a URL
        let media = await q.download();
        let url = await uploadImage(media);

        // Prepare the request body for the API
        const requestBody = {
            ask: text,
            image: url
        };

        // Make a POST request to the API
        const res = await fetch('https://rest.cifumo.biz.id/api/ai/gemini-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        // Parse the response
        const json = await res.json();
        if (!json.status) throw json.message || 'Terjadi kesalahan saat memproses gambar.';

        // Replace double asterisks with single asterisks in the result
        json.content = json.content.replace(/\*\*/g, '*');

        // React with a check emoji and send the result
        await conn.sendMessage(m.chat, { react: { text: '☑️', key: m.key } });
        await m.reply(json.content);
    } catch (e) {
        console.error(e);
        // React with a cross emoji and send an error message
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        await m.reply("Gagal memproses gambar. Pastikan Anda mengirim gambar dan teks pertanyaan.");
    }
};

handler.help = ['geminiimg *<text + image>*'];
handler.tags = ['ai'];
handler.command = /^(aiimg|geminiimg)$/i;
handler.limit = true;
handler.premium = true;

export default handler;