import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
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

const downloadFile = async (fileUrl, outputFilename) => {
  const outputPath = path.resolve('./', outputFilename);

  try {
    const response = await axios({
      url: fileUrl,
      method: 'GET',
      responseType: 'stream',
    });

    const writer = fs.createWriteStream(outputPath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(outputPath));
      writer.on('error', reject);
    });
  } catch (error) {
    throw new Error('Gagal mengunduh file: ' + error.message);
  }
};

let handler = async (m, { conn, args, command }) => {
  try {
    if (!args[0]) {
      const helpMessage = `
Gunakan salah satu perintah berikut:
- *${command} ongoing* untuk daftar anime yang sedang tayang.
- *${command} search <judul>* untuk mencari anime berdasarkan judul.
- *${command} detail <url>* untuk melihat detail anime.
- *${command} link <url>* untuk mendapatkan link download
- *${command} download <url>* untuk mengunduh episode anime.

Tips cara pakai ⬇️⬇️
‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎
1. *pakai fitur otakudesu search*
- contoh: !otakudesu search Unnamed memory

2. *pakai fitur otakudesu detail yang didapat dari search*
- contoh: !otakudesu detail https://otakudesu.cloud/anime/unnamed-memo-sub-indo/

3. *pakai fitur otakudesu link yang didapat dari detail*
- contoh: !otakudesu link https://otakudesu.cloud/episode/unmdmry-episode-12-sub-indo/

4. *pakai fitur otakudesu download yang didapat dari link*
- contoh: !otakudesu download https://desustream.com/safelink/link/?id=eXRoOHNYVG9UdnVZK3l6V3czeHJDN0tDTHJhUmdKNnBqbmRGYjdIRm14MGs=
      `;
      await conn.sendMessage(m.chat, { text: helpMessage }, { quoted: floc });
      return;
    }

    const otakudesu = {
      ongoing: async () => {
        const { data } = await axios.get('https://otakudesu.cloud/');
        const $ = cheerio.load(data);
        const results = [];

        $('.venz ul li').each((index, element) => {
          const episode = $(element).find('.epz').text().trim();
          const type = $(element).find('.epztipe').text().trim();
          const date = $(element).find('.newnime').text().trim();
          const title = $(element).find('.jdlflm').text().trim();
          const link = $(element).find('a').attr('href');
          const image = $(element).find('img').attr('src');

          if (title && link) { // Validasi data
            results.push({ episode, type, date, title, link, image });
          }
        });

        if (!results.length) {
          throw 'Tidak ada anime ongoing yang ditemukan.';
        }

        return results;
      },
      search: async (query) => {
        const url = `https://otakudesu.cloud/?s=${query}&post_type=anime`;
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const animeList = [];

        $('.chivsrc li').each((index, element) => {
          const title = $(element).find('h2 a').text().trim();
          const link = $(element).find('h2 a').attr('href');
          const imageUrl = $(element).find('img').attr('src');
          const genres = $(element).find('.set').first().text().replace('Genres : ', '').trim();
          const status = $(element).find('.set').eq(1).text().replace('Status : ', '').trim();
          const rating = $(element).find('.set').eq(2).text().replace('Rating : ', '').trim() || 'N/A';

          if (title && link) { // Validasi data
            animeList.push({ title, link, imageUrl, genres, status, rating });
          }
        });

        if (!animeList.length) {
          throw 'Anime tidak ditemukan. Coba gunakan kata kunci lain.';
        }

        return animeList;
      },
      detail: async (url) => {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const animeInfo = {
          title: $('.fotoanime .infozingle p span b:contains("Judul")').parent().text().replace('Judul: ', '').trim(),
          japaneseTitle: $('.fotoanime .infozingle p span b:contains("Japanese")').parent().text().replace('Japanese: ', '').trim(),
          score: $('.fotoanime .infozingle p span b:contains("Skor")').parent().text().replace('Skor: ', '').trim(),
          producer: $('.fotoanime .infozingle p span b:contains("Produser")').parent().text().replace('Produser: ', '').trim(),
          type: $('.fotoanime .infozingle p span b:contains("Tipe")').parent().text().replace('Tipe: ', '').trim(),
          status: $('.fotoanime .infozingle p span b:contains("Status")').parent().text().replace('Status: ', '').trim(),
          totalEpisodes: $('.fotoanime .infozingle p span b:contains("Total Episode")').parent().text().replace('Total Episode: ', '').trim(),
          duration: $('.fotoanime .infozingle p span b:contains("Durasi")').parent().text().replace('Durasi: ', '').trim(),
          releaseDate: $('.fotoanime .infozingle p span b:contains("Tanggal Rilis")').parent().text().replace('Tanggal Rilis: ', '').trim(),
          studio: $('.fotoanime .infozingle p span b:contains("Studio")').parent().text().replace('Studio: ', '').trim(),
          genres: $('.fotoanime .infozingle p span b:contains("Genre")').parent().text().replace('Genre: ', '').trim(),
          imageUrl: $('.fotoanime img').attr('src'),
        };

        const episodes = [];
        $('.episodelist ul li').each((index, element) => {
          const episodeTitle = $(element).find('span a').text();
          const episodeLink = $(element).find('span a').attr('href');
          const episodeDate = $(element).find('.zeebr').text();

          if (episodeTitle && episodeLink) {
            episodes.push({ title: episodeTitle, link: episodeLink, date: episodeDate });
          }
        });

        if (!animeInfo.title || !episodes.length) {
          throw 'Data detail anime tidak ditemukan.';
        }

        return { animeInfo, episodes };
      },
      link: async (url) => {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const episodeInfo = {
          title: $('.download h4').text().trim(),
          downloads: [],
        };

        $('.download ul li').each((index, element) => {
          const quality = $(element).find('strong').text().trim();
          const links = $(element).find('a').map((i, el) => {
            const link = $(el).attr('href');
            const host = $(el).text().trim();

            // Hanya ambil link yang host-nya 'PDrain'
            if (link && host === 'PDrain') {
              return { quality, link, host };
            }
          }).get();

          if (links.length) {
            episodeInfo.downloads.push(...links);
          }
        });

        if (!episodeInfo.downloads.length) {
          throw 'Link download PDrain tidak ditemukan.';
        }

        return episodeInfo;
      },
    };

    const type = args[0].toLowerCase();

    switch (type) {
      case 'ongoing':
        const ongoingList = await otakudesu.ongoing();
        let ongoingResult = ongoingList.map((anime, index) => `${index + 1}. *${anime.title}*\n  • Episode: ${anime.episode}\n  • Tipe: ${anime.type}\n  • Tanggal: ${anime.date}\n  • [Link](${anime.link})`).join('\n\n');
        await conn.sendMessage(m.chat, { text: ongoingResult }, { quoted: floc });
        break;

      case 'search':
        if (!args[1]) throw 'Masukkan judul anime yang ingin dicari.';
        const searchResult = await otakudesu.search(args.slice(1).join(' '));
        let searchList = searchResult.map((anime, index) => `${index + 1}. *${anime.title}*\n  • Genre: ${anime.genres}\n  • Status: ${anime.status}\n  • Rating: ${anime.rating}\n  • [Link](${anime.link})\n\nlangkah berikutnya\n!otakudesu detail <link di atas>`).join('\n\n');
        await conn.sendMessage(m.chat, { text: searchList }, { quoted: floc });
        break;

      case 'detail':
        if (!args[1]) throw 'Masukkan URL detail anime.';
        const detailResult = await otakudesu.detail(args[1]);
        let detailText = `*${detailResult.animeInfo.title}*\n\n` +
          `• Skor: ${detailResult.animeInfo.score}\n` +
          `• Produser: ${detailResult.animeInfo.producer}\n` +
          `• Tipe: ${detailResult.animeInfo.type}\n` +
          `• Status: ${detailResult.animeInfo.status}\n` +
          `• Total Episode: ${detailResult.animeInfo.totalEpisodes}\n` +
          `• Durasi: ${detailResult.animeInfo.duration}\n` +
          `• Tanggal Rilis: ${detailResult.animeInfo.releaseDate}\n` +
          `• Studio: ${detailResult.animeInfo.studio}\n` +
          `• Genre: ${detailResult.animeInfo.genres}\n\n` +
          `‼️langkah berikutnya\n!otakudesu link <link ambil salah satu link dibawah ini>\n\n` +
          `*Episodes:*\n${detailResult.episodes.map((ep) => `- ${ep.title} [Link](${ep.link})`).join('\n')}`;
        await conn.sendMessage(m.chat, { text: detailText }, { quoted: floc });
        break;

      case 'link':
        if (!args[1]) throw 'Masukkan URL episode untuk dilihat link downloadnya.';
        const downloadResult = await otakudesu.link(args[1]);

        // Filter hanya link dari PDrain
        let pDrainLink = downloadResult.downloads.map((dl) =>
          `• ${dl.quality} - ${dl.host}: [Link Download](${dl.link})`
        ).join('\n');

        if (!pDrainLink) {
          await conn.sendMessage(m.chat, { text: 'Tidak ada link PDrain yang ditemukan untuk diunduh.' }, { quoted: floc });
          return;
        }

        await conn.sendMessage(m.chat, { text: `*${downloadResult.title}*\n\n${pDrainLink}\n\nlangkah berikutnya\n!otakudesu download <link pilih link di atas>` }, { quoted: floc });
        break;
      case 'download':
        if (!args[1]) throw 'URL mana yang ingin didownload?';

        // Add reaction emoji here
        await conn.sendMessage(m.chat, { react: { text: '🕑', key: m.key } });

        const url = args[1];
        const resolvedUrl = await resolveRedirectUrl(url);

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
            // Remove the reaction emoji after download starts
            await conn.sendMessage(m.chat, { react: { text: '🕑', key: m.key, remove: true } });

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
        break;

      default:
        const errorMessage = `Gunakan salah satu dari:\n\n- *${command} ongoing*\n- *${command} search <judul>*\n- *${command} detail <url>*\n- *${command} link <url>*\n- *${command} download <url>*`;
        throw new Error(errorMessage);
    }
  } catch (error) {
    console.error(error);
    await conn.sendMessage(m.chat, { text: `${error.message || error}` }, { quoted: floc });
  }
};

handler.command = /^(otaku(desu)?)$/i;
handler.help = ['otakudesu <type>'];
handler.tags = ['anime'];
handler.limit = true;
handler.register = true;

export default handler;