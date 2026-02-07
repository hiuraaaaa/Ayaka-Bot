const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.sendMessage(m.chat, {
      text: `Masukkan teks!\n\nContoh: ${usedPrefix + command} ${global.namebot}`
    }, { quoted: m });
  }

  try {
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    const imageUrl = `${global.APIs.lolhuman}/api/ephoto1/avatardota?apikey=${global.lolhuman}&text=${encodeURIComponent(text)}`;

    await conn.sendMessage(m.chat, {
      image: { url: imageUrl },
      caption: `Avatar Dota oleh ${global.namebot}\nTeks: ${text}`
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (err) {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    await conn.sendMessage(m.chat, {
      text: `Terjadi kesalahan: ${err.message || err}`
    }, { quoted: m });
  }
};

handler.help = ['dota <teks>'];
handler.tags = ['maker'];
handler.command = ['dota'];
handler.limit = true;

export default handler;