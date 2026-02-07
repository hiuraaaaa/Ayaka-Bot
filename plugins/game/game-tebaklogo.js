import fs from 'fs'
let timeout = 120000
let poin = 4999
let handler = async (m, { conn, command, usedPrefix }) => {
    conn.tebaklogo = conn.tebaklogo ? conn.tebaklogo: {}
    let id = m.chat
    if (id in conn.tebaklogo) return conn.reply(m.chat, '❗Masih ada soal belum terjawab di chat ini', conn.tebaklogo[id][0])
    let src = JSON.parse(fs.readFileSync('./json/tebaklogo.json', 'utf-8'))
    let json = src[Math.floor(Math.random() * src.length)]
    let caption = `
┌─⊷ *TEBAKLOGO*    
${json.deskripsi}

⏳Timeout *${(timeout / 1000).toFixed(2)} detik*
💬 Ketik *${usedPrefix}hlog* untuk bantuan
💬 Ketik *nyerah* Untuk Menyerah
➕ Bonus: *${poin} ✨XP*
⚠️ *Balas/ REPLY soal ini untuk menjawab*
└──────────────
`.trim()
    conn.tebaklogo[id] = [
        await conn.sendFile(m.chat, json.img, 'tebaklogo.jpg', caption, m),
        json, poin, 4,
        setTimeout(() => {
            if (conn.tebaklogo[id]) conn.reply(m.chat, `🚩 Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tebaklogo[id][0])
            delete conn.tebaklogo[id]
        }, timeout)
    ]
}
handler.help = ['tebaklogo']
handler.tags = ['game']
handler.command = /^tebaklogo$/i

handler.onlyprem = true
handler.game = true

export default handler