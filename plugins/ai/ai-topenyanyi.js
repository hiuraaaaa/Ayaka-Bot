import axios from "axios"
import fetch from "node-fetch"
import FormData from "form-data"
import { fileTypeFromBuffer } from 'file-type'

const fkontak = {
 key: { participant: '0@s.whatsapp.net', remoteJid: '0@s.whatsapp.net', fromMe: false, id: 'Halo' },
 message: { conversation: `AI Singer Poster ✨` }
};

const Prompt = () => `
Buat foto seperti penyanyi sedang tampil di panggung konser, lampu merah-biru, dan ekspresi energik, namun pertahankan pakaian karakter, karakter sedang memegang mic dan seolah sedang bernyanyi di panggung konser.
*Crucially, preserve the original face, hair, shape, and angle of the person from the input image exactly.*
Pastikan gambar terlihat ultra-realistic, berkualitas tinggi, dan sinematik.
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
 `❌ Balas *GAMBAR* yang ingin dijadikan penyanyi dengan caption: *${usedPrefix + command}*`,
 m, { quoted: fkontak }
 )
 }
 
 const reactDone = { react: { text: "✅", key: m.key } }

 try {
 await conn.reply(m.chat, '⏳ Sedang membuat poster penyanyi, ini mungkin memakan waktu 1-2 menit...', m, { quoted: fkontak })
 await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })

 const imgBuffer = await q.download()
 if (!imgBuffer?.length) throw new Error("Gagal download media")
 const imageUrl = await uploadToZenzxz(imgBuffer)
 
   const finalPrompt = Prompt() 
 const caption = `🎤 *Poster Penyanyi Selesai!*\n\nFoto telah diubah menjadi penyanyi di panggung konser dengan pencahayaan merah-biru dan ekspresi energik.`

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

handler.help = ["topenyanyi"]
handler.tags = ["ai"]
handler.command = /^(topenyanyi|jadipenyanyi)$/i
handler.register = true

export default handler