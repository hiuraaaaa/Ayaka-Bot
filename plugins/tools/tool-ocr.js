import fetch from "node-fetch";
import fs from "fs";
import path from "path";

let handler = async (m, { conn, usedPrefix, command }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || "";
  if (!mime) throw `Kirim/Reply gambar dengan caption *${usedPrefix + command}*`;
  m.reply("⏳ Lagi baca teks dari gambarnya...");
  try {
    const tmpDir = "./tmp";
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
    let media = await q.download();
    let filePath = path.join(tmpDir, `ocr_${Date.now()}.jpg`);
    fs.writeFileSync(filePath, media);
    const url = "https://staging-ai-image-ocr-266i.frontend.encr.app/api/ocr/process";
    const ext = path.extname(filePath).toLowerCase();
    const mimeType = ext === ".png" ? "image/png" : "image/jpeg";
    const imageBase64 = fs.readFileSync(filePath).toString("base64");
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ imageBase64, mimeType }),
    });
    if (!res.ok) throw new Error(await res.text());
    const json = await res.json();
    let hasil = json.extractedText || "(teks tidak terbaca)";
    await conn.sendMessage(m.chat, { text: `${hasil}` }, { quoted: m });
    fs.unlinkSync(filePath);
  } catch (e) {
    console.error(e);
    m.reply("❌ Gagal membaca teks dari gambar.");
  }
};

handler.help = ["ocr"];
handler.tags = ["tools"];
handler.command = /^(ocr|imagetotext|imgtotxt|img2txt|image2text)$/i;
handler.limit = 2;
handler.register = true;

export default handler;