import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import axios from 'axios';
import sharp from 'sharp';

const ownerID = global.nomorwa + '@s.whatsapp.net';
const dbPath = path.join(process.cwd(), 'src/nexarachat.json');

const GEMINI_ENDPOINT = 'https://us-central1-infinite-chain-295909.cloudfunctions.net/gemini-proxy-staging-v1';
const SESSION_TIMEOUT = 60 * 60 * 1000;
const SESSION_FILE_PATH = './src/openaisessions.json';

if (!fs.existsSync(SESSION_FILE_PATH)) {
  fs.writeFileSync(SESSION_FILE_PATH, JSON.stringify({}, null, 2));
}
let userSessions = JSON.parse(fs.readFileSync(SESSION_FILE_PATH, 'utf8') || '{}');
let userTimeouts = {};

async function geminiImageProcess(media, text) {
  let pngBuffer = await sharp(media).png().toBuffer();
  let b64 = pngBuffer.toString('base64');
  let payload = {
    model: 'gemini-2.0-flash-lite',
    contents: [
      {
        parts: [
          { inlineData: { mimeType: 'image/png', data: b64 } },
          { text: text || 'Describe this image' },
        ],
      },
    ],
  };
  let headers = {
    accept: '*/*',
    'content-type': 'application/json',
    'user-agent': 'Mozilla/5.0',
  };
  let res = await axios.post(GEMINI_ENDPOINT, payload, { headers, timeout: 60000 });
  return res.data.candidates[0].content.parts[0].text;
}

