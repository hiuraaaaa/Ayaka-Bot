let handler = async (m, { conn }) => {

  await conn.sendMessage(m.chat, {
    image: { url: 'https://Lann4youoffc.biz.id/api/random/ba/' },
    caption: '*Random Blue Archive*'
  }, { quoted: m });
};

handler.help = ['bluearchive'];
handler.command = ['randomba','bluearchive','randombluearchive'];
handler.tags = ['anime'];

export default handler;