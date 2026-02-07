import axios from 'axios';
const { proto, generateWAMessageFromContent } = (await import('@adiwajshing/baileys')).default

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

const state = {};

function parseClickedId(text) {
  const match = text?.trim().match(/^\.ailyrics\s+(\w+)\s+(\w+)$/i);
  return match ? { type: match[1], value: match[2] } : null;
}

async function sendList(conn, m, title, dataKey, stepText) {
  const rows = Object.entries(types[dataKey]).map(([k, v]) => ({
    title: v,
    description: `Klik untuk memilih ${stepText}`,
    id: `.ailyrics ${dataKey} ${k}`
  }));

  const listMessage = {
    title,
    sections: [{
      title: `📑 Pilih ${stepText}`,
      rows
    }]
  };

  const msg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: proto.Message.InteractiveMessage.Body.create({ text: `🔘 Pilih ${stepText}` }),
          header: proto.Message.InteractiveMessage.Header.create({ title: "", hasMediaAttachment: false }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [{
              name: "single_select",
              buttonParamsJson: JSON.stringify(listMessage)
            }]
          })
        })
      }
    }
  }, { quoted: m });

  return conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
}

export const handler = async (m, { conn, args, command }) => {
  const user = m.sender;
  const text = m.text;

  const parsed = parseClickedId(text);

  if (parsed) {
    if (!state[user]) return m.reply('❗ Topik tidak ditemukan. Jalankan kembali `.ailyrics <topik>`');

    const { type, value } = parsed;

    if (!types[type] || !types[type][value]) {
      return m.reply('❌ Pilihan tidak valid.');
    }

    state[user][type] = value;

    const step = state[user];
    if (!step.genre) return sendList(conn, m, '🎼 Genre Lagu', 'genre', 'genre');
    if (!step.mood) return sendList(conn, m, '🎭 Mood Lagu', 'mood', 'mood');
    if (!step.structure) return sendList(conn, m, '📐 Struktur Lagu', 'structure', 'struktur');
    if (!step.language) return sendList(conn, m, '🌐 Bahasa Lagu', 'language', 'bahasa');

    const { topic, genre, mood, structure, language } = step;
    const payload = {
      topic,
      style: genre,
      mood,
      structure: structure.replace(/_/g, '-'),
      language
    };

    try {
      const headers = {
        'Content-Type': 'application/json',
        'Origin': 'https://lyricsintosong.ai',
        'Referer': 'https://lyricsintosong.ai/lyrics-generator',
        'User-Agent': 'Mozilla/5.0'
      };

      const res = await axios.post('https://lyricsintosong.ai/api/generate-lyrics', payload, { headers });
      const { title = 'Untitled', lyrics } = res?.data?.data || {};
      if (!lyrics) throw new Error('Lirik tidak ditemukan.');

      await conn.sendMessage(m.chat, {
        text: `🎵 *${title}*\n\n📌 *Topik:* ${topic}\n🎼 *Genre:* ${types.genre[genre]}\n🎭 *Mood:* ${types.mood[mood]}\n📐 *Struktur:* ${types.structure[structure]}\n🌐 *Bahasa:* ${types.language[language]}\n\n📝 *Lirik:*\n${lyrics}`
      }, { quoted: m });
    } catch (e) {
      await m.reply('❌ Gagal membuat lirik: ' + e.message);
    } finally {
      delete state[user];
    }

    return;
  }
  
  if (!args.length) {
    return m.reply('📌 *Contoh:* .ailyrics tentang kesepian');
  }

  state[user] = {
    topic: args.join(' ')
  };

  return sendList(conn, m, '🎼 Genre Lagu', 'genre', 'genre');
};

handler.command = ['lyricsai','ailyrics']
handler.tags = ['ai'];
handler.help = ['ailyrics <prompt>'];
export default handler;