import axios from "axios";
import crypto from "crypto";
import { fileTypeFromBuffer } from "file-type";

function fakeUserAgent() {
  const list = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    "Mozilla/5.0 (X11; Linux x86_64)",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
  ];
  return (
    list[Math.floor(Math.random() * list.length)] +
    " AppleWebKit/537.36 Chrome/114 Safari/537.36"
  );
}

function createFormData(buffer, field, ext = "bin") {
  const boundary =
    "----WebKitFormBoundary" + crypto.randomBytes(16).toString("hex");

  const payload = Buffer.concat([
    Buffer.from(`--${boundary}\r\n`),
    Buffer.from(
      `Content-Disposition: form-data; name="${field}"; filename="file.${ext}"\r\n`
    ),
    Buffer.from(`Content-Type: application/octet-stream\r\n\r\n`),
    buffer,
    Buffer.from(`\r\n--${boundary}--`)
  ]);

  return {
    data: payload,
    headers: { "Content-Type": `multipart/form-data; boundary=${boundary}` }
  };
}

async function uploadUguu(buffer) {
  try {
    const ft = (await fileTypeFromBuffer(buffer)) || {};
    const form = createFormData(buffer, "files[]", ft.ext || "bin");

    const res = await axios.post("https://uguu.se/upload.php", form.data, {
      headers: {
        ...form.headers,
        "User-Agent": fakeUserAgent()
      }
    });

    if (!res.data?.files?.[0]?.url) throw new Error("Invalid Uguu response");
    return res.data.files[0].url;
  } catch (e) {
    throw new Error("Upload gagal: " + e.message);
  }
}

async function createJob(imageUrl, prompt) {
  const payload = {
    aspectRatio: "auto",
    channel: "NANOBANANA_IMAGE",
    imageUrls: [imageUrl],
    isTemp: true,
    outputFormat: "png",
    pageId: 907,
    privateFlag: true,
    prompt,
    source: "nanobananaart.ai",
    type: "IMAGETOIAMGE",
    watermarkFlag: true
  };

  const res = await axios.post(
    "https://api.nanobananaart.ai/aimodels/api/v1/ai/image/create",
    payload,
    {
      headers: {
        "accept": "*/*",
        "content-type": "application/json",
        "origin": "https://nanobananaart.ai",
        "referer": "https://nanobananaart.ai/",
        "uniqueid": crypto.randomUUID(),
        "user-agent": fakeUserAgent()
      }
    }
  );

  if (!res.data?.data) throw new Error("Tidak ada taskId");
  return res.data.data;
}

async function getJobResult(taskId) {
  const url = `https://api.nanobananaart.ai/aimodels/api/v1/ai/${taskId}?channel=NANOBANANA_IMAGE`;

  for (let i = 0; i < 40; i++) {
    const res = await axios.get(url, {
      headers: {
        "accept": "*/*",
        "origin": "https://nanobananaart.ai",
        "referer": "https://nanobananaart.ai/",
        "user-agent": fakeUserAgent()
      }
    });

    if (res.data?.data?.completeData) {
      const parsed = JSON.parse(res.data.data.completeData);
      const urls = parsed?.data?.result_urls;
      if (urls?.length) return urls[0];
    }

    await new Promise(r => setTimeout(r, 2000));
  }

  throw new Error("Timeout menunggu hasil NanoBanana");
}

let handler = async (m, { conn, args }) => {
  try {
    if (!args.length)
      return m.reply(
        `✨ *AI IMAGE EDITOR*\n\n` +
        `📌 *Cara pakai:*\n` +
        `1. Kirim atau reply foto\n` +
        `2. Ketik:\n\`\`\`\n.editimg <prompt>\n\`\`\`\n` +
        `Contoh:\n\`\`\`\n.editimg ubah warna baju menjadi hitam\n\`\`\`"
      `);

    const prompt = args.join(" ");

    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || "";

    if (!mime || !mime.includes("image")) {
      return m.reply("📸 Silakan kirim atau reply *foto* yang ingin diedit.");
    }

    let buffer = await q.download();
    if (!buffer) return m.reply("❌ Gagal mengambil file gambar.");

    await conn.sendMessage(m.chat, {
      react: { text: "⏳", key: m.key }
    });

    const imageUrl = await uploadUguu(buffer);

    await conn.sendMessage(m.chat, {
      react: { text: "🟡", key: m.key }
    });

    const taskId = await createJob(imageUrl, prompt);

    await conn.sendMessage(m.chat, {
      react: { text: "🟢", key: m.key }
    });

    const resultUrl = await getJobResult(taskId);

    await conn.sendMessage(
      m.chat,
      {
        image: { url: resultUrl },
        caption: `✨ *EditImage AI - Result*\n\n📝 Prompt: *_${prompt}_*`},
      { quoted: m }
    );

    await conn.sendMessage(m.chat, {
      react: { text: "✅", key: m.key }
    });
  } catch (e) {
    console.log(e);
    await conn.sendMessage(m.chat, {
      react: { text: "❌", key: m.key }
    });
    m.reply("Terjadi error: " + e.message);
  }
};

handler.help = ["editimage prompt -model"];
handler.tags = ["ai"];
handler.command = ["editgambar", "editimg", "editimage", "editfoto"];
handler.limit = 5;
handler.register = true;

export default handler;