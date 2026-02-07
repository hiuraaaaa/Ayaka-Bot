import axios from 'axios';
import { Sticker } from 'wa-sticker-formatter';

// [MODIFIKASI] Menambahkan fkontak
const fkontak = {
  key: { participant: '0@s.whatsapp.net', remoteJid: '0@s.whatsapp.net', fromMe: false, id: 'Halo' },
  message: { conversation: `Sticker Brat Video 🎥` }
};

let handler = async (m, { text, conn, usedPrefix, command }) => {
  if (!text) return conn.reply(m.chat, `Harap masukkan teks setelah perintah!\n${usedPrefix + command} Halo lann`, m, { quoted: fkontak });
  
  try {
    // [MODIFIKASI] Pesan "tunggu" tetap ada
    await conn.sendMessage(m.chat, { text: `⏳ Lagi Proses Brat Video` }, { quoted: fkontak });;
  
    let { data } = await axios.get(`${global.faa}/faa/bratvid?text=${encodeURIComponent(text)}`, {
      responseType: 'arraybuffer'
    });
    
    const sticker = new Sticker(data, {
      pack: global.stickpack,
      author: global.stickauth,
      type: 'full',
      quality: 70
    });
    
    // [MODIFIKASI] Mengirim stiker dengan quoted fkontak
    await conn.sendMessage(m.chat, await sticker.toMessage(), { quoted: fkontak });
    
  } catch (e) {
    console.error(e);
    // [MODIFIKASI] Menggunakan conn.reply untuk pesan error dengan fkontak
    conn.reply(m.chat, global.eror, m, { quoted: fkontak });
  }
};

handler.command = ['bratvid', 'bratvideo', 'bratgif'];
handler.limit = true; // Menambahkan limit untuk konsistensi

export default handler;