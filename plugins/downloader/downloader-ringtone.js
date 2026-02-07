import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import yts from 'yt-search';

const getYoutubeThumbnail = async (query) => {
  try {
    const { videos } = await yts(query);
    return videos?.[0]?.thumbnail || 'https://i.imgur.com/JP52fdP.png';
  } catch {
    return 'https://i.imgur.com/JP52fdP.png';
  }
};

const RingTone = async (search) => {
  try {
    const res = await fetch(`https://meloboom.com/en/search/${encodeURIComponent(search)}`);
    const html = await res.text();
    const $ = cheerio.load(html);
    const hasil = [];

    $('ul li').each((i, el) => {
      const title = $(el).find('h4').text();
      const sourcePath = $(el).find('a').attr('href');
      const audio = $(el).find('audio').attr('src');
      const source = 'https://meloboom.com' + sourcePath;
      if (title && audio && sourcePath) {
        hasil.push({ title, source, audio });
      }
    });

    for (let i = 0; i < hasil.length; i++) {
      hasil[i].thumbnail = await getYoutubeThumbnail(hasil[i].title);
    }

    return hasil;
  } catch (err) {
    console.error('Error fetching ringtone:', err);
    return [];
  }
};

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
  const subcmd = args[0];
  const id = m.chat;
  global.ringtoneList = global.ringtoneList || {};

  switch (subcmd) {
    case 'play':
      if (!global.ringtoneList[id]) throw '⚠️ Tidak ada hasil sebelumnya. Gunakan perintah: `' + usedPrefix + command + ' <judul>`';
      const index = parseInt(args[1]);
      if (isNaN(index) || index < 0 || index >= global.ringtoneList[id].length) {
        throw '⚠️ Index tidak valid!';
      }

      const { title, audio, source, thumbnail } = global.ringtoneList[id][index];
      const caption = `🎶 *Now Playing!*\n\n✨ *Judul:* ${title}\n\n🔊 Nikmati nada dering pilihanmu!`;

      await conn.sendMessage(m.chat, {
        text: caption,
        contextInfo: {
          externalAdReply: {
            title,
            body: '🔊 Ringtone player by Lann4you',
            thumbnailUrl: thumbnail,
            sourceUrl: source,
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: m });

      return conn.sendMessage(m.chat, {
        audio: { url: audio },
        mimetype: 'audio/mp4',
        ptt: false
      }, { quoted: m });

    default:
      if (!text) throw `📌 Contoh penggunaan:\n${usedPrefix + command} alan walker`;

      const results = await RingTone(text);
      if (!results.length) throw '❌ Tidak ada ringtone ditemukan.';

      global.ringtoneList[id] = results.slice(0, 10);

      const sections = [{
        title: `🎼 Hasil untuk: ${text}`,
        rows: global.ringtoneList[id].map((v, i) => ({
          title: v.title,
          description: '▶️ Tekan untuk putar ringtone',
          rowId: `${usedPrefix + command} play ${i}`
        }))
      }];

      const listMessage = {
        text: '📀 Pilih ringtone dari daftar berikut:',
        footer: `🪄 ${global.namebot} | RingTone`,
        title: '🎧 Ringtone Ditemukan!',
        buttonText: '📜 Pilih Ringtone',
        sections
      };

      return conn.sendMessage(m.chat, listMessage, { quoted: m });
  }
};

handler.help = ['ringtone <judul>', 'ringtone play <index>'];
handler.tags = ['downloader'];
handler.command = /^ringtone$/i;

export default handler;