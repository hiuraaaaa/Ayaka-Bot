import axios from 'axios';

async function fluxAI(prompt) {
  try {
    const res = await axios.post('https://fluxai.pro/api/tools/fast', {
      prompt: prompt
    }, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36',
        'Referer': 'https://fluxai.pro/fast-flux'
      },
      timeout: 30000,
      decompress: true
    });

    if (res.data?.ok === true && res.data?.data?.imageUrl) {
      return res.data.data.imageUrl;
    }

    if (res.data?.data?.images?.[0]) {
      return res.data.data.images[0];
    }

    throw new Error('url gambar tidak ditemukan');
  } catch (err) {
    throw new Error(`FluxAI Error: ${err.message}`);
  }
}

const sendReact = (conn, id, emoji, key) => conn.sendMessage(id, {
  react: {
    text: emoji,
    key
  }
});

let handler = async (m, { text, conn, usedPrefix, command }) => {
  if (!text) throw `Contoh:\n${usedPrefix + command} naga api putih terbang di langit`;

  await sendReact(conn, m.chat, '🧸', m.key);

  try {
    const img = await fluxAI(text);
    const caption = `✨ FluxAI Image Generator ✨\n\nPrompt: ${text}\n\nBerikut 4 hasil visualnya! Semoga sesuai imajinasimu! 🎨`;

    const album = Array(4).fill(0).map((_, i) => ({
      image: { url: img },
      caption: `${caption}\n\n📸 Gambar ${i + 1}/4`
    }));

    await conn.sendAlbumMessage(m.chat, album, { quoted: m });
    await sendReact(conn, m.chat, '✅', m.key);
  } catch (e) {
    await sendReact(conn, m.chat, '❌', m.key);
    throw `Gagal mengambil gambar: ${e.message}`;
  }
};

handler.help = ['fluxai <prompt>'];
handler.tags = ['ai', 'tools'];
handler.command = /^fluxai$/i;
handler.premium = false;
handler.limit = true;

export default handler;