import axios from 'axios';

const api = 'https://api.threadsphotodownloader.com/v2/media';

async function downloadFromThreads(url) {
  try {
    const res = await axios.get(api, {
      params: { url },
      headers: {
        'Origin': 'https://sssthreads.pro',
        'Referer': 'https://sssthreads.pro/',
        'User-Agent': 'Mozilla/5.0',
      }
    });

    const { video_urls = [], image_urls = [] } = res.data;

    if (video_urls.length === 0 && image_urls.length === 0) {
      return { status: false, message: '❌ Tidak ada media ditemukan, senpai~' };
    }

    return {
      status: true,
      videos: video_urls.map(v => v.download_url),
      images: image_urls,
    };
  } catch (err) {
    return {
      status: false,
      message: `❌ A-ano... terjadi error saat mengambil media, senpai: ${err.message}`,
    };
  }
}

let handler = async (m, { args, conn }) => {
  let url = args[0];

  if (!url || !/https?:\/\/(www\.)?threads\.(net|com)\/.+/.test(url)) {
    return conn.sendMessage(m.chat, {
      text: 'Masukkan URL Threads yang valid, senpai!\nContoh: https://www.threads.net/@user/post/abc123',
    }, { quoted: m });
  }

  await conn.sendMessage(m.chat, {
    react: { text: '⏳', key: m.key }
  });

  const res = await downloadFromThreads(url);
  if (!res.status) {
    return conn.sendMessage(m.chat, { text: res.message }, { quoted: m });
  }

  let caption = `✨ Nih media dari Threads, senpai!\n\n🧵 Link: ${url}`;

  for (const vid of res.videos) {
    await conn.sendMessage(m.chat, {
      video: { url: vid },
      caption
    }, { quoted: m });
  }

  for (const img of res.images) {
    await conn.sendMessage(m.chat, {
      image: { url: img },
      caption
    }, { quoted: m });
  }

  await conn.sendMessage(m.chat, {
    react: { text: '✅', key: m.key }
  });
};

handler.command = /^threads(dl)?|sssthreads$/i;
handler.help = ['threads <url>'];
handler.tags = ['downloader'];
handler.premium = false;
handler.limit = true;
handler.register = true;

export default handler;