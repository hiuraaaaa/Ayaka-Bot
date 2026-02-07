import axios from "axios";
import FormData from "form-data";

const fkontak = {
  key: { participant: '0@s.whatsapp.net', remoteJid: '0@s.whatsapp.net', fromMe: false, id: 'Halo' },
  message: { conversation: 'Converting Image To Video 🖼➡📹' }
};

let handler = async (m, { conn, text, usedPrefix, command }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q.imageMessage || q).mimetype || q.mediaType || "";

  if (!mime || !mime.includes("image")) return m.reply(
    `*❗Kirim/Reply gambar dengan caption:*\n> ${usedPrefix + command} [prompt]`
  );
  
  if (!text) return m.reply(`*❗Dimana promptnya?*\n\n*📝 Example:*\n> ${usedPrefix + command} ubah agar karakter dilempari Piala lalu Piala dipegang diatas kepala`);
  
  conn.sendMessage(m.chat, { react: { text: "🔁", key: m.key } });

  let upload;
  let imageUrl;
  let prompt = text;
  
  try {
    conn.sendMessage(m.chat, { text: "⏳ Mengunggah gambar ke server sementara..." }, { quoted: fkontak });

    let buffer = await q.download();
    let form = new FormData();
    form.append("file", buffer, "image.jpg");

    upload = await axios.post("https://tmpfiles.org/api/v1/upload", form, {
      headers: form.getHeaders(),
      timeout: 180000,
    });

    let raw = upload.data.data.url;
    let id = raw.split("/")[3];
    imageUrl = `https://tmpfiles.org/dl/${id}/image.jpg`;
    
  } catch (e) {
    conn.sendMessage(m.chat, { react: { text: "❗", key: m.key } });
    let errorMsg = e.response ? `Server error: ${e.response.status} - ${JSON.stringify(e.response.data)}` : e.message;
    return m.reply(`Gagal mengunggah gambar ke tmpfiles.org.\n*Error:* ${errorMsg}`);
  }
  
  let taskId;
  try {
    conn.sendMessage(m.chat, { text: "⏳ Membuat tugas video... (API: veo31ai.io)" }, { quoted: fkontak }); // <-- DIUBAH

    let payload = {
      videoPrompt: prompt,
      videoAspectRatio: "16:9",
      videoDuration: 5,
      videoQuality: "540p",
      videoModel: "v4.5",
      videoImageUrl: imageUrl,
      videoPublic: false,
    };

    let gen = await axios.post("https://veo31ai.io/api/pixverse-token/gen", payload, {
      headers: { "Content-Type": "application/json" },
      timeout: 60000, // 1 menit timeout
    });

    taskId = gen.data.taskId;
    if (!taskId) return m.reply("❌ Gagal mendapatkan taskId dari veo31ai.io. (API 'gen' tidak mengembalikan taskId)");

  } catch (e) {
    conn.sendMessage(m.chat, { react: { text: "❗", key: m.key } });
    let errorMsg = e.response ? `Server error: ${e.response.status} - ${JSON.stringify(e.response.data)}` : e.message;
    return m.reply(`Gagal memulai proses 'gen' video di veo31ai.io.\n*Error:* ${errorMsg}`);
  }
  
  try {
    conn.sendMessage(m.chat, { text: `✅ Tugas berhasil dibuat
(Task ID: ${taskId}).
⏳ Memproses video... Ini bisa memakan waktu 3-5 menit. Harap tunggu.` }, { quoted: fkontak });
    
    let videoUrl;
    const timeout = Date.now() + 300000;
    
    while (Date.now() < timeout) {
      await new Promise((r) => setTimeout(r, 10000)); 

      let res;
      try {
        res = await axios.post(
          "https://veo31ai.io/api/pixverse-token/get",
          {
            taskId,
            videoPublic: false,
            videoQuality: "540p",
            videoAspectRatio: "16:9",
            videoPrompt: prompt,
          },
          { headers: { "Content-Type": "application/json" } }
        );

      } catch (pollError) {
        console.error("Polling error:", pollError.message);
        continue; 
      }

      if (res.data?.videoData?.url) {
        videoUrl = res.data.videoData.url;
        break; 
      }
    }

    if (!videoUrl) return m.reply("❌ Gagal mendapatkan video. Waktu tunggu habis (5 menit) atau server gagal memproses.");

    await conn.sendFile(m.chat, videoUrl, "veo31.mp4", `\`PROMPT:\`\n\n${prompt}`, fkontak);
    conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    
  } catch (e) {
    conn.sendMessage(m.chat, { react: { text: "❗", key: m.key } });
    let errorMsg = e.response ? `Server error: ${e.response.status} - ${JSON.stringify(e.response.data)}` : e.message;
    m.reply(`Terjadi error saat menunggu atau mengambil video.\n*Error:* ${errorMsg}`);
  }
};

handler.help = ["image2video"];
handler.tags = ["tools", "premium"];
handler.command = ["image2video", "img2vid", "image2vid", "img2video"];
handler.limit = true;
handler.register = true;
handler.premium = true;

export default handler;