const handler = async (m, { conn, text }) => {
  try {
    if (!text) {
      return await conn.sendMessage(m.chat, { text: `Masukkan teks yang ingin ditampilkan di gambar (contoh: ${global.namebot}).` });
    }

    // Membuat URL gambar dengan teks yang diberikan
    const imageUrl = `${global.APIs.lolhuman}/api/idulfitri?apikey=${global.lolhuman}&text=${encodeURIComponent(text)}`;

    // Mengirimkan reaksi emoji untuk menunjukkan bahwa proses sedang berlangsung
    await conn.sendMessage(m.chat, { react: { text: '🎉', key: m.key } });

    // Mengirimkan gambar dengan caption
    await conn.sendMessage(m.chat, {
      image: { url: imageUrl },
      caption: `${text}\nDibuat oleh ${global.namebot}`
    }, { quoted: m });

    // Mengirimkan reaksi emoji ✅ setelah pengiriman berhasil
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (err) {
    // Jika terjadi kesalahan, kirimkan reaksi emoji ❌ dan pesan kesalahan
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    await conn.sendMessage(m.chat, {
      text: `Terjadi kesalahan: ${err.message || err}`
    }, { quoted: m });
  }
};

handler.help = ['idulfitri <teks>'];
handler.tags = ['maker'];
handler.command = ['idulfitri'];
handler.limit = true;

export default handler;