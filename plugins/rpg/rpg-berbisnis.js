let pendingBusinesses = {}; // Menyimpan status bisnis yang sedang menunggu persetujuan

let handler = async (m, { conn, args, participants: groupParticipants, text, usedPrefix, command }) => {
    let mentioned = m.mentionedJid || [];
    let modal = parseInt(args[0]);

    // Validasi jumlah orang yang ditandai
    if (mentioned.length < 3 || mentioned.length > 5) 
        throw `⚠️ *Minimal tag 3 orang dan maksimal 5 orang!*`;

    // Validasi input modal
    if (isNaN(modal) || modal < 100000 || modal > 100000000) 
        throw `💰 *Modal minimal adalah 100.000 dan maksimal 100.000.000!*`;

    let users = global.db.data.users;

    // Periksa apakah semua yang ditandai ada di database Eris
    for (let id of mentioned) {
        if (!users[id]) throw `🚫 *Salah satu target tidak ditemukan dalam database!*`;
        if (users[id].money < modal) 
            throw `💸 *@${id.split`@`[0]} tidak memiliki cukup uang untuk modal! Minimal modal 100.000*`;
    }

    // Periksa apakah pengirim memiliki cukup modal
    if (users[m.sender].money < modal)
        throw `💸 *Kamu tidak memiliki cukup modal! Minimal modal 100.000*`;

    // Kirim pesan untuk meminta persetujuan dari semua orang dalam satu chat
    let participantsList = [m.sender, ...mentioned];
    let businessId = `business_${m.sender}_${new Date().getTime()}`;

    pendingBusinesses[businessId] = {
        participants: participantsList,
        accept: [],
        reject: [],
        modal: modal,
        started: false,
        timeout: setTimeout(() => {
            if (pendingBusinesses[businessId].accept.length === 0) {
                conn.reply(m.chat, `⚠️ Tidak ada yang menerima ajakan. Bisnis dibatalkan.`, m);
                delete pendingBusinesses[businessId];
            } else {
                startBusiness(m, conn, modal, pendingBusinesses[businessId].accept, m.sender);
                delete pendingBusinesses[businessId];
            }
        }, 120000) // 2 menit untuk persetujuan
    };

    // Kirim pesan ajakan dalam satu chat
    conn.reply(
        m.chat,
        `💼 @${m.sender.split`@`[0]} mengajak kamu berbisnis dengan modal *${modal.toLocaleString()}*.\n\n` +
        `Ketik *Terima* untuk bergabung atau *Tolak* untuk menolak dalam waktu 2 menit.\n\n` +
        `*Peserta yang diajak:*\n` + mentioned.map(id => `🔹 @${id.split`@`[0]}`).join('\n'),
        m, { mentions: mentioned }
    );
};

// Command untuk menerima bisnis
let terimaHandler = async (m, { conn }) => {
    let business = Object.values(pendingBusinesses).find(b => b.participants.includes(m.sender) && !b.started);

    if (!business) return conn.reply(m.chat, `⚠️ Kamu tidak ada dalam bisnis yang menunggu persetujuan.`, m);

    business.accept.push(m.sender);
    conn.reply(m.chat, `✅ @${m.sender.split`@`[0]} menerima ajakan berbisnis.`, m, { mentions: [m.sender] });

    // Jika semua peserta menerima, mulai bisnis lebih cepat
    if (business.accept.length === business.participants.length - 1) {
        clearTimeout(business.timeout);
        startBusiness(m, conn, business.modal, business.accept, business.participants[0]);
        delete pendingBusinesses[business.businessId];
    }
};

