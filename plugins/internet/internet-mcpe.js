import * as cheerio from 'cheerio';
import axios from 'axios';

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

async function mcpedl(mods) {
  try {
    const ress = await axios.get(`https://mcpedl.org/?s=${encodeURIComponent(mods)}`);
    const $ = cheerio.load(ress.data);

    const result = [];

   
    const blocks = $('.g-block.size-20');
    if (blocks.length === 0) {
      console.log('No blocks found for query:', mods);
      return null;
    }

  
    blocks.first().each((_, element) => {
      const title = $(element).find('.entry-title a').text().trim();
      const url = $(element).find('.entry-title a').attr('href');
      const thumbnailUrl = $(element).find('.post-thumbnail img').attr('data-src') || 
                          $(element).find('.post-thumbnail img').attr('src'); // Untuk contextInfo

      const ratingWidth = $(element).find('.rating-wrapper .rating-box .rating-subbox').attr('style');
      const rating = ratingWidth ? parseInt(ratingWidth.split(':')[1]) / 100 * 5 : 0;

      if (title && url && isValidUrl(url)) {

        const validThumbnail = thumbnailUrl && isValidUrl(thumbnailUrl) ? thumbnailUrl : null;

        result.push({
          title,
          url,
          thumbnailUrl: validThumbnail,
          rating,
        });
      }
    });

    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Error in mcpedl:', error.message);
    return null;
  }
}

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('❗ Masukkan nama mod yang ingin dicari! Contoh: .mcpedl RTX');

  await conn.sendMessage(m.chat, { react: { text: '🎀', key: m.key } });

  let mod = await mcpedl(text);
  if (!mod) return m.reply('❌ Mod tidak ditemukan.');

  let caption = `🔍 *${mod.title}*\n`;
  caption += `⭐ *Rating:* ${mod.rating.toFixed(1)}/5\n`;
  caption += `🌐 *Link:* ${mod.url}`;

  try {
    await conn.sendMessage(
      m.chat,
      {
        text: caption,
        contextInfo: {
          externalAdReply: {
            title: `🔍 ${mod.title}`,
            body: `⭐ Rating: ${mod.rating.toFixed(1)}/5`,
            thumbnailUrl: mod.thumbnailUrl || 'https://via.placeholder.com/150', // Fallback kalo thumbnail nggak ada
            sourceUrl: mod.url,
            showAdAttribution: true,
          },
        },
      },
      { quoted: m }
    );
  } catch (error) {
    console.error('Error sending message:', error.message);
    await m.reply('❌ Gagal mengirim pesan. Coba lagi nanti.');
  }

  await conn.sendMessage(m.chat, { react: { text: null, key: m.key } });
};

handler.command = /^(mcpedl)$/i;
handler.tags = ['internet'];
handler.help = ['mcpedl <nama mod>'];
handler.limit = true;

export default handler;