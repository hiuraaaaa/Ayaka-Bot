let handler = m => m;

handler.before = async function (m, { conn, isBotAdmin, isAdmin }) {
  if ((m.isBaileys && m.fromMe) || m.fromMe || !m.isGroup || isAdmin) return true;

  let chatId = m.chat;
  let groupData = global.db.data.chats[chatId];

  if (!groupData.antiTagStatus || m.mtype !== 'groupStatusMentionMessage') return false;

  let sender = m.sender;
  let tag = '@' + sender.split`@`[0];

  if (!groupData.users) groupData.users = {};
  let users = groupData.users;

  if (!users[sender]) users[sender] = { warn: 0 };

  users[sender].warn += 1;

  await m.reply(`*「 ANTI TAG STATUS 」*\n\nDetected *${tag}*, kamu mention status di grup!\n\nWarn Kamu *${users[sender].warn}/5*\n\n> Jangan tag status di grup ya, 5 kali warn auto kick!`);

  if (isBotAdmin) await conn.sendMessage(m.chat, { delete: m.key });

  if (users[sender].warn >= 5) {
    await m.reply(`*「 ANTI TAG STATUS 」*\n\n*${tag}* udah 5 kali mention status, bye-bye dari grup!`);
    await conn.groupParticipantsUpdate(m.chat, [sender], 'remove');
    users[sender].warn = 0;
  }

  return true;
};

handler.group = true;
handler.botAdmin = true;

export default handler;