// Command untuk menolak bisnis
let tolakHandler = async (m, { conn }) => {
    let business = Object.values(pendingBusinesses).find(b => b.participants.includes(m.sender) && !b.started);

    if (!business) return conn.reply(m.chat, `⚠️ Kamu tidak ada dalam bisnis yang menunggu persetujuan.`, m);

    business.reject.push(m.sender);
    conn.reply(m.chat, `❌ @${m.sender.split`@`[0]} menolak ajakan berbisnis.`, m, { mentions: [m.sender] });

    // Jika semua peserta menolak, bisnis dibatalkan
    if (business.reject.length === business.participants.length - 1) {
        clearTimeout(business.timeout);
        conn.reply(m.chat, `⚠️ Semua peserta menolak ajakan. Bisnis dibatalkan.`, m);
        delete pendingBusinesses[business.businessId];
    }
};

// Fungsi untuk memulai bisnis dengan peserta yang menyetujui
function startBusiness(m, conn, modal, participants, owner) {
    let users = global.db.data.users;

    // Kurangi uang peserta
    users[m.sender].money -= modal;
    participants.forEach(id => {
        users[id].money -= modal;
    });

    conn.reply(
        m.chat,
        `📝 *[Berbisnis Dimulai]*\n\n💼 Modal masing-masing: *${modal.toLocaleString()}*\n\n⏳ Tunggu 3 menit untuk hasilnya...\n\n*Peserta Bisnis:*\n🔹 @${owner.split`@`[0]}\n${participants.map(id => '🔹 @' + id.split`@`[0]).join('\n')}`,
        m, { mentions: [owner, ...participants] }
    );

    setTimeout(() => {
        let result = Math.random();
        let multiplier;
        let outcome;
        let bonusLuck = Math.random() < 0.1;  // 10% chance for luck bonus

        // Hasil Bisnis dengan tingkat yang berbeda
        if (result < 0.1) {
            multiplier = Math.random() * 0.3; // Rugi 0-30%
            outcome = "🚨 Rugi Besar! Bangkrut Total!";
        } else if (result < 0.3) {
            multiplier = Math.random() * 0.7 + 0.3; // Rugi 30%-100%
            outcome = "📉 Rugi Sedikit!";
        } else if (result < 0.5) {
            multiplier = Math.random() * 2 + 1; // Untung kecil 1-2x modal
            outcome = "💵 Untung Kecil!";
        } else if (result < 0.8) {
            multiplier = Math.random() * 3 + 2; // Untung sedang 2-5x modal
            outcome = "💰 Untung Besar!";
        } else {
            multiplier = Math.random() * 5 + 5; // Untung sangat besar 5-10x modal
            outcome = "🎉 Jackpot! Untung Sangat Besar!";
        }

        // Bonus Keberuntungan
        if (bonusLuck) {
            multiplier *= 3; // Multiplier bertambah 3 kali lipat
            outcome += `\n🍀 *Bonus Keberuntungan!* 🎲`;
        }

        // Hitung hasil reward
        let reward = Math.floor(modal * multiplier);

        // Update uang pemain
        global.db.data.users[m.sender].money += reward;
        participants.forEach(id => {
            global.db.data.users[id].money += reward;
        });

        // Pesan hasil
        conn.reply(
            m.chat,
            `🏅 *[Hasil Bisnis]*\n\n${outcome}\n\n🎁 Kalian mendapatkan: *${reward.toLocaleString()}* dari modal *${modal.toLocaleString()}*\n\n*Peserta Mendapat:*\n🔹 @${owner.split`@`[0]}: *+${reward.toLocaleString()}*\n${participants.map(id => `🔹 @${id.split`@`[0]}: *+${reward.toLocaleString()}*`).join('\n')}\n\n💼 *Sampai Jumpa di Bisnis Berikutnya!*`,
            m, { mentions: [owner, ...participants] }
        );
    }, 180000); // 3 menit dalam milidetik
}

// Atur handler
handler.help = ["berbisnis"];
handler.tags = ["rpg"];
handler.command = /^berbisnis$/i;
handler.limit = true;
handler.group = true;

export default handler;

// Atur handler untuk terima dan tolak
terimaHandler.command = /^terima$/i;
tolakHandler.command = /^tolak$/i;
export { terimaHandler, tolakHandler };