const handler = async (m, { conn, text }) => {
  try {
    if (!text) {
      return await conn.sendMessage(m.chat, { text: `Masukkan teks yang ingin ditampilkan di gambar (contoh: ${global.namebot}).` });
    }

    const imageUrl = `${global.APIs.lolhuman}/api/ephoto1/freefire?apikey=${global.lolhuman}&text=${encodeURIComponent(text)}`;

    await conn.sendMessage(m.chat, { react: { text: '🔥', key: m.key } });

    // Menambahkan caption dengan teks yang dimasukkan dan "Dibuat oleh Ubed Bot"
    const caption = `${text}\nDibuat oleh ${global.namebot}`;

    await conn.sendMessage(m.chat, {
      image: { url: imageUrl },
      caption: caption
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (err) {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    await conn.sendMessage(m.chat, {
      text: `Terjadi kesalahan: ${err.message || err}`
    }, { quoted: m });
  }
};

handler.help = ['freefire <teks>'];
handler.tags = ['maker'];
handler.command = ['freefire'];
handler.limit = true;

export default handler;