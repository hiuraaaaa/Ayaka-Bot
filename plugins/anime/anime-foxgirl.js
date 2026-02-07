const handler = async (m, { conn }) => {
  try {
    const imageUrl = 'https://api.lolhuman.xyz/api/random2/fox_girl?apikey=ubed2407';

    await conn.sendMessage(m.chat, { react: { text: '🦊', key: m.key } });

    await conn.sendMessage(m.chat, {
      image: { url: imageUrl },
      caption: 'Fox Girl oleh Ubed Bot'
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (err) {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    await conn.sendMessage(m.chat, {
      text: `Terjadi kesalahan: ${err.message || err}`
    }, { quoted: m });
  }
};

handler.help = ['foxgirl'];
handler.tags = ['anime'];
handler.command = ['foxgirl'];
handler.limit = true;

export default handler;