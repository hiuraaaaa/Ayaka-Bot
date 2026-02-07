import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';

const execPromise = promisify(exec);

const handler = async (m, { conn, text }) => {
  if (!/www.bilibili.com|bili.im/.test(text)) throw '⚠️ Masukkan link Bstation!';

  const a = await bstation(text, '720');
  const meta = a.result.metadata;

  let cap = `☂︎ Bstation Downloader
📙 *Title:* ${meta.title || ''}
🗾 *Locate:* ${meta.locate || ''}
♥️ *Like:* ${meta.like || ''}
👁️ *View:* ${meta.view || ''}
📝 *Description:* ${meta.description || ''}
🔗 *Link:* ${meta.url || ''}`;

  await conn.sendMessage(m.chat, {
    image: { url: meta.thumbnail },
    caption: cap
  }, { quoted: m });

  await conn.sendMessage(m.chat, { text: '⏳ Tunggu sebentar, sedang mendownload video...' }, { quoted: m });

  const { data } = await axios.get(a.result.download.url, { responseType: 'arraybuffer' });
  const convert = await converter(data, 'webp', 'mp4');

  await conn.sendMessage(m.chat, {
    video: convert,
    caption: `📙 *Title:* ${meta.title || ''}
🗾 *Locate:* ${meta.locate || ''}
🔗 *Link:* ${meta.url || ''}`
  }, { quoted: m });
};

handler.help = ['bstation', 'bilibili'].map(v => v + ' *[Link]*');
handler.tags = ['tools','anime'];
handler.command = ['bstation', 'bilibili'];
export default handler;

async function bstation(url, quality) {
  const scrapedData = {
    status: 500,
    content: false,
    result: {
      metadata: {},
      download: {}
    }
  };

  try {
    const format = ["max", "4320", "2160", "1440", "1080", "720", "480", "360", "240", "144", "320", "256", "128", "96", "64", "8"];
    if (!format.includes(quality)) throw `⚠️ Masukkan kualitas yang benar. Contoh: ${format.join(', ')}`;

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const $ = cheerio.load(response.data);
    const finalurl = response.request.res.responseUrl || url;

    scrapedData.status = 200;
    scrapedData.content = true;
    scrapedData.result.metadata = {
      title: $('title').text().trim(),
      locate: $('meta[property="og:locale"]').attr('content') || null,
      description: $('meta[name="description"]').attr('content') || null,
      thumbnail: $('meta[property="og:image"]').attr('content') || null,
      like: $('.interactive__btn.interactive__like .interactive__text').text() || null,
      view: $('.bstar-meta__tips-left .bstar-meta-text').first().text() || null,
      url: finalurl
    };

    const download = await axios.post('https://c.blahaj.ca/', {
      url: finalurl,
      videoQuality: quality,
      downloadMode: 'auto'
    }, {
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      }
    }).then(res => res.data);

    scrapedData.result.download = download;
    return scrapedData;

  } catch (e) {
    scrapedData.result.metadata = { error: e.message };
    scrapedData.result.download = { error: e.message };
    return scrapedData;
  }
}

async function converter(inputBuffer, inputFormat, outputFormat) {
  const tmpDir = '/tmp';
  const uniqueId = Date.now();
  const inputFilePath = path.join(tmpDir, `temp-${uniqueId}-input.${inputFormat}`);
  const outputFilePath = path.join(tmpDir, `temp-${uniqueId}-output.${outputFormat}`);

  try {
    await fs.promises.writeFile(inputFilePath, inputBuffer);
    console.log(`Input file saved to: ${inputFilePath}`);

    const command = `ffmpeg -y -i "${inputFilePath}" -c:v libx264 -preset fast -c:a aac -strict -2 "${outputFilePath}"`;
    console.log(`Executing FFmpeg command: ${command}`);

    const { stdout, stderr } = await execPromise(command);
    console.log('FFmpeg stdout:', stdout);
    console.log('FFmpeg stderr:', stderr);

    if (!fs.existsSync(outputFilePath)) {
      throw new Error(`FFmpeg failed: output file not found.\n${stderr}`);
    }

    const outputBuffer = await fs.promises.readFile(outputFilePath);
    console.log('Conversion successful.');
    return outputBuffer;

  } catch (error) {
    console.error('Error during conversion:', error.message);
    throw error;
  } finally {
    try {
      if (fs.existsSync(inputFilePath)) await fs.promises.unlink(inputFilePath);
      if (fs.existsSync(outputFilePath)) await fs.promises.unlink(outputFilePath);
    } catch (cleanupErr) {
      console.error('Cleanup error:', cleanupErr.message);
    }
  }
}