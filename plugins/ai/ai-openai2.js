import axios from 'axios';

var handler = async (m, { conn, text }) => {
  if (!text) {
    throw 'Apa yang kamu ingin tanyakan kepada asisten AI';
  }
  m.reply(wait)
  try {
    const response = await axios.get(`https://skizoasia.xyz/api/openai?apikey=${global.skizo}&text=${encodeURIComponent(text)}&system=`);
    const { status, result } = response.data;

    if (status && result) {
      await conn.reply(m.chat, result, m);
    } else {
      throw 'Gagal memproses teks dengan Asisten AI.';
    }
  } catch (error) {
    throw `Terjadi kesalahan:\nJika eror, Anda bisa mencoba menggunakan Gemini, cek di .menuai`;
  }
};

handler.help = ['ai2 <pertanyaan>']
handler.tags = ['ai'];
handler.command = /^(ai2|openai2)$/i;

export default handler;