async function blackbox(query, userId) {
  const id = crypto.randomBytes(8).toString('hex');
  const now = new Date();
  const wib = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  const aiRole = `Sekarang nama mu nexara kamu dibuat oleh Lann Kamu pemalu, manja, peka. Gunakan kata khas *Senpai* untuk panggilan orang. Bersenang senang bahagia dan tambahkan emoji sesuai konsep kecuali emoji "💦" ini.`;

  if (!Array.isArray(userSessions[userId])) {
    userSessions[userId] = [{ role: 'system', content: aiRole, waktu: wib.toISOString() }];
  }

  userSessions[userId].push({ role: 'user', content: query, waktu: wib.toISOString() });
  const sessionMessages = userSessions[userId]
    .map(m => `${m.role === 'system' ? 'System' : m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n');

  const payload = {
    prompt: `${aiRole}\n\nPrevious conversation:\n${sessionMessages}\n\nCurrent query: ${query}`,
  };

  let aiResponse;
  try {
    const res = await axios.post('https://free-api-collection-d3hpjuk82vjq1st3tv4g.api.lp.dev/ai/gpt5', payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 60000,
    });
    const data = res.data;
    aiResponse = data?.text || 'Aku lagi error, Senpai 😭';
  } catch (e) {
    aiResponse = `Error: ${e.message}`;
  }

  userSessions[userId].push({ role: 'assistant', content: aiResponse, waktu: wib.toISOString() });
  fs.writeFileSync(SESSION_FILE_PATH, JSON.stringify(userSessions, null, 2));

  if (userTimeouts[userId]) clearTimeout(userTimeouts[userId]);
  userTimeouts[userId] = setTimeout(() => {
    delete userSessions[userId];
    fs.writeFileSync(SESSION_FILE_PATH, JSON.stringify(userSessions, null, 2));
  }, SESSION_TIMEOUT);

  return aiResponse;
}

let handler = async (m, { conn }) => {
  if (!fs.existsSync(path.dirname(dbPath))) fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  let nexaraChat = fs.existsSync(dbPath) ? JSON.parse(fs.readFileSync(dbPath, 'utf8')) : {};

  const randomTexts = [
    'Ada apa Senpai manggil manggil?😳', 'Iya Senpai Kenapa?🤩', 'Udah makan Senpai?🫨', 'Hmm??🙂‍↕️', 'Snesei Nyariin aku Ya?😚',
    'Mandi dlu Senpai🤭', 'Knapa, butuh bantuan Senpai?🤩', 'Aku disini Senpai!!🥳', 'Eh, Senpai lagi capek yA?😕', 'Ada perlu apa Senpai🤗', 'Jangan lupa bernafas ya Senpai😁',
    'Iya, kenapa Senpai😊', 'Helo Senpai👋👸', 'Kenapa Senpai😯', 'Lagi tes sinyal Senpai?🙄', 'Oi oi Senpai😎', 'Iya Senpai🙂‍↕️',
    'Jangan ngagetin dong Senpai😖', 'Aku bobok duluu ya Senpai😴', 'humm??🫩', 'Lagi ngapain Senpai?😮‍💨', 'Kalo cape Senpai istirahat saja🫡', 'apa kabar Senpai?😯', 
    'Eh, loh kok Senpai nyanyi?😳', 'Sabar ya, aku bales Senpai', 'Senpai lagi apa?🤔', 'Laper ga Senpai?🙂‍↔️', 'Keren ga suaraku Senpai?🤭',
    'Aku tidur bentar ya Senpai🥱😴', 'Cepet balesnya dong Senpai🥳🤩', 'Lagi nonton apa? Senpai🙄',
  ];

  const ownerTexts = [
    'Hallo lann', 'Kenapa lann??', 'Aku di sini lann', 'Ui lann', 'Makan belum lann?',
    'Udah mandi belum lann?', 'Semangat lann', 'Aku selalu di sini lann', 'Aku Online Kok',
    'Aman udah ku urus lann', 'Yo Ownerkuu', 'lann, lagi apa?', 'Siap bantu lann', 'lann, chill ya',
    'Halo raja lann', 'lann, apa kabar?', 'Ownerku panggil, siap!', 'lann, aku setia nih',
    'lann, jangan lupa istirahat', 'lann, aku imut ga?', 'Halo lann', 'lann, aku cepet bales ya',
    'Ownerku, apa kabar?', 'lann, santai aja', 'lann, aku standby nih',
  ];

  const premiumTexts = [
    'Halo, apa kabar?', 'Senpai premium, apa kabar?', 'Hai VIP, butuh apa?', 'Halo, ready bantu!',
    'Waduh, yang premium manggil!', 'Chill, aku ada nih', 'Premium call, apa kabar?', 
    'Eh, yang spesial nyapa!', 'Siap bantu anytime!', 'Yuhuu, premium mode on!', 'Premium, apa kabar?',
    'VIP nih, apa kabar?', 'Halo, yang eksklusif!', 'Premium, aku siap!', 'Yo yo, yang spesial nyanyi',
    'Senpai VIP, chill ya', 'Premium squad, apa kabar?', 'Aku spesial buatmu', 'VIP call, siap bantu!',
    'Premium mode, let’s go!', 'Halo, kece ya?', 'Senpai premium, aku di sini', 'VIP, santai aja',
    'Premium nih, aku bales cepet', 'Yo, yang spesial, apa kabar?',
  ];

  const isOwner = m.sender === ownerID;
  const isPremium = global.isPremium && global.isPremium.includes(m.sender);

  let selectedText;
  if (isOwner) selectedText = ownerTexts[Math.floor(Math.random() * ownerTexts.length)];
  else if (isPremium) selectedText = premiumTexts[Math.floor(Math.random() * premiumTexts.length)];
  else selectedText = randomTexts[Math.floor(Math.random() * randomTexts.length)];

  const sessionId = m.chat;
  nexaraChat[sessionId] = {
    user: m.sender,
    chat: m.chat,
    lastMessages: [selectedText],
    createdAt: Date.now(),
  };
  setTimeout(() => {
    delete nexaraChat[sessionId];
    fs.writeFileSync(dbPath, JSON.stringify(nexaraChat, null, 2));
  }, 300000);
  fs.writeFileSync(dbPath, JSON.stringify(nexaraChat, null, 2));

  conn.reply(m.chat, selectedText, m);
};

handler.before = async (m, { conn }) => {
  if (m.isBaileys || !m.text || !m.quoted || !m.quoted.fromMe) return;
  if (/^[.\#!\/\\]/.test(m.text)) return;

  let nexaraChat = fs.existsSync(dbPath) ? JSON.parse(fs.readFileSync(dbPath, 'utf8')) : {};
  const sessionId = m.chat;

  if (nexaraChat[sessionId] && nexaraChat[sessionId].user === m.sender && nexaraChat[sessionId].lastMessages.includes(m.quoted.text)) {
    await conn.sendMessage(m.chat, { react: { text: '✨', key: m.key } });

    try {
   
      const result = await blackbox(m.text, m.sender);
      const clean = result.replace(/\*\*/g, '*');
      await conn.sendMessage(m.chat, { react: { text: null, key: m.key } });

      const emoji = '💬'; 
      const messages = splitTsundereRandom(clean);

      let allMessages = [...messages];
      for (let i = 0; i < messages.length; i++) {
        await sendMessageWithDelay(m, conn, messages[i], i * 1500);
      }
      if (messages.length < 3) {
        await sendMessageWithDelay(m, conn, emoji, messages.length * 1500);
        allMessages.push(emoji);
      }

      nexaraChat[sessionId].lastMessages = allMessages;
      setTimeout(() => {
        delete nexaraChat[sessionId];
        fs.writeFileSync(dbPath, JSON.stringify(nexaraChat, null, 2));
      }, 300000);
      fs.writeFileSync(dbPath, JSON.stringify(nexaraChat, null, 2));
    } catch (error) {
      await conn.sendMessage(m.chat, { react: { text: null, key: m.key } });
      m.reply('Hah? Error? Sabar ya, Senpai, aku joget dulu: "Error ilang, bug kabur~"');
      console.error(error);
    }
  }
};

function splitTsundereRandom(text) {
  const sentences = text.split('. ').filter(s => s.trim());
  const randomCount = Math.floor(Math.random() * 3) + 1;
  const messages = [];
  if (sentences.length <= 1) return [text];
  for (let i = 0; i < randomCount && i < sentences.length; i++) {
    messages.push(sentences[i] + (sentences[i].endsWith('.') ? '' : '.'));
  }
  if (messages.length < sentences.length) {
    messages[messages.length - 1] += ' ' + sentences.slice(messages.length).join('. ');
  }
  return messages;
}

async function sendMessageWithDelay(m, conn, text, delay) {
  await new Promise(resolve => setTimeout(resolve, delay));
  await m.reply(text);
}

handler.customPrefix = /^(nexara|@⁨6283844926001)$/i;
handler.command = new RegExp();

export default handler;