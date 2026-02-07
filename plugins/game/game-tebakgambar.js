import { tebakgambar } from '@bochilteam/scraper'
import { generateWAMessageFromContent } from '@adiwajshing/baileys'

let timeout = 120000
let poin = 4999
let handler = async (m, { conn, command, usedPrefix }) => {
    conn.tebakingambar = conn.tebakingambar ? conn.tebakingambar : {}
    let id = m.chat
    if (id in conn.tebakingambar) {
        conn.reply(m.chat, '❗Masih ada soal belum terjawab di chat ini', conn.tebakingambar[id][0])
        throw false
    }
    let json = await tebakgambar()
    let caption = `┌─⊷ *${command.toUpperCase()}*
🧩 Rangkailah Gambar Ini
⏳ Timeout *${(timeout / 1000).toFixed(2)} detik*
💬 Ketik *${usedPrefix}hgam* untuk bantuan
💬 Ketik *nyerah* Untuk Menyerah
➕ Bonus: *${poin} ✨XP*
⚠️ *Balas/ REPLY soal ini untuk menjawab*
└──────────────
    `.trim()

    // Hilangkan button saat memberikan soal
    let buttonMessage = {
        image: { url: json.img },
        caption: caption,
        footer: 'Balas pesan ini untuk menjawab',
        headerType: 4
    }

    let msg = await conn.sendMessage(m.chat, buttonMessage, { quoted: m })


    conn.tebakingambar[id] = [
        msg,
        json, poin,
        setTimeout(() => {
            if (conn.tebakingambar[id]) {
                 const teks = `🚩 Waktu Habis❗\nJawabannya Adalah *${json.jawaban}*`
                    let buttons = [
                        { buttonId: '.tebakgambar', buttonText: { displayText: 'Main Lagi 🔄' }, type: 1 }
                    ]
                    let buttonMessage = {
                        text: teks,
                        footer: 'Klik tombol dibawah untuk bermain lagi!',
                        buttons: buttons,
                        headerType: 2
                    }
                    conn.sendMessage(m.chat, buttonMessage, { quoted: m })
                delete conn.tebakingambar[id]
            }
        }, timeout)
    ]
}
handler.help = ['tebakgambar']
handler.tags = ['game']
handler.command = /^tebakgambar/i

export default handler