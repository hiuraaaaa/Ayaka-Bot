import axios from 'axios'; // Pastikan axios sudah diimpor jika belum

let handler = async (m, { conn, command }) => {
  if (command === 'randomjoke') {
    // Tambahkan reaksi emoji saat memproses
    await conn.sendMessage(m.chat, {
      react: {
        text: '😂', // Emoji tertawa saat memproses
        key: m.key
      }
    });

    try {
      // Mengambil data lelucon dari API
      const api = await axios.get("https://candaan-api.vercel.app/api/text/random");
      const jokeText = api.data.data;

      // Mengirim lelucon ke chat
      await conn.sendMessage(m.chat, { text: jokeText }, { quoted: m });
    } catch (err) {
      // Menangani kesalahan jika gagal mengambil lelucon
      console.error(err);
      await conn.sendMessage(m.chat, { text: "404 Jokes Not Found", }, { quoted: m }); // Pesan ini akan terkirim jika ada error
    }
  }
};

handler.command = ['randomjoke']; // Mendefinisikan perintah yang akan memicu handler ini
handler.tags = ['fun']; // Menambahkan tag 'fun'
handler.help = ['randomjoke']; // Bantuan penggunaan perintah

export default handler;