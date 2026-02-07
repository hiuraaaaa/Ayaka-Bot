import axios from "axios";
import FormData from "form-data";
import { fileTypeFromBuffer } from 'file-type';
import fetch from 'node-fetch';
import Jimp from "jimp"; // <-- Ditambahkan

// --- KONFIGURASI ---
const fkontak = {
    key: { participant: '0@s.whatsapp.net', remoteJid: '0@s.whatsapp.net', fromMe: false, id: 'Halo' },
    message: { conversation: `AI Couple Mirror ✨` }
};

const STATIC_PROMPT = `Gunakan foto aku dan wanita sebagai referensi wajah (jangan diubah). Buat foto gaya pasangan muda sedang selfie di depan cermin dengan suasana seperti photobooth modern. Interior ruangan sederhana, dinding berwarna netral dengan lampu putih terang di langit-langit, dan latar belakang lemari atau gantungan pakaian terlihat samar. Posisikan kami berdua berdiri sangat dekat, saling menempel dengan ekspresi bahagia/natural.`;
const API_URL_BASE = "https://api-faa.my.id/faa/editfoto";

const editSessions = {};

async function mergePhotos(buf1, buf2) {
  const img1 = await Jimp.read(buf1);
  const img2 = await Jimp.read(buf2);
  const size = 700;
  img1.cover(size, size);
  img2.cover(size, size);

  const gap = 20;
  const canvas = new Jimp(size * 2 + gap, size, 0xffffffff);
  canvas.composite(img1, 0, 0);
  canvas.composite(img2, size + gap, 0);

  return await canvas.getBufferAsync(Jimp.MIME_JPEG);
}

async function uploadToZenzxz(buffer) {
    const { ext } = await fileTypeFromBuffer(buffer) || { ext: 'bin' };
    const filename = `file-${Date.now()}.${ext}`;
    const form = new FormData();
    form.append('file', buffer, filename);
    const res = await fetch('https://uploader.zenzxz.dpdns.org/upload', { method: 'POST', body: form });
    if (!res.ok) throw new Error(`Zenzxz Gagal: ${res.statusText}`);
    const html = await res.text();
    const match = html.match(/href="(https?:\/\/uploader\.zenzxz\.dpdns\.org\/uploads\/[^"]+)"/);
    if (!match) throw new Error('Zenzxz Gagal: Tidak dapat menemukan URL');
    return match[1];
}

async function handleFirstImage(m, conn, sender) {
    await conn.sendMessage(m.chat, { text: '✅ Gambar pertama diterima.\nSilakan reply gambar kedua dengan caption yang sama.' }, { quoted: fkontak });

    const imageBuffer = await m.quoted.download();
    if (!imageBuffer) throw new Error('Gagal mengunduh gambar pertama.');

    editSessions[sender] = { buf1: imageBuffer, timestamp: Date.now() };

    setTimeout(() => {
        if (editSessions[sender]) {
            delete editSessions[sender];
            conn.reply(m.chat, '⏳ Sesi Anda telah berakhir karena tidak ada gambar kedua yang dikirim dalam 5 menit.', m);
        }
    }, 300000);
}

async function handleSecondImage(m, conn, sender) {
    await conn.sendMessage(m.chat, { text: `✅ Gambar kedua diterima.\n⏳ Memulai proses pembuatan foto couple mirror, mohon tunggu... Ini mungkin memakan waktu 1-3 menit.` }, { quoted: fkontak });

    const { buf1 } = editSessions[sender];
    delete editSessions[sender];

    const buf2 = await m.quoted.download();
    if (!buf2) throw new Error('Gagal mengunduh gambar kedua.');

    const mergedBuffer = await mergePhotos(buf1, buf2);

    const mergedUrl = await uploadToZenzxz(mergedBuffer);
    if (!mergedUrl) throw new Error('Gagal mengunggah gambar gabungan.');

    const finalApiUrl = `${API_URL_BASE}?url=${encodeURIComponent(mergedUrl)}&prompt=${encodeURIComponent(STATIC_PROMPT)}`;

    try {
        const apiResp = await axios.get(finalApiUrl, {
            timeout: 180000, 
            responseType: 'arraybuffer'
        });

        let data;
        let isBinary = false;

        try {
            data = JSON.parse(Buffer.from(apiResp.data).toString('utf8'));
        } catch (e) {
            data = apiResp.data;
            isBinary = true;
        }

        if (isBinary) {
            if (!data || data.length < 1000) {
                throw new Error("API mengembalikan hasil gambar yang tidak valid.");
            }
            await conn.sendFile(m.chat, data, "couple-edit.jpg", "✨ Ini dia hasilnya!", fkontak);
        } else if (!data?.status || !data?.result?.url) {
            console.error("API Response Gagal (JSON):", data);
            const errorMessage = data?.message || data?.error ? `Pesan dari API: ${data.message || data.error}` : `API tidak mengembalikan hasil yang valid.`;
            throw new Error(errorMessage);
        } else {
            const outResp = await axios.get(data.result.url, {
                responseType: "arraybuffer",
                timeout: 120000
            });
            await conn.sendFile(m.chat, outResp.data, "couple-edit.jpg", "✨ Ini dia hasilnya!", fkontak);
        }

    } catch (error) {
        if (error.response) {
            console.error("API Error Response:", error.response.status, error.response.statusText);
            throw new Error(`API gagal memproses gambar (Status: ${error.response.status}). Coba gunakan gambar lain.`);
        }
        throw new Error(`Terjadi kesalahan: ${error.message}`);
    }
}

// --- HANDLER UTAMA ---
const handler = async (m, { conn, usedPrefix, command }) => {
    const sender = m.sender;
    const mime = m.quoted?.mimetype || '';

    if (!/image/.test(mime)) {
        return conn.reply(m.chat, `🖼️ *Cara Penggunaan:*\n\n1. Kirim gambar pertama dengan caption *${usedPrefix + command}*\n2. Balas/reply gambar kedua dengan caption *${usedPrefix + command}* lagi.`, fkontak);
    }

    const isSecondImageProcess = !!editSessions[sender];

    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

    try {
        if (isSecondImageProcess) {
            await handleSecondImage(m, conn, sender);
            await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
        } else {
            await handleFirstImage(m, conn, sender);
        }
    } catch (e) {
        console.error(e);
        if (editSessions[sender]) {
            delete editSessions[sender];
        }
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
        conn.reply(m.chat, `❗ Gagal: ${e.message}`, fkontak);
    }
};

handler.help = ['mirror2', 'tomirror2'];
handler.tags = ['ai'];
handler.command = /^(mirror2|tomirror2)$/i;
handler.limit = true;
handler.premium = false;

export default handler;