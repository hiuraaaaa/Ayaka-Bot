import axios from 'axios';
import FormData from 'form-data';

const handler = async (m, { conn, usedPrefix, command }) => {
  const q = m.quoted ? m.quoted : m;
  const mime = (q.msg || q).mimetype || '';

  if (!mime.includes('image')) throw `❌ Untuk menggunakan fitur bantuan, balas gambar dengan caption *${usedPrefix + command}*.`;

  m.reply('🧠 Sedang menganalisis gambar dan mencari solusi...');

  try {
    const img = await q.download();
    const formUpload = new FormData();
    formUpload.append('reqtype', 'fileupload');
    formUpload.append('fileToUpload', img, 'image.jpg');

    const catbox = await axios.post('https://catbox.moe/user/api.php', formUpload, {
      headers: formUpload.getHeaders()
    });

    if (!catbox.data || !catbox.data.includes('https')) throw '❌ Gagal mengunggah gambar ke server.';

    const imageUrl = catbox.data.trim();

    // Prompt lebih empatik dan terbuka untuk segala jenis masalah
    const apiUrl = `https://api.maelyn.sbs/api/gemini/image?q=Seseorang%20memerlukan%20bantuan.%20Tolong%20jelaskan%20apa%20yang%20ada%20di%20dalam%20gambar%20ini%20dan%20jika%20ada%20masalah%20atau%20soal%2C%20berikan%20solusinya%20dengan%20bahasa%20yang%20mudah%20dipahami.%20Jika%20gambar%20tidak%20jelas%2C%20beri%20masukan%20yang%20ramah.&url=${encodeURIComponent(imageUrl)}&apikey=ubed2407`;

    const result = await axios.get(apiUrl);

    if (result.data.status !== 'Success' || !result.data.result) {
      throw 'Gagal menganalisis isi gambar.';
    }

    const isi = result.data.result;

    await conn.sendMessage(m.chat, {
      text: `🤖 *Berikut hasil bantuanku setelah melihat gambarnya:*\n\n${isi}`,
      contextInfo: {
        externalAdReply: {
          title: "Ubed Bot • Asisten Cerdas",
          body: "Bantu memahami, menyelesaikan, dan mencari solusi 📷",
          thumbnailUrl: "https://telegra.ph/file/3aa1d699bde0c8702018b.jpg",
          sourceUrl: "",
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    m.reply('❌ Maaf, terjadi kesalahan saat memproses gambar. Pastikan gambar tidak buram dan kirim ulang jika perlu.');
  }
};

handler.help = ['tolong'];
handler.tags = ['tools', 'ai'];
handler.command = /^tolong$/i;

export default handler;