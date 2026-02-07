import fetch from 'node-fetch';

let handler = async (m, { conn, text, command }) => {
  if (!text) throw `Silakan berikan deskripsi gambar yang ingin Anda hasilkan.\nContoh: ${command} A cat sitting on a table`;

  m.reply('Mohon tunggu, gambar sedang diproses...');

  try {
    const response = await fetch(
      `https://api.popcat.xyz/imagine?text=${encodeURIComponent(text)}`
    );

    if (!response.ok) throw `Terjadi kesalahan saat menghubungi API: ${response.status} ${response.statusText}`;

    const buffer = await response.buffer();

    conn.sendFile(m.chat, buffer, 'image.png', `Gambar dari: ${text}`, m);
  } catch (error) {
    console.error(error);
    m.reply(`Terjadi kesalahan saat menghasilkan gambar: ${error}`);
  }
};

handler.help = ['texttoimage <teks>'];
handler.tags = ['ai'];
handler.command = ['texttoimage', 'txttoimg', 'txtimg'];
handler.limit = 3;
handler.register = true;

export default handler;