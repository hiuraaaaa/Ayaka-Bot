import axios from 'axios'
import fs from 'fs'
import path from 'path'
import FormData from 'form-data'
import { sticker } from '../lib/sticker.js'

// Objek fkontak untuk kutipan pesan
const fkontak = {
  key: { participant: '0@s.whatsapp.net', remoteJid: '0@s.whatsapp.net', fromMe: false, id: 'Halo' },
  message: { conversation: `Sticker Brat Image No Background 🖼️` }
};

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(m.chat, `Harap masukkan teks setelah perintah!\nContoh: ${usedPrefix + command} Halo Pariell`, m, { quoted: fkontak });
  }

  try {
    // 1. Kirim pesan tunggu
    await conn.sendMessage(m.chat, { text: `⏳ Lagi Proses Brat Image Tanpa Background...` }, { quoted: fkontak });
    
    const initialUrl = `${global.faa}/faa/brat?text=${encodeURIComponent(text)}`;
    const response = await axios.get(initialUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data, 'binary');

    const tmpDir = './tmp';    
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

    const tempFilePath = path.join(tmpDir, `${Date.now()}.png`);
    fs.writeFileSync(tempFilePath, imageBuffer);

    const form = new FormData();
    form.append('image', fs.createReadStream(tempFilePath));
    
    const { data: removebgData } = await axios.post('https://www.abella.icu/removal-bg', form, { headers: form.getHeaders() });
    const removedBgUrl = removebgData?.data?.previewUrl;

    fs.unlinkSync(tempFilePath);

    if (!removedBgUrl) {
      throw new Error('Gagal menghapus background dari gambar.');
    }

    let stiker = await sticker(null, removedBgUrl, `${global.stickpack}`, `${global.stickauth}`);
    if (stiker) await conn.sendFile(m.chat, stiker, 'sticker.webp', '', fkontak);

  } catch (e) {
    console.error(e);
    conn.reply(m.chat, `Terjadi kesalahan: ${e.message}`, m, { quoted: fkontak });
  }
}

handler.command = /^(bratimgnobg)$/i
handler.limit = true

export default handler;