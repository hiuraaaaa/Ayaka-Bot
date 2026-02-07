import fetch from 'node-fetch'
import { generateWAMessageFromContent } from '@adiwajshing/baileys'

let timeout = 120000
let poin = 4999
let handler = async (m, { conn, text, command, usedPrefix,  }) => {
    conn.question = conn.question ? conn.question : {}
    let id = m.chat
    if (id in conn.question) {
        conn.reply(m.chat, '❗Masih ada soal belum terjawab di chat ini', conn.question[id][0])
        throw false
    }

    if (!text) {
      const buttons = [
        { buttonId: `${usedPrefix}question easy`, buttonText: { displayText: 'Easy 👶' }, type: 1 },
        { buttonId: `${usedPrefix}question medium`, buttonText: { displayText: 'Medium 🧑‍🏫' }, type: 1 },
        { buttonId: `${usedPrefix}question hard`, buttonText: { displayText: 'Hard 🧑‍🚀' }, type: 1 }
      ]
  
      const buttonMessage = {
          text: "*❗sᴇʟᴇᴄᴛ ᴛʜᴇ ᴅɪғғɪᴄᴜʟᴛʏ ʟᴇᴠᴇʟ ʏᴏᴜ ᴡᴀɴᴛ*",
          footer: `Questions By © ${global.namebot} 2025`,
          buttons: buttons,
          headerType: 1
      }
  
      return await conn.sendMessage(m.chat, buttonMessage)
    }
    
    let src = await (await fetch("https://opentdb.com/api.php?amount=1&difficulty=" + text + "&type=multiple")).json()
  let json = src
  let caption = `*『  QUESTION ANSWERS  』*
  
🎀 *Category:* ${json.results[0].category}
⭐ *Difficulty:* ${json.results[0].difficulty}

📒 *Question:* ${json.results[0].question}
  
⏳ Timeout *${(timeout / 1000).toFixed(2)} detik*
💬 Ketik *${usedPrefix}hquest* untuk bantuan
💬 Ketik *nyerah* Untuk Menyerah
➕ Bonus: *${poin} ✨XP*
⚠️ *Balas/ REPLY soal ini untuk menjawab*
└──────────────
    `.trim()
    conn.question[id] = [
        await conn.sendMessage(m.chat, { image: { url: flaaa.getRandom() + command }, caption: caption }, { quoted: m }),
        json, poin,
        setTimeout(async () => {
            if (conn.question[id]) {
              const buttons = [
                { buttonId: `${usedPrefix}question`, buttonText: { displayText: 'Main Lagi 🔄' }, type: 1 }
              ]

              const buttonMessage = {
                  text: `🚩 *Waktu Habis!*

🎋 *Answer:* ${json.results[0].correct_answer}\n`,
                  footer: 'Klik tombol dibawah untuk bermain lagi!',
                  buttons: buttons,
                  headerType: 1
              }

              await conn.sendMessage(m.chat, buttonMessage)
              delete conn.question[id]
            }
        }, timeout)
    ]
}

handler.help = ['question']
handler.tags = ['game']
handler.command = /^question$/i

export default handler

const buttons = [
    ['Hint', '/hquest'],
    ['Nyerah', 'menyerah']
]