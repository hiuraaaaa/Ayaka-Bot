import fetch from "node-fetch";

const scrapeTikTokSearch = async (keywords) => {
  const url = `https://us-central1-execbrief-31c27.cloudfunctions.net/tiktokSearch-search?keywords=${encodeURIComponent(
    keywords
  )}&filtersFast=lang+%3D+%27en%27%2CnbChar+%3E+10&sort=&uid=undefined`;

  const res = await fetch(url, {
    headers: {
      "accept": "*/*",
      "origin": "https://www.revid.ai",
      "referer": "https://www.revid.ai/",
      "user-agent":
        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36",
    },
  });

  if (!res.ok) throw new Error(`Request gagal: ${res.status}`);
  return await res.json();
};

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) return m.reply(`Masukin kata kunci!\nContoh:\n${usedPrefix + command} anime meme`);

  let keywords = args.join(" ");
  m.reply("🔍 Cari video...");

  try {
    let data = await scrapeTikTokSearch(keywords);

    if (!data.videos || data.videos.length === 0) {
      return m.reply("❌ Tidak ada hasil ditemukan");
    }

    let video = data.videos[Math.floor(Math.random() * data.videos.length)];

    let caption = `👤 @${video.username} (${video.userNickname})
🎬 Views: ${video.playCount}
👍 Likes: ${video.diggCount}
💬 Komentar: ${video.commentCount}
📝 ${video.desc || "-"} `;

    await conn.sendFile(m.chat, video.urlUploaded, "revid.mp4", caption, m);
  } catch (e) {
    console.error(e);
    m.reply("⚠️ Error saat ambil data");
  }
};

handler.help = ["revidai <query>"];
handler.tags = ["internet"];
handler.command = /^(revidai)$/i;
handler.limit = 2;
handler.register = true;

export default handler;