const suits = ['batu', 'gunting', 'kertas'];

let handler = async (m, { conn, args, usedPrefix }) => {
    let user = global.db.data.users[m.sender];
    let betAmount = 0;
    let time = global.db.data.users[m.sender].udahklaimmmm + 200000
  if (new Date - global.db.data.users[m.sender].udahklaimmmm < 200000) throw `Kamu Sudah Suit\nTunggu Selama ${msToTime(time - new Date())} Lagi`
    
    // Validasi jumlah taruhan
    if (args[0] && args[0].toLowerCase() === 'all') {
        betAmount = user.money; // Taruhan semua saldo eris pengguna
    } else {
        betAmount = parseInt(args[0]) || 0;
    }

    // Validasi jumlah tttaruh
    if (betAmount <= 0 || isNaN(betAmount)) {
        return m.reply(`Masukkan jumlah taruhan.`);
    }

    // Validasi saldo pengguna
    if (user.money < betAmount) {
        return m.reply(`Money tidak mencukupi untuk melakukan taruhan sebesar ${betAmount.toLocaleString()}.`);
    }

    // Bot memilih suit secara acak untuk pengguna
    let userChoice = suits[Math.floor(Math.random() * suits.length)];
    let botChoice = suits[Math.floor(Math.random() * suits.length)];

    // Menentukan hasil suit
    let result;
    if (userChoice === botChoice) {
        result = 'Seri';
    } else if (
        (userChoice === 'batu' && botChoice === 'gunting') ||
        (userChoice === 'gunting' && botChoice === 'kertas') ||
        (userChoice === 'kertas' && botChoice === 'batu')
    ) {
        result = 'Menang';
    } else {
        result = 'Kalah';
    }

    // Mengupdate saldo pengguna berdasarkan hasil suit
    if (result === 'Menang') {
        user.money += betAmount; // Pengguna menang, eris ditambahkan
    } else if (result === 'Seri') {
        // Tidak ada perubahan pada saldo eris
        // Pengguna mendapatkan kembali uang taruhan
    } else {
        user.money -= betAmount; // Pengguna kalah, eris dikurangi
    }

    // Menampilkan emoji sesuai dengan pilihan suit
    let emojiUser = getEmojiForChoice(userChoice);
    let emojiBot = getEmojiForChoice(botChoice);

    // Menampilkan hasil suit dan informasi taruhan dengan emoji
    conn.reply(m.chat, `👤 Kamu memilih: ${emojiUser} ${userChoice}
🌺 Ayaka memilih: ${emojiBot} ${botChoice}
📢 Hasil: ${getEmojiForResult(result)} ${result === 'Seri' ? 'Seri!' : `Kamu ${result}!`}
${result === 'Menang' ? `\n🎉 Kamu memenangkan taruhan sebesar ${betAmount.toLocaleString()} Money.` : result === 'Kalah' ? `💸 Kamu kalah dalam taruhan sebesar ${betAmount.toLocaleString()} Money.` : 'Tidak ada taruhan karena seri.'}\n
> Saldo Money saat ini: ${user.money.toLocaleString()}`, flok);
global.db.data.users[m.sender].udahklaimmmm = new Date * 1
};

// Fungsi untuk mendapatkan emoji berdasarkan pilihan suit
function getEmojiForChoice(choice) {
    switch (choice) {
        case 'batu':
            return '✊';
        case 'gunting':
            return '✌️';
        case 'kertas':
            return '🖐️';
        default:
            return '';
    }
}

// Fungsi untuk mendapatkan emoji berdasarkan hasil suit
function getEmojiForResult(result) {
    switch (result) {
        case 'Menang':
            return '😁';
        case 'Kalah':
            return '😢';
        case 'Seri':
            return '😐';
        default:
            return '';
    }
}

handler.help = ['suit <jumlah taruhan | all>'];
handler.tags = ['game'];
handler.command = /^(suit)$/i;
handler.register = true;

export default handler;

function msToTime(duration) {
  var milliseconds = parseInt((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24),
    monthly = Math.floor((duration / (1000 * 60 * 60 * 24)) % 720)

  monthly  = (monthly < 10) ? "0" + monthly : monthly
  hours = (hours < 10) ? "0" + hours : hours
  minutes = (minutes < 10) ? "0" + minutes : minutes
  seconds = (seconds < 10) ? "0" + seconds : seconds

  return monthly + " Hari " +  hours + " Jam " + minutes + " Menit"
}