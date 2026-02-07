import fetch from 'node-fetch';
import uploadImage from '../lib/uploadImage.js';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  let q = m.quoted || m;
  let mime = (q.msg || q).mimetype || q.mediaType || '';

  if (!mime.startsWith('image/')) {
    return m.reply(`kirim atau reply gambar dengan caption *${usedPrefix + command} [prompt]*\ncontoh: ${usedPrefix + command} A futuristic city skyline`);
  }

  if (!text) {
    return m.reply(`lu harus kasih prompt dulu\ncontoh: ${usedPrefix + command} A futuristic city skyline`);
  }

  m.reply('lagi proses sensei, sabar bentar...');

  try {
    let img = await q.download();
    let url = await uploadImage(img);

    let apiUrl = `https://fastrestapis.fasturl.cloud/imgedit/aibackground?imageUrl=${encodeURIComponent(url)}&prompt=${encodeURIComponent(text.trim())}`;

    let res = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'accept': 'image/png',
      },
    });

    if (!res.ok) {
      return m.reply('gagal dapet respon dari server, coba lagi ntar');
    }

    let buffer = await res.buffer();

    await conn.sendFile(m.chat, buffer, 'edited.png', 'nih sensei backgroundnya udah diganti', m);
  } catch (e) {
    console.error(e);
    m.reply('ada error sensei pas proses gambarnya');
  }
};

handler.help = ['editbg *[prompt]*'];
handler.tags = ['tools'];
handler.command = ['editbg'];

export default handler;