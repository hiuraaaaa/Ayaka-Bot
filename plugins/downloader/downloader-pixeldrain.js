import fs from 'fs';
import fetch from 'node-fetch';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function resolveRedirectUrl(urltiputipu) {
  try {
    const response = await axios.get(urltiputipu, { maxRedirects: 10 });
    return response.request.res.responseUrl;
  } catch (error) {
    throw `Gagal memproses URL redirect: ${error.message || error}`;
  }
}

let handler = async (m, { conn, args }) => {
  if (!args[0]) throw 'Linknya mana?\nContoh Format: .pixeldrain https://pixeldrain.com/u/xxxxx';

  try {
    await conn.sendMessage(m.chat, { react: { text: '🕑', key: m.key } });

    const resolvedUrl = await resolveRedirectUrl(args[0]);

    let fileId = resolvedUrl.split('/u/')[1];
    if (!fileId) throw 'URL tidak valid atau bukan dari PixelDrain. Pastikan formatnya benar.';

    let apiUrl = `https://pixeldrain.com/api/file/${fileId}/info`;
    let infoResponse = await fetch(apiUrl);

    if (!infoResponse.ok) throw `Terjadi kesalahan saat mengambil informasi file. Status: ${infoResponse.status}`;
    let fileInfo = await infoResponse.json();

    const { name: fileName, size } = fileInfo;
    let downloadDate = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
    let caption = `📂 *Judul:* ${fileName}\n📅 *Tanggal Unduh:* ${downloadDate}\n📦 *Ukuran:* ${(size / (1024 * 1024)).toFixed(2)} MB`;

    let fileUrl = `https://pixeldrain.com/api/file/${fileId}`;
    let response = await fetch(fileUrl);

    if (response.ok) {
      let videoStream = response.body;
      if (!videoStream) throw 'Tidak dapat menemukan stream video.';

      const tmpFolderPath = path.join(__dirname, '../tmp');
      if (!fs.existsSync(tmpFolderPath)) {
        fs.mkdirSync(tmpFolderPath);
      }

      let tempFilePath = path.join(tmpFolderPath, `${fileName}.mp4`);

      const writeStream = fs.createWriteStream(tempFilePath);
      videoStream.pipe(writeStream);

      writeStream.on('finish', async () => {
        await conn.sendMessage(m.chat, {
          document: { url: tempFilePath },
          mimetype: 'video/mp4',
          fileName: fileName.endsWith('.mp4') ? fileName : `${fileName}.mp4`,
          caption: caption,
        }, { quoted: m });

        fs.unlink(tempFilePath, (err) => {
          if (err) {
            console.error('Gagal menghapus file sementara:', err);
          }
        });
      });
    } else {
      throw `Terjadi kesalahan saat menghubungi API. Status: ${response.status}`;
    }

    await conn.sendMessage(m.chat, { react: { text: '', key: m.key } });
  } catch (error) {
    await conn.sendMessage(m.chat, { react: { text: '', key: m.key } });
    throw `Terjadi kesalahan saat memproses permintaan:\n${error.message || error}`;
  }
};

handler.help = ['pixeldrain'];
handler.tags = ['downloader'];
handler.command = /^pixeldrain$/i;
handler.register = true;
handler.limit = true;

export default handler;