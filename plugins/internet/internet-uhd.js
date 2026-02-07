import axios from 'axios';
import cheerio from 'cheerio';
const { generateWAMessageContent, generateWAMessageFromContent } = (await import('@adiwajshing/baileys')).default;

const handler = async (m, { conn, text }) => {
    if (!text) return conn.reply(m.chat, 'Masukan teksnya\n.uhd sasuke', m);

    try {
        const response = await axios.get(`https://www.uhdpaper.com/search?q=${encodeURIComponent(text)}&by-date=true`);
        const html = response.data;
        const $ = cheerio.load(html);
        const results = [];

        $('article.post-outer-container').slice(0, 5).each((index, element) => {
            const title = $(element).find('.snippet-title h2').text().trim();
            const imageUrl = $(element).find('.snippet-title img').attr('src');
            const resolution = $(element).find('.wp_box b').text().trim();
            const link = $(element).find('a').attr('href');
            results.push({
                title: title || `Gambar ${index + 1}`,
                imageUrl: imageUrl.startsWith('http') ? imageUrl : `https://www.uhdpaper.com${imageUrl}`,
                resolution: resolution || 'Tidak Diketahui',
                link: link.startsWith('http') ? link : `https://www.uhdpaper.com${link}`,
            });
        });

        if (results.length === 0) return conn.reply(m.chat, 'Tidak ada hasil yang ditemukan.', m);

        async function image(url) {
            const { imageMessage } = await generateWAMessageContent({
                image: { url },
            }, { upload: conn.waUploadToServer });
            return imageMessage;
        }

        const cards = await Promise.all(results.map(async (result) => ({
            header: {
                imageMessage: await image(result.imageUrl),
                hasMediaAttachment: true,
            },
            body: {
                text: `Judul: ${result.title}\nResolusi: ${result.resolution}`,
            },
            nativeFlowMessage: {
                buttons: [
                    {
                        "name": "cta_url",
                        "buttonParamsJson": `{"display_text":"Lihat Gambar","url":"${result.link}","merchant_url":"${result.link}"}`
                    },
                ],
            },
        })));

        const msg = generateWAMessageFromContent(
            m.chat,
            {
                viewOnceMessage: {
                    message: {
                        interactiveMessage: {
                            body: {
                                text: `Hasil pencarian untuk "${text}"`,
                            },
                            carouselMessage: {
                                cards,
                                messageVersion: 1,
                            },
                        },
                    },
                },
            },
            {}
        );

        await conn.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });
    } catch (error) {
        console.error('Error scraping UHDPaper:', error);
        conn.reply(m.chat, 'Terjadi kesalahan saat mencari gambar.', m);
    }
};

handler.help = ["uhd"];
handler.tags = ["internet"];
handler.command = /^(uhd|ultrahd)$/i;
handler.limit = true;
handler.register = true;

export default handler;