import axios from 'axios';

const API = 'https://api.snakeloader.com/index.php';
const DEFAULT_HEADERS = {
  'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
  origin: 'https://snakeloader.com',
  referer: 'https://snakeloader.com/',
  'user-agent':
    'Mozilla/5.0 (Linux; Android 13; TECNO LH7n) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Mobile Safari/537.36',
  'x-requested-with': 'XMLHttpRequest',
};

const VIDEO_QUALITY_LABELS = {
  auto: 'Auto',
  '1080p': 'Full HD (1080p)',
  '720p': 'HD (720p)',
  '480p': 'SD (480p)',
  '360p': 'Low (360p)',
  '240p': 'Very Low (240p)',
  '144p': 'Tiny (144p)',
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function search(query) {
  try {
    const params = new URLSearchParams();
    params.append('query', query);
    params.append('action', 'search');

    const res = await axios.post(API, params.toString(), {
      headers: DEFAULT_HEADERS,
      responseType: 'json',
      validateStatus: s => s >= 200 && s < 500,
    });

    if (!res.data) throw new Error('No response from API');
    if (res.data.status !== 'ok') throw new Error(`Search failed: ${JSON.stringify(res.data)}`);

    return res.data.data;
  } catch (err) {
    throw new Error(`search() error: ${err.message}`);
  }
}

async function convertAndDownload({ vid, key, preferType = 'video' }) {
  try {
    const params = new URLSearchParams();
    params.append('vid', vid);
    params.append('key', key);
    params.append('captcha_provider', 'cloudflare');
    params.append('web_name', 'default');
    params.append('action', 'searchConvert');

    const res = await axios.post(API, params.toString(), {
      headers: DEFAULT_HEADERS,
      responseType: 'json',
      validateStatus: s => s >= 200 && s < 500,
    });

    if (!res.data) throw new Error('No response body from convert API');
    const dlink = res.data.dlink || res.data.data?.dlink;
    if (!dlink) throw new Error('Download link not found');

    return { dlink };
  } catch (err) {
    throw new Error(`convertAndDownload() error: ${err.message}`);
  }
}

async function listResolutions(url) {
  const data = await search(url);
  if (!data.convert_links?.video) return [];

  return data.convert_links.video.map(v => ({
    label: VIDEO_QUALITY_LABELS[v.quality?.toLowerCase()] || v.quality || 'Unknown',
    quality: v.quality,
    size: v.size || 'Unknown',
    key: v.key,
    selected: v.selected || false,
  }));
}

async function searchAndDownload(url, { prefer = 'video', qualityLabel = 'HD (720p)' } = {}) {
  const data = await search(url);
  if (!data.convert_links?.video || data.convert_links.video.length === 0)
    throw new Error('No video links available');

  let pick = data.convert_links.video.find(
    v => VIDEO_QUALITY_LABELS[v.quality?.toLowerCase()] === qualityLabel
  );
  if (!pick) pick = data.convert_links.video.find(v => v.selected) || data.convert_links.video[0];
  if (!pick || !pick.key) throw new Error('No valid key for download');

  let lastError;
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      console.log(`🔁 [Attempt ${attempt}] convertAndDownload...`);
      const file = await convertAndDownload({ vid: data.vid, key: pick.key, preferType: prefer });
      return {
        title: data.title,
        quality: VIDEO_QUALITY_LABELS[pick.quality?.toLowerCase()] || pick.quality,
        filesize: pick.size || 'Unknown',
        format: pick.format || 'mp4',
        download: file.dlink,
      };
    } catch (err) {
      lastError = err;
      console.warn(`⚠️ Percobaan ${attempt} gagal: ${err.message}`);
      if (attempt < 5) await delay(1500);
    }
  }

  throw lastError;
}

let handler = async (m, { conn, text, command }) => {
  try {
    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

    if (!text) {
      const sampleUrl = 'https://youtube.com/watch?v=CVvJp3d8xGQ';
      const data = await listResolutions(sampleUrl);
      if (!data || data.length === 0)
        return m.reply('⚠️ Tidak ada video ditemukan.');

      let listReso = data.map(v => `• ${v.label} - ${v.size}`).join('\n');
      return m.reply(
        `⚠️ Masukkan link YouTube terlebih dahulu!\nContoh: ${command} https://youtu.be/XXXXX 720p\n\n🎞️ Resolusi tersedia untuk contoh video:\n${listReso}`
      );
    }

    const [url, resInput] = text.split(" ");
    const qualityLabel = resInput ? resInput : 'HD (720p)';

    const result = await searchAndDownload(url, { prefer: 'video', qualityLabel });

    let caption = `🎬 *YouTube Downloader MP4*

📌 Judul: ${result.title || url}
🎞️ Resolusi: ${result.quality || qualityLabel}
💾 Ukuran: ${result.filesize || 'Unknown'}
🔗 Format: ${result.format || 'mp4'}
`;

    await conn.sendMessage(
      m.chat,
      {
        video: { url: result.download },
        mimetype: "video/mp4",
        caption,
      },
      { quoted: m }
    );

    await conn.sendMessage(
      m.chat,
      {
        video: { url: result.download },
        mimetype: 'video/mp4',
        caption,
      },
      { quoted: m }
    )

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
  } catch {}
}

handler.help = ['ytmp4'];
handler.tags = ['downloader'];
handler.command = /^(yt(mp4|video|v)?)$/i;
handler.limit = 5;
handler.register = true;

export default handler;