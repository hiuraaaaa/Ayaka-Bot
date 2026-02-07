const handler = async (m, { conn, args }) => {
  try {
    if (!args[0]) throw `Masukkan nama, contoh: *.badboy ${global.author}*`;

    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    const name = encodeURIComponent(args.join(' '));
    const imageUrl = `${global.APIs.lolhuman}/api/badboy?apikey=${global.lolhuman}&name=${name}`;

    await conn.sendMessage(m.chat, {
      image: { url: imageUrl },
      caption: `Badboy oleh ${global.namebot}`
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (err) {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    await conn.sendMessage(m.chat, {
      text: `Terjadi kesalahan: ${err.message || err}`
    }, { quoted: m });
  }
};

handler.help = ['badboy <nama>'];
handler.tags = ['maker'];
handler.command = ['badboy'];
handler.limit = true;

export default handler;