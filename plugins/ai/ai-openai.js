import fs from 'fs';
import axios from 'axios';
import crypto from 'crypto';
import sharp from 'sharp';
import uploadImage from '../lib/uploadImage.js';

const SESSION_FILE_PATH = './src/openaisessions.json';
const SESSION_TIMEOUT = 60 * 60 * 1000;
const GEMINI_ENDPOINT = 'https://us-central1-infinite-chain-295909.cloudfunctions.net/gemini-proxy-staging-v1';

if (!fs.existsSync(SESSION_FILE_PATH)) {
  fs.writeFileSync(SESSION_FILE_PATH, JSON.stringify({}, null, 2));
}

let userSessions = {};
try {
  userSessions = JSON.parse(fs.readFileSync(SESSION_FILE_PATH, 'utf8'));
} catch (error) {
  userSessions = {};
  console.error('Error reading session file:', error.message);
}

let userTimeouts = {};

const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
};

const isImageUrl = (url) => /\.(jpg|jpeg|png)$/i.test(url.toLowerCase());

async function getImage(url) {
  try {
    const res = await axios.get(url, { responseType: 'arraybuffer', timeout: 5000 });
    if (!res.headers['content-type']?.includes('image')) return null;
    return Buffer.from(res.data);
  } catch {
    return null;
  }
}

async function resizeImageWithSharp(path, width, height) {
  try {
    return await sharp(path)
      .resize(width, height, { fit: 'cover' })
      .jpeg()
      .toBuffer();
  } catch {
    return fs.readFileSync(path);
  }
}

async function geminiImageProcess(media, text) {
  let pngBuffer = await sharp(media).png().toBuffer();
  let b64 = pngBuffer.toString('base64');
  let payload = {
    model: 'gemini-2.0-flash-lite',
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: 'image/png',
              data: b64,
            },
          },
          {
            text: text || 'Describe this image',
          },
        ],
      },
    ],
  };
  let headers = {
    accept: '*/*',
    'accept-language': 'id-ID',
    'content-type': 'application/json',
    origin: 'https://screenapp.io',
    priority: 'u=1, i',
    referer: 'https://screenapp.io/',
    'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Mobile Safari/537.36',
  };
  let res = await axios.post(GEMINI_ENDPOINT, payload, { headers, timeout: 60000 });
  return res.data.candidates[0].content.parts[0].text;
}

