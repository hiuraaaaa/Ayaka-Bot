import axios from 'axios';
import cheerio from 'cheerio';
const { generateWAMessageContent, generateWAMessageFromContent, proto } = (await import('@adiwajshing/baileys')).default;

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`• *Example:* ${usedPrefix + command} 1 Yue Arifureta 5\n${usedPrefix + command} <page> <tags> <max slides>`);

  const [page, ...tagsArray] = text.trim().split(' ');
  const tags = tagsArray.slice(0, -1).join('_');
  const maxSlides = parseInt(tagsArray.slice(-1)[0]);
  const searchUrl = `https://yande.re/post?page=${page}&tags=${tags}`;

  try {
    const response = await axios.get(searchUrl);
    const html = response.data;
    const $ = cheerio.load(html);

    const posts = [];

    $('li').each((index, element) => {
      const id = $(element).attr('id');
      const imgSrc = $(element).find('img').attr('src');
      const imgTitle = $(element).find('img').attr('title');
      const directLink = $(element).find('a.directlink').attr('href');
      const resolution = $(element).find('span.directlink-res').text();

      if (id && id !== 'tab-login' && id !== 'tab-reset') {
        const titleParts = imgTitle ? imgTitle.split(' Tags: ') : ["", ""];
        const rating = titleParts[0]?.replace('Rating: ', '').trim() || "N/A";
        const tagsAndUser = titleParts[1]?.split(' User: ') || ["", ""];
        const postTags = tagsAndUser[0]?.trim() || "N/A";
        const user = tagsAndUser[1]?.trim() || "N/A";

        posts.push({
          id,
          imgSrc,
          rating,
          tags: postTags,
          user,
          directLink,
          resolution,
        });
      }
    });

    if (posts.length > 0) {
      const imagesToSend = posts.slice(0, maxSlides);

      // Send each image individually with a caption
      for (let post of imagesToSend) {
        if (post.imgSrc) {
          await conn.sendMessage(m.chat, {
            image: { url: post.imgSrc },
            caption: `⛱️ *Title:* ${post.id}\n📊 *Rating:* ${post.rating}\n📌 *Tags:* ${post.tags}\n💳 *User:* ${post.user}\n🔗 *Link:* ${post.directLink}`
          });
        } else {
          console.log(`Skipping post ${post.id} due to missing image source.`);
        }
      }
    } else {
      m.reply(`No results found for tag "${tags.replace(/_/g, ' ')}" on page ${page}.`);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    m.reply('An error occurred while performing the search.');
  }
};

handler.help = ['yandere <page> <tags> <max slides>'];
handler.tags = ['internet'];
handler.command = /^(yandere)$/i;

export default handler;