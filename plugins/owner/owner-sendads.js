let handler = async (m, {
    conn,
    isOwner,
    args,
    text
}) => {
    if (!isOwner) return m.reply('Hanya owner yang dapat menggunakan perintah ini!');

    if (!text && !m.quoted) return m.reply('Kirim teksnya langsung atau reply ke pesan yang ingin dikirim.');

    const delay = 3000; // jeda 3 detik, atur sendiri
    const message = text || m.quoted?.text;

    const contextInfo = {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        externalAdReply: {
            title: global.namebot,
            body: 'Apa arti kehidupan itu?',
            thumbnailUrl: 'https://c.termai.cc/a21/xjwKfnz.jpg',
            sourceUrl: 'https://chat.whatsapp.com/HxBHntSYbMoGdpY7tVqLuK?mode=wwc',
            mediaType: 1,
            renderLargerThumbnail: true
        },
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363299719848392@newsletter',
            newsletterName: 'Lann4you! || Begining Development',
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

    m.reply(`Pesan berhasil dikirim ke ${totalSent} grup.`);
};

const delayFunc = (ms) => new Promise(resolve => setTimeout(resolve, ms));

handler.help = ['sendads <teks>'];
handler.tags = ['owner'];
handler.command = /^sendads$/i;
handler.owner = true;

export default handler;