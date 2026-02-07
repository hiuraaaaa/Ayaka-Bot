import fetch from 'node-fetch'
let timeout = 120000
let poin = 4999
let handler = async (m, { conn, command, usedPrefix }) => {

    conn.tebaksiapa = conn.tebaksiapa ? conn.tebaksiapa : {}
    let id = m.chat
    if (id in conn.tebaksiapa) {
        conn.reply(m.chat, '❗Masih ada soal belum terjawab di chat ini', conn.tebaksiapa[id][0])
        throw false
    }
    let src = await (await fetch('https://raw.githubusercontent.com/BochilTeam/database/master/games/siapakahaku.json')).json()
    let json = src[Math.floor(Math.random() * src.length)]

    // Daftar link gambar
    const gambar = [
        "https://files.catbox.moe/cbtbde.jpg",
        "https://files.catbox.moe/891z7d.jpg",
        "https://files.catbox.moe/6el1g2.jpg",
        "https://files.catbox.moe/n399m0.jpg"
    ];

    // Pilih gambar secara acak
    const randomGambar = gambar[Math.floor(Math.random() * gambar.length)];


    let caption = `┌─⊷ *${command.toUpperCase()}*
${json.soal}

⏳ Timeout *${(timeout / 1000).toFixed(2)} detik*
💬 Ketik *${usedPrefix}hsia* untuk bantuan
💬 Ketik *nyerah* Untuk Menyerah
➕ Bonus: *${poin} ✨XP*
⚠️ *Balas/ REPLY soal ini untuk menjawab*
└──────────────
    `.trim()
    conn.tebaksiapa[id] = [
        await conn.sendFile(m.chat, randomGambar, 'tebakgambar.jpg', caption, m), // Ganti imgr + command dengan randomGambar
        json, poin,
        setTimeout(() => {
            if (conn.tebaksiapa[id]) conn.reply(m.chat, `🚩 Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tebaksiapa[id][0])
            delete conn.tebaksiapa[id]
        }, timeout)
    ]
}
handler.help = ['tebaksiapa']
handler.tags = ['game']
handler.command = /^tebaksiapa/i

export default handler