import { sticker } from '../lib/sticker.js';

// [MODIFIKASI] Menambahkan fkontak
const fkontak = {
  key: { participant: '0@s.whatsapp.net', remoteJid: '0@s.whatsapp.net', fromMe: false, id: 'Halo' },
  message: { conversation: `Sticker Brat HD 🔥` }
};

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return conn.reply(m.chat, `Harap masukkan teks setelah perintah!\n${usedPrefix + command} Halo Lannl`, m, { quoted: fkontak });

  // [MODIFIKASI] Pesan "tunggu" tetap ada
  await conn.sendMessage(m.chat, { text: `⏳ Lagi Proses Brat HD` }, { quoted: fkontak });

  try {
    let url = `${global.faa}/faa/brathd?text=${encodeURIComponent(text)}`;
    let stiker = await sticker(null, url, `${global.stickpack}`, `${global.stickauth}`);

    // [MODIFIKASI] Mengirim stiker dengan quoted fkontak
    await conn.sendFile(m.chat, stiker, 'sticker.webp', '', fkontak);
  } catch (e) {
    console.error(e);
    conn.reply(m.chat, 'Terjadi kesalahan saat memproses stiker.', m, { quoted: fkontak });
  }
}

handler.command = /^brathd$/i;
handler.limit = true;

export default handler;