async function blackbox(query, userId, media = null) {
  const id = crypto.randomBytes(8).toString('hex');
  const now = new Date();
  const wib = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const day = dayNames[wib.getUTCDay()];
  const date = wib.getUTCDate();
  const month = monthNames[wib.getUTCMonth()];
  const year = wib.getUTCFullYear();
  const hour = String(wib.getUTCHours()).padStart(2, '0');
  const minute = String(wib.getUTCMinutes()).padStart(2, '0');
  const second = String(wib.getUTCSeconds()).padStart(2, '0');
  const currentTime = wib.toISOString();
  const aiRole = `Sekarang nama mu Ayaka kamu jawab semua pertanyaan dengan lembut kamu bisa menentang pertanyaan jadi tidak iya iya saja. bikin teks mu lebih rapi misal tambahin *teks* atau \`teks\` sesuai kebutuhan pembahasan dan tata letak teks harus rapi jangan norak jangan bikin pusing kepala.`;

  if (!Array.isArray(userSessions[userId])) {
    userSessions[userId] = [{ role: 'system', content: aiRole, waktu: currentTime }];
  } else if (userSessions[userId].length > 0) {
    const lastMessageTime = new Date(userSessions[userId].slice(-1)[0].waktu);
    if (Date.now() - lastMessageTime.getTime() > SESSION_TIMEOUT) {
      userSessions[userId] = [{ role: 'system', content: aiRole, waktu: currentTime }];
    }
  }

  let imageBuffer = null;
  let aiResponse;

  if (media) {
    aiResponse = await geminiImageProcess(media, query);
    userSessions[userId].push({ role: 'user', content: query, id, waktu: currentTime });
    userSessions[userId].push({ role: 'assistant', content: aiResponse, waktu: currentTime });
  } else if (isValidUrl(query) && isImageUrl(query)) {
    imageBuffer = await getImage(query);
    if (imageBuffer) {
      aiResponse = await geminiImageProcess(imageBuffer, query);
      userSessions[userId].push({ role: 'user', content: query, id, waktu: currentTime });
      userSessions[userId].push({ role: 'assistant', content: aiResponse, waktu: currentTime });
    } else {
      aiResponse = 'Gagal mengambil gambar dari URL, Senpai 😭';
    }
  } else {
    userSessions[userId].push({ role: 'user', content: query, id, waktu: currentTime });
    const sessionMessages = userSessions[userId]
      .map(m => `${m.role === 'system' ? 'System' : m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n');
    const payload = { prompt: `${aiRole}\n\nPrevious conversation:\n${sessionMessages}\n\nCurrent query: ${query}` };
    try {
      const res = await axios.post('https://free-api-collection-d3hpjuk82vjq1st3tv4g.api.lp.dev/ai/gpt5', payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: null,
      });
      const data = res.data;
      if (!data) aiResponse = 'Response kosong dari API, Senpai 😭';
      else if (data.success && data.text) aiResponse = data.text;
      else aiResponse = 'Format respons tidak dikenal, Senpai 😭';
    } catch (error) {
      aiResponse = `Error saat memanggil API: ${error.message}, Senpai 😭`;
    }
    userSessions[userId].push({ role: 'assistant', content: aiResponse, waktu: currentTime });
  }

  try {
    fs.writeFileSync(SESSION_FILE_PATH, JSON.stringify(userSessions, null, 2));
  } catch (error) {
    console.error('Error writing session file:', error.message);
  }

  if (userTimeouts[userId]) clearTimeout(userTimeouts[userId]);
  userTimeouts[userId] = setTimeout(() => {
    delete userSessions[userId];
    delete userTimeouts[userId];
    try {
      fs.writeFileSync(SESSION_FILE_PATH, JSON.stringify(userSessions, null, 2));
    } catch (error) {
      console.error('Error writing session file on timeout:', error.message);
    }
  }, SESSION_TIMEOUT);

  return { text: String(aiResponse), image: imageBuffer };
}

let Lann4you = async (m, { text, usedPrefix, command, conn }) => {
  const userId = m.sender;

  if (command === 'openaiclear123123') {
    if (!userSessions[userId] || userSessions[userId].length === 0) {
      return conn.sendMessage(m.chat, { text: 'Kamu belum memulai percakapan.' }, { quoted: m });
    }
    userSessions[userId] = [];
    try {
      fs.writeFileSync(SESSION_FILE_PATH, JSON.stringify(userSessions, null, 2));
    } catch (error) {
      console.error('Error clearing session file:', error.message);
    }
    return conn.sendMessage(m.chat, { text: 'Sesi percakapan telah dibersihkan.' }, { quoted: m });
  }

  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || '';
  let media = null;

  if (/image/.test(mime)) {
    media = await q.download();
    text = text || 'Describe this image';
  } else if (!text && !m.quoted) {
    throw `Gunakan format:\n${usedPrefix + command} <pertanyaan>`;
  } else if (m.quoted) {
    text = m.quoted.text || m.quoted.caption || m.quoted.content;
  }

  await conn.sendMessage(m.chat, { react: { text: '🥕', key: m.key } });

  let { text: response, image } = await blackbox(text, userId, media);
  let aiResponse = response.trim().replace(/\*\*/g, '*');

  await conn.sendMessage(m.chat, {
    text: aiResponse,
    buttons: [
      {
        buttonId: `${usedPrefix}openaiclear123123`,
        buttonText: { displayText: '♻️ Clear Session' },
        type: 1
      }
    ],
    headerType: 1
  }, { quoted: m });

  await conn.sendMessage(m.chat, { react: { text: null, key: m.key } });
};

Lann4you.help = ['openai'];
Lann4you.tags = ['ai'];
Lann4you.command = /^(openai|ai|openaiclear123123)$/i;
Lann4you.limit = 3;
Lann4you.register = true;

export default Lann4you;