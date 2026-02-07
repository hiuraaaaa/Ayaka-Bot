import fs from "fs";
import path from "path";
import axios from "axios";
import Jimp from "jimp";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { Sticker } from "wa-sticker-formatter";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// [MODIFIKASI] Menambahkan fkontak
const fkontak = {
  key: { participant: '0@s.whatsapp.net', remoteJid: '0@s.whatsapp.net', fromMe: false, id: 'Halo' },
  message: { conversation: `Sticker Brat Anime 🌸` }
};

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return conn.reply(m.chat, `Harap masukkan teks setelah perintah!\n${usedPrefix + command} Halo pariell`, m, { quoted: fkontak });

  // [MODIFIKASI] Pesan "tunggu" tetap ada
  await conn.sendMessage(m.chat, { text: `⏳ Lagi Proses Brat Anime` }, { quoted: fkontak });

  try {
    const imageUrl = "https://files.catbox.moe/wftnwc.jpg";
    const imagePath = path.join(__dirname, "gambar_anime.jpg");

    const response = await axios({ url: imageUrl, responseType: "arraybuffer" });
    fs.writeFileSync(imagePath, Buffer.from(response.data, "binary"));

    const image = await Jimp.read(imagePath);
    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);

    const x = 243, y = 750, maxWidth = 600;
    image.print(font, x, y, { text, alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE }, maxWidth);

    const outputPath = path.join(__dirname, "hasil.png");
    await image.writeAsync(outputPath);

    const sticker = new Sticker(fs.readFileSync(outputPath), {
      pack: `${global.stickpack || 'Ayaka'}`,
      author: `${global.stickauth || 'Lann'}`,
      type: "full", // Mengubah ke 'full' agar lebih konsisten
    });

    const stickerBuffer = await sticker.toBuffer();
    // [MODIFIKASI] Mengirim stiker dengan quoted fkontak
    await conn.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: fkontak });

    fs.unlinkSync(imagePath);
    fs.unlinkSync(outputPath);
  } catch (e) {
    console.error(e);
    // [MODIFIKASI] Mengirim pesan error dengan quoted fkontak
    conn.reply(m.chat, "Terjadi kesalahan saat memproses stiker.", m, { quoted: fkontak });
  }
};

handler.command = ["bratanime", "animebrat"];
handler.limit = true; // Menambahkan limit untuk konsistensi

export default handler;