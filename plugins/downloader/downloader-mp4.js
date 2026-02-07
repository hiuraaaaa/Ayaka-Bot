import fetch from 'node-fetch';
import os from 'os';
import yts from 'yt-search';

const handler = async (m, { conn, text }) => {
  if (!text) {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    return m.reply('Harap masukkan URL atau judul YouTube.\nContoh: .ytmp4 never gonna give you up');
  }

  const headers = {
    "accept": "*/*",
    "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
    "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\"",
    "sec-ch-ua-mobile": "?1",
    "sec-ch-ua-platform": "\"Android\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    "Referer": "https://id.ytmp3.mobi/",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  };

  try {
    const freeSpace = os.freemem() / (1024 * 1024);
    if (freeSpace < 100) {
      throw new Error('Penyimpanan server tidak mencukupi untuk mengunduh file.');
    }

    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    let videoUrl = text;

    // Jika bukan URL, cari dari judul
    if (!/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//.test(text)) {
      const search = await yts.search(text);
      const video = search.videos[0];
      if (!video) throw new Error('Video tidak ditemukan berdasarkan judul tersebut.');
      videoUrl = video.url;
    }

    const initial = await fetch(`https://d.ymcdn.org/api/v1/init?p=y&23=1llum1n471&_=${Math.random()}`, { headers });
    const init = await initial.json();

    const id = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|.*embed\/))([^&?/]+)/)?.[1];
    if (!id) throw new Error('URL tidak valid.');

    let convertURL = `${init.convertURL}&v=${id}&f=mp4&_=${Math.random()}`;
    const converts = await fetch(convertURL, { headers });
    const convert = await converts.json();

    let info = {};
    for (let i = 0; i < 3; i++) {
      let j = await fetch(convert.progressURL, { headers });
      info = await j.json();
      if (info.progress == 3) break;
    }

    if (!convert.downloadURL) throw new Error('Gagal mendapatkan link unduhan.');

    const title = info.title || "Judul tidak tersedia";
    const downloadURL = convert.downloadURL;
    const sizeText = convert.size || "0MB";
    const sizeMB = parseFloat(sizeText.replace(/MB|GB/, '')) * (sizeText.includes('GB') ? 1024 : 1);
    const caption = `\`Y O U T U B E   D O W N L O A D E D\`\n\n- *Judul:* ${title}\n- *URL:* ${videoUrl}`;

    if (sizeMB > 95) {
      await conn.sendMessage(m.chat, {
        document: { url: downloadURL },
        mimetype: 'video/mp4',
        fileName: `${title}.mp4`,
        caption
      }, { quoted: m });
    } else {
      await conn.sendMessage(m.chat, {
        video: { url: downloadURL },
        caption
      }, { quoted: m });
    }

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
  } catch (e) {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });

    if (e.message.includes('Penyimpanan server tidak mencukupi')) {
      return m.reply('❌ Penyimpanan server tidak mencukupi untuk mengunduh file. Harap coba lagi nanti.');
    }

    if (e.message.includes('ENOSPC')) {
      return m.reply('❌ Penyimpanan penuh! Tidak ada ruang tersisa untuk menyimpan file.');
    }

    m.reply(`❌ Terjadi kesalahan: ${e.message}`);
  }
};

handler.help = ['mp4 <url|judul>'];
handler.tags = ['downloader'];
handler.command = /^(mp4)$/i;
handler.limit = 5;
handler.register = true;

export default handler;