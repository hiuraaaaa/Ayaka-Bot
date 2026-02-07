// --- Definisi fkontak ---
const fkontak = {
 key: { participant: '0@s.whatsapp.net', remoteJid: '0@s.whatsapp.net', fromMe: false, id: 'Halo' },
 message: { conversation: `Info Banned User 🤖` } 
};

let handler = async (m, { jid, conn }) => {
    let users = Object.entries(global.db.data.users).filter(user => user[1].banned);
    let mentionedJids = users.map(([jid]) => jid);
    let userList = users.length ? users.map(([jid, data]) => {
        let banExpires = data.banExpires;
        let banReason = data.banReason || 'Tanpa Alasan'; // Ambil alasan, beri default
        let status, berakhir;
        const isPermanent = banExpires > (Date.now() + 1000 * 60 * 60 * 24 * 365 * 100) || banExpires === 0;

        if (isPermanent) {
            status = 'Permanen';
            berakhir = '-';
        } else if (banExpires > Date.now()) {
            status = 'Sementara';
            berakhir = `${new Date(banExpires).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB`;
        } else {
            status = 'Habis (Error)';
            berakhir = 'Sudah Berakhir';
        }

        return `
*👤 User:* @${jid.split('@')[0]}
*📝 Status:* ${status}
*🔚 Berakhir:* ${berakhir}
*📑 Alasan:* ${banReason}
`.trim();
    }).join('\n\n') : 'Tidak ada user yang di banned.';

    let replyText = `
📑 *Daftar User Terbanned*
📊 *Total: ${users.length} User*

${userList}
`.trim();

    // Buat tombol
    const buttons = [
        { buttonId: '.unbanall', buttonText: { displayText: '🔓 Unban Semua' }, type: 1 }
    ];

    const buttonMessage = {
        text: replyText,
        footer: 'Tekan tombol di bawah untuk menghapus semua ban.',
        buttons: buttons,
        headerType: 1,
        contextInfo: {
            mentionedJid: mentionedJids, 
        }
    };

    // Kirim pesan dengan tombol
    await conn.sendMessage(m.chat, buttonMessage, { quoted: fkontak }); // <-- Modifikasi di sini
}

handler.help = ['bannedlist'];
handler.tags = ['info'];
handler.command = /^listban(ned)?|ban(ned)?list|daftarban(ned)?$/i;
export default handler;