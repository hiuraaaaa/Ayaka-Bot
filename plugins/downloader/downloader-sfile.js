import axios from 'axios';
import * as cheerio from 'cheerio';

const downloadFile = async (url) => {
  const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36 Edg/117.0.2045.47",
    Referer: url,
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
    "Cache-Control": "max-age=0",
  };

  const { data: info, headers: responseHeaders } = await axios.get(url, { headers }).catch((e) => e.response);
  if (!info) throw new Error('Failed to retrieve page content');

  const cookies = responseHeaders["set-cookie"]?.map((cookie) => cookie.split(";")[0]).join("; ") || "";
  headers.Cookie = cookies;

  let $ = cheerio.load(info);
  let result = { metadata: {}, download: {} };

  $(".file-content").eq(0).each((a, i) => {
    result.metadata.filename = $(i).find("img").attr("alt");
    result.metadata.mimetype = $(i).find(".list").eq(0).text().trim().split("-")[1].trim();
    result.metadata.uploaded = $(i).find(".list").eq(2).text().trim().split(":")[1].trim();
    result.metadata.download = $(i).find(".list").eq(3).text().trim().split(":")[1].trim();
    result.metadata.author = $(i).find(".list").eq(1).find("a").text().trim();
  });

  let downloadUrl = $("#download").attr("href");
  headers.Referer = downloadUrl;

  let { data: process } = await axios.get(downloadUrl, { headers }).catch((e) => e.response);
  if (!process) throw new Error('Failed to process download request');

  $ = cheerio.load(process);
  let key = $("#download").attr("onclick");

  let { data: buffer } = await axios.get(
    $("#download").attr("href") + "&k=" + key.split("'+'")[1].split("';")[0],
    { headers, responseType: "arraybuffer" },
  );

  result.download = buffer;
  return result;
};

const sfileSearch = async (query) => {
  const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36 Edg/117.0.2045.47",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
    "Cache-Control": "max-age=0",
  };

  const { data } = await axios.get(`https://sfile.mobi/search.php?q=${query}`, { headers }).catch((e) => e.response);
  if (!data) throw new Error('Failed to retrieve search results');

  let $ = cheerio.load(data);
  let result = [];
  $('div.list').each(function () {
    let title = $(this).find('a').text();
    let size = $(this).text().trim().split('(')[1];
    let link = $(this).find('a').attr('href');
    if (link) result.push({ title, size: size.replace(')', ''), link });
  });
  return result;
};

const handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    return m.reply(`*URL atau query tidak ditemukan*\n\nHarap masukkan URL dari sfile.mobi atau query pencarian\nContoh:\n${usedPrefix + command} https://sfile.mobi/87GP8jpuRar\nAtau\n${usedPrefix + command} scbot`);
  }

  if (/https:\/\/sfile.mobi\//i.test(args[0])) {
    try {
      m.reply('*Memproses permintaan, harap tunggu sebentar...*');
      const result = await downloadFile(args[0]);

      const fileName = `${result.metadata.filename}`;
      let caption = `===== SFILE DOWNLOADER =====\n\n`;
      caption += `File Name: ${fileName}\n`;
      caption += `Size: ${result.metadata.size || 'Tidak Diketahui'}\n`;
      caption += `Type: ${result.metadata.mimetype || 'Tidak Diketahui'}\n`;
      caption += `Author: ${result.metadata.author || 'Tidak Diketahui'}\n`;
      caption += `Uploaded: ${result.metadata.uploaded || 'Tidak Diketahui'}\n`;
      caption += `Downloaded: ${result.metadata.download || '0'} kali`;

      await conn.sendMessage(m.chat, {
        document: result.download,
        fileName,
        mimetype: result.metadata.mimetype || 'application/octet-stream',
        caption
      }, { quoted: flok });

    } catch (e) {
      m.reply(`Terjadi kesalahan saat mengambil data:\n${e.message}`);
    }
  } else {
    let query = args.join(' ');
    try {
      let res = await sfileSearch(query);
      if (!res.length) throw `Query "${query}" tidak ditemukan :/`;

      let fileList = res.map((v, index) => `*${index + 1}.* ${v.title}\n*Size:* ${v.size}\n*Link:* ${v.link}`).join('\n\n');
      m.reply(`Found the following results:\n\n${fileList}\n\n_Tekan link untuk mengunduh file yang diinginkan._`);
    } catch (e) {
      m.reply(`Terjadi kesalahan saat mencari:\n${e.message}`);
    }
  }
};

handler.help = ['sfile'].map(v => v + ' <url/query>');
handler.tags = ['downloader'];
handler.command = /^sfile$/i;
handler.register = true;
handler.limit = true;

export default handler;