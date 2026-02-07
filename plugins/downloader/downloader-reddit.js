import fetch from 'node-fetch';

const handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) throw `Contoh:\n${usedPrefix + command} https://www.reddit.com/r/fursuit/comments/1i1yic0/银碳gintan_illit_cherish_my_love/`;

  // Kirim emoji loading
  await conn.sendMessage(m.chat, {
    react: {
      text: '⏳',
      key: m.key
    }
  });

  try {
    const url = `https://fastrestapis.fasturl.cloud/downup/redditdown?url=${encodeURIComponent(args[0])}`;
    const res = await fetch(url);
    const json = await res.json();

    if (!json || json.status !== 200 || !json.result) throw 'Gagal mengambil video';

    const video = json.result.data.secure_media.reddit_video.fallback_url;
    const title = json.result.snippet.title;
    const author = json.result.snippet.author;
    const ups = json.result.snippet.ups;

    const caption = `*${title}*\n👤 Author: ${author}\n⬆️ Upvotes: ${ups}`;

    await conn.sendFile(m.chat, video, 'reddit.mp4', caption, m);

    // Ganti ke emoji selesai
    await conn.sendMessage(m.chat, {
      react: {
        text: '✅',
        key: m.key
      }
    });
  } catch (e) {
    console.error(e);
    await conn.sendMessage(m.chat, {
      react: {
        text: '❌',
        key: m.key
      }
    });
    throw 'Terjadi kesalahan saat mengambil video Reddit.';
  }
};

handler.help = ['redditdl <url>'];
handler.tags = ['downloader'];
handler.command = /^reddit(dl)?$/i;

export default handler;