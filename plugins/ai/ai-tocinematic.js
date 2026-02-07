/*
* Nama Fitur : AI To Cinematic
* Type : Plugins ESM
* Sumber : https://whatsapp.com/channel/0029VbBYwRiF1YlVvnE3rv3G
* Author : lann
*/

import fetch from 'node-fetch';
import FormData from 'form-data';
import { fileTypeFromBuffer } from 'file-type';
const { generateWAMessageFromContent, prepareWAMessageMedia, proto } = (await import('@adiwajshing/baileys')).default;

let isProcessing = false;
let isCooldown = false;
// --- KONFIGURASI ---
const fkontak = {
    key: { participant: '0@s.whatsapp.net', remoteJid: '0@s.whatsapp.net', fromMe: false, id: 'Halo' },
    message: { conversation: `AI Cinematic 🎬` }
};

// Daftar prompt dan nama untuk diproses secara sekuensial
const API_CONFIGS = [
    {
        name: "Cinematic 🎬",
        prompt: `Foto dari atas ke bawah dari karakter, pertahankn bentuk wajah bentuk rambut model rambut 100%, dalam pakaian musim dingin yang sejuk - jean biru yang agak longgar dan jaket kuning puffer di atas kaos hitam polos dan sepatu nike jordan, berdiri diam melihat ke arah kamera, di jalan yang agak sibuk dengan orang-orang yang berjalan kaki, menggeser jalur kerumunan, gambar rana rendah, fokus subjek yang tajam, keburaman gerakan, gradasi warna teal yang sangat sinematik, butiran film minimal pasca produksi.`
    },
    {
        name: "Cinematic v2 🎬",
        prompt: `CINEMATIC STREET PHOTOGRAPHY, STYLISH CHARACTER IN MOTION, URBAN ENVIRONMENT, MOTION BLUR EFFECT. BLURRED PEDESTRIANS PASSING BY, SHALLOW DEPTH OF FIELD, NATURAL OVERCAST LIGHTING, SOFT PASTEL TONES, EDITORIAL FASHION PHOTOGRAPHY, CANDID MOMENT, DYNAMIC MOVEMENT, FILM AESTHETIC, MUTED COLORS --ar 4:5 --s 250 --raw`
    }
];

const API_BASE_URL = () => `${global.faa}/faa/editfoto`;

const RETRY_COUNT = 5; // Jumlah retry untuk *mengunggah hasil*
const RETRY_DELAY = 2000; // Jeda retry untuk *mengunggah hasil*
const API_PROCESS_DELAY = 20000; // Jeda 20 detik antar request API & saat retry

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

async function uploadResultWithRetry(buffer, index) {
    const { ext } = await fileTypeFromBuffer(buffer) || { ext: 'png' };
    
    for (let i = 0; i < RETRY_COUNT; i++) {
        try {
            console.log(`Mengunggah hasil gambar #${index + 1}, percobaan ke-${i + 1}...`);
            const result = await uploadToZenzxz(buffer);
            console.log(`Unggah hasil #${index + 1} berhasil.`);
            return result; 
            
        } catch (error) {
            console.error(`Unggah hasil #${index + 1} gagal pada percobaan ke-${i + 1}: ${error.message}`);
            if (i === RETRY_COUNT - 1) throw error; 
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY)); 
        }
    }
}

async function processEditFotoApi(imageUrl, prompt) {
    const apiUrl = `${API_BASE_URL()}?url=${encodeURIComponent(imageUrl)}&prompt=${encodeURIComponent(prompt)}`;
    
    const response = await fetch(apiUrl, { timeout: 180000 }); // Timeout 3 menit
    if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);

    const buffer = await response.buffer();
    
    let data;
    let isBinary = false;
    try {
        data = JSON.parse(buffer.toString('utf8'));
    } catch (e) {
        isBinary = true;
    }

    if (isBinary) {
        if (!buffer || buffer.length < 1000) throw new Error('API tidak mengembalikan gambar yang valid (binary).');
        return buffer;
    }
    
    if (!data?.status || !data?.result?.url) {
        const errorMessage = data?.error 
            ? `API Error (JSON): ${data.error}` 
            : `API tidak mengembalikan result yang valid. Data: ${JSON.stringify(data).substring(0, 100)}...`;
        throw new Error(errorMessage);
    }

    console.log(`API mengembalikan URL: ${data.result.url}. Mengunduh...`);
    const outResp = await fetch(data.result.url, { timeout: 120000 }); // Timeout 2 menit
    if (!outResp.ok) throw new Error(`Gagal mengunduh hasil dari URL: ${outResp.statusText}`);
    
    const outBuf = await outResp.buffer();
    if (!outBuf || outBuf.length < 1000) throw new Error('API tidak mengembalikan gambar yang valid (from URL).');
    
    return outBuf;
}

