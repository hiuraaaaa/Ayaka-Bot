import fetch from 'node-fetch'
import { generateWAMessageFromContent } from '@adiwajshing/baileys'

let timeout = 120000
let poin = 4999
let handler = async (m, { conn, text, command, usedPrefix,  }) => {
    conn.quizz = conn.quizz ? conn.quizz : {}
    let id = m.chat
    if (id in conn.quizz) {
        conn.reply(m.chat, '❗Masih ada soal belum terjawab di chat ini', conn.quizz[id][0])
        throw false
    }

    if (!text) {
      const buttons = [
        { buttonId: `${usedPrefix}quizz easy`, buttonText: { displayText: ' Easy 👶' }, type: 1 },
        { buttonId: `${usedPrefix}quizz medium`, buttonText: { displayText: ' Medium 🧑‍🏫' }, type: 1 },
        { buttonId: `${usedPrefix}quizz hard`, buttonText: { displayText: ' Hard 🧑‍🚀' }, type: 1 }
      ]
  
      const buttonMessage = {
          text: "*❗sᴇʟᴇᴄᴛ ᴛʜᴇ ᴅɪғғɪᴄᴜʟᴛʏ ʟᴇᴠᴇʟ ʏᴏᴜ ᴡᴀɴᴛ*",
          footer: `Quizz © ${global.namebot} 2025`,
          buttons: buttons,
          headerType: 1
      }
  
      return await conn.sendMessage(m.chat, buttonMessage)
    }
    
    let json = await quizApi(text)
    let caption = `『  *QUIZZ ANSWERS*  』

*📒 Quizz:* ${json[0].soal}

⏳ Timeout *${(timeout / 1000).toFixed(2)} detik*
💬 Ketik *${usedPrefix}quizzh* untuk bantuan
💬 Ketik *nyerah* Untuk Menyerah
➕ Bonus: *${poin} ✨XP*
⚠️ *Balas/ REPLY soal ini untuk menjawab*
└──────────────
    `.trim()
    conn.quizz[id] = [
        await conn.reply(m.chat, caption, m),
        json, poin,
        setTimeout(async () => {
            if (conn.quizz[id]) {
              const buttons = [
                { buttonId: `${usedPrefix}quizz`, buttonText: { displayText: 'Main Lagi 🔄' }, type: 1 }
              ]

              const buttonMessage = {
                  text: `🚩 Waktu Habis!\n\n🎋 *Answer:* ${json[0].jawaban}`,
                  footer: 'Klik tombol dibawah untuk bermain lagi!',
                  buttons: buttons,
                  headerType: 1
              }

              await conn.sendMessage(m.chat, buttonMessage)
              delete conn.quizz[id]
            }
        }, timeout)
    ]
}

handler.help = ['quizz']
handler.tags = ['game']
handler.command = /^quizz/i

export default handler

async function quizApi(difficulty) {
  const response = await fetch('https://quizapi.io/api/v1/questions?apiKey=MrSORkLFSsJabARtQhyloo7574YX2dquEAchMn8x&difficulty=' + difficulty + '&limit=1');
  const quizData = await response.json();

  const transformedData = quizData.map(({ question, answers, correct_answers }) => ({
    soal: question,
    hint: Object.values(answers).filter(value => value !== null),
    jawaban: Object.entries(correct_answers)
      .reduce((acc, [key, value]) => (value === 'true' ? answers[key.replace('_correct', '')] : acc), null)
  }));

  return transformedData;
}