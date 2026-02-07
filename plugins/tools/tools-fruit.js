import axios from "axios";
import * as cheerio from "cheerio";

const sxyz_base_url = {
  sxyz_stock_page: "https://fruityblox.com/stock",
};

const sxyzScraper = {
  sxyzAmbilStock: async () => {
    const { data: sxyz_data_html } = await axios.get(sxyz_base_url.sxyz_stock_page, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
      }
    });
    const sxyz_dom = cheerio.load(sxyz_data_html);
    const sxyz_hasil = [];

    sxyz_dom("div.p-4.border").each((_, sxyz_el) => {
      const sxyz_nama = sxyz_dom(sxyz_el).find("h3").text().trim();
      const sxyz_tipe = sxyz_dom(sxyz_el).find("span.text-xs").text().trim();
      const sxyz_harga = sxyz_dom(sxyz_el).find("span.text-sm").first().text().trim();
      const sxyz_robux = sxyz_dom(sxyz_el).find("span.text-sm").last().text().trim();
      const sxyz_gambar = sxyz_dom(sxyz_el).find("img").attr("src");

      sxyz_hasil.push({
        sxyz_nama,
        sxyz_tipe,
        sxyz_harga,
        sxyz_robux,
        sxyz_gambar,
        sxyz_pembuat: "Sxyz",
      });
    });

    return sxyz_hasil;
  },
};

const handler = async (m, { conn }) => {
  await m.reply("⏳ Mengambil data stock...");

  const sxyz_list_stock = await sxyzScraper.sxyzAmbilStock();
  if (!sxyz_list_stock.length) return m.reply("Stock tidak ditemukan!");

  let teks = "*===== STOCK FRUITYBLOX =====*\n\n";
  for (let i = 0; i < Math.min(5, sxyz_list_stock.length); i++) {
    const item = sxyz_list_stock[i];
    teks += `*${item.sxyz_nama}*\n` +
            `Tipe: ${item.sxyz_tipe}\n` +
            `Harga: ${item.sxyz_harga}\n` +
            `Robux: ${item.sxyz_robux}\n` +
            `Gambar: ${item.sxyz_gambar}\n\n`;
  }

  m.reply(teks.trim());
};

handler.command = /^fruitstock$/i;
handler.tags = ["tools"];
handler.help = ["fruitstock"];

export default handler;