import fs from 'fs';
import { createCanvas } from 'canvas';

const dbPath = './src/qurban.json';
let db = { users: {}, lastWeeklyReminder: '', claimedPrize: {} };

if (fs.existsSync(dbPath)) {
    db = JSON.parse(fs.readFileSync(dbPath));
}

function save() {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

function level(p) {
    if (p >= 5000) return '🌟 Relawan Legenda';
    if (p >= 3000) return '🥇 Relawan Ahli';
    if (p >= 1500) return '🥈 Relawan Terampil';
    if (p >= 500) return '🥉 Relawan Pemula';
    return '🧺 Relawan Baru';
}

function hariKeIdulAdha() {
    const now = new Date();
    const idulAdha = new Date('2025-06-07');
    const diff = Math.ceil((idulAdha - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? `${diff} hari lagi menuju Idul Adha!` : 'Hari ini Idul Adha!';
}

async function buatSertifikat(nama, pangkat) {
    const canvas = createCanvas(800, 600);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#f9f3e7';
    ctx.fillRect(0, 0, 800, 600);

    ctx.fillStyle = '#000';
    ctx.font = 'bold 36px Arial';
    ctx.fillText('SERTIFIKAT RELAWAN QURBAN', 160, 100);

    ctx.font = '28px Arial';
    ctx.fillText(`Nama: ${nama}`, 100, 200);
    ctx.fillText(`Pangkat: ${pangkat}`, 100, 250);

    ctx.font = '20px Arial';
    ctx.fillText('Diberikan atas partisipasi luar biasa dalam Qurban Quest 1445H', 100, 350);

    return canvas.toBuffer();
}

const COOLDOWN_TIME = 15 * 60 * 1000;

function isCooldownActive(user, command) {
    if (!user.cooldowns) user.cooldowns = {};
    const last = user.cooldowns[command] || 0;
    return (Date.now() - last) < COOLDOWN_TIME;
}

function getCooldownRemaining(user, command) {
    if (!user.cooldowns) user.cooldowns = {};
    const last = user.cooldowns[command] || 0;
    const remaining = COOLDOWN_TIME - (Date.now() - last);
    return remaining > 0 ? remaining : 0;
}

function formatTime(ms) {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
}

function normalizeNumber(jid) {
    return jid?.replace(/@.+$/, '') || '';
}

function isOwner(m) {
    const ownerNumbers = global.nomorwa || [];
    const senderNumber = normalizeNumber(m.sender);
    return ownerNumbers.includes(senderNumber);
}

let handler = async (m, { conn, command, args }) => {
    let id = m.sender;

    if (!db.users[id]) {
        db.users[id] = {
            kambing: 1,
            sapi: 0,
            poin: 0,
            uang: 0,
            sertifikat: 0,
            tugas: { klaim: 0, bantu: 0, bagi: 0, selesai: false },
            cooldowns: {},
            name: m.pushName
        };
    }

    let user = db.users[id];

    const pointCommands = ['klaimharian', 'bantuwarga', 'berbagiqurban', 'klaimhadiah', 'upgrade', 'ceritaqurban'];

    if (pointCommands.includes(command)) {
        if (isCooldownActive(user, command)) {
            const remaining = formatTime(getCooldownRemaining(user, command));
            return m.reply(`⏳ Tunggu selama ${remaining} sebelum menggunakan perintah ini lagi.`);
        }
    }

    switch (command) {
        case 'qurbanmenu':
            return m.reply(`🐐 QURBAN QUEST 1445H
🧍 Nama: ${user.name}
🎖️ Pangkat: ${level(user.poin)}
⭐ Poin: ${user.poin}
💰 Uang: Rp${user.uang.toLocaleString()}
🐐 Kambing: ${user.kambing}
🐄 Sapi: ${user.sapi}
📜 Sertifikat: ${user.sertifikat}

📌 Perintah:
.sertifikatqurban — Unduh sertifikat relawan
.hitungiduladha — Hitung mundur Idul Adha
.tugasqurban — Cek misi harian
.ceritaqurban — Cerita interaktif bantu warga
.klaimharian — Klaim poin dan uang harian (maks 2x)
.bantuwarga — Bantu warga untuk dapat poin
.berbagiqurban — Sumbangkan kambing ke warga
.upgrade — Tukar uang jadi poin
.inventori — Cek koleksi dan status
.lbqurban — Lihat 10 besar leaderboard
.klaimhadiah — Klaim hadiah besar jika poin cukup`);

        case 'sertifikatqurban': {
            let buf = await buatSertifikat(user.name, level(user.poin));
            return conn.sendMessage(m.chat, { image: buf, caption: `📜 Sertifikat Relawan: *${user.name}* - ${level(user.poin)}` }, { quoted: m });
        }

        case 'hitungiduladha':
            return m.reply(`🕌 ${hariKeIdulAdha()}`);

        case 'klaimharian': {
            if (user.tugas.klaim >= 2) return m.reply('🚫 Klaim maksimal 2x/hari.');
            user.tugas.klaim++;
            let bonus = Math.floor(Math.random() * 100) + 150;
            user.poin += bonus;
            user.uang += 10000;
            user.cooldowns[command] = Date.now();
            save();
            return m.reply(`🎁 Klaim ke-${user.tugas.klaim}/2

⭐ +${bonus} poin 💸 +Rp10.000`);
        }

        case 'bantuwarga': {
            user.tugas.bantu++;
            user.poin += 30;
            user.uang += 5000;
            user.cooldowns[command] = Date.now();
            save();
            return m.reply('🛠️ Kamu bantu warga!\n\n⭐ +30 poin 💸 +Rp5.000');
        }

        case 'berbagiqurban': {
            if (user.kambing < 1) return m.reply('❌ Kamu butuh kambing!');
            user.kambing--;
            user.tugas.bagi++;
            user.poin += 50;
            user.cooldowns[command] = Date.now();
            save();
            return m.reply('🤲 Kamu berbagi kambing!\n\n⭐ +50 poin');
        }

        case 'tugasqurban': {
            let t = user.tugas;
            let teks = `🎯 Tugas Harian:\n\nKlaim harian: ${t.klaim}/2\nBantu warga: ${t.bantu}/5\nBerbagi kambing: ${t.bagi}/3`;

            if (t.klaim >= 2 && t.bantu >= 5 && t.bagi >= 3 && !t.selesai) {
                user.poin += 500;
                user.uang += 20000;
                user.sertifikat++;
                t.selesai = true;
                save();
                return m.reply(`${teks}\n\n✅ Tugas selesai! ⭐ +500 poin 💸 +Rp20.000 📜 +1 Sertifikat`);
            }
            return m.reply(t.selesai ? teks + '\n✅ Sudah selesai hari ini.' : teks);
        }

        case 'ceritaqurban': {
            if (!args[0]) return m.reply(`🐐 Cerita:\n\n1. Bantu cari kambing warga (.ceritaqurban 1)\n\n2. Abaikan warga (.ceritaqurban 2)`);
            if (args[0] == '1') {
                user.poin += 100;
                user.uang += 10000;
                user.cooldowns[command] = Date.now();
                save();
                return m.reply('🤝 Kamu bantu warga! ⭐ +100 poin 💸 +Rp10.000');
            }
            return m.reply('😐 Kamu memilih untuk tidak membantu...');
        }

        case 'inventori':
            return m.reply(`🎒 Inventori:
🐐 Kambing: ${user.kambing}
🐄 Sapi: ${user.sapi}
📜 Sertifikat: ${user.sertifikat}
💰 Uang: Rp${user.uang.toLocaleString()}
⭐ Poin: ${user.poin}`);

        case 'upgrade': {
            if (user.uang < 50000) return m.reply('❌ Butuh Rp50.000');
            user.uang -= 50000;
            user.poin += 300;
            user.cooldowns[command] = Date.now();
            save();
            return m.reply('🔧 Upgrade berhasil! ⭐ +300 poin 💸 -Rp50.000');
        }

        case 'lbqurban': {
            let sorted = Object.entries(db.users).sort((a, b) => b[1].poin - a[1].poin);
            let teksArr = [];
            let mentionedJids = [];
            for (let i = 0; i < Math.min(10, sorted.length); i++) {
                const [jid, u] = sorted[i];
                teksArr.push(`${i + 1}. @${jid.replace(/@.+$/, '')} - ${u.poin} poin`);
                mentionedJids.push(jid);
            }
            let teks = teksArr.join('\n');
            return conn.sendMessage(m.chat, {
                text: `🏆 *LEADERBOARD QURBAN:*\n${teks}`,
                contextInfo: { mentionedJid: mentionedJids }
            }, { quoted: m });
        }

        case 'klaimhadiah': {
            if (db.claimedPrize[id]) return m.reply('🎁 Kamu sudah klaim hadiah spesial Idul Adha.');
            if (user.poin < 3000) return m.reply('❌ Butuh minimal 3000 poin untuk klaim hadiah besar.');
            user.uang += 100000;
            user.sertifikat += 2;
            user.sapi += 1;
            db.claimedPrize[id] = true;
            user.cooldowns[command] = Date.now();
            save();
            return m.reply('🎊 Selamat! Kamu mendapatkan:\n💰 Rp100.000\n📜 +2 Sertifikat\n🐄 +1 Sapi');
        }

        case 'reminderqurban': {
            if (!isOwner(m)) return m.reply('⛔ Hanya owner yang bisa.');
            let today = new Date().toISOString().slice(0, 10);
            if (db.lastWeeklyReminder === today) return m.reply('✅ Reminder sudah dikirim hari ini.');
            let groups = Object.keys(conn.chats).filter(id => id.endsWith('@g.us'));
            for (let g of groups) {
                conn.sendMessage(g, { text: '🕌 QURBAN QUEST Jangan lupa klaim harian dan bantu warga! Ketik .qurbanmenu untuk mulai bermain.' });
            }
            db.lastWeeklyReminder = today;
            save();
            return m.reply('📨 Reminder dikirim ke semua grup.');
        }
    }
};

handler.tags = ['rpg'];
handler.help = handler.command = [
    'qurbanmenu',
    'sertifikatqurban',
    'hitungiduladha',
    'klaimharian',
    'bantuwarga',
    'berbagiqurban',
    'tugasqurban',
    'ceritaqurban',
    'inventori',
    'upgrade',
    'lbqurban',
    'klaimhadiah',
    'reminderqurban'
];

export default handler;