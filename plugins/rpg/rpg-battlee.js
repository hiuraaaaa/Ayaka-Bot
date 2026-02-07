const timeout = 1500000; // 25 menit cooldown untuk sesi pertarungan
const battleTimeout = 100; // 30 detik untuk memilih serang atau mundur

export const handler = async (m, { conn }) => {
    const tag = '@' + m.sender.split`@`[0];
    let user = global.db.data.users[m.sender];
    let time = user.lastbattle + timeout;

    if (new Date() - user.lastbattle < timeout) {
        throw `Kamu sudah bertarung terlalu baru. Tunggu selama ${msToTime(time - new Date())} lagi.`;
    }

    // Cek nilai user.attack
    if (user.attack < 100) {
        throw `⚠️ Attack kamu terlalu rendah (${user.attack}). Latihan terlebih dahulu dengan fitur training!`;
    }

    // Definisikan monster dan item yang bisa didapat
    const monsters = [
        { name: "Kucing Liar", hp: 30, attack: 10, type: "Penyerang" },
        { name: "Anjing Hutan", hp: 50, attack: 15, type: "Penyerang" },
        { name: "Serigala", hp: 70, attack: 20, type: "Penyerang" },
        { name: "Beruang", hp: 100, attack: 25, type: "Penyerang" },
        { name: "Naga Kecil", hp: 150, attack: 30, type: "Penyerang" }
    ];

    // Pilih monster secara acak
    const monster = monsters[Math.floor(Math.random() * monsters.length)];
    user.battleSession = true; // Mengatur sesi pertarungan
    user.monsterHp = monster.hp; // Menyimpan HP monster untuk referensi
    user.monsterAttack = monster.attack; // Menyimpan serangan monster

    let battleInfo = `🏆 *Pertarungan Melawan ${monster.name}* 🏆\n\n` +
        `🔹 *Nama Monster:* ${monster.name}\n` +
        `🔹 *HP Monster:* ${monster.hp}\n` +
        `🔹 *Tipe Monster:* ${monster.type}\n` +
        `🔹 *Serangan Monster:* ${monster.attack} Damage\n\n` +
        `Hasil Pertarungan akan segera ditampilkan...`;

    conn.reply(m.chat, battleInfo, m);

    setTimeout(() => {
        let reward = Math.floor(Math.random() * (3000000 - 100000)) + 100000; // Uang
        let expGain = Math.floor(Math.random() * (100000 - 1000)) + 1000; // XP
        let legendaryGain = Math.floor(Math.random() * (30 - 5)) + 5; // Legendary
        let uncommonGain = Math.floor(Math.random() * (90 - 20)) + 20; // Uncommon
        let rockGain = Math.floor(Math.random() * (200 - 100)) + 100; // Rock
        let diamondGain = Math.floor(Math.random() * (30 - 12)) + 12; // Diamond
        let woodGain = Math.floor(Math.random() * (300 - 100)) + 100; // Wood

        // Menambah item dan XP ke pengguna
        user.money += reward;
        user.exp += expGain;
        user.legendary += legendaryGain;
        user.uncommon += uncommonGain;
        user.rock += rockGain;
        user.diamond += diamondGain;
        user.wood += woodGain;

        let resultInfo = `🎉 Kamu telah selesai bertarung melawan ${monster.name}!\n` +
            `🏅 Hasil Pertarungan: \n` +
            `💰 Uang: ${reward}\n` +
            `📊 XP: ${expGain}\n` +
            `💎 Legendary Item: ${legendaryGain}\n` +
            `📦 Uncommon Item: ${uncommonGain}\n` +
            `🪨 Rock: ${rockGain}\n` +
            `💎 Diamond: ${diamondGain}\n` +
            `🪵 Wood: ${woodGain}\n`;

        conn.reply(m.chat, resultInfo, m);
        user.battleSession = false; // Mengakhiri sesi pertarungan
        user.lastbattle = new Date() * 1; // Update waktu pertarungan
    }, battleTimeout);
}

// Fungsi untuk menghitung waktu tersisa dalam format yang lebih ramah
const msToTime = (duration) => {
    let milliseconds = parseInt((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return `${hours} Jam ${minutes} Menit ${seconds} Detik`;
}

handler.help = ['battle']
handler.tags = ['rpg']
handler.command = /^(battle)$/i
export default handler;