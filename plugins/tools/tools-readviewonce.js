const handler = async (m, { conn, isAdmin, isBotAdmin }) => {
    const ownerNumbers = [(conn.user?.jid || '').replace(/[^0-9]/g, '')]; // Ambil nomor owner dari bot

    const isOwner = ownerNumbers.includes(m.sender.replace(/[^0-9]/g, '')); // Cek apakah pengguna adalah owner

    if (!m.isGroup) return conn.reply(m.chat, '❌ Perintah ini hanya bisa digunakan di dalam grup!', m);
    if (!isAdmin && !isOwner) return conn.reply(m.chat, '❌ Perintah ini hanya bisa digunakan oleh admin grup!', m);

    if (!m.quoted) return conn.reply(m.chat, `Reply pesan view once-nya! 🙏`, m);

    if (!/viewOnce(MessageV2)?/.test(m.quoted.mtype) && !m.quoted?.viewOnce) {
        return conn.reply(m.chat, `Hmm... ini bukan pesan view once kak! 🤔`, m);
    }

    let msg = m.quoted;
    let type = msg.mtype;
    let buffer = await m.quoted.download();

    if (/video/.test(type)) {
        return conn.sendFile(m.chat, buffer, 'media.mp4', msg.text || '', m);
    } else if (/image/.test(type)) {
        return conn.sendFile(m.chat, buffer, 'media.jpg', msg.text || '', m);
    }
};

handler.help = ['readviewonce'];
handler.tags = ['tools'];
handler.command = /^rvo|readviewonce$/i;
handler.group = true; // Hanya bisa digunakan di grup

export default handler;