import axios from "axios";
import * as cheerio from "cheerio";

let handler = async (m, { conn, text }) => {
  conn.autotiktok = conn.autotiktok || {};

  if (!text) throw `*Contoh:* .autotiktok [on/off]`;

  if (text === "on") {
    conn.autotiktok[m.chat] = { user: m.sender, active: true };
    m.reply("[ ✓ ] Auto-download TikTok diaktifkan.");
  } else if (text === "off") {
    if (conn.autotiktok[m.chat]) {
      delete conn.autotiktok[m.chat];
      m.reply("[ ✓ ] Auto-download TikTok dinonaktifkan.");
    } else {
      m.reply("[ ✓ ] Tidak ada sesi Auto-download TikTok yang aktif.");
    }
  }
};

handler.before = async (m, { conn }) => {
  conn.autotiktok = conn.autotiktok || {};

  const tiktokRegex = /https?:\/\/(www\.)?(tiktok\.com|vt\.tiktok\.com)\/[^\s]+/i;

  if (!conn.autotiktok[m.chat] || !conn.autotiktok[m.chat].active) return;
  if (!tiktokRegex.test(m.text)) return;

  await conn.sendMessage(m.chat, { react: { text: '🍁', key: m.key } });

  try {
    const result = await ttsave.video(m.text);
    const { type, nickname, username, description, videoInfo, slides, audioUrl } = result;

    let caption = `\`\`\`T I K T O K   A U T O - D O W N L O A D\`\`\`\n
> Request By: ${m.pushName}
> User: @${username}
> Nickname: ${nickname}
> Description: ${description || '-'}
`.trim();

    if (type === "slide") {
      for (let slide of slides) {
        await conn.sendFile(m.sender, slide.url, `slide-${slide.number}.jpg`, "", m);
      }
      await conn.reply(m.chat, "Slide gambar telah dikirim ke chat pribadi.", m);
    } else if (type === "video") {
      if (videoInfo?.nowm) {
        await conn.sendFile(m.chat, videoInfo.nowm, "tiktok.mp4", caption, m);
      } else {
        await conn.reply(m.chat, "Gagal mengambil video tanpa watermark.", m);
      }
    }

    if (audioUrl) {
      await conn.sendFile(m.chat, audioUrl, "tiktok.mp3", `🎵 Audio dari video`, m);
    }

    await conn.sendMessage(m.chat, { react: { text: '🌸', key: m.key } });
  } catch (e) {
    console.error(e);
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    await conn.reply(m.chat, "Gagal mengambil data TikTok. Cek link dan coba lagi.", m);
  }
};

handler.command = ['autotiktok'];
handler.help = ['autotiktok [on/off]'];
handler.tags = ['downloader'];

export default handler;

const headers = {
  authority: "ttsave.app",
  accept: "application/json, text/plain, */*",
  origin: "https://ttsave.app",
  referer: "https://ttsave.app/en",
  "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
};

const ttsave = {
  submit: async function (url) {
    const data = { query: url, language_id: "1" };
    const res = await axios.post("https://ttsave.app/download", data, { headers });
    return res.data;
  },

  parse: function (html) {
    const $ = cheerio.load(html);
    const uniqueId = $("#unique-id").val();
    const nickname = $("h2.font-extrabold").text().trim();
    const username = $("a.font-extrabold.text-blue-400").text().trim();
    const description = $("p.text-gray-600").text().trim();

    const dlink = {
      nowm: $("a.w-full.text-white.font-bold").first().attr("href"),
      wm: $("a.w-full.text-white.font-bold").eq(1).attr("href"),
      audio: $("a[type='audio']").attr("href")
    };

    const slides = $("a[type='slide']")
      .map((i, el) => ({ number: i + 1, url: $(el).attr("href") }))
      .get();

    return {
      uniqueId,
      nickname,
      username,
      description,
      dlink,
      slides
    };
  },

  video: async function (link) {
    const html = await this.submit(link);
    const result = this.parse(html);

    if (result.slides && result.slides.length > 0) {
      return { type: "slide", ...result };
    }

    return {
      type: "video",
      ...result,
      videoInfo: {
        nowm: result.dlink.nowm,
        wm: result.dlink.wm
      },
      audioUrl: result.dlink.audio
    };
  }
};