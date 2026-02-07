const moneykagetCooldown = 30 * 60 * 1000; // 30 menit dalam milidetik
const minParticipants = 3;
const maxParticipants = 15;
const activeMoneykagets = new Map();

let handler = async (m) => {
    let command = m.text.trim().split(' ');
    let user = m.sender;
    let chatId = m.chat;

    // Pastikan data pengguna ada
    if (!global.db.data.users[user]) {
        global.db.data.users[user] = {
            money: 0,
            lastMoneykaget: 0
        };
    }

    let userData = global.db.data.users[user];
    let currentTime = Date.now();

    // Jika pengguna hanya mengetik .moneykaget tanpa argumen tambahan
    if (command[0] === '.moneykaget' && command.length === 1) {
        conn.reply(chatId, `⚠️ Gunakan: .moneykaget <jumlah uang> <jumlah penerima>. Contoh: .moneykaget 1000 5\n\nJika masih belum paham ketik\n* .moneykaget help`, flok);
        return;
    }

    // Pembuatan Moneykaget
    if (command[0] === '.moneykaget' && command[1] !== 'claim' && command[1] !== 'hapus' && command.length === 3) {
        // Validasi input
        let amount = parseInt(command[1]);
        let numParticipants = parseInt(command[2]);
        if (isNaN(amount) || isNaN(numParticipants) || numParticipants < minParticipants || numParticipants > maxParticipants) {
            conn.reply(chatId, `⚠️ Format salah! Gunakan .moneykaget <money> <jumlah pengguna>. Jumlah pengguna harus antara ${minParticipants} dan ${maxParticipants}.`, flok);
            return;
        }
        // Validasi cooldown
        if (userData.lastMoneykaget + moneykagetCooldown > currentTime) {
            let remainingTime = formatTime(userData.lastMoneykaget + moneykagetCooldown - currentTime);
            conn.reply(chatId, `⏳ Kamu @${user.split('@')[0]}, perlu menunggu ${remainingTime} sebelum bisa membuat moneykaget lagi.`, flok);
            return;
        }
        // Validasi eris cukup
        if (userData.money < amount) {
            conn.reply(chatId, `⚠️ Kamu tidak memiliki cukup money (${amount} money diperlukan) untuk membuat moneykaget ini.`, flok);
            return;
        }
        // Kurangi eris dan buat moneykaget baru
        userData.money -= amount;
        let code = generateCode();
        activeMoneykagets.set(code, {
            creator: user,
            amount,
            numParticipants,
            claimed: [],
            createdAt: currentTime
        });
        userData.lastMoneykaget = currentTime;
        // Kirim pesan ke grup tentang moneykaget baru
        conn.reply(chatId, `💸 Moneykaget dibuat oleh @${user.split('@')[0]}!
- Code: ${code}
- Jumlah: ${numParticipants}
🔔 Ketik: .moneykaget claim <code>
🔕 Kadaluarsa dalam 30 menit`, flok);
        setTimeout(() => {
            // Cek apakah moneykaget masih aktif saat waktu habis
            if (activeMoneykagets.has(code)) {
                let moneykaget = activeMoneykagets.get(code);
                if (moneykaget.claimed.length < moneykaget.numParticipants) {
                    // Kembalikan uang sisa ke pengguna yang membuat moneykaget
                    let remainingAmount = moneykaget.amount - calculateTotalClaimed(moneykaget.claimed, moneykaget.amount, moneykaget.numParticipants);
                    global.db.data.users[moneykaget.creator].money += remainingAmount;
                    conn.reply(chatId, `⏰ Moneykaget dengan code ${code} telah kedaluwarsa. Sisa uang ${remainingAmount} Money telah dikembalikan ke @${moneykaget.creator.split('@')[0]}.`, flok);
                }
                activeMoneykagets.delete(code);
            }
        }, moneykagetCooldown);
    }

    // Klaim Moneykaget
    if (command[0] === '.moneykaget' && command[1] === 'claim' && command.length === 3) {
        let code = command[2].trim();
        if (!activeMoneykagets.has(code)) {
            conn.reply(chatId, `⚠️ Kode moneykaget tidak valid atau telah kedaluwarsa.`, flok);
            return;
        }
        let moneykaget = activeMoneykagets.get(code);
        if (moneykaget.claimed.includes(user)) {
            conn.reply(chatId, `⚠️ Kamu sudah mengambil moneykaget ini.`, flok);
            return;
        }
        if (moneykaget.claimed.length >= moneykaget.numParticipants) {
            conn.reply(chatId, `⚠️ Semua moneykaget telah diambil.`, flok);
            return;
        }
        let share = calculateShare(moneykaget.amount, moneykaget.claimed.length, moneykaget.numParticipants);
        userData.money += share;
        moneykaget.claimed.push(user);
        // Kirim pesan ke grup tentang klaim moneykaget
        conn.reply(chatId, `🎉 @${user.split('@')[0]} telah menerima ${share} Money!`, flok);
        if (moneykaget.claimed.length === moneykaget.numParticipants) {
            // Hapus moneykaget jika semua hadiah telah diambil
            conn.reply(chatId, `✅ Semua hadiah untuk moneykaget dengan code ${code} telah diambil.`, flok);
            activeMoneykagets.delete(code);
        }
    }

    // Hapus Moneykaget
    if (command[0] === '.moneykaget' && command[1] === 'hapus' && command.length === 3) {
        let code = command[2].trim();
        console.log('Perintah hapus diterima');
        if (!activeMoneykagets.has(code)) {
            conn.reply(chatId, `⚠️ Kode moneykaget tidak valid atau telah kedaluwarsa.`, flok);
            console.log('Kode tidak valid atau telah kedaluwarsa');
            return;
        }
        let moneykaget = activeMoneykagets.get(code);
        if (moneykaget.creator !== user) {
            conn.reply(chatId, `⚠️ Kamu tidak memiliki izin untuk menghapus moneykaget ini.`, flok);
            console.log('Pengguna tidak memiliki izin');
            return;
        }
        let remainingAmount = moneykaget.amount - calculateTotalClaimed(moneykaget.claimed, moneykaget.amount, moneykaget.numParticipants);
        userData.money += remainingAmount;
        activeMoneykagets.delete(code);
        conn.reply(chatId, `🗑️ Moneykaget dengan code ${code} telah dihapus oleh @${user.split('@')[0]}. Sisa uang ${remainingAmount} Money telah dikembalikan.`, flok);
        console.log('Moneykaget berhasil dihapus');
    }
    if (command[0] === '.moneykaget' && command[1] === 'check') {
    let activeMoneykagetsList = [];
    activeMoneykagets.forEach((moneykaget, code) => {
        if (moneykaget.createdAt + moneykagetCooldown > currentTime) {
            activeMoneykagetsList.push(`Code: ${code}, Jumlah: ${moneykaget.numParticipants}, Dibuat oleh: @${moneykaget.creator.split('@')[0]}`);
        }
    });
    if (activeMoneykagetsList.length === 0) {
        conn.reply(chatId, `⚠️ Tidak ada moneykaget yang masih aktif.`, m);
    } else {
        conn.reply(chatId, `💸 Daftar moneykaget yang masih aktif:\n${activeMoneykagetsList.join('\n')}`, m);
    }
}
if (command[0] === '.moneykaget' && command[1] === 'help' && command.length === 2) {
  conn.reply(chatId, `Bro! 🤩 Berikut tutorial cara bermain moneykaget:

*Membuat Moneykaget*

1. Ketik \`.moneykaget <jumlah uang> <jumlah penerima>\` untuk membuat moneykaget baru. Contoh: \`.moneykaget 1000 5\`
2. Jumlah uang harus cukup dan jumlah penerima harus antara 3 dan 15 orang.
3. Setelah membuat moneykaget, kode unik akan dihasilkan dan dikirim ke grup.

*Klaim Moneykaget*

1. Ketik \`.moneykaget claim <kode>\` untuk klaim moneykaget. Contoh: \`.moneykaget claim ABCDE\`
2. Pastikan kode moneykaget masih aktif dan belum diambil oleh orang lain.
3. Jika klaim berhasil, uang akan ditambahkan ke saldo kamu.

*Hapus Moneykaget*

1. Ketik \`.moneykaget hapus <kode>\` untuk menghapus moneykaget. Contoh: \`.moneykaget hapus ABCDE\`
2. Pastikan kamu adalah pembuat moneykaget dan kode masih aktif.
3. Jika hapus berhasil, uang sisa akan dikembalikan ke saldo kamu.

*Cek Moneykaget Aktif*

1. Ketik \`.moneykaget check\` untuk menampilkan daftar moneykaget yang masih aktif.
2. Daftar akan menampilkan kode, jumlah penerima, dan pembuat moneykaget.

Itu dia, bro! 🎉 Sekarang kamu sudah tahu cara bermain moneykaget. Selamat bermain! 😄`, m);
  return;
}
};

