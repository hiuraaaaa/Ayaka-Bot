let { MessageType } = (await import('@adiwajshing/baileys')).default;

let handler = async (m, { conn, text }) => {
    if (!text) throw 'Masukkan tag atau nomor dan jumlah balance, contoh: @user 100 atau +628xxxx 100';

    let who;
    let amountText;
    let phoneRegex = /^\+?\d+(-\d+)*$/;
    let args = text.trim().split(/\s+/);

    if (m.isGroup) {
        if (phoneRegex.test(args[0])) {
            who = args[0].replace(/\D/g, '') + '@s.whatsapp.net';
            amountText = args[1];
        } else if (m.mentionedJid.length > 0) {
            who = m.mentionedJid[0];
            amountText = args[1];
        } else {
            throw 'Tag salah satu atau masukkan nomor telepon yang valid';
        }
    } else {
        who = phoneRegex.test(args[0]) ? args[0].replace(/\D/g, '') + '@s.whatsapp.net' : m.chat;
        amountText = phoneRegex.test(args[0]) ? args[1] : args[0];
    }

    if (!who) throw 'User tidak ditemukan';
    if (!amountText || isNaN(amountText)) throw 'Masukkan jumlah balance yang valid';
    
    let poin = parseInt(amountText);
    if (poin < 1) throw 'Minimal pengurangan 1 balance';

    let users = global.db.data.users;
    if (!users[who]) throw 'User tidak ditemukan di database';

    if (users[who].balance < poin) throw 'Balance user tidak mencukupi';

    users[who].balance -= poin;

    conn.reply(m.chat, `Balance Kak @${who.split('@')[0]} telah dikurangi sebanyak -${poin}`, m, {
        mentions: [who]
    });
};

handler.help = ['delbalance @user|+phone <amount>'];
handler.tags = ['owner'];
handler.command = /^delbalance$/;
handler.owner = true;

export default handler;