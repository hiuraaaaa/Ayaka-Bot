import axios from 'axios';

let handler = async (m, { conn, text }) => {
  if (!text) throw 'URL-nya?';

  try {
    // Call the REST API with the URL
    let res = await axios.get(`https://rest.cifumo.biz.id/api/anime/otakudesu-detail?url=${encodeURIComponent(text)}`);

    // Check if the response status is true and data is available
    if (res.data.status && res.data.data) {
      let anime = res.data.data;

      let result = `• *Judul:* ${anime.judul.replace('Judul: ', '')}
• *Japanese:* ${anime.japanese.replace('Japanese: ', '')}
• *Skor:* ${anime.skor.replace('Skor: ', '')}
• *Produser:* ${anime.produser.replace('Produser: ', '')}
• *Tipe:* ${anime.tipe.replace('Tipe: ', '')}
• *Status:* ${anime.status.replace('Status: ', '')}
• *Total Episode:* ${anime.total_episode.replace('Total Episode: ', '')}
• *Durasi:* ${anime.durasi.replace('Durasi: ', '')}
• *Tanggal Rilis:* ${anime.tanggal_rilis.replace('Tanggal Rilis: ', '')}
• *Studio:* ${anime.studio.replace('Studio: ', '')}
• *Genre:* ${anime.genre.replace('Genre: ', '')}
• *Sinopsis:* ${anime.sinopsis}
• *Batch:* [Link](${anime.batch})`;

      let episodes = anime.episode.map(ep => `• [${ep.judul}](${ep.link}) (Upload: ${ep.upload})`).join('\n');

      // Send the message with additional context info
      await conn.sendMessage(m.chat, {
        text: `${result}\n\n*Episodes:*\n${episodes}`,
        contextInfo: {
          externalAdReply: {
            title: "OTAKUDESU",
            body: '',
            thumbnailUrl: anime.image,
            sourceUrl: text, // URL to the detailed anime page
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: m });

    } else {
      m.reply('Detail anime tidak ditemukan.');
    }
  } catch (e) {
    m.reply('Terjadi kesalahan. URL yang kamu masukkan tidak valid atau tidak dapat ditemukan.');
  }
};

handler.help = ['otakudetail'];
handler.tags = ['anime'];
handler.command = /^(otakudetail)$/i;
handler.limit = true;

export default handler;