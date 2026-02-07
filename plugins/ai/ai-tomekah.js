
import fetch from 'node-fetch';
import FormData from 'form-data';
import { fileTypeFromBuffer } from 'file-type';

// --- KONFIGURASI ---
const fkontak = {
    key: { participant: '0@s.whatsapp.net', remoteJid: '0@s.whatsapp.net', fromMe: false, id: 'Halo' },
    message: { conversation: `AI To Mekah ✨` }
};

const API_URL = `${global.faa}/faa/tomekah?url=`;

async function uploadToZenzxz(buffer) {
    const { ext } = await fileTypeFromBuffer(buffer) || { ext: 'png' };
    const form = new FormData();
    form.append('file', buffer, `upload.${ext}`);
    const res = await fetch('https://uploader.zenzxz.dpdns.org/upload', { method: 'POST', body: form });
    if (!res.ok) throw new Error(`Gagal mengunggah ke Zenzxz: ${res.statusText}`);
    const html = await res.text();
    const match = html.match(/href="(https?:\/\/uploader\.zenzxz\.dpdns\.org\/uploads\/[^"]+)"/);
    if (!match) throw new Error('Gagal mendapatkan URL dari Zenzxz');
    return match[1];
}

// --- HANDLER UTAMA ---

const handler = async (m, { conn, usedPrefix, command }) => {

    const mime = m.quoted?.mimetype || '';
    if (!/image/.test(mime)) {
        return conn.reply(m.chat, `Reply sebuah gambar dengan caption *${usedPrefix + command}*`, m, { quoted: fkontak });
    }

    try {

        await conn.sendMessage(m.chat, { text: '⏳ Sedang memproses AI To Mekah, mohon tunggu sebentar...' }, { quoted: fkontak });

        // Mengunduh gambar yang direply
        const imageBuffer = await m.quoted.download();
        if (!imageBuffer) {
            return conn.reply(m.chat, '❌ Gagal mengunduh gambar, silakan coba lagi.', m, { quoted: fkontak });
        }

        const sourceUrl = await uploadToZenzxz(imageBuffer);

        const response = await fetch(API_URL + encodeURIComponent(sourceUrl));
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const resultBuffer = await response.buffer();
        if (!resultBuffer || resultBuffer.length < 1000) {
            throw new Error('❌ API tidak mengembalikan gambar yang valid. Mungkin sedang down.');
        }

        await conn.sendMessage(m.chat, { image: resultBuffer }, { quoted: fkontak });

    } catch (e) {
        console.error(e);
        conn.reply(m.chat, `❗ Terjadi kesalahan: ${e.message}`, m, { quoted: fkontak });
    }
};

handler.help = ['tomekah'];
handler.tags = ['ai', 'tools'];
handler.command = ['tomekah'];
handler.limit = true;

export default handler;