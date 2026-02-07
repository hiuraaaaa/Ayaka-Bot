let handler = async (m, { conn, text }) => {
  if (!text) throw 'URL-nya?';

  try {
    // Call the REST API with the URL
    let res = await axios.get(`https://rest.cifumo.biz.id/api/anime/otakudesu-getvideo?url=${encodeURIComponent(text)}`);

    // Check if the response status is true and data is available
    if (res.data.status && res.data.data) {
      let videoData = res.data.data;

      let result = `• *Judul:* ${videoData.title}\n\n`;
      let videoLinks = videoData.video.map((vid, idx) => `*${idx + 1}. [${vid.quality}](${vid.link})*`).join('\n');

      // Reply with video details and links
      await m.reply(`${result}*Video Links:*\n${videoLinks}`);
    } else {
      m.reply('Link video tidak ditemukan.');
    }
  } catch (e) {
    m.reply('Terjadi kesalahan. URL yang kamu masukkan tidak valid atau tidak dapat ditemukan.');
  }
};

handler.help = ['otakugetvideo'];
handler.tags = ['anime'];
handler.command = /^(otakugetvideo)$/i;
handler.limit = true;

export default handler;