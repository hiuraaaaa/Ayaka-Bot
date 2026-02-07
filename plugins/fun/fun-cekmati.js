import axios from 'axios';

let handler = async (m, { conn, command, text, prefix }) => {
  if (command === 'cekmati') {
    if (!text) {
      return m.reply(`Contoh: ${prefix + command} nama lu`);
    }

    // Tambahkan reaksi emoji saat memproses
    await conn.sendMessage(m.chat, {
      react: {
        text: '🍏',
        key: m.key
      }
    });

    let cleanedText = text.replace(/@|[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '').replace(/\d/g, '');

    try {
      let { data } = await axios.get(`https://api.agify.io/?name=${cleanedText || 'bot'}`);
      let age = data.age === null ? (Math.floor(Math.random() * 90) + 20) : data.age;

      m.reply(`Nama: ${text}\n*Mati Pada Umur:* ${age} Tahun.\n\n_Cepat Cepat Tobat Bro_\n_Soalnya Mati ga ada yang tau_`);
    } catch (e) {
      console.error(e);
      m.reply(`❌ Gagal mengambil data. Mungkin ada masalah dengan API. Tapi umur kamu diprediksi ${Math.floor(Math.random() * 90) + 20} tahun.`);
    }
  }
};

handler.command = ['cekmati'];
handler.tags = ['fun'];
handler.help = ['cekmati <nama>'];

export default handler;