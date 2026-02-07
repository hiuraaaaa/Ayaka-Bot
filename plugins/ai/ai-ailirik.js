// Plugin untuk generate lirik lagu dari AI - Dilarang keras menyalin tanpa izin!
// Dibuat oleh UBED dan dikonversi ke ESM oleh ChatGPT

import axios from 'axios';

const types = {
  genre: {
    pop: 'Pop', rock: 'Rock', folk: 'Folk', rap: 'Rap',
    rnb: 'R&B', jazz: 'Jazz', classical: 'Classical',
    electronic: 'Electronic', country: 'Country', blues: 'Blues'
  },
  mood: {
    happy: 'Happy', sad: 'Sad', romantic: 'Romantic', energetic: 'Energetic',
    peaceful: 'Peaceful', melancholic: 'Melancholic', angry: 'Angry',
    hopeful: 'Hopeful', nostalgic: 'Nostalgic', uplifting: 'Uplifting'
  },
  structure: {
    verse_chorus: 'Verse + Chorus',
    verse_chorus_bridge: 'Verse + Chorus + Bridge',
    verse_prechorus_chorus: 'Verse + Pre-Chorus + Chorus',
    verse_chorus_bridge_chorus: 'Verse + Chorus + Bridge + Chorus',
    verse_only: 'Verse Only',
    chorus_only: 'Chorus Only'
  },
  language: {
    en: 'English',
    id: 'Indonesian'
  }
};

const handler = async (m, { conn, text, usedPrefix, command }) => {
  const fkontak = {
    key: {
      participant: '0@s.whatsapp.net',
      remoteJid: "0@s.whatsapp.net",
      fromMe: false,
      id: "LyricsAI",
    },
    message: {
      conversation: `🎶 AI Lyrics Generator ${global.namebot || 'Bot'}`
    }
  };

  const sendReaction = async (emoji) => {
    await conn.sendMessage(m.chat, { react: { text: emoji, key: m.key } });
  };

  const [topic, genreKey = 'pop', moodKey = 'sad', structureKey = 'verse_chorus', langKey = 'id'] = text.split('|').map(v => v.trim());

  if (!topic) {
    await sendReaction('❓');
    return conn.reply(m.chat, `🤖 *Generate Lirik AI*\n\nGunakan format:\n*.${command} topik | genre | mood | struktur | bahasa*\n\nContoh:\n*.${command} Hati yang gelap | rock | melancholic | verse_chorus | id*\n\nGenre: ${Object.keys(types.genre).join(', ')}\nMood: ${Object.keys(types.mood).join(', ')}\nStructure: ${Object.keys(types.structure).join(', ')}\nLanguage: en, id`, m, { quoted: fkontak });
  }

  await sendReaction('🎵');

  const genre = types.genre[genreKey?.toLowerCase()] ? genreKey.toLowerCase() : 'pop';
  const mood = types.mood[moodKey?.toLowerCase()] ? moodKey.toLowerCase() : 'sad';
  const structure = types.structure[structureKey?.toLowerCase()] ? structureKey.toLowerCase() : 'verse_chorus';
  const language = types.language[langKey?.toLowerCase()] ? langKey.toLowerCase() : 'en';

  const payload = {
    topic,
    style: genre,
    mood,
    structure: structure.replace(/_/g, '-'),
    language
  };

  const headers = {
    'Content-Type': 'application/json',
    'Origin': 'https://lyricsintosong.ai',
    'Referer': 'https://lyricsintosong.ai/lyrics-generator',
    'User-Agent': 'Mozilla/5.0'
  };

  try {
    const res = await axios.post('https://lyricsintosong.ai/api/generate-lyrics', payload, { headers });
    const { title = 'Untitled', lyrics } = res?.data?.data || {};

    if (!lyrics) throw new Error('Lirik tidak ditemukan.');

    const result = `*🎤 Judul:* ${title}
*📝 Topik:* ${payload.topic}
*🎼 Genre:* ${types.genre[genre]}
*🎭 Mood:* ${types.mood[mood]}
*📐 Struktur:* ${types.structure[structure]}
*🌐 Bahasa:* ${language} (${types.language[language]})

🎶 *LIRIK:* 🎶

${lyrics}
`;

    await conn.reply(m.chat, result.trim(), m, { quoted: fkontak });
    await sendReaction('✅');
  } catch (err) {
    console.error('Error generate lirik:', err);
    await sendReaction('❌');
    await conn.reply(m.chat, `❌ *Gagal generate lirik!*\n\n_Error:_\n\`\`\`${err.message || err}\`\`\``, m, { quoted: fkontak });
  }
};

handler.help = ['lyricsgen'].map(v => v + ' <topik|genre|mood|struktur|bahasa>');
handler.tags = ['ai', 'music', 'tools'];
handler.command = /^lyricsgen|ailirik$/i;
handler.limit = true;
handler.register = true;

export default handler;