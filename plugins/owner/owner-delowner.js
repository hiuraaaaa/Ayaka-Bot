let handler = async (m, { conn, text }) => {
    let who;
    if (m.isGroup) {
        who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text;
    } else {
        who = m.chat;
    }
    if (!who) throw 'Tag atau reply user yang ingin dihapus dari Owner!';
    
    const number = who.split('@')[0];
    const index = global.owner.findIndex(([id]) => id === number);

    if (index === -1) throw 'User ini bukan Owner!';

    global.owner.splice(index, 1); 
    const caption = `@${number} telah dihapus dari daftar Owner.`;
    await conn.reply(m.chat, caption, m, {
        mentions: conn.parseMention(caption)
    });
}

handler.help = ['delowner @user']
handler.tags = ['owner']
handler.command = /^(-|del)(owner|sudo)$/i
handler.owner = true

export default handler;