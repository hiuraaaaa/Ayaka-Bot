import axios from "axios"
import fetch from "node-fetch"
import FormData from "form-data"
import { fileTypeFromBuffer } from 'file-type'

const fkontak = {
 key: { participant: '0@s.whatsapp.net', remoteJid: '0@s.whatsapp.net', fromMe: false, id: 'Halo' },
 message: { conversation: `AI Happy Birthday 🎉🥳` }
};

// --- MODIFIKASI: Fungsi Prompt sekarang menerima argumen 'name' ---
const Prompt = (name) => `Create a cinematic HD vertical photo edit using a Canon lens look with warm lighting and pastel sunset tones. Add hand-drawn white chalk clouds at the top left with black eyes and a smiling face. Include sparkles, doodle stars, and “HAPPINESS” in large, blue 3D bubble text with soft shadow. Below it, “GOOD DAY!!” in pastel mint and yellow chalk-texture letters. Replace “ready to celebrate” with floating 3D birthday-themed doodles—balloons, stars, ribbons, confetti, and curly streamers in soft pink, yellow, and blue. Add a 3D digital birthday cake on top right corner with white frosting, soft shadows, one lit candle, and the name “${name}” in cute handwritten cursive on top. Add a white glowing chalk outline around the main body only, not inside the Polaroid cutouts. Bottom area includes 3D doodles like arrows, speech bubbles, Polaroid photo frames with soft drop shadows, and bold pastel captions like “choose one!!” All elements layered cleanly and glowing with cinematic depth.`

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

let handler = async (m, { conn, usedPrefix, command, text }) => {
 const q = m.quoted ? m.quoted : m
 const mime = (q.msg || q).mimetype || ""
  if (!/image\/(png|jpe?g|webp)/i.test(mime)) {
 return conn.reply(
 m.chat,
 `❗Balas/Reply gambar dengan caption *${usedPrefix + command} Namamu*\n📝 Contoh: *${usedPrefix + command} Lann4you*`,
 m, { quoted: fkontak }
 )
 }
 
 if (!text) {
  return conn.reply(
  m.chat,
  `❗Harus menyertakan nama.\nContoh: *${usedPrefix + command} Lann4you*`,
  m, { quoted: fkontak }
  )
 }
  
 const reactDone = { react: { text: "✅", key: m.key } }

 try {
 await conn.reply(m.chat, '⏳ Sedang memproses AI Birthday, mohon tunggu sebentar...', m, { quoted: fkontak })
 await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })

 const imgBuffer = await q.download()
 if (!imgBuffer?.length) throw new Error("❌ Gagal download media")
 const imageUrl = await uploadToZenzxz(imgBuffer)
 
   // --- MODIFIKASI: Masukkan 'text' (nama) ke fungsi Prompt ---
   const finalPrompt = Prompt(text) 
 const caption = `🥳 *Poster Happy Birthday Selesai*`

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

handler.help = ["tobirthday <nama>"]
handler.tags = ["ai"]
handler.command = /^(tohbd|tobirthday|tohappybirthday)$/i
handler.register = true

export default handler