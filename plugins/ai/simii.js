import axios from 'axios';

var handler = async (m, { conn, text }) => {
  if (!text) {
    throw 'Apa yang kamu ingin bicarakan kepada simi?';
  }
  m.reply(wait)
  try {
    const response = await axios.get(`https://api.tioprm.eu.org/simi?text=${encodeURIComponent(text)}`);
    const { status, result } = response.data;

    if (status && result) {
      await conn.reply(m.chat, result, m);
    } else {
      throw 'Gagal memproses teks dengan Turbo.';
    }
  } catch (error) {
    throw `apa syang`;
  }
};

handler.help = ['simi <pertanyaan>']
handler.tags = ['ai'];
handler.command = /^(simi)$/i;

export default handler;