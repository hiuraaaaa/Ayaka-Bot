let handler = async (m, { conn, args, command }) => {
  try {
    const antara = new antaraNews();

    if (command === "antara") {
      const news = await antara.home();
      let message = "Antara News - Berita Terbaru\n\n";

      if (news.updated.length) {
        message += "Berita Terbaru:\n";
        news.updated.slice(0, 5).forEach((item, i) => {
          message += `${i + 1}. ${item.title}\n`;
          message += `Tanggal: ${item.uploaded}\n`;
          message += `Link: ${item.url}\n\n`;
        });
      }

      await conn.sendMessage(m.chat, { text: message });
    } else if (command === "antarasearch") {
      if (!args.length) return m.reply("Masukkan kata kunci pencarian.");
      const results = await antara.search(args.join(" "));
      if (!results.length) return m.reply("Tidak ada hasil yang ditemukan.");

      let message = "Hasil Pencarian Antara News:\n\n";
      results.slice(0, 5).forEach((item, i) => {
        message += `${i + 1}. ${item.title}\n`;
        message += `Tanggal: ${item.uploaded}\n`;
        message += `Link: ${item.url}\n\n`;
      });

      await conn.sendMessage(m.chat, { text: message });
    } else if (command === "antaradetail") {
      if (!args.length) return m.reply("Masukkan URL berita Antara.");
      const detail = await antara.detail(args[0]);
      if (!detail.title) return m.reply("Gagal mengambil detail berita.");

      let message = "Detail Berita\n\n";
      message += `Judul: ${detail.title}\n`;
      message += `Tanggal: ${detail.date}\n`;
      message += `Durasi Baca: ${detail.readDuration}\n\n`;
      message += `${detail.content.slice(0, 1000)}...\n\n`;
      message += `Baca selengkapnya: ${args[0]}`;

      await conn.sendMessage(m.chat, { text: message });
    }
  } catch (error) {
    console.error(error);
    m.reply("Terjadi kesalahan saat mengambil data.");
  }
};

handler.help = ["antara", "antarasearch <query>", "antaradetail <url>"];
handler.tags = ["internet"];
handler.command = /^(antara|antarasearch|antaradetail)$/i;

export default handler;

import axios from 'axios';
import * as cheerio from 'cheerio';

class antaraNews {
  constructor() {
    this.BASE_URL = "https://www.antaranews.com";
  }

  async request(url) {
    let { data } = await axios.get(url, {
      headers: {
        referer: "https://www.google.com/",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
      },
    });
    return cheerio.load(data);
  }

  async home() {
    const $ = await this.request(this.BASE_URL);
    let result = { updated: [], popular: [] };

    $(".popular__section-news .col-md-6").each((i, e) => {
      let title = $(e).find(".card__post__title").text().trim();
      let uploaded = $(e).find(".list-inline-item").text().trim();
      let url = $(e).find(".card__post__title a").attr("href");
      let img = $(e).find("img").attr("data-src");
      result.updated.push({ title, uploaded, url, img });
    });

    $(".wrapper__list__article .mb-3").each((i, e) => {
      let title = $(e).find(".card__post__title").text().trim();
      let uploaded = $(e).find(".list-inline-item").text().trim();
      let url = $(e).find(".card__post__title a").attr("href");
      let img = $(e).find("img").attr("data-src");
      result.popular.push({ title, uploaded, url, img });
    });

    return result;
  }

  async search(q, page = 1) {
    const $ = await this.request(`${this.BASE_URL}/search?q=${q}&page=${page}`);
    let result = [];
    $(".wrapper__list__article .card__post").each((i, e) => {
      let title = $(e).find("h2.h5").text().trim();
      let uploaded = $(e).find(".list-inline-item").text().trim();
      let url = $(e).find("h2.h5 a").attr("href");
      let img = $(e).find("img").attr("data-src");
      let description = $(e).find("p").text().trim();
      result.push({ title, uploaded, url, img, description });
    });
    return result;
  }

  async detail(url) {
    const $ = await this.request(url);
    let title = $(".wrap__article-detail-title").text().trim();
    let img = $("img.img-fluid").attr("src");
    let date = $(".wrap__article-detail-info .list-inline-item").first().text().trim();
    let readDuration = $(".wrap__article-detail-info .list-inline-item").eq(1).text().trim();
    let tags = [];
    $(".blog-tags a").each((i, e) => {
      tags.push({ tag: $(e).text().trim(), url: $(e).attr("href") });
    });

    let content = "";
    let para = $(".wrap__article-detail-content");
    para.find("span, p.text-muted, script, br, ins").remove();
    $(para).find("p").each((i, e) => {
      content += $(e).text().trim() + "\n";
    });

    return { title, img, date, readDuration, tags, content };
  }
}