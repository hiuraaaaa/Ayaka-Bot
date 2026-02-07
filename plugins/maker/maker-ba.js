import axios from 'axios';

const handler = async (m, { conn, args, usedPrefix, command }) => {
  if (args.length < 2) {
    return conn.sendMessage(m.chat, {
      text: `Contoh penggunaan:\n${usedPrefix + command} Lann4you ofc\n\nGunakan 2 kata: text kiri dan text kanan.`,
    }, { quoted: m });
  }

  const [textL, textR] = args;
  const apiUrl = `https://api.nekorinn.my.id/maker/ba-logo?textL=${encodeURIComponent(textL)}&textR=${encodeURIComponent(textR)}`;

  try {
    const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');

    await conn.sendMessage(m.chat, {
      image: buffer,
      caption: `Berhasil membuat logo dengan teks:\nKiri: ${textL}\nKanan: ${textR}`,
    }, { quoted: m });
  } catch (err) {
    console.error(err);
    m.reply('Gagal mengambil data dari API. Coba lagi nanti.');
  }
};

handler.command = ['balogo', 'balg'];
handler.help = ['balogo'];
handler.tags = ['maker'];

export default handler;