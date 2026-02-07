/*
* Nama Fitur : AI Sora (Video Generator)
* Type : Plugins ESM
* Author : 𝐅𝐚𝐫𝐢𝐞𝐥
* Modifier : 𝐅𝐚𝐫𝐢𝐞𝐥
*/

import axios from "axios";

// --- KONFIGURASI ---
const fkontak = {
 key: { participant: '0@s.whatsapp.net', remoteJid: '0@s.whatsapp.net', fromMe: false, id: 'Halo' },
 message: { conversation: `AI Sora ✨` }
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function translateToEnglish(text) {
  try {

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text)}`;
    const { data } = await axios.get(url, { timeout: 10000 });
    
    const translatedText = data[0].map(segment => segment[0]).join('');

    const sourceLang = data[2] || 'auto'; 

    if (!translatedText) {
      throw new Error('Tidak dapat mengekstrak teks terjemahan dari respons API.');
    }

    return { translated: translatedText, sourceLang: sourceLang };
    
  } catch (error) {
    console.error("[Translation Error]", error.message);

    console.warn("[Translation Fallback] Menggunakan prompt asli karena translasi gagal.");
    return { translated: text, sourceLang: 'en' };
  }
}


// --- API & PENGATURAN ---
const SORA_API_URL = "https://api-faa.my.id/faa/sora";
const INITIAL_WAIT_MS = 40000; // 40 detik (Tunggu awal sesuai permintaan)
const POLLING_INTERVAL_MS = 40000; // Periksa setiap 40 detik (Sesuai permintaan)
const MAX_POLLING_ATTEMPTS = 9; // Maksimal 9x percobaan polling

let isSoraProcessing = false;
let soraCooldown = 0;
const GLOBAL_COOLDOWN_SECONDS = 120; // Cooldown 2 menit setelah selesai

// --- HANDLER UTAMA ---
const handler = async (m, { conn, text, usedPrefix, command }) => {

 // 1. Cek Cooldown
 if (isSoraProcessing) {
    return conn.reply(m.chat, '⏳ Perintah Sora lain sedang diproses. Harap tunggu hingga selesai.', m, { quoted: fkontak });
 }

 const now = Date.now();
 if (now < soraCooldown) {
    const timeLeft = Math.ceil((soraCooldown - now) / 1000);
    return conn.reply(m.chat, `⏳ Perintah ini sedang dalam masa jeda. Silakan coba lagi dalam *${timeLeft} detik*.`, m, { quoted: fkontak });
 }
 
 // 2. Cek Input Teks
 if (!text) {
    return conn.sendMessage(
        m.chat,
        { text: `📝 Prompt wajib diisi!\nContoh: *${usedPrefix + command} Kratos bermain gulat dengan Zeus*` },
        { quoted: fkontak }
    );
 }

 isSoraProcessing = true;
 await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

 try {

    await conn.reply(m.chat, '🔍 Menganalisis dan menerjemahkan prompt ke bahasa Inggris...', m, { quoted: fkontak });
    
    const { translated: translatedPrompt, sourceLang } = await translateToEnglish(text);

    if (sourceLang !== 'en' && sourceLang !== 'auto') {
        await conn.reply(m.chat, `✨ Prompt berhasil diterjemahkan dari [${sourceLang}] ke [en]:\n*${translatedPrompt}*`, m, { quoted: fkontak });
    } else {
        await conn.reply(m.chat, `📝 Prompt sudah dalam bahasa Inggris. Melanjutkan...`, m, { quoted: fkontak });
    }

    const apiUrl = `${SORA_API_URL}?prompt=${encodeURIComponent(translatedPrompt)}`;
    await conn.reply(m.chat, `🚀 Mengirim permintaan Sora...\n*Prompt Asli:* ${text}`, m, { quoted: fkontak });

    const apiResp = await axios.get(apiUrl, { timeout: 30000 });
    const initialData = apiResp.data;

    // Validasi respon awal
    if (!initialData.status || !initialData.job_id || !initialData.check_url) {
        throw new Error(`API Gagal (Tahap 1): ${initialData.message || 'Respon tidak valid, tidak ada job_id/check_url'}`);
    }

    const jobId = initialData.job_id;
    const checkUrl = initialData.check_url;
    await conn.reply(m.chat, `✅ Permintaan diterima (ID: ${jobId}).\n⏱️ Menunggu 40 detik sebelum pengecekan pertama...`, m, { quoted: fkontak });

    // Tahap 2: Polling
    await delay(INITIAL_WAIT_MS); 
    let statusData = null;
    let attempts = 0;
    
    while (attempts < MAX_POLLING_ATTEMPTS) {
        attempts++;
        console.log(`[Sora] Percobaan polling ke-${attempts} untuk Job ID: ${jobId}`);
        
        const statusResp = await axios.get(checkUrl, { timeout: 30000 });
        statusData = statusResp.data;

        // Validasi respon status
        if (!statusData.status) {
             throw new Error(`API Gagal (Tahap 2): ${statusData.message || 'Status check gagal'}`);
        }

        // Cek jika sudah selesai
        if (statusData.processing === false) {
            console.log(`[Sora] Job ${jobId} selesai pada percobaan ke-${attempts}.`);
            break; // Keluar dari loop
        }

        // Cek jika sudah max attempts
        if (attempts >= MAX_POLLING_ATTEMPTS) {
            throw new Error(`Video masih diproses setelah ${MAX_POLLING_ATTEMPTS} percobaan. Silakan coba lagi nanti.`);
        }

        // Tunggu sebelum polling lagi
        await delay(POLLING_INTERVAL_MS);
    }

    // --- Tahap 3: Kirim Hasil (MODIFIKASI) ---
    // Validasi hasil akhir
    if (!statusData.result || !statusData.result.download_url) {
        throw new Error(`API Gagal (Tahap 2): ${statusData.message || 'Tidak ada URL download di hasil akhir'}`);
    }

    const downloadUrl = statusData.result.download_url;
    const quality = statusData.result.quality || 'N/A';
    const format = statusData.result.format || 'N/A';

    await conn.sendFile(
        m.chat,
        downloadUrl,
        "sora_result.mp4",
        `✨ *Sora Video Berhasil Dibuat*\n\n*Prompt:* ${text}\n*Kualitas:* ${quality}\n*Format:* ${format}`,
        m, { quoted: fkontak }); 
        
    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

    // Set Cooldown global
    soraCooldown = Date.now() + (GLOBAL_COOLDOWN_SECONDS * 1000);

 } catch (e) {
    console.error("[Sora Error]", e); 
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    
    const errorDetails = `Message: ${e?.message || e}\nStack: ${e?.stack || 'No stack available'}`;
    conn.sendMessage(m.chat, { text: `❗ Terjadi Kesalahan:\n${errorDetails}` }, { quoted: fkontak });
 } finally {
    // Pastikan processing flag di-reset
    isSoraProcessing = false;
 }
};

// --- EKSPOR HANDLER ---
handler.help = ["sora <prompt>"];
handler.tags = ["ai", "video", "premium"];
handler.command = /^(sora)$/i;
handler.limit = true; 
handler.premium = true; 

export default handler;