import axios from 'axios';

async function uploadAudioBuffer(buffer) {
  const boundary = '----WebKitFormBoundary' + Math.random().toString(16).slice(2);

  const multipartBody = Buffer.concat([
    Buffer.from(`--${boundary}\r\n`),
    Buffer.from(`Content-Disposition: form-data; name="fileName"; filename="audio.mp3"\r\n`),
    Buffer.from(`Content-Type: audio/mpeg\r\n\r\n`),
    buffer,
    Buffer.from(`\r\n--${boundary}--\r\n`)
  ]);

  const res = await axios.post('https://aivocalremover.com/api/v2/FileUpload', multipartBody, {
    headers: {
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Content-Length': multipartBody.length,
      'User-Agent': 'Mozilla/5.0',
      'X-Requested-With': 'XMLHttpRequest'
    }
  });

  const { data } = res;
  if (data?.error) throw new Error(data.message);

  return {
    key: data.key,
    file_name: data.file_name
  };
}

async function processAudio(file_name, key) {
  const params = new URLSearchParams({
    file_name,
    action: 'watermark_video',
    key,
    web: 'web'
  });

  const res = await axios.post('https://aivocalremover.com/api/v2/ProcessFile', params.toString(), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'User-Agent': 'Mozilla/5.0',
      'X-Requested-With': 'XMLHttpRequest'
    }
  });

  const { data } = res;
  if (data?.error) throw new Error(data.message);

  return {
    vocal: data.vocal_path,
    instrumental: data.instrumental_path
  };
}

let handler = async (m, { conn, usedPrefix, command }) => {
  if (!m.quoted || !/audio/.test(m.quoted.mimetype)) {
    return m.reply(`Huh?! B-balas audio MP3 dulu lah baru bisa kuproses!\n\nContoh:\nBalas audio lalu ketik:\n${usedPrefix + command}`);
  }

  conn.sendMessage(m.chat, { react: { text: "🎧", key: m.key } });

  try {
    const buffer = await m.quoted.download();
    const { key, file_name } = await uploadAudioBuffer(buffer);
    const { vocal, instrumental } = await processAudio(file_name, key);

    await m.reply(`Hmph! Aku udah pisahin suaranya ya, b-bukan karena kamu spesial atau gimana... 😤`);

    await conn.sendMessage(m.chat, {
      text: `T-tuh! Ini *instrumental*-nya... jangan berharap aku melakukan ini lagi, ya! 😳`,
    }, { quoted: m });

    await conn.sendMessage(m.chat, {
      audio: { url: instrumental },
      mimetype: 'audio/mpeg',
      fileName: 'Instrumental.mp3'
    }, { quoted: m });

    await conn.sendMessage(m.chat, {
      text: `D-dan ini versi vokalnya... j-jangan bilang suaranya kayak aku ya! >///<`,
    }, { quoted: m });

    await conn.sendMessage(m.chat, {
      audio: { url: vocal },
      mimetype: 'audio/mpeg',
      fileName: 'Vocal.mp3'
    }, { quoted: m });

    conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

  } catch (err) {
    console.error(err);
    m.reply(`Ugh... gagal gara-gara kamu sih! 😡\n*${err.message}*`);
  }
};

handler.help = ["vocalremover *[balas audio]*"];
handler.tags = ["tools","ai"];
handler.command = /^vocalremover|rmover$/i;

export default handler;