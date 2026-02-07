let handler = async (m, {
    conn,
    isOwner
}) => {
    if (!isOwner) return m.reply('Hanya owner yang dapat menggunakan perintah ini!');
    const delay = 3000; // jeda 3detik atur sendiri
    const message = `Sekarang kamu bisa topup cash dan beli premium otomatis\n\nGunakan : *.topup\n*.premium*`;
    const contextInfo = {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        externalAdReply: {
            title: global.namebot || 'Iklan Await',
            body: 'A D S - A W A I T',
            thumbnailUrl: 'https://files.catbox.moe/74slix.png',
            sourceUrl: 'https://chat.whatsapp.com/DHU0O3aAkwnEKpbrFzcpRb' || 'https://wa.me/6288705574039',
            mediaType: 1,
            renderLargerThumbnail: true
        },
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363322679171544@g.us',
            newsletterName: 'Await ID • Created By Saa',
            serverMessageId: 143
        }
    };

    let groups = Object.keys(conn.chats).filter(id => id.endsWith('@g.us')); // Hanya grup
    let totalSent = 0;
    for (let id of groups) {
        try {
            await conn.sendMessage(id, {
                text: message,
                contextInfo
            });
            totalSent++;
            await delayFunc(delay);
        } catch (e) {
            console.error(`Gagal mengirim pesan ke grup ${id}:`, e);
        }
    }
    m.reply(`Pesan iklan berhasil dikirim ke ${totalSent} grup.`);
};
const delayFunc = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

handler.help = ['sendads2'];
handler.tags = ['owner'];
handler.command = /^sendads2$/i;
handler.owner = true;
export default handler;