import fs from "fs";
import path from "path";
import FormData from "form-data";
import axios from "axios";

const presets = [
 "none","3d-model","abstract","advertising","alien","analog-film","anime","architectural","artnouveau","baroque","black-white-film-portrait",
 "cinematic","collage","comic-book","craft-clay","cubist","dark-portrait-realism","dark-realism","digital-art","disco","dreamscape","dystopian",
 "enhance","fairy-tale","fantasy-art","fighting-game","filmnoir","flat-papercut","food-photography","gothic","graffiti","grunge","gta","hdr","horror",
 "hyperrealism","impressionist","industrialfashion","isometric-style","light-portrait-realism","light-realism","line-art","long-exposure","minecraft",
 "minimalist","monochrome","nautical","neon-noir","neon-punk","origami","paper-mache","papercut-collage","papercut-shadow-box","photographic",
 "pixel-art","pointillism","pokémon","pop-art","psychedelic","real-estate","renaissance","retro-arcade","retro-game","romanticism","rpg-fantasy-game",
 "silhouette","space","stacked-papercut","stained-glass","steampunk","strategy-game","street-fighter","super-mario","surrealist","techwear-fashion",
 "texture","thick-layered-papercut","tilt-shift","tribal","typography","vintagetravel","watercolor"
];

const sizes = { ultra: "1536x1536" };

async function generateImage({ prompt, preset = "anime" }) {
 const form = new FormData();
 form.append("prompt", prompt);
 form.append("negativePrompt", "");
 form.append("preset", preset);
 form.append("orientation", "ultra");
 form.append("seed", "");

 const res = await axios.post(
  "https://linangdata.com/text-to-image-ai/stablefusion-v2.php",
  form,
  {
   headers: {
    ...form.getHeaders(),
    accept: "application/json, text/plain, */*",
    "x-requested-with": "XMLHttpRequest",
    referer: "https://linangdata.com/text-to-image-ai/"
   }
  }
 );

 const { image } = res.data || {};
 if (!image) throw new Error("Response tidak berisi gambar");

 return { success: true, base64: image, preset, size: sizes.ultra };
}

let handler = async (m, { text, conn }) => {
 const args = text ? text.split(" ") : [];
 let presetFlag = "anime";
 let promptText = args.join(" ");

 args.forEach(arg => {
  if (arg.startsWith("--")) {
   presetFlag = arg.slice(2);
   promptText = promptText.replace(arg, "").trim();
  }
 });

 if (!promptText) {
  return m.reply(`📌 *Cara menggunakan txt2img*\n\n`
  + `• Format: txt2img <prompt> --<preset>\n`
  + `• Contoh:\n`
  + `  txt2img girl in tokyo --anime\n`
  + `  txt2img futuristic city --pixel-art\n\n`
  + `📃 *Daftar preset*: ${presets.join(", ")}`);
 }

 await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

 try {
  const result = await generateImage({ prompt: promptText, preset: presetFlag });

  const buffer = Buffer.from(result.base64, "base64");
  const outPath = "./tmp/txt2img_" + Date.now() + ".jpg";
  fs.writeFileSync(outPath, buffer);

  await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

  await conn.sendMessage(
   m.chat,
   {
    image: fs.readFileSync(outPath),
    caption: `✨ *Image Generated!*  
🖼️ Preset: *${presetFlag}*
📝 Prompt: *${promptText}*`
   },
   { quoted: m }
  );

  fs.unlinkSync(outPath);

 } catch (e) {

  await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
  m.reply("❗ Terjadi kesalahan: " + e.message);
 }
};

handler.help = ['txt2img','texttoimage'];
handler.tags = ['ai'];
handler.command = /^txt2img|texttoimage$/i;

export default handler;