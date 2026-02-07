/*
* Nama Fitur : AI VEO3 (Video Generator)
* Type : Plugins ESM
* Author : 𝐅𝐚𝐫𝐢𝐞𝐥
* Modifier : 𝐅𝐚𝐫𝐢𝐞𝐥
*/

import axios from "axios";

// --- KONFIGURASI ---
const fkontak = {
 key: { participant: '0@s.whatsapp.net', remoteJid: '0@s.whatsapp.net', fromMe: false, id: 'Halo' },
 message: { conversation: `AI VEO3 ✨` }
};

// Fungsi delay helper
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// --- API & PENGATURAN ---
const VEO_API_URL = "https://api-faa.my.id/faa/veo3";
const INITIAL_WAIT_MS = 60000; // 60 detik (Tunggu awal)
const POLLING_INTERVAL_MS = 60000; // Periksa setiap 60 detik (Sesuai permintaan)
const MAX_POLLING_ATTEMPTS = 10; // Maksimal 10x percobaan polling (total 10 menit polling + 1 menit awal)

let isVeoProcessing = false;
let veoCooldown = 0;
const GLOBAL_COOLDOWN_SECONDS = 120; // Cooldown 2 menit setelah selesai

// --- HANDLER UTAMA ---
const handler = async (m, { conn, text, usedPrefix, command }) => {

 // 1. Cek Cooldown
 if (isVeoProcessing) {
    return conn.reply(m.chat, '⏳ Perintah VEO3 lain sedang diproses. Harap tunggu hingga selesai.', m, { quoted: fkontak });
 }

 const now = Date.now();
 if (now < veoCooldown) {
    const timeLeft = Math.ceil((veoCooldown - now) / 1000);
    return conn.reply(m.chat, `⏳ Perintah ini sedang dalam masa jeda. Silakan coba lagi dalam *${timeLeft} detik*.`, m, { quoted: fkontak });
 }
 
 // 2. Cek Input Teks
 if (!text) {
    return conn.sendMessage(
        m.chat,
        { text: `📝 Prompt wajib diisi!\nContoh: *${usedPrefix + command} wanita cantik sedang memasak telur dadar*` },
        { quoted: fkontak }
    );
 }

 isVeoProcessing = true;
 await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

 try {
    const apiUrl = `${VEO_API_URL}?prompt=${encodeURIComponent(text)}`;
    await conn.reply(m.chat, `🚀 Mengirim permintaan VEO3...\n*Prompt:* ${text}`, m, { quoted: fkontak });

    const apiResp = await axios.get(apiUrl, { timeout: 30000 });
    const initialData = apiResp.data
    if (!initialData.status || !initialData.job_id || !initialData.check_url) {
        throw new Error(`API Gagal (Tahap 1): ${initialData.message || 'Respon tidak valid, tidak ada job_id/check_url'}`);
    }

    const jobId = initialData.job_id;
    const checkUrl = initialData.check_url;
    await conn.reply(m.chat, `✅ Permintaan diterima (ID: ${jobId}).\n⏱️ Menunggu beberapa menit untuk proses VEO3...`, m, { quoted: fkontak });

    await delay(INITIAL_WAIT_MS);
    let statusData = null;
    let attempts = 0;
    
    while (attempts < MAX_POLLING_ATTEMPTS) {
        attempts++;
        const statusResp = await axios.get(checkUrl, { timeout: 30000 });
        statusData = statusResp.data;

        if (!statusData.status) {
             throw new Error(`API Gagal (Tahap 2): ${statusData.message || 'Status check gagal'}`);
        }

        if (statusData.processing === false) {
            console.log(`VEO3 Job ${jobId} selesai pada percobaan ke-${attempts}.`);
            break;
        }

        if (attempts >= MAX_POLLING_ATTEMPTS) {
            throw new Error(`Video masih diproses setelah ${MAX_POLLING_ATTEMPTS} percobaan. Silakan coba lagi nanti.`);
        }

        await delay(POLLING_INTERVAL_MS);
    }

    if (!statusData.result || !statusData.result.download_url) {
        throw new Error(`API Gagal (Tahap 2): ${statusData.message || 'Tidak ada URL download di hasil akhir'}`);
    }

    const downloadUrl = statusData.result.download_url;
    const promptResult = statusData.result.prompt || text;

    await conn.sendFile(
        m.chat,
        downloadUrl,
        "veo3_result.mp4",
        `✨ *VEO3 Video Berhasil Dibuat*\n\n*Prompt:* ${promptResult}\n*Kualitas:* ${statusData.result.quality || 'N/A'}\n*Ukuran:* ${statusData.result.size || 'N/A'}\n*Kadaluarsa:* ${statusData.result.expired || 'N/A'}`,
        m, { quoted: fkontak });
        
    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

    veoCooldown = Date.now() + (GLOBAL_COOLDOWN_SECONDS * 1000);

 } catch (e) {
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    conn.sendMessage(m.chat, { text: `❗ Terjadi Kesalahan: ${e?.message || e}` }, { quoted: fkontak });
 } finally {
    isVeoProcessing = false;
 }
};

// --- EKSPOR HANDLER ---
handler.help = ["veo3 <prompt>"];
handler.tags = ["ai", "video", "premium"];
handler.command = /^(veo3)$/i;
handler.limit = true; 
handler.premium = true;

export default handler;