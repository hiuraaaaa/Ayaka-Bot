import axios from 'axios';
import * as cheerio from 'cheerio';

async function ttImage(url) {
  try {
  let response = await axios('https://ttsave.app/download', {
        method: 'POST',
        data: {
          query: url,
          langage_id: "2"
          },
        headers: {
          "cookie": "_ga=GA1.1.2134200012.1719399150; _ga_1CPHGEZ2VQ=GS1.1.1719399149.1.1.1719400570.0.0.0; XSRF-TOKEN=eyJpdiI6IkpJRkVNUW5zOEV0LzlUYzdVSnR1eWc9PSIsInZhbHVlIjoiUnFld2oyV0x1Q3BoL1hZN2JTa3I5Ni9Xb1JSWG91bGxkaW9KRndKV2RkdWR5Q2dzMmZaQXdZM0kyVm9RKzUxbkVqSnUzRjhCeTl3NjE3dDRWMWc2RGlGL2loSmtuQnFWb0hvRGZiOUQ2VklSelQrVEJaTDJPOGtoR3NncmdFK2giLCJtYWMiOiI4YmJjMWViN2JmZDIwYWQyYWI5YWJlOTg5NjExOGY2MzE3MDM5OWE2OWMzMzZiYzM3YzAwZDA2ZWViMTI2OTk5IiwidGFnIjoiIn0%3D; ttsaveapp_session=eyJpdiI6IlkyazlpNXhtRkMwbmNCYWQ2dCs5MWc9PSIsInZhbHVlIjoiSUJ1NlZoQ1NxenBGUDd0S3M5R053Q2lBOWRGQTM5VGxWL3ZTNW56OU9oQkJ5bThxMXltTkRRWTlzNnI1b2hQMW92SDYvTzhpV3lkS0Q5VjhuTURxYVJiejR1WTd1cE5Qd0FOVEN6d1B2QzRtdktIME1CY2lYaVhCQVhGZ3IvRmUiLCJtYWMiOiJkNmQzMzgyNDc1NTYzZjliOThlOTUzZmUyYTdkYjE0MTVjNDc2MTQyYmU3OTg2OTg1ZTM3MGRiOTUwMGFlMzQ2IiwidGFnIjoiIn0%3D",
          "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36"
           }
        })
       // console.log(response.data)
   let html = response.data
   let $ = await cheerio.load(html)
   let foto = []
   let img = $('img').slice(1).each((index, element) => {
        let links = $(element).attr('src')
        foto.push({links})
        })
       let result = {
          status: true,
          creator: 'Lann4you',
          image: foto
         }
         console.log(result)
         return result
    } catch(error) {
     return error
     console.error(error)
    }
  return;
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let handler = async (m, { text, conn, usedPrefix, command }) => {
  try {
    if (!text) return m.reply(`Urlnya mana?\n*Contoh:* ${usedPrefix + command} https://vt.tiktok.com/xxxx`);

    conn.sendMessage(m.chat, { react: { text: "☘️", key: m.key }});

    let { image, error } = await ttImage(text);
    if (image && Array.isArray(image)) {
      for (let img of image) {
        await delay(3000);
        conn.sendFile(m.chat, img.links, '', `\`Image Result\``, m);
      }
    } else {
      m.reply(error);
    }
  } catch (error) {
    console.error(error);
    return m.reply('Terjadi kesalahan saat memproses permintaan Anda.');
  }
};
handler.tags = ['downloader']
handler.help = ['ttimg <url>','tiktokimg <url>']
handler.command = /^(ttimg|tiktokimg)$/i;
handler.limit = true

export default handler;