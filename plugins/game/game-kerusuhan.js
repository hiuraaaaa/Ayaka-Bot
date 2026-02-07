const handler = async (m, { conn, args, command }) => {
  const target = m.mentionedJid[0];
  if (!target) throw `Tag seseorang untuk memulai kerusuhan!\n\nContoh:\n.${command} @user`;

  const teks = `🔥 *Apakah kamu yakin ingin memulai kerusuhan dengan @${target.split('@')[0]}?*`;

  const buttons = [
    { buttonId: `.kerusuhanmulai ${target}`, buttonText: { displayText: 'Mulai Kerusuhan ⚔️' }, type: 1 },
    { buttonId: `.kerusuhankabur`, buttonText: { displayText: 'Melarikan Diri 🏃' }, type: 1 }
  ];

  await conn.sendMessage(m.chat, {
    text: teks,
    mentions: [target],
    footer: 'Ubed Bot - Kerusuhan 1vs1',
    buttons: buttons,
    headerType: 1
  }, { quoted: m });
};

handler.command = /^\kerusuhan$/i;
handler.group = true;
handler.tags = ['game'];

export default handler;