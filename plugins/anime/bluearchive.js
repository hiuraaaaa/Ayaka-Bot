import axios from 'axios';
import * as cheerio from 'cheerio';

const handler = async (m, { text, command }) => {
  try {
    if (command === "bluearchive") {
      if (!text || typeof text !== "string") {
        return m.reply("Masukkan nama karakter Blue Archive! Contoh: .bluearchive Midori");
      }

      const wiki = new BlueArchiveWiki();
      const result = await wiki.characters(text).catch(err => err);

      if (!result.metadata) {
        return m.reply(`😹 ${result.msg || "Karakter tidak ditemukan."}`);
      }

      let response = `🎮 *Blue Archive Wiki: ${result.metadata.full_name}*\n\n`;
      for (let key in result.metadata) {
        if (key !== 'cards' && key !== 'stats' && key !== 'background') {
          response += `*${key.replace(/_/g, ' ')}:* ${result.metadata[key]}\n`;
        }
      }
      if (result.metadata.background) response += `\n*Background:* ${result.metadata.background}\n`;
      if (result.metadata.cards.length) {
        response += `\n*Cards:*\n`;
        result.metadata.cards.forEach(card => {
          response += `- ${card.name} (${card.role}, Ranks: ${card.ranks})\n  Image: ${card.image}\n  [Link](${card.url})\n\n`;
        });
      }
      if (result.metadata.stats) {
        response += `*Stats:*\n`;
        for (let stat in result.metadata.stats) {
          response += `- ${stat.replace(/_/g, ' ')}: ${result.metadata.stats[stat]}\n`;
        }
      }
      if (result.voices.length) {
        response += `\n*Voice Lines:*\n`;
        result.voices.forEach(v => {
          response += `- ${v.title} (${v.duration})\n  *${v.text}*\n  [🎧 Audio](${v.audio})\n\n`;
        });
      }

      await m.reply(response);
    }
  } catch (error) {
    console.error(error);
    m.reply("Terjadi kesalahan saat mengambil data.");
  }
};

handler.command = ["bluearchive"];
handler.tags = ["anime"];
handler.limit = true;

export default handler;;

class BlueArchiveWiki {
  constructor() {
    this.baseURL = 'https://bluearchive.wiki';
  }

  list = async () => {
    return new Promise(async (resolve, reject) => {
      await axios.get(this.baseURL + "/wiki/Characters").then((a) => {
        let $ = cheerio.load(a.data);
        let result = [];
        $(".sortable tbody tr td a").each((ul, el) => {
          let name = $(el).text().trim();
          let url = this.baseURL + $(el).attr("href");
          if (!name) return;
          result.push({ name, url });
        });
        resolve({ total_character: result.length, list_character: result });
      }).catch((e) => {
        reject({ total_character: 0, list_character: [], msg: "failed to fetch data from web" });
      });
    });
  }

  characters = async (name) => {
    return new Promise(async (resolve, reject) => {
      let chara = await this.list().then((a) => a.list_character.find((i) => i.name.toLowerCase().includes(name.toLowerCase())));
      let { data: character } = await axios.get(`${chara.name ? chara.url : this.baseURL + `/wiki/${name.split(" ").join("_")}`}`).catch(e => e.response);
      let $ = cheerio.load(character);
      let result = { metadata: {}, voices: [] };
      $(".character tbody tr").each((ul, el) => {
        let name = $(el).find("th").text().trim().split(" ").join("_").toLowerCase();
        let value = $(el).find("td").text().trim();
        if (!value || !name) return;
        result.metadata[name] = value;
      });
      if (!result.metadata.full_name) return reject({ msg: "characters not found !" });
      result.metadata.cards = $(".charactercard").map((ul, el) => ({
        name: $(el).find(".name").text().trim(),
        role: $(el).find("div").last().attr("title"),
        ranks: $(el).find(".rank").text().trim(),
        image: "https:" + $(el).find(".portrait span > a > img").attr("src").split("/100px")[0],
        url: this.baseURL + $(el).find(".portrait span > a").attr("href")
      })).get();
      result.metadata.background = $(".character-background #tabber-tabpanel-English-2 p").text().trim();
      result.metadata.stats = {};
      $(".character-stattable .stattable-stats").each((ul, el) => {
        let name = $(el).find("th").text().trim().split(" ").join("_").toLowerCase().split("\n");
        let value = $(el).find("td").text().trim().split("\n");
        if (!value || !name) return;
        for (let i of name) {
          for (let u of value) {
            result.metadata.stats[i] = u;
          }
        }
      });
      let { data: voice } = await axios.get(`${chara.name ? chara.url + '/audio' : this.baseURL + `/wiki/${name.split(" ").join("_")}/audio`}`).catch(e => e.response);
      $ = cheerio.load(voice);
      $(".wikitable tbody tr").each((ul, el) => {
        let title = $(el).find("td").text().trim().split("\n")[0];
        let text = $(el).find("td p").eq(1).text().trim();
        let filename = $(el).find("td span span audio").attr("data-mwtitle");
        let duration = $(el).find("td span span audio").attr("data-durationhint") + " seconds";
        let audio = "https:" + $(el).find("td span span audio source").attr("src");
        if (!title) return;
        result.voices.push({ title, filename, duration, text, audio });
      });
      resolve(result);
    });
  }
}