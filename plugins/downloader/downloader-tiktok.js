import axios from "axios";

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const Lann4you = {
    key: {
      participant: "0@s.whatsapp.net",
      remoteJid: "0@s.whatsapp.net",
      fromMe: false,
      id: "Halo",
    },
    message: {
      conversation: m.text,
    },
  };

  if (!text) {
    return conn.reply(
      m.chat,
      `Link nya mana, Sensei?\nContoh: ${usedPrefix + command} https://vt.tiktok.com/xoxoxox/`,
      Lann4you
    );
  }

  await conn.sendMessage(m.chat, { react: { text: "🎀", key: m.key } });

  try {
    const videoResult = await tikwm(text);
    
    if (videoResult.msg) throw new Error(videoResult.msg);

    const { metadata, type, download, music } = videoResult;

    let caption = `✨ *TIKTOK DOWNLOADER* ✨\n
🔗 *Link:* ${text}
🎵 *Title:* ${metadata.title || "Tanpa judul"}
✍️ *Author:* ${metadata.author?.unique_id || metadata.author?.nickname || "Tidak diketahui"}
🌎 *Region:* ${metadata.region || "Tidak diketahui"}
⏱️ *Duration:* ${metadata.duration || "Tidak diketahui"} detik
`.trim();

    if (type === "image" && Array.isArray(download)) {
      for (let i = 0; i < download.length; i++) {
        await conn.sendFile(
          m.chat,
          download[i],
          `slide-${i + 1}.jpg`,
          "",
          Lann4you
        );
      }
      conn.reply(
        m.chat,
        "Slide gambar udah dikirim semua ya, Sensei! 🖼️",
        Lann4you
      );
    } else if (type === "video" && download) {
      await conn.sendFile(m.chat, download, "tiktok.mp4", caption, Lann4you);

      if (music) {
        await conn.sendMessage(m.chat, {
          audio: { url: music },
          mimetype: 'audio/mpeg',
          ptt: false,
          contextInfo: { forwardingScore: 999, isForwarded: true },
        }, { quoted: Lann4you });
      }
    } else {
      conn.reply(
        m.chat,
        "Gagal ambil video, coba link lain ya, Senpai! 😿",
        Lann4you
      );
    }

    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
  } catch (error) {
    console.error(error);
    conn.reply(
      m.chat,
      `Waduh, error nih, Sensei! Sabun apa yang paling genit? Sabun colek! 😹\nCek link-nya bener apa nggak, terus coba lagi ya~ 🤗`,
      Lann4you
    );
  }
};

handler.help = ["tiktok <link>"];
handler.tags = ["downloader"];
handler.command = ["tiktok", "tiktokdl", "tt"];
handler.limit = 3;
handler.register = true;

export default handler;

async function tikwm(url) {
  const result = {
    metadata: {},
    type: "",
    download: "",
    music: "",
  };

  try {
    if (!url.includes("tiktok")) throw "Gada Link/Link Salah Jgn Di Request in lagi dong 😹";

    const { data } = await axios.post(
      `https://tikwm.com/api/?url=${url}`,
      null,
      { timeout: 50000 }
    );

    const tikwm = data.data;

    result.metadata.title = tikwm.title || "";
    result.metadata.id = tikwm.id || "";
    result.metadata.region = tikwm.region || "";
    result.metadata.duration = tikwm.duration || "";
    result.metadata.author = tikwm.author || {};

    if (tikwm.images) {
      result.type = "image";
      result.download = tikwm.images;
    } else {
      result.type = "video";
      result.download = tikwm.play;
      result.music = tikwm.music || "";
    }

    return result;
  } catch (e) {
    console.log("Error: " + e);
    result.msg = e;
    return result;
  }
}