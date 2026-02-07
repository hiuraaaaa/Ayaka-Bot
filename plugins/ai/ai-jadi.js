import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

let handler = async (m, { conn, text, usedPrefix, command }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || "";

  if (!mime) return m.reply(`Kirim/reply gambar dengan caption *${usedPrefix + command} <menjadi apa>*\n\nContoh:\n${usedPrefix + command} kucing`);
  if (!/image\/(jpe?g|png)/.test(mime)) return m.reply(`Format ${mime} tidak didukung! Hanya jpeg/jpg/png.`);

  const defaultOptions = [
    "Hello Kitty",
    "ular",
    "setan",
    "vampire",
    "singa",
    "macan",
    "jerapah",
    "Doraemon",
    "Nobita",
    "malaikat",
    "bidadari"
  ];

  let transformTo = text || defaultOptions[Math.floor(Math.random() * defaultOptions.length)];

  let promptText = `Ubah karakter dalam gambar menjadi ${transformTo}. Pastikan karakter tetap mempertahankan pose dan latar belakang asli, tetapi bentuk tubuh, wajah, dan ciri-ciri lainnya menyesuaikan seperti ${transformTo}.`;

  m.reply(`Proses mengubah menjadi ${transformTo}...`);

  try {
    let imgData = await q.download();
    let genAI = new GoogleGenerativeAI("AIzaSyDGKKLqFglsXuW8fv64qbkMjlG1i6t_AIU");
    const base64Image = imgData.toString("base64");

    const contents = [
      { text: promptText },
      {
        inlineData: {
          mimeType: mime,
          data: base64Image
        }
      }
    ];

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp-image-generation",
      generationConfig: {
        responseModalities: ["Text", "Image"]
      },
    });

    const response = await model.generateContent(contents);

    let resultImage;
    let resultText = "";

    for (const part of response.response.candidates[0].content.parts) {
      if (part.text) {
        resultText += part.text;
      } else if (part.inlineData) {
        const imageData = part.inlineData.data;
        resultImage = Buffer.from(imageData, "base64");
      }
    }

    if (resultImage) {
      const tempPath = path.join(process.cwd(), "tmp", `jadi_${Date.now()}.png`);
      fs.writeFileSync(tempPath, resultImage);

      await conn.sendMessage(m.chat, {
        image: { url: tempPath },
        caption: `*Berhasil! Karakter telah diubah menjadi ${transformTo}.*`
      }, { quoted: m });

      setTimeout(() => {
        try {
          fs.unlinkSync(tempPath);
        } catch { }
      }, 30000);
    } else {
      m.reply(`Gagal mengubah menjadi ${transformTo}. Coba lagi nanti.`);
    }
  } catch (error) {
    console.error(error);
    m.reply(`Error: ${error.message}`);
  }
};

handler.help = ["jadi <teks>"];
handler.tags = ["ai"];
handler.command = ["jadi"];

export default handler;