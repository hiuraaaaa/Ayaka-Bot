let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Kalo kamu nemu pesan error, lapor pake perintah ini\n\nContoh:\n${usedPrefix + command} selamat siang owner, saya menemukan error seperti berikut <copy/tag pesan errornya>`;
    if (text.length < 5) throw `Terlalu pendek, minimal 5 karakter!`;
    if (text.length > 1000) throw `Mau lapor atau curhat? Maksimal 1000 karakter!`;

    let teks = `*${command.toUpperCase()}!*\n\nDari : *@${m.sender.split`@`[0]}*\n\nPesan : ${text}\n`;

    if (m.quoted && m.quoted.text) teks += `\n*Quoted Message:* ${m.quoted.text}`;

    if (!global.logerror) throw '❌ ID grup logerror belum diatur di global.logerror';
    await conn.sendMessage(global.logerror, { text: teks, mentions: [m.sender] });

    m.reply(`_Pesan terkirim ke grup team projects Ayaka, jika ${command.toLowerCase()} hanya main-main tidak akan ditanggapi._`);
}

handler.help = ['report', 'request'].map(v => v + ' <teks>');
handler.tags = ['info'];
handler.command = /^(report|request)$/i;
export default handler;