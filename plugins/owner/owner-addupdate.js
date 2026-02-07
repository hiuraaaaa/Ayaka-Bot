import fs from 'fs';
import path from 'path';

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!m.isGroup) throw 'Fitur ini hanya bisa digunakan di grup, Senpai!';

    if (command === 'addupdate') {
        if (!args[0] || !args[1]) throw `Masukkan input yang benar, Senpai!\nContoh: *${usedPrefix + command} @user1 6 bulan*`;

        let user = args[0].replace('@', '').replace(/\s/g, '');
        if (user.startsWith('+')) user = user.slice(1);
        if (user.startsWith('0')) user = user.slice(1);
        user = user + '@s.whatsapp.net';

        const durationInput = args.slice(1).join(' ').toLowerCase();
        let durationMs;
        if (durationInput.includes('tahun')) {
            const years = parseInt(durationInput);
            if (isNaN(years)) throw 'Jumlah tahun harus angka, Senpai! Contoh: *1 tahun*';
            durationMs = years * 365 * 24 * 60 * 60 * 1000;
        } else if (durationInput.includes('bulan')) {
            const months = parseInt(durationInput);
            if (isNaN(months)) throw 'Jumlah bulan harus angka, Senpai! Contoh: *6 bulan*';
            durationMs = months * 30 * 24 * 60 * 60 * 1000;
        } else if (durationInput.includes('minggu')) {
            const weeks = parseInt(durationInput);
            if (isNaN(weeks)) throw 'Jumlah minggu harus angka, Senpai! Contoh: *2 minggu*';
            durationMs = weeks * 7 * 24 * 60 * 60 * 1000;
        } else if (durationInput.includes('hari')) {
            const days = parseInt(durationInput);
            if (isNaN(days)) throw 'Jumlah hari harus angka, Senpai! Contoh: *30 hari*';
            durationMs = days * 24 * 60 * 60 * 1000;
        } else if (durationInput.includes('jam')) {
            const hours = parseInt(durationInput);
            if (isNaN(hours)) throw 'Jumlah jam harus angka, Senpai! Contoh: *5 jam*';
            durationMs = hours * 60 * 60 * 1000;
        } else {
            throw 'Format waktu salah, Senpai! Gunakan "jam", "hari", "minggu", "bulan", atau "tahun". Contoh: *6 bulan* atau *30 hari*';
        }

        const dbPath = path.join(process.cwd(), 'src/update.json');
        let db = {};
        if (fs.existsSync(dbPath)) {
            db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
        } else {
            fs.mkdirSync(path.dirname(dbPath), { recursive: true });
            fs.writeFileSync(dbPath, JSON.stringify({}));
        }

        const now = Date.now();
        if (!db[m.chat]) db[m.chat] = {};
        db[m.chat][user] = now + durationMs;

        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

        const waktuTersisa = msToDate(durationMs);
        await conn.reply(m.chat, `Sukses, Senpai! User *${args[0]}* akan dihapus dari grup *${m.chat}* setelah *${waktuTersisa}*.`, m);
    } else if (command === 'delupdate') {
        if (!args[0]) throw `Masukkan input yang benar, Senpai!\nContoh: *${usedPrefix + command} @user1*`;

        let user = args[0].replace('@', '').replace(/\s/g, '');
        if (user.startsWith('+')) user = user.slice(1);
        if (user.startsWith('0')) user = user.slice(1);
        user = user + '@s.whatsapp.net';

        const dbPath = path.join(process.cwd(), 'src/update.json');
        if (!fs.existsSync(dbPath)) throw 'Belum ada data update untuk grup ini, Senpai!';

        let db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
        if (!db[m.chat] || !db[m.chat][user]) throw `User *${args[0]}* tidak ditemukan di data update grup ini, Senpai!`;

        delete db[m.chat][user];
        if (Object.keys(db[m.chat]).length === 0) delete db[m.chat];

        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

        await conn.reply(m.chat, `Sukses, Senpai! User *${args[0]}* telah dihapus dari daftar update grup *${m.chat}*.`, m);
    }
};

setInterval(async () => {
    const dbPath = path.join(process.cwd(), 'src/update.json');
    if (!fs.existsSync(dbPath)) return;

    const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    const now = Date.now();

    for (const group in db) {
        for (const user in db[group]) {
            if (now >= db[group][user]) {
                try {
                    await global.conn.groupParticipantsUpdate(group, [user], 'remove');
                    delete db[group][user];
                    if (Object.keys(db[group]).length === 0) delete db[group];
                } catch (err) {
                    console.error(`Gagal mengeluarkan ${user} dari grup ${group}:`, err);
                }
            }
        }
    }

    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}, 60 * 1000);

handler.help = ['addupdate @tag/number <waktu>', 'delupdate @tag/number'];
handler.tags = ['owner'];
handler.command = /^(addupdate|delupdate)$/i;
handler.group = true;
handler.owner = true;
handler.botAdmin = true;

export default handler;

function msToDate(ms) {
    let years = Math.floor(ms / (365 * 24 * 60 * 60 * 1000));
    ms %= 365 * 24 * 60 * 60 * 1000;
    let months = Math.floor(ms / (30 * 24 * 60 * 60 * 1000));
    ms %= 30 * 24 * 60 * 60 * 1000;
    let days = Math.floor(ms / (24 * 60 * 60 * 1000));
    ms %= 24 * 60 * 60 * 1000;
    let hours = Math.floor(ms / (60 * 60 * 1000));
    ms %= 60 * 60 * 1000;
    let minutes = Math.floor(ms / (60 * 1000));
    let result = '';
    if (years) result += `${years} Tahun `;
    if (months) result += `${months} Bulan `;
    if (days) result += `${days} Hari `;
    if (hours) result += `${hours} Jam `;
    if (minutes) result += `${minutes} Menit`;
    return result.trim() || '0 Menit';
}