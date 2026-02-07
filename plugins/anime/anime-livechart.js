import axios from 'axios';
import * as cheerio from 'cheerio';
const { generateWAMessageContent, generateWAMessageFromContent, proto } = (await import('@adiwajshing/baileys')).default;

async function liveChart(anime) {
  try {
    const { data: html } = await axios.get(`https://www.livechart.me/search?q=${anime}`);
    const $ = cheerio.load(html);

    const animeData = [];
    $('.grouped-list-item.anime-item').each((index, element) => {
      const title = $(element).data('title');
      const premiere = $(element).find('[data-action="click->anime-item#showPremiereDateTime"]').text().trim();
      const rating = $(element).find('.icon-star').parent().text().trim();
      const poster = $(element).find('img').attr('src');
      const link = `https://www.livechart.me${$(element).find('a[data-anime-item-target="mainTitle"]').attr('href')}`;

      if (link && title) {
        animeData.push({ title, premiere, rating, poster, link });
      }
    });

    return animeData;
  } catch (error) {
    console.error(`Error fetching anime data: ${error.message}`);
    return [];
  }
}

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`• *Example:* ${usedPrefix + command} one piece`);

  await conn.sendMessage(m.chat, { react: { text: '🕓', key: m.key } });
  
  const animeList = await liveChart(text);

  if (animeList.length === 0) {
    return m.reply(`Anime "${text}" not found.`);
  }

  let slides = [];
  let i = 1;

  for (let anime of animeList.slice(0, 5)) {
    const { title, premiere, rating, poster, link } = anime;

    slides.push({
      body: proto.Message.InteractiveMessage.Body.fromObject({
        text: `*${title}*\n\n⏰ *Premiere*: ${premiere || 'Unknown'}\n⭐ *Rating*: ${rating || 'N/A'}`
      }),
      footer: proto.Message.InteractiveMessage.Footer.fromObject({
        text: 'LiveChart.me'
      }),
      header: proto.Message.InteractiveMessage.Header.fromObject({
        title: `Anime #${i++}`,
        hasMediaAttachment: true,
        imageMessage: await generateWAMessageContent({ image: { url: poster } }, { upload: conn.waUploadToServer })
          .then(({ imageMessage }) => imageMessage)
      }),
      nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
        buttons: [
          {
            name: "cta_url",
            buttonParamsJson: `{"display_text":"Details","url":"${link}","merchant_url":"${link}"}`
          }
        ]
      })
    });
  }

  const bot = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        interactiveMessage: proto.Message.InteractiveMessage.fromObject({
          carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
            cards: slides
          })
        })
      }
    }
  }, {});

  await conn.relayMessage(m.chat, bot.message, { messageId: bot.key.id });
  await conn.sendMessage(m.chat, { react: { text: null, key: m.key } });
};

handler.help = ["livechart"];
handler.tags = ["anime"];
handler.command = /^(livechart)$/i;
handler.limit = 1;
handler.register = true;

export default handler;