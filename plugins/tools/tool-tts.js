import axios from 'axios';

const voices = [
  { id: 'voice-107', name: 'Andrew Multilingual', gender: 'Male', language: 'Multilingual', country: 'United States' },
  { id: 'voice-110', name: 'Ava Multilingual', gender: 'Female', language: 'Multilingual', country: 'United States' },
  { id: 'voice-112', name: 'Brian Multilingual', gender: 'Male', language: 'Multilingual', country: 'United States' },
  { id: 'voice-115', name: 'Emma Multilingual', gender: 'Female', language: 'Multilingual', country: 'United States' },
  { id: 'voice-106', name: 'Ana', gender: 'Female', language: 'English', country: 'United States' },
  { id: 'voice-108', name: 'Andrew', gender: 'Male', language: 'English', country: 'United States' },
  { id: 'voice-109', name: 'Aria', gender: 'Female', language: 'English', country: 'United States' },
  { id: 'voice-82', name: 'Libby', gender: 'Female', language: 'English', country: 'United Kingdom' },
  { id: 'voice-83', name: 'Maisie', gender: 'Female', language: 'English', country: 'United Kingdom' },
  { id: 'voice-179', name: 'Keita', gender: 'Male', language: 'Japanese', country: 'Japan' },
  { id: 'voice-180', name: 'Nanami', gender: 'Female', language: 'Japanese', country: 'Japan' },
  { id: 'voice-190', name: 'InJoon', gender: 'Male', language: 'Korean', country: 'South Korea' },
  { id: 'voice-191', name: 'SunHi', gender: 'Female', language: 'Korean', country: 'South Korea' }
];

const getVoiceId = (name) => {
  const v = voices.find(v => v.name.toLowerCase() === name.toLowerCase() || v.id === name);
  return v?.id;
};

const handler = async (m, { text, args, command, conn }) => {
  if (text.toLowerCase() === 'list') {
    let list = voices.map(v => `• ${v.name} (${v.language}, ${v.gender})`).join('\n');
    return m.reply(`Daftar karakter yang tersedia:\n\n${list}\n\nGunakan:\n.${command} --voice Ava Multilingual Halo dunia`);
  }

  if (!text) return m.reply(`Masukkan teks untuk diubah ke suara.\nContoh: .${command} Halo dunia\n\nLihat karakter: .${command} list`);

  const match = text.match(/--voice\s+("[^"]+"|[^\s]+)/i);
  let voiceName = 'Ava Multilingual';
  let realText = text;

  if (match) {
    voiceName = match[1].replace(/"/g, '');
    realText = text.replace(match[0], '').trim();
  }

  const voiceId = getVoiceId(voiceName);
  if (!voiceId) {
    return m.reply(`Karakter "${voiceName}" tidak ditemukan!\nKetik .${command} list untuk melihat daftar karakter.`);
  }

  if (!realText) return m.reply('Teksnya kosong setelah menghapus opsi --voice, coba periksa lagi.');

  try {
    await conn.sendMessage(m.chat, {
      react: {
        text: '⏳',
        key: m.key
      }
    });

    const ttsRes = await axios.post(
      'https://speechma.com/com.api/tts-api.php',
      {
        text: realText,
        voice: voiceId,
        pitch: 0,
        rate: 0,
        volume: 100
      },
      {
        headers: {
          'authority': 'speechma.com',
          'origin': 'https://speechma.com',
          'referer': 'https://speechma.com/',
          'user-agent': 'Postify/1.0.0'
        }
      }
    );

    if (!ttsRes.data.success) {
      return m.reply(`Gagal generate audio: ${ttsRes.data.message || 'unknown error'}`);
    }

    const jobId = ttsRes.data.data.job_id;
    await new Promise(r => setTimeout(r, 2000));
    const audioUrl = `https://speechma.com/com.api/tts-api.php/audio/${jobId}`;

    await conn.sendMessage(m.chat, {
      audio: { url: audioUrl },
      mimetype: 'audio/mpeg',
      ptt: true
    }, { quoted: m });

  } catch (e) {
    return m.reply(`Terjadi error: ${e.message}`);
  } finally {
    await conn.sendMessage(m.chat, {
      react: {
        text: '',
        key: m.key
      }
    });
  }
};

handler.command = ['tts', 'suara'];
handler.help = ['tts <teks>', 'tts --voice <nama> <teks>', 'tts list'];
handler.tags = ['tools'];
handler.limit = false;
handler.premium = false;

export default handler;