/*
lann
*
* === SUDAH DIPERBAIKI OLEH GEMINI ===
* Perubahan: Mengganti metode pengiriman audio dari PTT/OGG (yang error)
* menjadi audio/mpeg via URL (seperti ytmp3.js) sambil
* mempertahankan externalAdReply (thumbnail besar).
*/

import yts from 'yt-search';
import axios from 'axios';
import cheerio from 'cheerio';
import fetch from 'node-fetch'

const randomConversations = [
  "Musik Pilihanmu Siap Diputar 🎶",
  "Ayaka Siap Temani Harimu Dengan Musik 📀",
]

const getRandomText = () =>
  randomConversations[Math.floor(Math.random() * randomConversations.length)]

function extractVideoId(url) {
  const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/)
  return match ? match[1] : null
}

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


async function ytmp3(url) {
  if (!url) throw '📝 Masukkan URL YouTube!'
  const videoId = extractVideoId(url)
  const thumbnail = videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null

  try {
    const form = new URLSearchParams()
    form.append('q', url)
    form.append('type', 'mp3')

    const res = await axios.post('https://yt1s.click/search', form.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Origin': 'https://yt1s.click',
        'Referer': 'https://yt1s.click/',
        'User-Agent': 'Mozilla/5.0',
      },
    })

    const $ = cheerio.load(res.data)
    const link = $('a[href*="download"]').attr('href')

    if (link) {
      return {
        link,
        title: $('title').text().trim() || 'Unknown Title',
        thumbnail,
        filesize: null,
        duration: null,
        success: true,
      }
    }
  } catch (e) {
    console.warn('Gagal YT1S:', e.message || e.toString())
  }

  try {
    if (!videoId) throw 'Video ID tidak valid'
    const payload = { fileType: 'MP3', id: videoId }

    const res = await axios.post('https://ht.flvto.online/converter', payload, {
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://ht.flvto.online',
        'Referer': `https://ht.flvto.online/widget?url=https://www.youtube.com/watch?v=${videoId}`,
        'User-Agent': 'Mozilla/5.0',
      },
    })

    const data = res?.data
    if (!data || typeof data !== 'object') throw 'Tidak ada respon dari FLVTO'
    if (data.status !== 'ok' || !data.link) throw `Status gagal: ${data.msg || 'Tidak diketahui'}`

    return {
      link: data.link,
      title: data.title,
      thumbnail,
      filesize: data.filesize,
      duration: data.duration,
      success: true,
    }
  } catch (e) {
    console.warn('Gagal FLVTO:', e.message || e.toString())
  }

  throw 'Gagal mendapatkan link download.'
}

