import axios from "axios"
import fetch from "node-fetch"
import FormData from "form-data"
import { fileTypeFromBuffer } from 'file-type'

const fkontak = {
 key: { participant: '0@s.whatsapp.net', remoteJid: '0@s.whatsapp.net', fromMe: false, id: 'Halo' },
 message: { conversation: `AI To Pantai v2 🏖️` }
};

const Prompt = () => `
Pemandangan pantai saat matahari terbenam yang sangat realistis dengan langit biru tua yang dramatis yang dipenuhi awan gelap, sedikit cahaya menerobos dekat cakrawala, menghasilkan pantulan keemasan samar di air laut yang tenang. Pantai tersebut yang tenang dan muram.
​Di latar depan, pertahankan sepenuhnya subjek manusia dari gambar asli. Pastikan wajah asli, bentuk tubuh, lekukan tubuh, dan pakaian dari gambar input dijaga keasliannya 100% dan tidak diubah. wajahnya disinari lembut oleh lampu kilat kamera, menciptakan kontras yang indah dengan latar belakang yang gelap. pertahankan bentuk kepala, baik mengenakan hijab, jilbab, kerudung atu tidak, tetap pertahankan kepala karakter,dilengkapi dengan bunga kamboja (plumeria) putih segar lengan dengan pola bunga biru halus pada kain putih lembut, yang membangkitkan tampilan pantai yang segar. Tas bahu berwarna gading berlapis dengan tekstur halus dan empuk tergantung santai di bahunya. mode dan alam dengan sempurna.
​Gambar keseluruhannya memadukan tekstur yang sangat realistis, kontras pencahayaan alami dengan langit sunset gelap terlihat matahari berwarna merah pekat di tepi langit, dan pemandangan pantai yang atmosferik untuk menciptakan potret yang memikat dan damai secara visual. rasio 9:16.
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
 await conn.reply(m.chat, '⏳ Sedang memproses AI To Pantai v2, mohon tunggu sebentar...', m, { quoted: fkontak })
 await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })

 const imgBuffer = await q.download()
 if (!imgBuffer?.length) throw new Error("❌ Gagal download media")
 const imageUrl = await uploadToZenzxz(imgBuffer)
 
   const finalPrompt = Prompt() 
 const caption = `🏖 *Poster Pantai Selesai*`

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

handler.help = ["topantai2"]
handler.tags = ["ai"]
handler.command = /^(topantai2)$/i
handler.register = true

export default handler