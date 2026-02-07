// Plugin untuk menampilkan daftar calon DPR yang menang pemilu
let handler = async (m, { conn }) => {
    // Cek apakah pemilu sudah selesai dan ada pemenang
    if (!global.db.data.parties) {
        return m.reply('Belum ada pemilu yang dimulai.');
    }

    let message = 'Daftar Calon DPR yang Menang:\n\n';
    let winnerFound = false;

    // Periksa setiap partai dan hitung pemenang
    for (let party in global.db.data.parties) {
        // Cek apakah partai memiliki calon
        if (global.db.data.parties[party].candidates && global.db.data.parties[party].candidates.length > 0) {
            let winnerCandidate = global.db.data.parties[party].candidates[0];  // Ambil calon pertama sebagai pemenang (atau bisa disesuaikan)
            let votes = global.db.data.parties[party].votes;  // Suara untuk partai tersebut

            // Jika partai memiliki suara lebih dari 0
            if (votes > 0) {
                message += `Partai: ${party} - Calon: ${winnerCandidate} - Suara: ${votes}\n`;
                winnerFound = true;
            }
        }
    }

    // Jika tidak ada pemenang yang ditemukan
    if (!winnerFound) {
        return m.reply('Tidak ada pemenang untuk pemilu DPR.');
    }

    // Kirimkan daftar pemenang
    m.reply(message);
};

handler.help = ['anggotadpr'];
handler.tags = ['game', 'rpg'];
handler.command = /^(Anggotadpr)$/i;

export default handler;