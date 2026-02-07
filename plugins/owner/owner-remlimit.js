let { MessageType } = (await import('@adiwajshing/baileys')).default;

let handler = async (m, { conn, text }) => {
    if (!text) throw 'Masukkan nomor/tag dan jumlah limit yang akan dikurangi.\n\nContoh:\nremlimit 6283857182374 10\nremlimit @tag 10';
    
    let who;
    let args = text.split(' ');

    // Cek apakah input berupa tag atau nomor
    if (m.isGroup) {
        if (m.mentionedJid && m.mentionedJid[0]) {
            who = m.mentionedJid[0]; // Ambil dari tag
        } else if (args[0].match(/^\d+$/)) {
            who = args[0] + '@s.whatsapp.net'; // Format nomor jadi JID
        }
    } else {
        if (args[0].match(/^\d+$/)) {
            who = args[0] + '@s.whatsapp.net'; // Format nomor di chat pribadi
        } else {
            who = m.chat; // Untuk chat pribadi
        }
    }

    if (!who) throw 'Masukkan tag atau nomor yang valid.';
    
    // Ambil jumlah limit dari argumen kedua
    let jumlahLimit = args.length > 1 ? parseInt(args[1]) : null;

    if (!jumlahLimit || isNaN(jumlahLimit)) throw 'Jumlah limit harus berupa angka.\n\nContoh:\nremlimit 6283857182374 10\nremlimit @tag 10';
    if (jumlahLimit < 1) throw 'Jumlah limit minimal 1.';

    let users = global.db.data.users;

    if (!users[who]) throw 'Pengguna tidak ditemukan dalam database.';
    users[who].limit -= jumlahLimit;

    // Kirim konfirmasi
    conn.reply(
        m.chat, 
        `Maaf Kak @${who.split`@`[0]}, limit kamu telah dikurangi sebanyak -${jumlahLimit} LIMIT oleh owner.`,
        m,
        { mentions: [who] }
    );
};

handler.help = ['remlimit @user|number <amount>'];
handler.tags = ['owner'];
handler.command = /^remlimit$/;
handler.owner = true;

export default handler;