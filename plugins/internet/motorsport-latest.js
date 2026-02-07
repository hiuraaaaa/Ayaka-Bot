import axios from "axios";
import * as cheerio from "cheerio";

let Lann4youofc = async (m, { conn }) => {
  const url = "https://id.motorsport.com/motogp/news/";

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    let news = [];
    $("a.ms-item").each((i, elem) => {
      let title =
        $(elem).find(".ms-item__title").text().trim() || $(elem).attr("title");
      let link = $(elem).attr("href");
      let image = $(elem).find("img.ms-item__img").attr("src");
      let time = $(elem).find("time.ms-item__date").text().trim();

      // Pastikan semua data yang diperlukan tersedia
      if (title && link) {
        news.push({
          title,
          link: link.startsWith("http")
            ? link
            : `https://id.motorsport.com${link}`,
          image: image?.startsWith("http")
            ? image
            : `https://id.motorsport.com${image}`, // Menambahkan domain jika perlu
          time,
        });
      }
    });

    // Format pesan
    let res = news
      .map(
        (n, i) => `📌 *${n.title}*\n🔗 ${n.link}\n🕒 ${n.time}\n🖼️ ${n.image}\n`
      )
      .join("\n");

    m.reply(res || "Tidak ada berita terbaru.", null, { quoted: m });
  } catch (error) {
    console.error("Error:", error);
    m.reply("Terjadi kesalahan saat mengambil berita.");
  }
};

Lann4youofc.command = Lann4youofc.help = ["motorsport-latest"];
Lann4youofc.tags = ["internet"];

export default Lann4youofc;