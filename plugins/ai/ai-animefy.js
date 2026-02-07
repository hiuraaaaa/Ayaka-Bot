import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import uploadImage from '../lib/uploadImage.js';

const style = "anime"; // Default style anime
const quality = "medium"; // Default quality medium

const drawever = {
  queue: async (imageUrl) => {
    try {
      const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const mimeType = imageResponse.headers['content-type'];
      const base64Image = Buffer.from(imageResponse.data).toString('base64');
      const base64ImageUrl = `data:${mimeType};base64,${base64Image}`;
      const data = JSON.stringify({
        image: base64ImageUrl,
        style: style,
        quality: quality,
        strength: 0.4,
      });
      const config = {
        method: 'POST',
        url: 'https://www.drawever.com/api/tools/queue',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Android 10; Mobile; rv:131.0 Firefox/131.0',
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'accept-language': 'id-ID',
          referer: 'https://www.drawever.com/ai/photo-to-anime?start=1736212737985',
          path: '/ai/photo-to-anime',
          origin: 'https://www.drawever.com',
          'alt-used': 'www.drawever.com',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          priority: 'u=0',
          te: 'trailers',
          Cookie: '_ga_H15YQYJC6R=GS1.1.1736212732.1.0.1736212732.0.0.0; _ga=GA1.1.1471909988.1736212732',
        },
        data: data,
      };
      const api = await axios.request(config);
      return api.data;
    } catch (error) {
      console.error("Error during image queue:", error.message);
      throw new Error("Terjadi kesalahan saat mengantre gambar.");
    }
  },

  create: async (imageUrl) => {
    try {
      const { queueId } = await drawever.queue(imageUrl);
      const checkStatus = async () => {
        const config = {
          method: 'GET',
          url: `https://www.drawever.com/api/tools/queue?queueId=${queueId}`,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0',
            'accept-language': 'id-ID',
            referer: 'https://www.drawever.com/ai/photo-to-anime?start=1736212737985',
            'content-type': 'application/json',
            'alt-used': 'www.drawever.com',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            priority: 'u=4',
            te: 'trailers',
            Cookie: '_ga_H15YQYJC6R=GS1.1.1736226490.2.1.1736226501.0.0.0; _ga=GA1.1.1471909988.1736212732; _ym_uid=1736782704433305783; _ym_d=1736782704; _ym_isad=2; _ym_visorc=w',
          },
        };
        const api = await axios.request(config);
        const output = api.data.output;
        if (output) {
          const base64Image = output.split(';base64,').pop();
          const imageBuffer = Buffer.from(base64Image, 'base64');
          const fileName = `${uuidv4()}.png`;
          const filePath = path.join(process.cwd(), 'tmp', fileName);
          fs.writeFileSync(filePath, imageBuffer);
          return filePath;
        } else {
          return new Promise((resolve) => setTimeout(() => resolve(checkStatus()), 1000));
        }
      };
      return checkStatus();
    } catch (error) {
      console.error("Error during image creation:", error.message);
      throw new Error("Terjadi kesalahan saat membuat gambar.");
    }
  },
};

let handler = async (m, { conn, usedPrefix, command, args }) => {
  try {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    if (!mime.startsWith('image/')) {
      return m.reply(`Kirim/Reply gambar nya`);
    }

    await conn.sendMessage(m.chat, { react: { text: '🎀', key: m.key } });

    let media = await q.download();
    let url = await uploadImage(media);
    let resultPath = await drawever.create(url);
    await conn.sendFile(m.chat, resultPath, path.basename(resultPath), 'Berhasil diubah menjadi gambar anime!', m);
    fs.unlinkSync(resultPath);
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
  } catch (e) {
    console.error("Error in handler:", e.message);
    m.reply('Terjadi kesalahan saat memproses gambar. Silakan coba lagi nanti.');
  }
};

handler.help = ['animefy'];
handler.tags = ['ai'];
handler.command = /^(animefy)$/i;
handler.register = true;
handler.limit = 10;

export default handler;