let handler = async (m, { conn, command, text, usedPrefix }) => {
  const fkontak = {
    key: {
      participant: '0@s.whatsapp.net',
      remoteJid: '0@s.whatsapp.net',
      fromMe: false,
      id: 'Musik Pilihanmu Siap Diputar 🎶',
    },
    message: {
      conversation: getRandomText(),
    },
  }

  if (!text) {
    return conn.reply(
      m.chat,
      `*🎵 Hai Kak! Mau cari lagu apa hari ini?*\n\n*📝 Contoh:* ${usedPrefix + command} Armada Bebaskan Diriku`,
      m,
      { quoted: fkontak }
    )
  }

  await conn.sendMessage(m.chat, {
    react: { text: '🎶', key: m.key },
  })

  try {
    const search = await yts(text)
    if (!search.videos.length) throw '❌ Lagu tidak ditemukan di YouTube.'

    const top10Videos = search.videos.slice(0, 10)
    const firstVideo = search.videos[0]
    const videoIds = top10Videos.map(v => v.videoId).join(',');
    const YOUTUBE_API_KEY = global.youtube;
    let detailsMap = new Map();
    if (YOUTUBE_API_KEY) {
      try {
        const videoDetailsResponse = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`);
        const videoDetails = await videoDetailsResponse.json();
        if (videoDetails.items) {
          detailsMap = new Map(videoDetails.items.map(item => [item.id, item]));
        }
      } catch (apiError) {
        console.warn('Gagal mengambil detail YouTube API:', apiError.message);
      }
    } else {
        console.warn('YouTube API Key (global.youtube) tidak dikonfigurasi. Detail list akan terbatas.');
    }
    
    const rows = top10Videos.map((video, index) => {
      const details = detailsMap.get(video.videoId);
      let description;
      let title = video.title;

      if (details) {
        const duration = parseDuration(details.contentDetails.duration);
        const views = Number(details.statistics.viewCount).toLocaleString('id-ID');
        const likes = Number(details.statistics.likeCount).toLocaleString('id-ID');
        const comments = Number(details.statistics.commentCount).toLocaleString('id-ID');
        const date = new Date(details.snippet.publishedAt).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
        
        title = details.snippet.title;
        description = `⏳${duration} 👀${views}\n❤️${likes} 💬${comments} 📅${date}`;
      
      } else {
        const duration = video.timestamp || '00:00';
        const views = video.views.toLocaleString('id-ID');
        description = `⏰${duration} | 👀${views}`;
      }
      
      return {
        header: `${index + 1}. ${title}`,
        title: title,
        description: description,
        id: `${usedPrefix}ytmp3 ${video.url}`
      }
    })

    const thumbnailUrl = firstVideo.thumbnail

    await conn.sendMessage(m.chat, {
      product: {
        productImage: { url: thumbnailUrl },
        productId: '9999999999999999',
        title: 'Hasil Pencarian YouTube',
        description: 'Pilih musik yang ingin Anda unduh',
        currencyCode: 'IDR',
        priceAmount1000: '0',
        retailerId: 'ytsearch',
        url: 'https://wa.me/6288705574039', 
        productImageCount: 1
      },
      businessOwnerJid: '6288705574039@s.whatsapp.net',
      caption: `🔍 *Hasil pencarian untuk:* ${text}\n\n*Silakan pilih dari daftar di bawah ini!*`,
      title: 'Daftar Lagu',
      subtitle: 'Klik tombol di bawah',
      footer: `© 2025 ${global.namebot}`,
      interactiveButtons: [
        {
          name: 'single_select',
          buttonParamsJson: JSON.stringify({
            title: 'Pilih Musik',
            sections: [
              {
                title: 'Hasil Pencarian',
                highlight_label: 'Pilih Salah Satu',
                rows
              }
            ]
          })
        }
      ],
      hasMediaAttachment: false
    }, { /* Opsi quoted: m dihapus untuk menghindari duplikasi */ }) 

    const result = await ytmp3(firstVideo.url)
    if (!result?.link) throw 'Gagal mengambil audio dari YouTube'

    const firstVideoDetails = detailsMap.get(firstVideo.videoId);
    let duration, viewCount, publishedAt, title, caption, newBody;

    if (firstVideoDetails) {
        duration = parseDuration(firstVideoDetails.contentDetails.duration);
        viewCount = Number(firstVideoDetails.statistics.viewCount).toLocaleString('id-ID');
        const likes = Number(firstVideoDetails.statistics.likeCount).toLocaleString('id-ID');
        const comments = Number(firstVideoDetails.statistics.commentCount).toLocaleString('id-ID');
        publishedAt = new Date(firstVideoDetails.snippet.publishedAt).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        title = firstVideoDetails.snippet.title;
        newBody = `⏳${duration} 👀${viewCount} ❤${likes} 💬${comments}`; 
        caption = `
*${title}*
🎵 *Durasi:* ${duration}
👀 *Tayangan:* ${viewCount}
❤️ *Suka:* ${likes}
💬 *Komentar:* ${comments}
📅 *Upload:* ${publishedAt}
`;
    } else {
        duration = firstVideo.timestamp;
        viewCount = firstVideo.views.toLocaleString('id-ID');
        publishedAt = firstVideo.ago;
        title = firstVideo.title;
        newBody = `⏳${duration} | 👀${viewCount} | 📅${publishedAt}`;
        caption = `
*${title}*
🎵 *Durasi:* ${duration}
👀 *Tayangan:* ${viewCount}
📅 *Upload:* ${publishedAt}
`;
    }
    const contextInfo = {
         externalAdReply: {
            title: `🎶 ${title}`,
            body: newBody,
            thumbnailUrl: firstVideo.thumbnail,
            sourceUrl: firstVideo.url,
            mediaType: 1,
            renderLargerThumbnail: true,
            showAdAttribution: false
        }
    };

    await conn.sendMessage(
      m.chat,
      {
        audio: { url: result.link },
        mimetype: 'audio/mpeg',
        fileName: `${title}.mp3`,
        caption: caption,
        contextInfo: contextInfo
      },
      { quoted: fkontak }
    )
    await conn.sendMessage(m.chat, {
      react: { text: '✅', key: m.key },
    })

  } catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, {
      react: { text: '❌', key: m.key },
    })
    await conn.reply(m.chat, `❌ Gagal mengambil audio YouTube.\n\nLog: ${e.message || e}`, m, { quoted: fkontak });

  } 
}

handler.help = ['play3', 'musik3', 'lagu3', 'song3'].map(v => v + ' <judul>')
handler.tags = ['downloader']
handler.command = /^(play3|musik3|lagu3|song3)$/i
handler.limit = true
handler.premium = false
handler.register = true

export default handler;

/*
lann
*
* === SUDAH DIPERBAIKI OLEH GEMINI ===
* Perubahan: Mengganti metode pengiriman audio dari PTT/OGG (yang error)
* menjadi audio/mpeg via URL (seperti ytmp3.js) sambil
* mempertahankan externalAdReply (thumbnail besar).
*/