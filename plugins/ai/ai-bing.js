import axios from 'axios';
import * as cheerio from 'cheerio';

const handler = async (m, { conn, text, command }) => {
  if (!text) throw `Example: .${command} monster`;

  const searchUrl = `https://www.bing.com/images/search?q=${encodeURIComponent(text)}&form=HDRSC2&first=1&tsc=ImageBasicHover`;

  try {
    const { data } = await axios.get(searchUrl);
    const $ = cheerio.load(data);
    const imageUrls = [];

    $('a.iusc').each((i, el) => {
      const m = $(el).attr('m');
      if (m) {
        const match = m.match(/"murl":"(.*?)"/);
        if (match && match[1]) {
          imageUrls.push(match[1]);
        }
      }
    });

    if (!imageUrls.length) throw 'No results found.';

    const randomImage = imageUrls[Math.floor(Math.random() * imageUrls.length)];
    await conn.sendFile(m.chat, randomImage, 'bing.jpg', `Result for: ${text}`, m);
  } catch (error) {
    console.error(error);
    throw 'Error fetching images.';
  }
};

handler.help = ['bingimg <query>'];
handler.tags = ['internet'];
handler.command = /^bingimg$/i;

export default handler;