import fetch from 'node-fetch'

let timeout = 120000
let poin = 4999
let handler = async (m, { conn, command, usedPrefix }) => {

    // Daftar link gambar
    const images = [
        "https://files.catbox.moe/ukj21t.jpg",
        "https://files.catbox.moe/6ph7qg.jpg",
        "https://files.catbox.moe/is3djp.jpg",
        "https://files.catbox.moe/qli55j.jpg",
        "https://files.catbox.moe/qygii8.jpg"
    ];

    // Pilih gambar secara acak
    const randomIndex = Math.floor(Math.random() * images.length);
    const randomImage = images[randomIndex];


    conn.tebakkimia = conn.tebakkimia ? conn.tebakkimia : {}
    let id = m.chat
    if (id in conn.tebakkimia) {
        conn.reply(m.chat, '❗Masih ada soal belum terjawab di chat ini', conn.tebakkimia[id][0])
        throw false
    }
    let src = await (await fetch('https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakkimia.json')).json()
  let json = src[Math.floor(Math.random() * src.length)]
    let caption = `┌─⊷ *${command.toUpperCase()}*
🧪 Usur kimia : *[ ${json.lambang} ]*
⏳ Timeout *${(timeout / 1000).toFixed(2)} detik*
💬 Ketik *${usedPrefix}hkim* untuk bantuan
💬 Ketik *nyerah* Untuk Menyerah
➕ Bonus: *${poin} ✨XP*
⚠️ *Balas/ REPLY soal ini untuk menjawab*
└──────────────
    `.trim()
    conn.tebakkimia[id] = [
        await conn.sendFile(m.chat, randomImage, null, caption, m), // Menggunakan gambar acak dari daftar
        json, poin,
        setTimeout(() => {
            if (conn.tebakkimia[id]) conn.reply(m.chat, `🚩 Waktu habis!\nJawabannya adalah *${json.unsur}* *[ ${json.lambang} ]*`, conn.tebakkimia[id][0])
            delete conn.tebakkimia[id]
        }, timeout)
    ]
}
handler.help = ['tebakkimia']
handler.tags = ['game']
handler.command = /^tebakkimia/i

export default handler