let handler = async (m, { conn }) => {
  let videoUrl = 'https://files.catbox.moe/icdzbo.mp4';
  let caption = 'Ku bunuh lo dengan ini!';

  // Mengirim video dengan caption
  await conn.sendMessage(m.chat, {
    video: { url: videoUrl },
    caption: caption,
    mimetype: 'video/mp4'
  }, { quoted: m });
};

handler.help = ['bunuhlo'];
handler.tags = ['fun'];
handler.command = ['bunuhlo'];

export default handler;