/*
* Nama Fitur : AI To Role Play
* Type : Plugins ESM
* Sumber : https://whatsapp.com/channel/0029Vb6p7345a23vpJBq3a1h
* Channel Testimoni : https://whatsapp.com/channel/0029Vb6B91zEVccCAAsrpV2q
* Group Bot : https://chat.whatsapp.com/CBQiK8LWkAl2W2UWecJ0BG
* Author : 𝐅𝐚𝐫𝐢𝐞l
* Nomor Author : https://wa.me/6282152706113
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
    message: { conversation: `AI Role Play 🆕` }
};

const getApiConfigs = (name) => [
    {
        name: "To Pretty 👸🏻",
        prompt: `Create an artsy Pinterest-style image. Keep the person in the image completely realistic—do not alter their face, features, or outfit. Instead, draw a chalk-style white outline around their entire body to give a sketched effect.

Add cute doodles in chalk:
	•	A pastel blue cloud on the top left
	•	A soft pink cloud on the right
	•	A mustard yellow sun with smiling face in the top corner
(All doodles should look hand-drawn with textured chalk strokes.)

On the bottom right corner, add a cute Polaroid camera doodle—blush pink with a heart on it.

Write in large playful chalk letters across the center or top:

✨ “I’M PRETTY” ✨

And below or near the person’s feet in small cursive chalk writing:

“You are made of stardust & soft light”

Make sure the background stays real and untouched, just enhance the vibes with these chalk doodles and writing.and keep the image size 9:16`
    },
    {
        name: "To Happy Birthday 🥳🎉",
        prompt: `Create a cinematic HD vertical photo edit using a Canon lens look with warm lighting and pastel sunset tones. Add hand-drawn white chalk clouds at the top left with black eyes and a smiling face. Include sparkles, doodle stars, and “HAPPINESS” in large, blue 3D bubble text with soft shadow. Below it, “GOOD DAY!!” in pastel mint and yellow chalk-texture letters. Replace “ready to celebrate” with floating 3D birthday-themed doodles—balloons, stars, ribbons, confetti, and curly streamers in soft pink, yellow, and blue. Add a 3D digital birthday cake on top right corner with white frosting, soft shadows, one lit candle, and the name “${name}” in cute handwritten cursive on top. Add a white glowing chalk outline around the main body only, not inside the Polaroid cutouts. Bottom area includes 3D doodles like arrows, speech bubbles, Polaroid photo frames with soft drop shadows, and bold pastel captions like “choose one!!” All elements layered cleanly and glowing with cinematic depth.`
    },
    {
        name: "To Scribble 🌸🌼",
        prompt: `Create a 9:16 HD doodle aesthetic edit while keeping the original person, pose, outfit, and background completely unchanged. Do not modify or retouch any part of the subject. Add soft pastel doodles and handwritten text for a cozy and playful vibe. Include a large 3D pastel header “have a nice day” at the top, with dotted white paper-plane trails and sky motifs. Add circular and vertical cutouts of the same person from the image, framed with white outlines and shadows. Surround the composition with doodled stars, sparkles, balloons, bows, hearts, and cute icons like flowers, bears, and carrots. Use warm, natural color grading with soft shadows and realistic texture. Write words in a casual handwritten style like “Desi gurl,” “traditional,” “lassi girl,” “pretty cool,” “lovely,” and “cool” to match the theme. Keep the overall tone vibrant, happy, and high-quality without changing the real look or lighting of the original image.`
    },
    {
        name: "To Coffee ☕",
        prompt: `Keep the person, face, pose, body, outfit, and background exactly the same. Do not alter or retouch any detail. Maintain natural lighting, real skin texture, and cozy café ambience. Add cute doodles and coffee-themed text in the same aesthetic as reference: fluffy white clouds and a small yellow doodle sun at the top, white and blue sketch squiggles and curved lines around the person, “Love You” in rounded handwritten blue text with white outline on top left, “cozy cozy” near the bottom in bubble blue sticker style, and a small white doodle coffee cup with steam near hand or table. On the right side, draw four rounded blue cubes vertically spelling “ARA” in white bold letters with connecting doodle lines. Add text “drinking coffee with Ayaka” at the bottom in white rounded handwritten font. Keep doodle lines smooth, bright, clean, and cartoon-like. Preserve realistic warm golden tones, HD 9:16 ratio, bright cozy mood, and aesthetic balance.`
    },
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

const handler = async (m, { conn, usedPrefix, command, text }) => {

    if (isProcessing) {
        return conn.reply(m.chat, '⏳ Fitur AI Role Play sedang digunakan oleh pengguna lain. Mohon tunggu sebentar...', m, { quoted: fkontak });
    }
    if (isCooldown) {
        return conn.reply(m.chat, '⏳ Fitur baru saja selesai digunakan. Mohon tunggu 10 detik sebelum mencoba lagi.', m, { quoted: fkontak });
    }
    
    const mime = m.quoted?.mimetype || '';
    if (!/image/.test(mime)) {
        return conn.reply(m.chat, `❗Balas/Reply gambar dengan caption *${usedPrefix + command} Namamu*\n📝 Contoh: *${usedPrefix + command} ${global.author}*`, m, { quoted: fkontak });
    }
    
    if (!text) {
        return conn.reply(
        m.chat,
        `*❗Harus menyertakan nama*\n*📝 Contoh:* ${usedPrefix + command} ${global.author || 'NamaAnda'}`,
        m, { quoted: fkontak }
        )
    }

    try {
        isProcessing = true;
        const apiConfigs = getApiConfigs(text);

        await conn.sendMessage(m.chat, { text: `⏳ Sedang membuat ${apiConfigs.length} model AI Role Play, mohon tunggu sebentar...` }, { quoted: fkontak });

        const imageBuffer = await m.quoted.download();
        if (!imageBuffer) {
        
            throw new Error('❌ Gagal mengunduh gambar, silakan coba lagi.');
        }

        const sourceUrl = await uploadToZenzxz(imageBuffer);
        
        const successfulBuffers = [];
        const successfulConfigs = [];
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

        for (const config of apiConfigs) {
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
            if (successfulBuffers.length < apiConfigs.length) {
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

        let carouselCards = [];
        for (let i = 0; i < finalImageUrls.length; i++) {
            const url = finalImageUrls[i];
            const config = successfulConfigs[i];
            const media = await prepareWAMessageMedia({ image: { url: url } }, { upload: conn.waUploadToServer });
            
            const card = {
                header: proto.Message.InteractiveMessage.Header.fromObject({
                    title: `${config.name}`,
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

        const msg = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2
                    },
                    interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                        body: proto.Message.InteractiveMessage.Body.create({
                            text: `*Berikut adalah ${carouselCards.length} hasil AI Role Play Style:*`
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

handler.help = ['toroleplay <nama>'];
handler.tags = ['ai', 'tools'];
handler.command = /^(toroleplay|roleplay|rp|torp)$/i;
handler.limit = true;

export default handler;