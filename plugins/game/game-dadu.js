// 📦 Plugin: game-dadu.js
// ✅ Author: https://wa.me/6282285357346 | https://github.com/sadxzyq | https://instagram.com/tulisan.ku.id
// 🚫 Jangan hapus watermark

import { createSticker } from "wa-sticker-formatter"

const packname = "Dadu Game"
const author = "TulisanKuBot"

let handler = async (m, { conn }) => {
  await m.reply('🎲 Sedang mengocok dadu...')
  
  let diceImage = rollDice()
  
  try {
    let stiker = await createSticker(diceImage, {
      pack: packname,
      author: m.name || author,
      type: 'full',
      quality: 75
    })
  
    await conn.sendFile(m.chat, stiker, "dadu.webp", "", m)
  } catch (e) {
    console.error(e)
    await m.reply("❌ Gagal membuat stiker.")
  }
}

handler.help = ["dadu"]
handler.tags = ["game"]
handler.command = ["dadu"]

export default handler

function rollDice() {
  let num = Math.floor(Math.random() * 6) + 1
  return `https://www.random.org/dice/dice${num}.png`
}