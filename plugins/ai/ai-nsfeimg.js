import fetch from 'node-fetch';

let handler = async (m, { text, conn, command }) => {
  if (!text) throw `Contoh penggunaan:\n.${command} burung`;

  // Kirim emoji reaksi saat memproses
  await conn.sendMessage(m.chat, {
    react: {
      text: '⏳',
      key: m.key
    }
  });

  try {
    const url = `https://fastrestapis.fasturl.cloud/aiimage/nsfw?prompt=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    if (!res.ok) throw 'Gagal menghubungi API';

    const buffer = await res.buffer();
    await conn.sendFile(m.chat, buffer, 'result.jpg', `Prompt: *${text}*`, m);

    await conn.sendMessage(m.chat, {
      react: {
        text: '✅',
        key: m.key
      }
    });
  } catch (err) {
    console.error('[ERROR NSFWIMG]', err);
    throw typeof err === 'string' ? err : err.message || 'Terjadi kesalahan saat memproses.';
  }
};

handler.command = /^nsfwimg$/i;
handler.help = ['nsfwimg <prompt>'];
handler.tags = ['ai', 'nsfw'];
handler.premium = true;

export default handler;