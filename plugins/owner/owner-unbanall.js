// --- Definisi fkontak ---
const fkontak = {
 key: { participant: '0@s.whatsapp.net', remoteJid: '0@s.whatsapp.net', fromMe: false, id: 'Halo' },
 message: { conversation: `Un-Banned User All ✅` } 
};

let handler = async (m, { conn }) => {
    let users = global.db.data.users;
    let unbannedCount = 0;

    for (let userId in users) {
        if (users[userId].banned) {
            users[userId].banned = false; // Hapus status banned
            users[userId].banExpires = 0; // Set banExpires ke 0
            users[userId].banReason = null; // Hapus alasan ban
            users[userId].warning = 0; // Reset warning jika diperlukan
            unbannedCount++;
        }
    }

    conn.reply(m.chat, `Done! Unbanned ${unbannedCount} users.`, m, { quoted: fkontak }); // <-- Modifikasi di sini
};

handler.help = ['unbanall'];
handler.tags = ['owner'];
handler.command = /^(unbanall)$/i;
handler.owner = true;

export default handler;