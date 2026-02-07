import fetch from 'node-fetch';
import FormData from 'form-data';
import { fileTypeFromBuffer } from 'file-type';
const { generateWAMessageFromContent, prepareWAMessageMedia, proto } = (await import('@adiwajshing/baileys')).default;

// --- KONFIGURASI ---
const fkontak = {
 key: { participant: '0@s.whatsapp.net', remoteJid: '0@s.whatsapp.net', fromMe: false, id: 'Halo' },
 message: { conversation: `AI To Polaroid ✨` }
};

const POLAROID_API_URL = "https://api.zenzxz.my.id/maker/polaroid";
const REQUIRED_RESULT_COUNT = 5;
const polaroidSessions = {};

let isPolaroidProcessing = false;
let polaroidCooldown = 0;
const GLOBAL_COOLDOWN_SECONDS = 25;

// --- UPLOADER BARU ---
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

async function uploadToYupra(buffer, filename) {
 const form = new FormData();
 form.append('files', buffer, { filename });
 const res = await fetch('https://cdn.yupra.my.id/upload', { method: 'POST', body: form, headers: { ...form.getHeaders() } });
 if (!res.ok) throw new Error(`Yupra Gagal: ${res.statusText}`);
 const json = await res.json();
 if (!json.success || !json.files?.[0]) throw new Error('Yupra Gagal: Respons tidak valid');
 return `https://cdn.yupra.my.id${json.files[0].url}`;
}

async function handleFirstImage(m, conn, sender) {
 await conn.sendMessage(m.chat, { text: '✅ Gambar pertama diterima.\nSilakan reply gambar kedua dengan caption yang sama.' }, { quoted: fkontak });

 const imageBuffer = await m.quoted.download();
 if (!imageBuffer) throw new Error('Gagal mengunduh gambar pertama.');

 const url = await uploadToZenzxz(imageBuffer);
 if (!url) throw new Error('Gagal mengunggah gambar pertama.');

 polaroidSessions[sender] = { url1: url, timestamp: Date.now() };

 setTimeout(() => {
 if (polaroidSessions[sender] && polaroidSessions[sender].url1 === url) {
 delete polaroidSessions[sender];
 conn.reply(m.chat, '⏳ Sesi polaroid Anda telah berakhir karena tidak ada aktivitas selama 5 menit.', m);
 }
 }, 300000);
}

