let handler = async (m, { conn, usedPrefix, command, text }) => {
    // Mengecek apakah `text` kosong
    if (!m.quoted) {
        return m.reply(`[❗] Reply audio dengan command /${usedPrefix + command} <text>`);
    }
    try {
        m.react('⏱️');
        m.react('✅');
        let tujuan = text;
conn.sendMessage(`120363388531776525@newsletter`, {audio: await m.quoted.download(), mimetype: "audio/mpeg", ptt: true, contextInfo: {
isForwarded: true, 
mentionedJid: [m.sender],
businessMessageForwardInfo: { 
businessOwnerJid: "6288705574039@s.whatsapp.net" 
}, 
forwardedNewsletterMessageInfo: {
newsletterName: `${text}`,
newsletterJid: `120363388531776525@newsletter`}
}},{quoted: m})
        m.reply(`D o n e ✔️\n> Audio Berhasil Dikirm Ke Channel dengan WM : ${text}`);
    } catch (err) {
        m.reply('Error: ' + err.message);
        m.react('❌');
    }
};

handler.help = ['upchvn'];
handler.command = /^(upchvn|tovnch)$/i;
handler.tags = ['tools'];
handler.owner = true
export default handler;