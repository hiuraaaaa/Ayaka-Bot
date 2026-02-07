import axios from 'axios';
import { Sticker } from 'wa-sticker-formatter';

// [MODIFIKASI] Menambahkan fkontak
const fkontak = {
  key: { participant: '0@s.whatsapp.net', remoteJid: '0@s.whatsapp.net', fromMe: false, id: 'Halo' },
  message: { conversation: `Sticker Brat Anime v2 🌸` }
};

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return conn.reply(m.chat, `Harap masukkan teks setelah perintah!\n${usedPrefix + command} Halo Lannl`, m, { quoted: fkontak });

  await conn.sendMessage(m.chat, { text: `⏳ Lagi Proses Brat Anime v2` }, { quoted: fkontak });

  try {
    const encodedText = encodeURIComponent(text.trim());
    const apiUrl = `https://www.veloria.my.id/imagecreator/bratanime?text=${encodedText}`;

    const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
    const stickerBuffer = Buffer.from(response.data, 'binary');

    const sticker = new Sticker(stickerBuffer, {
      pack: `${global.stickpack || 'Ayaka'}`,
      author: `${global.stickauth || 'Lann'}`,
      type: "full",
    });

    const finalStickerBuffer = await sticker.toBuffer();

    await conn.sendMessage(m.chat, {
      sticker: finalStickerBuffer
    }, { quoted: fkontak });

  } catch (e) {
    console.error('Error:', e);

    conn.reply(m.chat, '⚠️ Gagal membuat stiker Brat Anime v2! API mungkin sedang down.', m, { quoted: fkontak });
  }
};

handler.command = ["bratanime2", "animebrat2"];
handler.limit = true; 

export default handler;