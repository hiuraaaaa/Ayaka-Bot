/*
* Nama Fitur : AI Tohidup (Image to Video)
* Type : Plugins ESM
* Author : lann
*/

import axios from 'axios';
import fetch from 'node-fetch';
import FormData from 'form-data';
import { fileTypeFromBuffer } from 'file-type';

async function uploadToZenzxz(buffer, filename) {
    const form = new FormData();
    form.append('file', buffer, filename);
    const res = await fetch('https://uploader.zenzxz.dpdns.org/upload', { method: 'POST', body: form });
    if (!res.ok) throw new Error(`Zenzxz Uploader Gagal: ${res.statusText}`);
    const html = await res.text();
    const match = html.match(/href="(https?:\/\/uploader\.zenzxz\.dpdns\.org\/uploads\/[^"]+)"/);
    if (!match) throw new Error('Zenzxz Uploader Gagal: Tidak dapat menemukan URL di respons');
    return match[1];
}

// --- KONFIGURASI ---
const fkontak = {
 key: { participant: '0@s.whatsapp.net', remoteJid: '0@s.whatsapp.net', fromMe: false, id: 'Halo' },
 message: { conversation: `AI To Hidup ✨` }
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// --- API & PENGATURAN ---
const TOHIDUP_API_URL = "https://api-faa.my.id/faa/tohidup";
const INITIAL_WAIT_MS = 40000; // Tunggu 40 detik pertama
const POLLING_INTERVAL_MS = 40000; // Periksa setiap 40 detik
const MAX_POLLING_ATTEMPTS = 3; // Maksimal 3x percobaan polling
const AXIOS_TIMEOUT = 60000;

let isTohidupProcessing = false;
let tohidupCooldown = 0;
const GLOBAL_COOLDOWN_SECONDS = 30;

// --- HANDLER UTAMA ---
const handler = async (m, { conn, usedPrefix, command }) => {
 if (isTohidupProcessing) {
    return conn.reply(m.chat, '⏳ Perintah Tohidup lain sedang diproses. Harap tunggu hingga selesai.', m, { quoted: fkontak });
 }

 const now = Date.now();
 if (now < tohidupCooldown) {
    const timeLeft = Math.ceil((tohidupCooldown - now) / 1000);
    return conn.reply(m.chat, `⏳ Perintah ini sedang dalam masa jeda. Silakan coba lagi dalam *${timeLeft} detik*.`, m, { quoted: fkontak });
 }

 let q = m.quoted ? m.quoted : m;
 let mime = (q.msg || q).mimetype || q.mediaType || '';

 if (!/image/g.test(mime)) {
    return conn.reply(m.chat, `🖼️ Kirim atau balas sebuah *gambar* dengan perintah *${usedPrefix + command}*`, m, { quoted: fkontak });
 }

 isTohidupProcessing = true;
 await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

 try {
    await conn.reply(m.chat, '📥 Mengunduh dan mengunggah gambar...', m, { quoted: fkontak });
    const media = await q.download();
    if (!media) throw new Error("Gagal mengunduh media.");
    
    const { ext } = await fileTypeFromBuffer(media) || { ext: 'png' };
    const filename = `tohidup-${Date.now()}.${ext}`;
    const imageUrl = await uploadToZenzxz(media, filename);
    if (!imageUrl) throw new Error("Gagal mengunggah gambar ke server.");
    
    await conn.reply(m.chat, `✅ Gambar berhasil diunggah.\n🚀 Mengirim permintaan untuk menganimasikan gambar...`, m, { quoted: fkontak });

    const apiUrl = `${TOHIDUP_API_URL}?url=${encodeURIComponent(imageUrl)}`;
    const apiResp = await axios.get(apiUrl, { timeout: AXIOS_TIMEOUT });
    const initialData = apiResp.data;

    if (!initialData.status || !initialData.job_id || !initialData.check_url) {
        throw new Error(`API Gagal (Tahap 1): ${initialData.message || 'Respon tidak valid, tidak ada job_id/check_url'}`);
    }

    const jobId = initialData.job_id;
    const checkUrl = initialData.check_url;
    await conn.reply(m.chat, `✅ Permintaan diterima (ID: ${jobId}).\n⏱️ Menunggu beberapa menit untuk proses AI Tohidup...`, m, { quoted: fkontak });

    await delay(INITIAL_WAIT_MS); 
    let statusData = null;
    let attempts = 0;
    
    while (attempts < MAX_POLLING_ATTEMPTS) {
        attempts++;
        console.log(`[Tohidup] Percobaan polling ke-${attempts} untuk Job ID: ${jobId}`);
        
        try {
            const statusResp = await axios.get(checkUrl, {
                timeout: AXIOS_TIMEOUT,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });
            statusData = statusResp.data;

            if (!statusData || typeof statusData.status === 'undefined') {
                throw new Error('Format respons API tidak valid saat pengecekan status.');
            }

            if (statusData.status === false) {
                 throw new Error(`API melaporkan kegagalan (Tahap 2): ${statusData.message || 'Tidak ada pesan error spesifik'}`);
            }

            if (statusData.processing === false) {
                console.log(`[Tohidup] Job ${jobId} selesai pada percobaan ke-${attempts}.`);
                break;
            }
        } catch (pollError) {
             console.error(`[Tohidup Polling Error] Percobaan ke-${attempts} gagal:`, pollError.message);
             if (attempts >= MAX_POLLING_ATTEMPTS) {
                 throw new Error(`Gagal menghubungi API setelah ${attempts} percobaan. Error terakhir: ${pollError.message}`);
             }
             await conn.reply(m.chat, `⚠️ Pengecekan ke-${attempts} gagal. Mencoba lagi dalam ${POLLING_INTERVAL_MS / 1000} detik...`, m);
        }

        if (attempts >= MAX_POLLING_ATTEMPTS && (statusData && statusData.processing !== false)) {
            throw new Error(`Video masih diproses setelah ${MAX_POLLING_ATTEMPTS} percobaan. Silakan coba lagi nanti.`);
        }
        await delay(POLLING_INTERVAL_MS);
    }

    if (!statusData || !statusData.result || !statusData.result.url) {
        console.log("[Tohidup Debug] Respon akhir tidak valid:", statusData);
        throw new Error(`API Gagal (Tahap Akhir): ${statusData && statusData.message ? statusData.message : 'Tidak ada URL video di hasil akhir'}`);
    }

    const downloadUrl = statusData.result.url;
    await conn.sendFile(
        m.chat,
        downloadUrl,
        "tohidup_result.mp4",
        `✨ *Gambar Berhasil Dianimasikan!*`,
        m, { quoted: fkontak }); 
        
    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    tohidupCooldown = Date.now() + (GLOBAL_COOLDOWN_SECONDS * 1000);

 } catch (e) {
    console.error("[Tohidup Error]", e); 
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    conn.reply(m.chat, `❗ Terjadi Kesalahan:\n${e.message}`, m, { quoted: fkontak });
 } finally {
    isTohidupProcessing = false;
 }
};

handler.help = ["tohidup"];
handler.tags = ["ai", "video", "premium"];
handler.command = /^(tohidup)$/i;
handler.limit = true; 
handler.premium = true;

export default handler;