async function handleSecondImage(m, conn, sender) {
 await conn.sendMessage(m.chat, { text: `✅ Gambar kedua diterima.\n⏱️ Memulai proses pembuatan ${REQUIRED_RESULT_COUNT} polaroid... Ini mungkin memakan waktu beberapa menit.` }, { quoted: fkontak });

 const { url1 } = polaroidSessions[sender];
 delete polaroidSessions[sender];

 const image2Buffer = await m.quoted.download();
 if (!image2Buffer) throw new Error('Gagal mengunduh gambar kedua.');

 const url2 = await uploadToZenzxz(image2Buffer);
 if (!url2) throw new Error('Gagal mengunggah gambar kedua.');

 const successfulBuffers = [];
 const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

 while (successfulBuffers.length < REQUIRED_RESULT_COUNT) {
  try {
   const currentCount = successfulBuffers.length + 1;
   console.log(`Membuat gambar polaroid ke-${currentCount}...`);
   const apiUrl = `${POLAROID_API_URL}?img1=${encodeURIComponent(url1)}&img2=${encodeURIComponent(url2)}`;
   const res = await fetch(apiUrl);

   if (res.ok) {
    const buffer = await res.buffer();
    successfulBuffers.push(buffer);
    console.log(`Berhasil membuat gambar ke-${currentCount}.`);
   } else {
    console.error(`API Polaroid Gagal untuk gambar #${currentCount}: ${res.statusText}`);
   }
  } catch (error) {
   console.error(`Terjadi kesalahan pada percobaan #${successfulBuffers.length + 1}:`, error.message);
  }

  if (successfulBuffers.length < REQUIRED_RESULT_COUNT) {
   await delay(35000);
  }
 }

 if (successfulBuffers.length < REQUIRED_RESULT_COUNT) {
  throw new Error(`❗Hanya berhasil membuat ${successfulBuffers.length} gambar dari ${REQUIRED_RESULT_COUNT} yang diminta. API mungkin sedang bermasalah.`);
 }

 const finalImageUrls = [];
 const UPLOAD_ATTEMPT_LIMIT_PER_IMAGE = 10;

 for (let i = 0; i < successfulBuffers.length; i++) {
  const buffer = successfulBuffers[i];
  let success = false;
  let attempts = 0;

  while (!success && attempts < UPLOAD_ATTEMPT_LIMIT_PER_IMAGE) {
   try {
    const url = await uploadToZenzxz(buffer);
    finalImageUrls.push(url);
    success = true;
   } catch (e) {
    attempts++;
    console.error(`Upload Gagal (Zenzxz) untuk gambar #${i + 1} (Percobaan ${attempts}/${UPLOAD_ATTEMPT_LIMIT_PER_IMAGE}):`, e.message);
    if (attempts < UPLOAD_ATTEMPT_LIMIT_PER_IMAGE) {
     await new Promise(resolve => setTimeout(resolve, 2000));
    }
   }
  }

  if (!success) {
   throw new Error(`Gagal total mengunggah gambar #${i + 1} setelah ${UPLOAD_ATTEMPT_LIMIT_PER_IMAGE} percobaan.`);
  }
 }

 if (finalImageUrls.length < REQUIRED_RESULT_COUNT) {
  throw new Error(`Hanya ${finalImageUrls.length} dari ${REQUIRED_RESULT_COUNT} gambar yang berhasil diunggah.`);
 }

 let carouselCards = [];
 for (let i = 0; i < finalImageUrls.length; i++) {
  const url = finalImageUrls[i];
  const media = await prepareWAMessageMedia({ image: { url: url } }, { upload: conn.waUploadToServer });

  const card = {
   header: proto.Message.InteractiveMessage.Header.fromObject({
    title: `✨ Polaroid Result #${i + 1}`,
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
      text: `*Berikut adalah ${carouselCards.length} hasil Polaroid Anda:*`
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
}

const Lann4youxyz = async (m, { conn, usedPrefix, command }) => {

 if (isPolaroidProcessing) {
    return conn.reply(m.chat, '⏳ Perintah ini sedang dalam masa jeda. Silakan coba lagi ketika masa jeda berakhir', m);
 }

 const now = Date.now();
 if (now < polaroidCooldown) {
    const timeLeft = Math.ceil((polaroidCooldown - now) / 1000);
    return conn.reply(m.chat, `⏳ Perintah ini sedang dalam masa jeda. Silakan coba lagi dalam *${timeLeft} detik*.`, m);
 }
 
 const sender = m.sender;
 const mime = m.quoted?.mimetype || '';

 if (!/image/.test(mime)) {
  return conn.reply(m.chat, `🖼️ Reply sebuah gambar dengan caption *${usedPrefix + command}*.\n\nAnda perlu melakukannya dua kali untuk dua gambar yang berbeda.`, m, { quoted: fkontak });
 }

 const isSecondImageProcess = !!polaroidSessions[sender];

 try {
  if (isSecondImageProcess) {
   isPolaroidProcessing = true;

   await handleSecondImage(m, conn, sender);

   polaroidCooldown = Date.now() + (GLOBAL_COOLDOWN_SECONDS * 1000);
  } else {
   await handleFirstImage(m, conn, sender);
  }
 } catch (e) {
  console.error(e);
  if (polaroidSessions[sender]) {
   delete polaroidSessions[sender];
  }
  conn.reply(m.chat, `❗ Terjadi kesalahan: ${e.message}`, m, { quoted: fkontak });
 } finally {

    if (isSecondImageProcess) {
        isPolaroidProcessing = false;
    }

 }
};

Lann4youxyz.help = ['polaroid'];
Lann4youxyz.tags = ['ai', 'tools'];
Lann4youxyz.command = ['polaroid'];
Lann4youxyz.limit = true;
Lann4youxyz.premium = false;

export default Lann4youxyz;