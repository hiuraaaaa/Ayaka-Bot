import fetch from 'node-fetch'
import { generateWAMessageFromContent } from '@adiwajshing/baileys'

let timeout = 120000
let poin = 4999
let handler = async (m, { conn, command, usedPrefix }) => {

    conn.tebaktebakan = conn.tebaktebakan ? conn.tebaktebakan : {}
    let id = m.chat
    if (id in conn.tebaktebakan) {
        conn.reply(m.chat, '⚠️Masih ada soal belum terjawab di chat ini', conn.tebaktebakan[id][0])
        throw false
    }

    let src = await (await fetch('https://raw.githubusercontent.com/BochilTeam/database/master/games/tebaktebakan.json')).json()
    let json = src[Math.floor(Math.random() * src.length)]

    // Daftar link gambar
    const gambar = [
        'https://files.catbox.moe/ys2f3y.jpg',
        'https://files.catbox.moe/1v3nqb.jpg',
        'https://files.catbox.moe/biwv27.jpg',
        'https://files.catbox.moe/pbbgvn.jpg',
        'https://files.catbox.moe/tbcj6r.jpg',
        'https://files.catbox.moe/4yfftu.jpg',
        'https://files.catbox.moe/v95dy9.jpg',
        'https://files.catbox.moe/ad7ebh.jpg',
        'https://files.catbox.moe/qtvjjr.jpg',
        'https://files.catbox.moe/ij65hs.jpg',
        'https://files.catbox.moe/finv0d.jpg',
    ];

    // Pilih gambar secara acak
    const randomGambar = gambar[Math.floor(Math.random() * gambar.length)];

    let caption = `┌─⊷ *${command.toUpperCase()}*
${json.soal}

⏳ Timeout *${(timeout / 1000).toFixed(2)} detik*
💬 Ketik *${usedPrefix}hteb* untuk bantuan
💬 Ketik *nyerah* Untuk Menyerah
➕ Bonus: *${poin} ✨XP*
⚠️ *Balas/ REPLY soal ini untuk menjawab*
└──────────────
    `.trim()

    // Tambahkan caption gambar
    let captionGambar = `${caption}`

    conn.tebaktebakan[id] = [
        await conn.sendFile(m.chat, randomGambar, 'tebak_gambar.jpg', captionGambar, m), // Kirim gambar dengan caption
        json, poin,
        setTimeout(() => {
            if (conn.tebaktebakan[id]) {
                const buttons = [
                    {buttonId: '.tebaktebakan', buttonText: {displayText: 'Main Lagi 🔄'}, type: 1}
                ]
                const buttonMessage = {
                    text: `🚩 *Waktu Habis❗*\nJawabannya adalah *${json.jawaban}*`,
                    footer: 'Klik tombol dibawah untuk bermain lagi!',
                    buttons: buttons,
                    headerType: 1
                }
                conn.sendMessage(m.chat, buttonMessage, { quoted: conn.tebaktebakan[id][0] })
                delete conn.tebaktebakan[id]
            }
        }, timeout)
    ]
}

handler.help = ['tebaktebakan']
handler.tags = ['game']
handler.command = /^tebaktebakan/i

export default handler