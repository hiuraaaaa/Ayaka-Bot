const handler = async (m, { conn, args }) => {
  try {
    if (!args[0]) throw `Masukkan nama, contoh: *.badgirl ${global.namebot}*`;

    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    const name = encodeURIComponent(args.join(' '));
    const imageUrl = `${global.APIs.lolhuman}/api/badgirl?apikey=${global.lolhuman}&name=${name}`;

    await conn.sendMessage(m.chat, {
      image: { url: imageUrl },
      caption: `Badgirl oleh ${global.namebot}`
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (err) {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    await conn.sendMessage(m.chat, {
      text: `Terjadi kesalahan: ${err.message || err}`
    }, { quoted: m });
  }
};

handler.help = ['badgirl <nama>'];
handler.tags = ['maker'];
handler.command = ['badgirl'];
handler.limit = true;

export default handler;