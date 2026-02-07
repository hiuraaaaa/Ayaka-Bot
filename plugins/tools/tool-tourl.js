import crypto from "crypto";
import { FormData, Blob } from "formdata-node";
import { fileTypeFromBuffer } from "file-type";
import axios from "axios";
import fakeUserAgent from "fake-useragent";
const { proto, generateWAMessageFromContent } = (await import("@adiwajshing/baileys")).default;

const handler = async (m, { conn }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || "";
  if (!mime) return m.reply("No media found!");

  await conn.sendMessage(m.chat, { react: { text: "🍁️", key: m.key } });

  let media = await q.download();
  const { ext, mime: detectedMime } = (await fileTypeFromBuffer(media)) || {
    ext: "unknown",
    mime: "unknown",
  };

  const uploadPromises = Object.entries(uploaders).map(async ([name, uploader]) => {
    try {
      const link = await uploader(media);
      return { name, link };
    } catch (error) {
      return { name, error: error.toString() };
    }
  });

  const results = await Promise.all(uploadPromises);

  let caption = `📤 *T O U R L* 📤\n\n`;
  caption += `📦 *Size:* ${formatBytes(media.length)}\n`;
  caption += `📁 *Type:* ${detectedMime} (.${ext})\n\n`;
  caption += `Pilih uploader untuk mendapatkan link:\n`;

  const buttons = results
    .filter((r) => !r.error && r.link)
    .map((r) => ({
      name: "cta_copy",
      buttonParamsJson: JSON.stringify({
        display_text: r.name.charAt(0).toUpperCase() + r.name.slice(1),
        copy_code: r.link,
      }),
    }));

  if (buttons.length === 0) {
    return m.reply("Gagal mengunggah ke semua uploader!");
  }

  const buttonMessage = generateWAMessageFromContent(
    m.chat,
    {
      viewOnceMessage: {
        message: {
          interactiveMessage: proto.Message.InteractiveMessage.create({
            body: { text: caption },
            nativeFlowMessage: { buttons },
          }),
        },
      },
    },
    { quoted: m }
  );

  await conn.relayMessage(m.chat, buttonMessage.message, {});
};

handler.command = ["tourl", "tolink"];
handler.help = ["tourl", "tolink"];
handler.tags = ["tools"];
handler.limit = true;
handler.register = true;
export default handler;

const uploaders = {
  termai: async (content) => {
    try {
      const ft = (await fileTypeFromBuffer(content)) || {};
      const formData = createFormData(content, "file", ft.ext || "bin");
      const key = "AIzaBj7z2z3xBjsk"; // jangan di ganti ya anjeng, tar eror
      const domain = "https://c.termai.cc";
      const res = await axios.post(`${domain}/api/upload?key=${key}`, formData, {
        headers: { "User-Agent": fakeUserAgent() },
      });
      if (!res.data?.path) throw new Error("Invalid Termai response");
      return res.data.path; 
    } catch (error) {
      throw `Failed to upload to Termai: ${error.message}`;
    }
  },

  tmpfiles: async (content) => {
    try {
      const ft = (await fileTypeFromBuffer(content)) || {};
      const formData = createFormData(content, "file", ft.ext || "bin");
      const response = await axios.post("https://tmpfiles.org/api/v1/upload", formData, {
        headers: { "User-Agent": fakeUserAgent() },
      });
      const result = response.data;
      const match = /https?:\/\/tmpfiles.org\/(.*)/.exec(result.data.url);
      if (!match) throw new Error("Invalid tmpfiles URL format");
      return `https://tmpfiles.org/dl/${match[1]}`;
    } catch (error) {
      throw `Failed to upload to tmpfiles: ${error.message}`;
    }
  },

  Uguu: async (content) => {
    try {
      const ft = (await fileTypeFromBuffer(content)) || {};
      const formData = createFormData(content, "files[]", ft.ext || "bin");
      const response = await axios.post("https://uguu.se/upload.php", formData, {
        headers: { "User-Agent": fakeUserAgent() },
      });
      if (!response.data.files?.[0]?.url) throw new Error("Invalid Uguu response");
      return response.data.files[0].url;
    } catch (error) {
      throw `Failed to upload to Uguu: ${error.message}`;
    }
  },

  catbox: async (content) => {
    try {
      const ft = (await fileTypeFromBuffer(content)) || {};
      const formData = createFormData(content, "fileToUpload", ft.ext || "bin");
      formData.append("reqtype", "fileupload");
      const response = await axios.post("https://catbox.moe/user/api.php", formData, {
        headers: { "User-Agent": fakeUserAgent() },
      });
      if (!response.data) throw new Error("Invalid Catbox response");
      return response.data;
    } catch (error) {
      throw `Failed to upload to Catbox: ${error.message}`;
    }
  },

  picu: async (buffer) => {
    try {
      const response = await axios.put("https://put.icu/upload/", buffer, {
        headers: { "User-Agent": fakeUserAgent(), Accept: "application/json" },
      });
      if (!response.data.direct_url) throw new Error("Invalid Picu response");
      return response.data.direct_url;
    } catch (error) {
      throw `Failed to upload to Picu: ${error.message}`;
    }
  },
};

const createFormData = (content, fieldName, ext) => {
  const formData = new FormData();
  const random = crypto.randomBytes(5).toString("hex");
  formData.append(
    fieldName,
    new Blob([content], { type: "application/octet-stream" }),
    `${random}.${ext}`
  );
  return formData;
};

function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`;
}