// --- HANDLER UTAMA ---
const handler = async (m, { conn, usedPrefix, command }) => {

    if (isProcessing) {
        return conn.reply(m.chat, '⏳ Fitur AI Cinematic sedang digunakan oleh pengguna lain. Mohon tunggu sebentar...', m, { quoted: fkontak });
    }
    if (isCooldown) {
        return conn.reply(m.chat, '⏳ Fitur baru saja selesai digunakan. Mohon tunggu 10 detik sebelum mencoba lagi.', m, { quoted: fkontak });
    }
    
    const mime = m.quoted?.mimetype || '';
    if (!/image/.test(mime)) {
        return conn.reply(m.chat, `Reply sebuah gambar dengan caption *${usedPrefix + command}*`, m, { quoted: fkontak });
    }

    try {
        isProcessing = true;
        await conn.sendMessage(m.chat, { text: `⏳ Sedang membuat ${API_CONFIGS.length} model AI Cinematic, mohon tunggu sebentar...` }, { quoted: fkontak });

        const imageBuffer = await m.quoted.download();
        if (!imageBuffer) {
        
            throw new Error('❌ Gagal mengunduh gambar, silakan coba lagi.');
        }

        const sourceUrl = await uploadToZenzxz(imageBuffer);
        
        const successfulBuffers = [];
        const successfulConfigs = [];
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

        for (const config of API_CONFIGS) {
            let buffer;

            while (true) {
                try {
                    console.log(`Mencoba API ${config.name}...`);
                    buffer = await processEditFotoApi(sourceUrl, config.prompt);
                    console.log(`API ${config.name} berhasil.`);
                    successfulBuffers.push(buffer);
                    successfulConfigs.push(config);
                    break;
                } catch (error) {
                    console.error(`API ${config.name} gagal: ${error.message}. Mencoba lagi dalam ${API_PROCESS_DELAY / 1000} detik...`);
                    await delay(API_PROCESS_DELAY);
                }
            }
            if (successfulBuffers.length < API_CONFIGS.length) {
                console.log(`Menunggu ${API_PROCESS_DELAY / 1000} detik sebelum memproses API berikutnya...`);
                await delay(API_PROCESS_DELAY);
            }
        }

        if (successfulBuffers.length === 0) {
            throw new Error('❌ Gagal memproses gambar di semua API. Silakan coba lagi nanti.');
        }
        
        const finalUploadPromises = successfulBuffers.map((buffer, index) => uploadResultWithRetry(buffer, index));
        const finalUploadResults = await Promise.allSettled(finalUploadPromises);

        const finalImageUrls = finalUploadResults
            .filter(res => res.status === 'fulfilled' && res.value)
            .map(res => res.value);

        if (finalImageUrls.length === 0) {
        
            throw new Error('❗Gambar berhasil dibuat, namun gagal diunggah kembali setelah beberapa kali percobaan.');
        }

        // 4. Buat Carousel
        let carouselCards = [];
        for (let i = 0; i < finalImageUrls.length; i++) {
            const url = finalImageUrls[i];
            const config = successfulConfigs[i]; // Ambil nama dari config yang berhasil
            const media = await prepareWAMessageMedia({ image: { url: url } }, { upload: conn.waUploadToServer });
            
            const card = {
                header: proto.Message.InteractiveMessage.Header.fromObject({
                    title: `✨ ${config.name}`, // Gunakan nama dari config
                    hasMediaAttachment: true,
                    ...media
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                    buttons: [{
                        name: "cta_url",
                        buttonParamsJson: JSON.stringify({
                            display_text: "🔗 Lihat Gambar HD",
                            url: url
                        })
                    }]
                })
            };
            carouselCards.push(card);
        }

        // 5. Kirim pesan Carousel
        const msg = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2
                    },
                    interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                        body: proto.Message.InteractiveMessage.Body.create({
                            text: `*Berikut adalah ${carouselCards.length} hasil AI Style:*`
                        }),
                        footer: proto.Message.InteractiveMessage.Footer.create({
                            text: "Geser untuk melihat hasil lainnya"
                        }),
                        carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                            cards: carouselCards
                        })
                    })
                }
            }
        }, { userJid: m.chat, quoted: m });

        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

    } catch (e) {
        console.error(e);
        // --- UBAHAN: Kirim pesan error dari 'e.message' ---
        conn.reply(m.chat, `❗ Terjadi kesalahan: ${e.message}`, m, { quoted: fkontak });
    
    } finally {
        isProcessing = false;
        isCooldown = true;
        
        console.log('Memulai jeda 10 detik...');
        setTimeout(() => {
            isCooldown = false;
            console.log('Jeda selesai. Fitur siap digunakan.');
        }, 10000);    }
};

handler.help = ['cinematic', 'tocinematic'];
handler.tags = ['ai', 'tools'];
handler.command = /^(tocinematic|cinematic)$/i;
handler.limit = true;

export default handler;