// Fungsi untuk format waktu dari milidetik ke HH:mm:ss
function formatTime(milliseconds) {
    let seconds = Math.floor(milliseconds / 1000);
    let hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    let minutes = Math.floor(seconds / 60);
    seconds %= 60;

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

// Fungsi untuk menambahkan nol di depan angka satu digit
function pad(number) {
    return (number < 10 ? '0' : '') + number;
}

// Fungsi untuk menghasilkan kode acak
function generateCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Fungsi untuk menghitung bagian uang yang diterima oleh setiap peserta
function calculateShare(totalAmount, claimedCount, totalParticipants) {
    const averageShare = totalAmount / totalParticipants;
    const bonusFactor = 1.2; // Klaim pertama mendapat 20% lebih banyak

    if (claimedCount === 0) {
        return Math.round(averageShare * bonusFactor);
    }

    const remainingAmount = totalAmount - (averageShare * bonusFactor);
    const remainingShares = totalParticipants - 1;
    const nextShare = remainingAmount / remainingShares;
    return Math.round(nextShare * (remainingShares - claimedCount) / remainingShares);
}

// Fungsi untuk menghitung total uang yang telah diklaim
function calculateTotalClaimed(claimedArray, totalAmount, totalParticipants) {
    let claimedAmount = 0;
    for (let i = 0; i < claimedArray.length; i++) {
        claimedAmount += calculateShare(totalAmount, i, totalParticipants);
    }
    return claimedAmount;
}

handler.help = ['moneykaget'];
handler.tags = ['game'];
handler.command = /^(moneykaget|\.moneykaget|mk)$/i;
handler.group = true;
handler.register = true;
handler.owner = false;

export default handler;