import fetch from 'node-fetch';

const fkontak = {
  key: {
    participant: '0@s.whatsapp.net',
    remoteJid: '0@s.whatsapp.net',
    fromMe: false,
    id: 'Halo',
  },
  message: {
    conversation: `File musik pilihan mu siap diputar ✅`,
  },
};

const parseDuration = (duration) => {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  const hours = (parseInt(match[1]) || 0);
  const minutes = (parseInt(match[2]) || 0);
  const seconds = (parseInt(match[3]) || 0);
  return [
    hours,
    minutes,
    seconds
  ].map(v => v.toString().padStart(2, '0')).join(':');
};

const handler = async (m, { conn, text, usedPrefix, comand }) => {
  if (!text) {
    return conn.reply(m.chat, `Harap masukkan URL YouTube.\nContoh: ${usedPrwfix + command} https://youtube.com/watch?v=example`, m, { quoted: fkontak });
  }

  try {
    await conn.reply(m.chat, global.wait, m, { quoted: fkontak });

    const id = text.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|.*embed\/))([^&?/]+)/)?.[1];
    if (!id) {
        throw new Error('URL YouTube tidak valid atau tidak ditemukan.');
    }

    const YOUTUBE_API_KEY = global.youtube;
    if (!YOUTUBE_API_KEY) {
        throw new Error('YouTube API Key tidak ditemukan. Harap konfigurasi terlebih dahulu.');
    }
    
    const videoDetailsResponse = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${id}&key=${YOUTUBE_API_KEY}`);
    const videoDetails = await videoDetailsResponse.json();

    if (!videoDetails.items || videoDetails.items.length === 0) {
      throw new Error('Detail video tidak dapat ditemukan.');
    }

    const { snippet, statistics, contentDetails } = videoDetails.items[0];
    const title = snippet.title;
    const channelTitle = snippet.channelTitle;
    const publishedAt = new Date(snippet.publishedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    const duration = parseDuration(contentDetails.duration);
    const viewCount = Number(statistics.viewCount).toLocaleString('id-ID');
    const likeCount = Number(statistics.likeCount).toLocaleString('id-ID');
    const commentCount = Number(statistics.commentCount).toLocaleString('id-ID');

    const apiUrl = `${global.faa}/faa/ytmp3?url=${encodeURIComponent(text)}`;
    const downloaderResponse = await fetch(apiUrl);
    const downloaderJson = await downloaderResponse.json();

    const { result } = downloaderJson;
    if (!downloaderJson.status || !result || !result.mp3) {
      throw new Error('Gagal mendapatkan link unduhan audio. API mungkin sedang down.');
    }

    const { mp3: link, thumbnail } = result;
    const sizeMB = 'Unknown';

    const caption = `
╭─•「 𝗬𝗢𝗨𝗧𝗨𝗕𝗘 𝗗𝗢𝗖 」•─╮
│ 🎵 *Judul:* ${title}
│ 📺 *Channel:* ${channelTitle}
│ ⏰ *Durasi:* ${duration}
│ 📦 *Ukuran:* ${sizeMB} MB
│  👀 *Tayangan:* ${viewCount}
│ ❤️ *Suka:* ${likeCount}
│ 💬 *Komentar:* ${commentCount}
│ 📅 *Upload:* ${publishedAt}
╰─•「 ${global.namebot} 」•─╯`;

    await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption: caption
    }, { quoted: fkontak });

    await conn.sendMessage(m.chat, {
      document: { url: link }, 
      mimetype: 'audio/mpeg',
      fileName: `${title}.mp3` 
    }, { quoted: fkontak });

  } catch (e) {
    conn.reply(m.chat, `❌ Terjadi kesalahan: ${e.message}`, m, { quoted: fkontak });
    console.error(e);
  }
};

handler.command = ['ytmp3doc', 'ytaudiodoc'];
handler.limit = 6;
handler.premium = false;

export default handler;