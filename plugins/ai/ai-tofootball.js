import axios from "axios"
import fetch from "node-fetch"
import FormData from "form-data"
import { fileTypeFromBuffer } from 'file-type'

const fkontak = {
 key: { participant: '0@s.whatsapp.net', remoteJid: '0@s.whatsapp.net', fromMe: false, id: 'Halo' },
 message: { conversation: `AI Football Poster ✨` }
};


const Prompt = (playerName, jerseyNumber) => `
Create an ultra-realistic, high-resolution cinematic professional football (soccer) poster.
The central figure is based on the provided input image.
*Crucially, preserve the original face, hair, shape, and angle of the person from the input image exactly.*

The poster features three distinct perspectives of the player:
1. *Super Close-up Portrait:* The player's face with a clear view of the Manchester United home jersey (2025 season).
2. *Side Profile View:* The player wearing the Manchester United home jersey (2025 season) from the side, with the name "${playerName}" clearly visible on the back.
3. *Full-Body Action Shot:* The player in a complete Manchester United home football kit (2025 season jersey, shorts, socks, and cleats) with authentic sponsor logos.

*Jersey Details:* The number "${jerseyNumber}" must be prominently displayed on the front, back, and shorts of the jersey in all depictions.

*Dynamic Action Scene (Bottom Section):* At the bottom of the poster, integrate a dynamic, high-motion action scene. Show the player performing a powerful bicycle high jump kick. Include motion blur and realistic flying grass effects around the action.

*Background:* A bold dark blue Old Trafford stadium serves as the background. Behind the main character, a large, glowing number "${jerseyNumber}" and the name "${playerName}" are subtly integrated, creating an epic aura.

*Overall Style:* The poster should exude professional sports poster vibes, high-resolution details, and a cinematic quality.

*Logo:* Place the official Manchester United logo [see image (add a placeholder image URL for the logo here if you have one, or describe its appearance)] in the top right corner.
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


let handler = async (m, { conn, usedPrefix, command, text }) => {
 const q = m.quoted ? m.quoted : m
 const mime = (q.msg || q).mimetype || ""
 
  if (!/image\/(png|jpe?g|webp)/i.test(mime)) {
 return conn.reply(
 m.chat,
 `❌ Balas *GAMBAR* yang ingin dijadikan pemain dengan caption:\n*${usedPrefix + command} <nama> | <nomor>*\n\nContoh: *${usedPrefix + command} lanndev | 10*`,
 m, { quoted: fkontak }
 )
 }
 
 if (!text || !text.includes("|")) {
 return conn.reply(
 m.chat,
 `⚠️ Format salah, gunakan format: *${usedPrefix + command} <nama> | <nomor>*\n\nContoh: *${usedPrefix + command} lanndev | 10*`,
 m, { quoted: fkontak }
 )
 }
 
 const [playerName, jerseyNumber] = text.split("|").map(s => s.trim())
 if (!playerName || !jerseyNumber) {
 return conn.reply(m.chat, `⚠️ Nama & nomor wajib diisi!\n\nContoh: *${usedPrefix + command} lanndev | 10*`, m, { quoted: fkontak })
 }

 const reactDone = { react: { text: "✅", key: m.key } }

 try {
 await conn.reply(m.chat, '⏳ Sedang membuat poster, ini mungkin memakan waktu 1-2 menit...', m, { quoted: fkontak })
 await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })

 const imgBuffer = await q.download()
 if (!imgBuffer?.length) throw new Error("Gagal download media")
 const imageUrl = await uploadToZenzxz(imgBuffer)
 
 const finalPrompt = Prompt(playerName, jerseyNumber)
 const caption = `✨ *Poster Sepak Bola Selesai!*\n\n*Pemain:* ${playerName}\n*Nomor:* ${jerseyNumber}`

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

 await conn.sendFile(m.chat, data, "football_poster.jpg", caption, fkontak);
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

 await conn.sendFile(m.chat, outBuf, "football_poster.jpg", caption, fkontak)
 }
 
 await conn.sendMessage(m.chat, reactDone)
 
 } catch (e) {
 await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } })
 conn.reply(m.chat, `❌ Error: ${e.message || e}`, m, { quoted: fkontak })
 }
}

handler.help = ["tofootball nama | nomor"]
handler.tags = ["ai"]
handler.command = /^(tofootball|jadifootball)$/i
handler.register = true

export default handler