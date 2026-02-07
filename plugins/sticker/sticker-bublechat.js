import axios from 'axios';
import sharp from 'sharp';
import { Sticker, StickerTypes } from 'wa-sticker-formatter';
import uploadImage from '../lib/memek.js';
import { fileTypeFromBuffer } from 'file-type';

const packname = global.packname;
const author = global.author;

let handler = async (m, { conn, text }) => {
    if (!text.includes('|')) {
        return conn.reply(m.chat, `Format salah! Gunakan *text|name*\nContoh: Halo Sayang|Lann4you`, m);
    }

    const [quoteText, name] = text.split('|').map(v => v.trim());
    const img = m.quoted ? m.quoted : m;
    const mime = (img.msg || img).mimetype || '';

    if (!mime.startsWith('image/')) {
        return conn.reply(m.chat, `❌ Harap reply atau kirim gambar dengan perintah.`, m);
    }

    try {
        m.reply('⏳ Sedang membuat stiker...');

        const imgBuffer = await img.download?.();
        if (!imgBuffer) throw 'Gagal mengunduh gambar.';

        const fileType = await fileTypeFromBuffer(imgBuffer);
        if (!fileType || !fileType.mime.startsWith('image/')) {
            throw 'Gambar tidak valid. Coba gunakan gambar lain.';
        }

        const uploadedUrl = await uploadImage(imgBuffer);
        if (!uploadedUrl || !uploadedUrl.startsWith('http')) {
            throw 'Gagal upload gambar ke server.';
        }

        const apiUrl = `https://api.hiuraa.my.id/maker/quotechat?text=${encodeURIComponent(quoteText)}&name=${encodeURIComponent(name)}&profile=${encodeURIComponent(uploadedUrl)}`;
        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });

        const stickerBuffer = await sharp(response.data)
            .resize({ width: 512, height: 512, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
            .toFormat('webp')
            .toBuffer();

        const sticker = new Sticker(stickerBuffer, {
            pack: packname,
            author,
            type: StickerTypes.FULL,
            quality: 100,
        });

        const stickerData = await sticker.build();
        await conn.sendFile(m.chat, stickerData, 'sticker.webp', '', m, { sendMediaAsSticker: true });

    } catch (err) {
        console.error('Error bublechat:', err);
        return conn.reply(m.chat, `❌ Gagal membuat stiker. ${typeof err === 'string' ? err : 'Pastikan gambar valid dan server API aktif.'}`, m);
    }
};

handler.help = ["bublechat"].map(a => a + " *[text|name]* *[reply/send image]*");
handler.tags = ["sticker"];
handler.command = ["bublechat"];
handler.limit = true;

export default handler;