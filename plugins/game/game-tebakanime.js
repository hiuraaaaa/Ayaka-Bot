import fetch from 'node-fetch'
import { generateWAMessageFromContent } from '@adiwajshing/baileys'

let timeout = 120000
let poin = 500
let handler = async (m, { conn, usedPrefix, command }) => {
    conn.tebakanime = conn.tebakanime ? conn.tebakanime : {}
    let id = m.chat
    if (id in conn.tebakanime) {
        conn.reply(m.chat, '❗Masih Ada Soal Yang Belum Terjawab', conn.tebakanime[id][0])
        throw false
    }
    let src = await (await fetch('https://raw.githubusercontent.com/unx21/ngetezz/main/src/data/nyenyenye.json')).json()
    let json = src[Math.floor(Math.random() * src.length)]
    let caption = `┌─⊷ *${command.toUpperCase()}*
⏳ Timeout *${(timeout / 1000).toFixed(2)} Detik*
💬 Ketik *${usedPrefix}wa* Untuk Bantuan
💬 Ketik *nyerah* Untuk Menyerah
➕ Bonus: *${poin} 💰Eris*
➕ Bonus: *1 🎟️Limit*
⚠️ *Balas/ REPLY soal ini untuk menjawab*
└──────────────
`.trim()

    let msg = await conn.sendFile(m.chat, json.img, 'tebakanime.jpg', caption, m) // Hanya kirim gambar dan caption

    conn.tebakanime[id] = [
        msg,
        json, poin,
        setTimeout(async () => {
            if (conn.tebakanime[id]) {
                let buttons = [ // Definisikan tombol di dalam setTimeout
                    { buttonId: '.tebakanime', buttonText: { displayText: 'Main Lagi 🔄' }, type: 1 }
                ]
                 const solutionMessage = {
                    text: `*❗Waktu Habis*\nJawabannya Adalah *${json.jawaban}*`,
                    footer: 'Klik tombol dibawah untuk bermain lagi!',
                    buttons: buttons,
                    headerType: 1
                }
              await conn.sendMessage(m.chat, solutionMessage, { quoted: msg }) // Kirim pesan solusi dengan tombol
               delete conn.tebakanime[id]
            }
        }, timeout)
    ]
}
handler.help = ['tebakanime']
handler.tags = ['game']
handler.command = /^tebakanime$/i
export default handler