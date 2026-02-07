import fs from 'fs'
let timeout = 120000;
let poin = 4999;

// Daftar link gambar
const gambar = [
    "https://files.catbox.moe/vj2nm0.jpg",
    "https://files.catbox.moe/x3aazd.jpg"
];

let handler = async (m, { conn, command, usedPrefix }) => {
    conn.game = conn.game ? conn.game : {};
    let id = 'tebakanml-' + m.chat;
    if (id in conn.game) return conn.reply(m.chat, '❗Masih ada soal belum terjawab di chat ini', conn.game[id][0]);

    let src = JSON.parse(fs.readFileSync('./json/tebakanml.json', 'utf-8'));
    let json = src[Math.floor(Math.random() * src.length)];

    // Pilih gambar secara acak
    const randomGambar = gambar[Math.floor(Math.random() * gambar.length)];

    let caption = `┌─⊷ *${command.toUpperCase()}*
${json.soal}

⏳ Timeout *${(timeout / 1000).toFixed(2)} detik*
💬 Ketik *${usedPrefix}tekml* untuk bantuan
💬 Ketik *nyerah* Untuk Menyerah
➕ Bonus: *${poin} ✨XP*
⚠️ *Balas/ REPLY soal ini untuk menjawab*
└──────────────
    `.trim();

    conn.game[id] = [
        await conn.sendFile(m.chat, randomGambar, 'tebakan.jpg', caption, m), // Kirim gambar dengan caption
        json, poin,
        setTimeout(() => {
            if (conn.game[id]) {
                conn.reply(m.chat, `🚩 Waktu habis❗\nJawabannya adalah *${json.jawaban}*`, conn.game[id][0]);
            }
            delete conn.game[id];
        }, timeout)
    ];
};

handler.help = ['tebakheroml'];
handler.tags = ['game'];
handler.command = /^tebakheroml$/i;

handler.limit = false;
handler.group = true;
handler.register = true;

export default handler;