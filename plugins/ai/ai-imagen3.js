import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

const genAI = new GoogleGenerativeAI("AIzaSyCMKHjCSrM0B7vTH0vqGUxhPchEevZUbrY");

let handler = async (m, { conn, text, command }) => {
  if (!text) throw `Senpai, kasih deskripsi gambar dong! Contoh: ${command} Biri-biri pake topi terbang di kota futuristik`;

  m.reply("Sabar ya Senpai, Alicia lagi bikin gambar cakep buat kamu...");

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp-image-generation",
    generationConfig: {
      responseModalities: ["Text", "Image"],
    },
  });

  try {
    const tmpDir = path.join(process.cwd(), "tmp");
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

    const response = await model.generateContent(text);

    for (const part of response.response.candidates[0].content.parts) {
      if (part.text) {
        console.log(part.text);
      } else if (part.inlineData) {
        const imageData = part.inlineData.data;
        const buffer = Buffer.from(imageData, "base64");
        const fileName = path.join(tmpDir, "imagen3-output.png");
        fs.writeFileSync(fileName, buffer);
        console.log(`Gambar disimpan di ${fileName}`);
        await conn.sendFile(m.chat, fileName, "imagen3.png", `Nih Senpai, gambar dari: ${text}`, m);
      }
    }
  } catch (error) {
    console.error(error);
    m.reply(`Duh, ada masalah saat bikin gambar: ${error.message}. Coba lagi ya!`);
  }
};

handler.help = ["imagen3 <teks>"];
handler.tags = ["ai", "premium"];
handler.command = ["imagen3", "img3"];
handler.premium = true;
handler.register = true;

export default handler;