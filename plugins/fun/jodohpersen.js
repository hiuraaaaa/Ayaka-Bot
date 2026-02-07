import fetch from 'node-fetch';

let handler = async (m, { text, participants, usedPrefix, command }) => {
    let pasangan = text.split(',').map(v => v.trim());

    if (pasangan.length !== 2 && !m.mentionedJid.length) {
        throw `❌ *Format salah!*\n\nGunakan:\n${usedPrefix + command} nama1, nama2\n\nAtau tag dua orang:\n${usedPrefix + command} @user1 @user2`;
    }

    let nama1, nama2;
    let tag = false;

    if (m.mentionedJid.length === 2) {
        nama1 = m.mentionedJid[0];
        nama2 = m.mentionedJid[1];
        tag = true;
    } else {
        [nama1, nama2] = pasangan;
    }


    let persentase = Math.floor(Math.random() * 101);
    let alasanCocok = [
        "Kalian berdua memiliki kesamaan yang luar biasa dan saling melengkapi.",
        "Hubungan kalian penuh dengan pengertian dan saling mendukung.",
        "Kalian memiliki chemistry yang kuat dan akan saling melengkapi.",
        "Kalian saling memahami satu sama lain tanpa perlu banyak kata.",
        "Kalian selalu menemukan cara untuk membuat satu sama lain tersenyum.",
        "Kalian memiliki tujuan hidup yang sama dan saling mendukung.",
        "Kalian berdua memiliki rasa hormat yang besar satu sama lain.",
        "Kalian bisa saling mengandalkan dalam situasi apa pun.",
        "Kalian selalu merasa nyaman dan aman saat bersama.",
        "Kalian berdua selalu tahu bagaimana membuat satu sama lain bahagia."
    ];

    let alasanTidakCocok = [
        "Meskipun kalian baik, tapi kalian berdua mungkin tidak cocok bersama.",
        "Kalian mungkin lebih baik sebagai teman daripada pasangan.",
        "Perbedaan kalian terlalu besar untuk diatasi dalam hubungan romantis.",
        "Kalian mungkin memiliki visi hidup yang berbeda.",
        "Terlalu banyak perbedaan yang membuat hubungan kalian sulit.",
        "Kalian mungkin sulit menemukan kesamaan dalam hal penting.",
        "Kalian cenderung sering bertengkar dan sulit berkompromi.",
        "Kalian mungkin kurang memiliki kesamaan dalam nilai dan prinsip.",
        "Kalian mungkin lebih bahagia jika bersama orang lain.",
        "Kalian mungkin lebih baik menjalani hidup masing-masing."
    ];

    let alasan = persentase >= 50 ? alasanCocok[Math.floor(Math.random() * alasanCocok.length)] : alasanTidakCocok[Math.floor(Math.random() * alasanTidakCocok.length)];

    let pasanganString;
    if (tag) {
        pasanganString = `${nama1 ? `@${nama1.split('@')[0]}` : ''} ❤️ ${nama2 ? `@${nama2.split('@')[0]}` : ''}`;
    } else {
        pasanganString = `${nama1} ❤️ ${nama2}`;
    }


    let pesan = `
❤️ *Cek Kecocokan Jodoh* 💙

👫 *Pasangan:* ${pasanganString}
💖 *Kecocokan:* ${persentase}%
📖 *Alasan:* ${alasan}

✨ *Apakah kalian jodoh sejati?* ✨
`;

    m.reply(pesan, null, { mentions: tag ? [nama1, nama2] : [] });
};

handler.help = ['cekjodoh <nama1>, <nama2>'];
handler.tags = ['fun'];
handler.command = /^(cekjodoh|jodoh)$/i;

export default handler;