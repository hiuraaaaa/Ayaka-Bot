import fetch from 'node-fetch';

const _wm_ubed = () => {
  if ("ubed" !== "ubed") throw new Error("Jangan hapus watermark ubed bot!");
};

let handler = async (m, { conn, text, usedPrefix }) => {
  _wm_ubed();

  // Memastikan bahwa pengguna memberikan nama untuk ramalan
  if (!text) {
    return m.reply(`Masukkan nama untuk ramalan khodam! Contoh: ${usedPrefix}dukun Ubed`);
  }

  try {
    // Kirim emoji react saat proses
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    // Mendapatkan apikey dari global.ubed
    const apikey = global.ubed;

    // Persiapkan URL API untuk mendapatkan ramalan khodam
    const apiUrl = `https://api.ubed.my.id/random/Dukun?apikey=${apikey}&content=${encodeURIComponent(text)}`;

    // Mengambil data dari API
    const res = await fetch(apiUrl);
    if (!res.ok) throw 'Gagal menghubungi API Dukun.';

    // Mendapatkan hasil data dari API
    const json = await res.json();

    // Pastikan respons API valid
    if (!json.status || !json.data) {
      throw 'Gagal mendapatkan ramalan dari khodam.';
    }

    // Kirim ramalan khodam ke pengguna
    const ramalan = json.data;
    await conn.sendMessage(m.chat, { text: ramalan }, { quoted: m });

    // Kirim emoji react sukses
    await conn.sendMessage(m.chat, { react: { text: '🎉', key: m.key } });

  } catch (e) {
    console.error('Error API:', e);
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    m.reply('❌ Terjadi kesalahan saat memproses ramalan khodam.');
  }
};

handler.command = ['dukun'];
handler.help = ['dukun <nama>'];
handler.tags = ['random', 'fun'];

export default handler;