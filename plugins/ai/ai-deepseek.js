import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';

const SESSION_FILE_PATH = './src/deepseeksessions.json';
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

const Lann4you = async (m, { text, usedPrefix, command }) => {

  if (!text) throw `Gunakan format: <pertanyaan>`;
  
  const userId = m.sender;

  if (!Array.isArray(userSessions[userId])) {
    userSessions[userId] = [
      { 
        role: "system", 
        content: "Nama kamu DeepSeek, dikembangkan oleh Lann4youOfc. Kamu adalah asisten cerdas yang memberikan jawaban akurat dan menarik." 
      }
    ];
  }

  userSessions[userId].push({ role: "user", content: text });

  try {
    await conn.sendMessage(m.chat, { react: { text: '🌏', key: m.key } });

    let formData = new FormData();
    formData.append("content", `User: ${text}`);
    formData.append("model", "@hf/thebloke/deepseek-coder-6.7b-instruct-awq");

    const config = {
      headers: {
        ...formData.getHeaders()
      }
    };

    const { data } = await axios.post("https://mind.hydrooo.web.id/v1/chat", formData, config);

    if (!data || !data.result) throw 'Gagal mendapatkan respons dari API.';

    const aiResponse = data.result.trim();

    userSessions[userId].push({ role: "assistant", content: aiResponse });

    fs.writeFileSync(SESSION_FILE_PATH, JSON.stringify(userSessions, null, 2));

    if (userTimeouts[userId]) clearTimeout(userTimeouts[userId]);
    userTimeouts[userId] = setTimeout(() => {
      delete userSessions[userId];
      delete userTimeouts[userId];
      fs.writeFileSync(SESSION_FILE_PATH, JSON.stringify(userSessions, null, 2));
    }, SESSION_TIMEOUT);

    await conn.sendMessage(m.chat, {
    text: aiResponse, 
    contextInfo: {
    externalAdReply :{
    mediaUrl: '', 
    mediaType: 1,
    title: '✦ DeepSeek',
    body: '', 
    thumbnailUrl: 'https://files.catbox.moe/mbagae.jpg', 
    sourceUrl: '',
    renderLargerThumbnail: true, 
    showAdAttribution: false
    }}}, { quoted: m })
  
    await conn.sendMessage(m.chat, { react: { text: null, key: m.key } });

  } catch (error) {
    console.error(error);
    conn.sendMessage(m.chat, { text: 'Terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi nanti.' }, { quoted: m });
        await conn.sendMessage(m.chat, { react: { text: null, key: m.key } });
  }
};

Lann4you.help = ['deepseek'];
Lann4you.tags = ['ai'];
Lann4you.command = /^(deepseek)$/i;
Lann4you.limit = 3;
Lann4you.register = true;

export default Lann4you;