import axios from 'axios';
import fs from 'fs';
import path from 'path';
import yts from 'yt-search';

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

const AUDIO_QUALITY_LABELS = {
  '128kbps': 'Standard (128kbps)',
  '64kbps': 'Low (64kbps)',
  '320kbps': 'High (320kbps)',
};

function formatNumber(num) {
  if (!num) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const TMP_DIR = path.join(process.cwd(), 'tmp');
if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR);

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

    if (!res.data) throw new Error('No response from Snakeloader API');
    if (res.data.status !== 'ok') throw new Error(`Search failed: ${JSON.stringify(res.data)}`);

    return res.data.data;
  } catch (err) {
    throw new Error(`search() error: ${err.message}`);
  }
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function convertAndDownload({ vid, key, preferType = 'audio' }) {
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

    if (!res.data) throw new Error('No response from convert API');
    const dlink = res.data.dlink || res.data.data?.dlink;
    if (!dlink) throw new Error('Download link not found');

    const dlRes = await axios.get(dlink, {
      responseType: 'arraybuffer',
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      headers: {
        'user-agent': DEFAULT_HEADERS['user-agent'],
        referer: 'https://snakeloader.com/',
      },
      validateStatus: s => s >= 200 && s < 500,
    });

    const contentType = (dlRes.headers['content-type'] || '').toLowerCase();
    if (contentType.includes('text/html')) throw new Error('Downloaded resource is HTML');

    let filename = `download-${vid}`;
    const cd = dlRes.headers['content-disposition'];
    if (cd) {
      const m = cd.match(/filename\*?=(?:UTF-8'')?["']?([^;"']+)/i);
      if (m) filename = decodeURIComponent(m[1]);
    } else {
      let ext = '';
      if (contentType.includes('audio/')) ext = contentType.split('/')[1].split(';')[0];
      if (contentType.includes('video/')) ext = contentType.split('/')[1].split(';')[0];
      if (!ext) {
        const urlObj = new URL(dlink);
        const guessed = path.extname(urlObj.pathname);
        if (guessed) ext = guessed.replace('.', '');
      }
      filename = `${vid}.${ext || (preferType === 'audio' ? 'mp3' : 'mp4')}`;
    }

    const buffer = Buffer.from(dlRes.data);
    const savePath = path.join(TMP_DIR, filename);
    fs.writeFileSync(savePath, buffer);

    return { buffer, filename, savePath, contentType, size: buffer.length };
  } catch (err) {
    throw new Error(`convertAndDownload() error: ${err.message}`);
  }
}

async function searchAndDownload(query, { prefer = 'audio', qualityLabel = null } = {}) {
  const data = await search(query);
  const links = prefer === 'video' ? (data.convert_links?.video || []) : (data.convert_links?.audio || []);

  if (!links.length) throw new Error(`No ${prefer} links available`);

  let pick = null;
  if (qualityLabel) {
    pick = links.find(
      l =>
        (VIDEO_QUALITY_LABELS[l.quality?.toLowerCase()] === qualityLabel) ||
        (AUDIO_QUALITY_LABELS[l.quality?.toLowerCase()] === qualityLabel)
    );
  }
  pick = pick || links.find(l => l.selected) || links[0];
  if (!pick || !pick.key) throw new Error('No valid key for download');

  let lastError;
  for (let attempt = 1; attempt <= 30; attempt++) {
    try {
      console.log(`🔁 [Attempt ${attempt}] convertAndDownload...`);
      return await convertAndDownload({ vid: data.vid, key: pick.key, preferType: prefer });
    } catch (err) {
      lastError = err;
      console.warn(`⚠️ Percobaan ${attempt} gagal: ${err.message}`);
      if (attempt < 30) await delay(1500);
    }
  }

  throw lastError;
}

const handler = async (m, { conn, usedPrefix, text, command }) => {
  if (!text) return m.reply(`Ketik judul lagu atau link\nContoh: ${usedPrefix + command} alone`);

  await conn.sendMessage(m.chat, { react: { text: '🧸', key: m.key } });

  try {
    
    const searchRes = await yts(text);
    const video = searchRes.all[0];
    if (!video) return m.reply('Video tidak ditemukan.');

    const { title, views, timestamp, ago, url, author } = video;

    const snakeloaderData = await search(url);
    const scraperThumb = snakeloaderData.thumbnail || video.image;

    const caption = `⬣─ 〔 *Y T - A U D I O* 〕 ─⬣
- *Title:* ${title}
- *Views:* ${formatNumber(views)}
- *Duration:* ${timestamp}
- *Upload:* ${ago}
- *Author:* ${author?.name || 'N/A'}
⬣────────────────⬣`;

    const result = await searchAndDownload(url, { prefer: 'audio', qualityLabel: 'Standard (128kbps)' });

    await conn.sendMessage(m.chat, {
      text: caption,
      contextInfo: {
        mentionedJid: [m.sender],
        externalAdReply: {
          title,
          body: global.namebot || 'Audio Player',
          thumbnailUrl: scraperThumb,
          mediaType: 1,
          renderLargerThumbnail: true,
          sourceUrl: url
        }
      }
    }, { quoted: flok });

    await conn.sendMessage(m.chat, {
      audio: { url: result.savePath },
      mimetype: 'audio/mp4',
      fileName: `${title}.mp3`
    }, { quoted: flok });

    await conn.sendMessage(m.chat, { react: { text: null, key: m.key } });
  } catch (err) {
    console.error(err);
    m.reply('Terjadi kesalahan:\n' + err.message);
  }
};

handler.help = ['ytmp3 <link|judul>'];
handler.tags = ['downloader'];
handler.command = /^(yt(musik|a|audio|mp3)?)$/i;
handler.limit = 3;
handler.register = true;

export default handler;