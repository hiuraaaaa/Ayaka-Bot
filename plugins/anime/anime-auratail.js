import axios from 'axios';
import * as cheerio from 'cheerio';

class Auratail {
  async popular(m, conn) {
    try {
      const url = 'https://auratail.vip';
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);

      const popularSection = $('div.listupd.normal').first();
      const results = [];

      popularSection.find('article.bs').each((_, el) => {
        const title = $(el).find('div.tt h2').text().trim();
        const episodeLink = $(el).find('a').attr('href').trim();

        if (title && episodeLink) {
          results.push(`${title}\n${episodeLink}`);
        }
      });

      if (results.length > 0) {
        const message = `📺 *Popular Today*\n\n${results.join('\n\n')}`;
        conn.reply(m.chat, message, m);
      } else {
        conn.reply(m.chat, 'Tidak ada data yang ditemukan untuk "Popular Today".', m);
      }
    } catch (error) {
      console.error(error);
      conn.reply(m.chat, 'Terjadi kesalahan saat memproses permintaan.', m);
    }
  }

  async latest(m, conn) {
    const url = 'https://auratail.vip/anime/?status=&type=&order=update';
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const latestReleases = [];
    $('.listupd .bsx').each((_, el) => {
      const title = $(el).find('.tt h2').text().trim();
      const episode = $(el).find('.bt .epx').text().trim();
      const link = $(el).find('a').attr('href');
      const image = $(el).find('img').attr('data-src') || $(el).find('img').attr('src');
      latestReleases.push({ title, episode, link, image });
    });

    if (latestReleases.length === 0) return conn.reply(m.chat, 'Tidak ada rilis terbaru ditemukan.', m);

    const { image } = latestReleases[0];
    const message = latestReleases.map(({ title, episode, link }) =>
      `🌟 *${title}*\n🗂️ Episode: ${episode}\n🔗 [Tonton Sekarang](${link})\n`
    ).join('\n');

    await conn.sendMessage(m.chat, {
      text: message,
      thumbnail: await (await axios.get(image, { responseType: 'arraybuffer' })).data,
    });
  }

  async detail(m, conn, url) {
    try {
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);

      const title = $('.entry-title[itemprop="name"]').text().trim();
      const image = $('.thumb img[itemprop="image"]').attr('data-src') || $('.thumb img[itemprop="image"]').attr('src');
      const status = $('span:contains("Status:")').text().replace('Status:', '').trim();
      const studio = $('span:contains("Studio:")').text().replace('Studio:', '').trim();
      const episodes = $('span:contains("Episodes:")').text().replace('Episodes:', '').trim();
      const duration = $('span:contains("Duration:")').text().replace('Duration:', '').trim();
      const type = $('span:contains("Type:")').text().replace('Type:', '').trim();
      const releaseYear = $('span:contains("Released:")').text().replace('Released:', '').trim();
      const producers = $('span:contains("Producers:")')
        .nextUntil('span')
        .map((_, el) => $(el).text().trim())
        .get()
        .join(', ');

      const genres = $('.genxed a')
        .map((_, el) => $(el).text().trim())
        .get()
        .join(', ');

      const synopsis = $('.entry-content[itemprop="description"] p')
        .map((_, el) => $(el).text().trim())
        .get()
        .join('\n');

      const detail = {
        title,
        image,
        status: status || 'N/A',
        studio: studio || 'N/A',
        episodes: episodes || 'N/A',
        duration: duration || 'N/A',
        type: type || 'N/A',
        releaseYear: releaseYear || 'N/A',
        producers: producers || 'N/A',
        genres: genres || 'N/A',
        synopsis: synopsis || 'N/A',
      };

      const message = `
🎥 *${detail.title}*
🪄 *Status*: ${detail.status}
🏭 *Studio*: ${detail.studio}
🎞️ *Episodes*: ${detail.episodes}
⏳ *Duration*: ${detail.duration}
📅 *Released*: ${detail.releaseYear}
🎭 *Genres*: ${detail.genres}
🔖 *Type*: ${detail.type}
🧑‍💼 *Producers*: ${detail.producers}

📖 *Synopsis*:
${detail.synopsis}`;

      await conn.sendMessage(m.chat, {
        text: message,
        thumbnail: await (await axios.get(detail.image, { responseType: 'arraybuffer' })).data,
      });
    } catch (error) {
      console.error(error);
      conn.reply(m.chat, 'Gagal mengambil detail. Pastikan link valid atau coba lagi nanti.', m);
    }
  }

  async search(m, conn, query) {
    const url = `https://auratail.vip/?s=${encodeURIComponent(query)}`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const searchResults = [];
    $('#content .listupd article').each((_, el) => {
      const title = $(el).find('.tt h2').text().trim();
      const link = $(el).find('a').attr('href');
      const image = $(el).find('.lazyload').attr('data-src') || $(el).find('noscript img').attr('src');
      const status = $(el).find('.status').text().trim() || $(el).find('.bt .epx').text().trim();
      searchResults.push({ title, link, image, status });
    });

    if (searchResults.length === 0) return conn.reply(m.chat, `Tidak ada hasil untuk "${query}".`, m);

    const { image } = searchResults[0];
    const message = searchResults.map(({ title, link, status }) =>
      `📌 *${title}*\n🔗 [Tonton Sekarang](${link})\n⚙️ *Status*: ${status}\n`
    ).join('\n');

    await conn.sendMessage(m.chat, {
      text: message,
      thumbnail: await (await axios.get(image, { responseType: 'arraybuffer' })).data,
    });
  }
}

let handler = async (m, { conn, text }) => {
  if (!text) return conn.reply(m.chat, '*Format Perintah*\n\n- .auratail --popular\n- .auratail --detail (link)\n- .auratail --search (query)\n- .auratail --latestrelease', m);

  const [command, ...args] = text.split(' ');
  const query = args.join(' ');
  const auratail = new Auratail();

  try {
    switch (command) {
      case '--popular':
        await auratail.popular(m, conn);
        break;
      case '--latestrelease':
        await auratail.latest(m, conn);
        break;
      case '--detail':
        if (!query) return conn.reply(m.chat, 'Harap sertakan link untuk perintah detail.\n\nContoh: .auratail --detail (link)', m);
        await auratail.detail(m, conn, query);
        break;
      case '--search':
        if (!query) return conn.reply(m.chat, 'Harap sertakan query untuk pencarian.\n\nContoh: .auratail --search (query)', m);
        await auratail.search(m, conn, query);
        break;
      default:
        conn.reply(m.chat, 'Perintah tidak valid.\nGunakan:\n- .auratail --popular\n- .auratail --detail (link)\n- .auratail --search (query)\n- .auratail --latestrelease', m);
    }
  } catch (error) {
    console.error(error);
    conn.reply(m.chat, 'Terjadi kesalahan saat memproses perintah.', m);
  }
};

handler.help = ['auratail'];
handler.command = ['auratail'];
handler.tags = ['anime'];

export default handler;