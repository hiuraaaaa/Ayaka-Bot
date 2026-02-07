/*
* Nama Fitur : AI To Pretty
* Type : Plugins ESM
* Author : lann
*/

import axios from "axios"
import fetch from "node-fetch"
import FormData from "form-data"
import { fileTypeFromBuffer } from 'file-type'

const fkontak = {
 key: { participant: '0@s.whatsapp.net', remoteJid: '0@s.whatsapp.net', fromMe: false, id: 'Halo' },
 message: { conversation: `AI To Pretty ♂️` }
};

const Prompt = () => `
Create an artsy Pinterest-style image. Keep the person in the image completely realistic—do not alter their face, features, or outfit. Instead, draw a chalk-style white outline around their entire body to give a sketched effect.

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

Make sure the background stays real and untouched, just enhance the vibes with these chalk doodles and writing.and keep the image size 9:16
`

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


let handler = async (m, { conn, usedPrefix, command }) => {
 const q = m.quoted ? m.quoted : m
 const mime = (q.msg || q).mimetype || ""
  if (!/image\/(png|jpe?g|webp)/i.test(mime)) {
 return conn.reply(
 m.chat,
 `❗Balas/Reply gambar dengan caption *${usedPrefix + command}*`,
 m, { quoted: fkontak }
 )
 }
 
 const reactDone = { react: { text: "✅", key: m.key } }

 try {
 await conn.reply(m.chat, '⏳ Sedang memproses AI To Pretty, mohon tunggu sebentar...', m, { quoted: fkontak })
 await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })

 const imgBuffer = await q.download()
 if (!imgBuffer?.length) throw new Error("❌ Gagal download media")
 const imageUrl = await uploadToZenzxz(imgBuffer)
 
   const finalPrompt = Prompt() 
 const caption = `♂️ *Poster Cantik Selesai*`

 const apiUrl = `${global.faa}/faa/editfoto?url=${encodeURIComponent(imageUrl)}&prompt=${encodeURIComponent(finalPrompt)}` 
 
 const apiResp = await axios.get(apiUrl, { 
 timeout: 180000,
 responseType: 'arraybuffer' 
 })
 
 let data;
 let isBinary = false;

 try {

 data = JSON.parse(Buffer.from(apiResp.data).toString('utf8'));
 } catch (e) {

 data = apiResp.data; 
 isBinary = true;
 }

 if (isBinary) {
 await conn.sendFile(m.chat, data, "singer_poster.jpg", caption, fkontak);
 } else if (!data?.status || !data?.result?.url) {
 console.error("API Response Gagal (JSON):", data); 
 const errorMessage = data?.error 
 ? `API Error: ${data.error}` 
 : `API tidak mengembalikan result yang valid. Data diterima: ${JSON.stringify(data).substring(0, 100)}...`; 
 
 throw new Error(errorMessage);
 } else {
 const outResp = await axios.get(data.result.url, {
 responseType: "arraybuffer",
 timeout: 120000
 })
 const outBuf = Buffer.from(outResp.data)
 await conn.sendFile(m.chat, outBuf, "singer_poster.jpg", caption, fkontak)
 }
 await conn.sendMessage(m.chat, reactDone)
 } catch (e) {
 await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } })
 conn.reply(m.chat, `❌ Error: ${e.message || e}`, m, { quoted: fkontak })
 }
}

handler.help = ["topretty"]
handler.tags = ["ai"]
handler.command = /^(topretty|pretty)$/i
handler.register = true

export default handler