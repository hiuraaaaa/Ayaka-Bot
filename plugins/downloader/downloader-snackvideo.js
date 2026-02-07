import fetch from 'node-fetch';

let handler = async (m, { conn, text, command }) => {
  if (!text) {
    return m.reply(`❌ Masukkan link SnackVideo!\n\nContoh:\n.${command} https://www.snackvideo.com/@username/video/12345`);
  }

  // Kirim reaksi saat memproses
  await conn.sendMessage(m.chat, {
    react: {
      text: '🍏',
      key: m.key
    }
  });

  try {
    const res = await fetch(`https://fastrestapis.fasturl.cloud/downup/snackvideodown?url=${encodeURIComponent(text)}`);
    const json = await res.json();

    if (json.status !== 200 || !json.result?.media) {
      return m.reply('❌ Gagal mengambil data dari API!');
    }

    const { title, thumbnail, media, author, like, comment, share } = json.result;

    const caption = `🎬 *Judul:* ${title}
👤 *Author:* ${author}
❤️ *Likes:* ${like}
💬 *Komentar:* ${comment}
🔁 *Shares:* ${share}
`;

    await conn.sendMessage(m.chat, {
      video: { url: media },
      caption,
      contextInfo: {
        externalAdReply: {
          title,
          body: `Author: ${author}`,
          thumbnailUrl: thumbnail,
          mediaUrl: text,
          mediaType: 2,
          renderLargerThumbnail: true,
          showAdAttribution: false,
        }
      }
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    m.reply('❌ Terjadi kesalahan saat memproses video SnackVideo!');
  }
};

handler.help = ['snackvideo <link>'];
handler.tags = ['downloader'];
handler.command = /^snackvideo$/i;
handler.limit = true;
handler.premium = false;
handler.register = true;

export default handler;