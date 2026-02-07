import fetch from 'node-fetch';

// fkontak untuk replikasi pesan
const fkontak = {
    key: {
        participant: '0@s.whatsapp.net',
        remoteJid: '0@s.whatsapp.net',
        fromMe: false,
        id: 'Halo',
    },
    message: {
        conversation: `Video pilihan mu siap diputar ✅`,
    },
};

// Helper function untuk format durasi ISO 8601 ke HH:MM:SS
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

const handler = async (m, { conn, text }) => {
    if (!text) {
        return conn.reply(m.chat, 'Harap masukkan URL YouTube.\nContoh: .ytmp4 https://youtube.com/watch?v=example', m, { quoted: fkontak });
    }

    try {
        await conn.reply(m.chat, global.wait, m, { quoted: fkontak });

        const id = text.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|.*embed\/))([^&?/]+)/)?.[1];
        if (!id) {
            throw new Error('URL YouTube tidak valid atau tidak ditemukan.');
        }

        const YOUTUBE_API_KEY = global.youtube;
        if (!YOUTUBE_API_KEY) {
            throw new Error('YouTube API Key tidak ditemukan. Harap konfigurasi terlebih dahulu di file config.js');
        }
        
        const videoDetailsResponse = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${id}&key=${YOUTUBE_API_KEY}`);
        const videoDetails = await videoDetailsResponse.json();

        if (!videoDetails.items || videoDetails.items.length === 0) {
          throw new Error('Detail video tidak dapat ditemukan. Mungkin video ini pribadi atau telah dihapus.');
        }

        const { snippet, statistics, contentDetails } = videoDetails.items[0];
        const title = snippet.title;
        const channelTitle = snippet.channelTitle;
        const publishedAt = new Date(snippet.publishedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
        const duration = parseDuration(contentDetails.duration);
        
        // [PERBAIKAN] Cek keberadaan data statistik sebelum menampilkannya
        const viewCount = statistics.viewCount ? Number(statistics.viewCount).toLocaleString('id-ID') : 'Tidak tersedia';
        const likeCount = statistics.likeCount ? Number(statistics.likeCount).toLocaleString('id-ID') : 'Privasi';
        const commentCount = statistics.commentCount ? Number(statistics.commentCount).toLocaleString('id-ID') : 'Dinonaktifkan';

        const apiUrl = `https://www.sankavollerei.com/download/ytmp4?url=${encodeURIComponent(text)}&apikey=${global.sanka}`;
        const apiResponse = await fetch(apiUrl);
        const apiJson = await apiResponse.json();

        if (!apiJson.status || !apiJson.result || !apiJson.result.download) {
            throw new Error('Gagal mendapatkan link unduhan dari API. Coba lagi nanti.');
        }

        const { thumbnail, download: downloadURL } = apiJson.result;

        const headResponse = await fetch(downloadURL, { method: 'HEAD' });
        const contentLength = headResponse.headers.get('content-length');
        const sizeMB = parseFloat(contentLength) / (1024 * 1024);

        const caption = `
╭─•「 𝗬𝗢𝗨𝗧𝗨𝗕𝗘 𝗠𝗣𝟰 」•─╮
│ 🎵 *Judul:* ${title}
│ 📺 *Channel:* ${channelTitle}
│ ⏰ *Durasi:* ${duration}
│ 📦 *Ukuran:* ${sizeMB.toFixed(2)} MB
│ 👀 *Tayangan:* ${viewCount}
│ ❤️ *Suka:* ${likeCount}
│ 💬 *Komentar:* ${commentCount}
│ 📅 *Upload:* ${publishedAt}
╰─•「 ${global.namebot} 」•─╯`;

        await conn.sendMessage(m.chat, {
            image: { url: thumbnail },
            caption: caption
        }, { quoted: fkontak });

        if (sizeMB > 95) {
            await conn.sendMessage(m.chat, {
                document: { url: downloadURL },
                mimetype: 'video/mp4',
                fileName: `${title}.mp4`,
            }, { quoted: fkontak });
        } else {
            await conn.sendMessage(m.chat, {
                video: { url: downloadURL },
                mimetype: 'video/mp4',
                fileName: `${title}.mp4`,
            }, { quoted: fkontak });
        }

    } catch (e) {
        conn.reply(m.chat, `❌ Terjadi kesalahan: ${e.message}`, m, { quoted: fkontak });
        console.error(e);
    }
};

handler.command = /^(ytmp4v2|ytvideov2)$/i;
handler.limit = 5;
handler.register = true;

export default handler;