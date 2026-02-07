import axios from 'axios';
import * as cheerio from 'cheerio';

const dongeng = {
  list: async () => {
    let nextPageUrl = 'https://www.1000dongeng.com/';
    const posts = [];

    try {
        while (nextPageUrl) {
            const { data } = await axios.get(nextPageUrl);
            const $ = cheerio.load(data);
            
            $('.date-outer .date-posts .post-outer').each((index, element) => {
                const title = $(element).find('.post-title a').text().trim();
                const link = $(element).find('.post-title a').attr('href');
                const author = $(element).find('.post-author .fn').text().trim();
                const date = $(element).find('.post-timestamp .published').text().trim();
                const image = $(element).find('.post-thumbnail amp-img').attr('src') 
                            || $(element).find('.post-thumbnail img').attr('src') 
                            || 'Image not available';

                posts.push({
                    title,
                    link,
                    author,
                    date,
                    image
                });
            });

            const nextLink = $('.blog-pager-older-link').attr('href');
            nextPageUrl = nextLink ? nextLink : null;
        }

        return {
            total: posts.length,
            posts
        };
    } catch (error) {
        console.error('Error fetching the website:', error);
    }
  },
  
  getDongeng: async (url) => {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        
        const title = $('h1.post-title.entry-title').text().trim();
        const author = $('.post-author .fn').text().trim();
        const storyContent = $('.superarticle').html() 
            .replace(/<img[^>]*>/g, '')
            .replace(/<\/?[^>]+(>|$)/g, '')
            .trim();

        return { 
            title, 
            author, 
            storyContent
        };
    } catch (error) {
        console.error('Error fetching the website:', error);
    }
  }
};

const handler = async (m, { text, command }) => {
  try {
    if (command === "dongeng") {
      if (!text) {
        return m.reply("Masukkan judul dongeng yang ingin dicari. Contoh: .dongeng Pahlawan");
      }

      const { posts } = await dongeng.list();
      const foundStory = posts.find(story => story.title.toLowerCase().includes(text.toLowerCase()));

      if (!foundStory) {
        return m.reply("Dongeng tidak ditemukan.");
      }

      const { title, author, storyContent } = await dongeng.getDongeng(foundStory.link);
      const response = `📖 *Judul:* ${title}\n👨‍💻 *Penulis:* ${author}\n\n*Isi Dongeng:*\n${storyContent}`;

      try {
        await m.reply({ image: { url: foundStory.image }, caption: response });
      } catch (err) {
        console.error("Gagal mengirim gambar:", err.message);
        await m.reply(response);
      }
    }
  } catch (error) {
    console.error(error);
    m.reply("Terjadi kesalahan saat mengambil data.");
  }
};

handler.command = ["dongeng"];
handler.tags = ["internet"];
handler.limit = true;

export default handler;;