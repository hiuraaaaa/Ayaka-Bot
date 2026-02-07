import fs from 'fs';
import path from 'path';

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!m.isGroup) throw 'Fitur ini hanya bisa digunakan di grup, Senpai!';
    if (!args[0]) throw `Masukkan input yang benar, Senpai!\nContoh: *${usedPrefix + command} @user1*`;

    let user = args[0].replace('@', '').replace(/\s/g, '');
    if (user.startsWith('+')) user = user.slice(1);
    if (user.startsWith('0')) user = user.slice(1);
    user = user + '@s.whatsapp.net';

    const dbPath = path.join(process.cwd(), 'src/update.json');
    if (!fs.existsSync(dbPath)) throw 'Belum ada data update untuk grup ini, Senpai!';

    const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    if (!db[m.chat] || !db[m.chat][user]) throw `User *${args[0]}* tidak ditemukan di data update grup ini, Senpai!`;

    const now = Date.now();
    const expiration = db[m.chat][user];
    if (now >= expiration) {
        await conn.reply(m.chat, `Waktu untuk user *${args[0]}* sudah habis, Senpai!`, m);
        return;
    }

    const waktuTersisa = msToDate(expiration - now);
    await conn.reply(m.chat, `Sisa waktu untuk user *${args[0]}* di grup *${m.chat}*: *${waktuTersisa}*.`, m);
};

handler.help = ['cekupdate @tag'];
handler.tags = ['owner'];
handler.command = /^(cekupdate)$/i;
handler.group = true;
handler.owner = true;

export default handler;

function msToDate(ms) {
    let days = Math.floor(ms / (24 * 60 * 60 * 1000));
    let daysms = ms % (24 * 60 * 60 * 1000);
    let hours = Math.floor(daysms / (60 * 60 * 1000));
    let hoursms = ms % (60 * 60 * 1000);
    let minutes = Math.floor(hoursms / (60 * 1000));
    return `${days} Hari ${hours} Jam ${minutes} Menit`;
}