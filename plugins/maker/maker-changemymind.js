import axios from 'axios';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text) throw `Contoh penggunaan:\n${usedPrefix + command} ${global.author}`;

    await conn.sendMessage(m.chat, { react: { text: `${global.titlebot}`, key: m.key } });

    const api = `${global.APIs.lolhuman}/api/creator/changemymind?apikey=${global.lolhuman}&text=${encodeURIComponent(text)}`;

    await conn.sendMessage(m.chat, {
      image: { url: api },
      caption: `Dibuat oleh ${global.namebot}`
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (err) {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    await conn.sendMessage(m.chat, {
      text: `Terjadi kesalahan: ${err.message || err}`
    }, { quoted: m });
  }
};

handler.help = ['changemymind <teks>'];
handler.tags = ['maker'];
handler.command = ['changemymind'];
handler.limit = true;

export default handler;