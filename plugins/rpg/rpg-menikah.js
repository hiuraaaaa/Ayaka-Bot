import PhoneNumber from 'awesome-phonenumber';
import moment from 'moment-timezone';

let handler = async (m, { conn, args }) => {
    let sender = m.sender;
    let target = m.mentionedJid && m.mentionedJid[0];

    if (!target) return m.reply('⚠️ Tag seseorang yang ingin kamu nikahi!');

    if (!global.db.data.users[sender] || !global.db.data.users[target]) return m.reply('⚠️ Pengguna tidak ada dalam database');

    let user = global.db.data.users[sender];
    let pasangan = global.db.data.users[target];

    let nameUser = user.registered ? user.name : conn.getName(sender);
    let namePasangan = pasangan.registered ? pasangan.name : conn.getName(target);

    let biayaMenikah = 100000000; // 100 juta
    let jumlahUndangan = 3; // Harus mengundang 3 orang

    if (user.money < biayaMenikah) return m.reply(`💰 Uang kamu kurang! Butuh Rp ${biayaMenikah.toLocaleString()} untuk menikah.`);
    
    if (pasangan.isMarried) return m.reply(`⚠️ ${namePasangan} sudah menikah!`);

    pasangan.lamaranDari = sender; // Menandai siapa yang melamar
    pasangan.undanganDiterima = 0; // Reset undangan

    let caption = `
💍 *Lamaran Pernikahan* 💍

👤 *${nameUser}* telah melamar *${namePasangan}*!

🔹 ${namePasangan}, kamu harus menyebarkan undangan ke *${jumlahUndangan} orang* sebelum bisa menerima lamaran.

📜 Gunakan: *.undangan @user1 @user2 @user3*

📝 Jika sudah, gunakan *.terimanikah ${nameUser}* untuk menerima lamaran.
`;

    await conn.sendMessage(m.chat, { text: caption, mentions: [sender, target] });
}

handler.help = ['menikah @user'];
handler.tags = ['rpg'];
handler.command = /^(menikah)$/i;

export default handler;