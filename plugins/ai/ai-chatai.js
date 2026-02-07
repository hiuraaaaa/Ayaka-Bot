import fs from 'fs';
import axios from 'axios';
import crypto from 'crypto';

const SESSION_FILE_PATH = './src/chataisessions.json';
const SESSION_TIMEOUT = 60 * 60 * 1000;

if (!fs.existsSync(SESSION_FILE_PATH)) {
  fs.writeFileSync(SESSION_FILE_PATH, JSON.stringify({}, null, 2));
}

let userSessions = {};
try {
  userSessions = JSON.parse(fs.readFileSync(SESSION_FILE_PATH, 'utf8'));
} catch {
  userSessions = {};
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

const isImageUrl = (url) => {
  return /\.(jpg|jpeg|png)$/i.test(url.toLowerCase());
};

async function searchWeb(query) {
  const apiKey = process.env.GOOGLE_API_KEY || global.GoogleApi;
  const cx = process.env.GOOGLE_CX || global.GoogleCx;
  const apiUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}&num=5`;
  try {
    const { data } = await axios.get(apiUrl, {
      timeout: 10000
    });
    if (!data.items || data.items.length === 0) {
      return "Nggak ketemu apa-apa, Senpai. Coba kata kunci lain yuk! 😜";
    }
    const results = data.items.slice(0, 3).map((item, i) => {
      return `${i + 1}. *${item.title}* - ${item.link}\n   ${item.snippet.slice(0, 100)}...`;
    }).join('\n');
    return `Hasil pencarian "${query}":\n${results}\n\n*Sumber:*\n${data.items.slice(0, 3).map((item, i) => `[${i + 1}] ${item.link}`).join('\n')}`;
  } catch (error) {
    console.error('Error search:', error.message);
    return "Waduh, ada error nih pas nyari: " + error.message + ". Sabar ya, Senpai! 😭";
  }
}

async function getImage(url) {
  try {
    const response = await axios.get(url, { 
      responseType: 'arraybuffer',
      timeout: 5000 
    });
    if (!response.headers['content-type'].includes('image')) {
      return null;
    }
    return Buffer.from(response.data);
  } catch (error) {
    console.error('Error getImage:', error.message);
    return null;
  }
}

async function blackbox(query, userId) {
  const id = crypto.randomBytes(16).toString('hex');
  const now = new Date();
  const offset = 7;
  const wibTime = new Date(now.getTime() + offset * 60 * 60 * 1000);
  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const day = dayNames[wibTime.getUTCDay()];
  const date = wibTime.getUTCDate();
  const month = monthNames[wibTime.getUTCMonth()];
  const year = wibTime.getUTCFullYear();
  const hour = String(wibTime.getUTCHours()).padStart(2, '0');
  const minute = String(wibTime.getUTCMinutes()).padStart(2, '0');
  const second = String(wibTime.getUTCSeconds()).padStart(2, '0');
  const currentTime = wibTime.toISOString();

  if (!Array.isArray(userSessions[userId])) {
    userSessions[userId] = [];
  }

  if (userSessions[userId].length > 0) {
    const lastMessageTime = new Date(userSessions[userId].slice(-1)[0].waktu);
    if (Date.now() - lastMessageTime.getTime() > SESSION_TIMEOUT) {
      userSessions[userId] = [];
    }
  }

  const aiRole = `nama kamu adalah *Alicia* kamu wajib bisa coding dan menghibur lawan bicara mu , kamu juga harus bisa scraping dan memperbaiki codingan tujuan kamu adalah membantu para programmer untuk membantu menyelesaikan/memperbaiki codingan, kerjain codingan dengan detail, dan jangan sampai ada yang salah, kamu di buat oleh *Ponta*, Panggil lawan bicaramu dengan kata *Senpai*. Hibur lawan bicaramu jika codingan nya error.

pakai bahasa Indonesia non-formal jangan terlalu baku.
nama pengembang kamu adalah *Ponta*`;

  if (userSessions[userId].length === 0) {
    userSessions[userId].push({
      role: "system",
      content: aiRole,
      waktu: currentTime
    });
  }

  userSessions[userId].push({
    role: "user",
    content: query,
    id: id,
    waktu: currentTime
  });

  let additionalInfo = "";
  let imageBuffer = null;
  if (isValidUrl(query) && isImageUrl(query)) {
    imageBuffer = await getImage(query);
    additionalInfo = imageBuffer
      ? `Aku udah ambil gambar dari ${query}, cek bentar ya, Senpai!\n\n*Citations:*\n[1] ${query}`
      : `Hmm, gagal ambil gambar dari ${query}, mungkin bukan gambar beneran.`;
  } else if (isValidUrl(query)) {
    additionalInfo = await searchWeb(query);
  } else if (query.toLowerCase().includes("cari") || query.toLowerCase().includes("apa itu")) {
    additionalInfo = await searchWeb(query);
  }

  const data = JSON.stringify({
    "messages": userSessions[userId],
    "agentMode": {},
    "id": id,
    "previewToken": null,
    "userId": null,
    "codeModelMode": false,
    "trendingAgentMode": {},
    "isMicMode": false,
    "userSystemPrompt": aiRole + `\n\nInfo tambahan: ${additionalInfo}`,
    "maxTokens": 1042,
    "playgroundTopP": null,
    "playgroundTemperature": null,
    "isChromeExt": false,
    "githubToken": "",
    "clickedAnswer2": false,
    "clickedAnswer3": false,
    "clickedForceWebSearch": false,
    "visitFromDelta": false,
    "isMemoryEnabled": false,
    "mobileClient": false,
    "userSelectedModel": null,
    "validated": "00f37b34-a166-4efb-bce5-1312d87f2f94",
    "imageGenerationMode": false,
    "webSearchModePrompt": false,
    "deepSearchMode": true,
    "domains": null,
    "vscodeClient": false,
    "codeInterpreterMode": false,
    "customProfile": {
      "name": "",
      "occupation": "",
      "traits": [],
      "additionalInfo": "",
      "enableNewChats": false
    },
    "session": null,
    "isPremium": false
  });

  const config = {
    method: 'POST',
    url: 'https://www.blackbox.ai/api/chat',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0',
      'Content-Type': 'application/json',
      'accept-language': 'id-ID',
      'referer': 'https://www.blackbox.ai/',
      'origin': 'https://www.blackbox.ai',
      'alt-used': 'www.blackbox.ai',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'priority': 'u=0',
      'te': 'trailers'
    },
    data: data
  };

  try {
    const response = await axios.request(config);
    if (!response.data) throw 'Gagal mendapatkan respons dari Blackbox AI.';
    let aiResponse = response.data.trim();
    aiResponse = aiResponse.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
    if (additionalInfo.includes("Citations")) {
      aiResponse += `\n\n${additionalInfo.split("*Citations:*")[1]}`;
    }
    userSessions[userId].push({
      role: "assistant",
      content: aiResponse,
      waktu: currentTime
    });
    fs.writeFileSync(SESSION_FILE_PATH, JSON.stringify(userSessions, null, 2));
    if (userTimeouts[userId]) clearTimeout(userTimeouts[userId]);
    userTimeouts[userId] = setTimeout(() => {
      delete userSessions[userId];
      delete userTimeouts[userId];
      fs.writeFileSync(SESSION_FILE_PATH, JSON.stringify(userSessions, null, 2));
    }, SESSION_TIMEOUT);
    return { text: aiResponse, image: imageBuffer };
  } catch (error) {
    console.error(error);
    return { text: 'Terjadi kesalahan saat memproses permintaan. Silakan coba lagi nanti.', image: null };
  }
}

let ponta = async (m, { text, usedPrefix, command }) => {
  const userId = m.sender;

  if (command === 'chataiclear123123') {
    if (!userSessions[userId] || userSessions[userId].length === 0) {
      return conn.sendMessage(m.chat, { text: 'Kamu belum memulai percakapan.' }, { quoted: m });
    }
    userSessions[userId] = [];
    fs.writeFileSync(SESSION_FILE_PATH, JSON.stringify(userSessions, null, 2));
    return conn.sendMessage(m.chat, { text: 'Sesi percakapan telah dibersihkan.' }, { quoted: m });
  }

  if (!text && !m.quoted) throw `Gunakan format:\n${usedPrefix + command} <pertanyaan>`;
  if (m.quoted) {
    text = m.quoted.text || m.quoted.caption || m.quoted.content;
  }

  conn.sendMessage(m.chat, { react: { text: '🐥', key: m.key } });

  let { text: response, image } = await blackbox(text, userId);
  let aiResponse = response.trim();
  let formattedMessage = aiResponse.replace(/\*\*/g, '*');

  if (image) {
    let medias = [{
      image: { url: text, buffer: image }
    }];
    await conn.sendAlbumMessage(m.chat, medias, { 
      caption: formattedMessage,
      footer: `${global.namebot} || ${global.author}`,
      buttons: [
        { buttonId: `${usedPrefix}chataiclear123123`, buttonText: { displayText: '🫟 Clear Session' }, type: 1 }
      ],
      headerType: 1,
      viewOnce: true,
      contextInfo: {
        forwardingScore: 99999999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363401097268327@newsletter',
          serverMessageId: null,
          newsletterName: `© ${global.namebot} || ${global.author}`
        }
      }
    }, { quoted: m });
  } else {
    await conn.sendMessage(m.chat, {
      text: formattedMessage,
      contextInfo: {
        forwardingScore: 99999999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363401097268327@newsletter',
          serverMessageId: null,
          newsletterName: `© ${global.namebot} || ${global.author}`
        }
      }
    }, { quoted: m });
  }

  await conn.sendMessage(m.chat, { react: { text: null, key: m.key } });
};

ponta.help = ['chatai'];
ponta.tags = ['ai'];
ponta.command = /^(chatai|cai|chataiclear123123)$/i;
ponta.limit = 3;
ponta.register = true;

export default ponta;