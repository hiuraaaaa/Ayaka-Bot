const handler = async (m, { conn, args }) => {
  const id = args && /\d+\-\d+@g.us/.test(args[0]) ? args[0] : m.chat;
  try {
    const chat = conn.chats[id];
    if (!chat || !chat.messages) {
      throw new Error('No messages found in the chat.');
    }

    const data = chat.messages;
    const online = Object.values(data).map(item => item.key.participant);

    const uniqueOnline = [...new Set(online)];

    const message = '┌─〔 Daftar Online 〕\n' + uniqueOnline.map(v => '├ @' + v.replace(/@.+/, '')).join('\n') + '\n└────';

    await conn.reply(m.chat, message, m, {
      contextInfo: { mentionedJid: uniqueOnline }
    });
  } catch (e) {
    await conn.reply(m.chat, 'Terjadi kesalahan dalam mengambil daftar online.', m);
    console.error(e);
  }
};

handler.help = ['listonline'];
handler.tags = ['group'];
handler.command = /^(liston(line)?)$/i;
handler.owner = false;
handler.mods = false;
handler.premium = false;
handler.group = false;
handler.private = false;
handler.admin = true;
handler.botAdmin = false;
handler.fail = null;

export default handler;