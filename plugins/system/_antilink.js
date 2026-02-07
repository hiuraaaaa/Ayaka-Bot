let handler = m => m;

let linkRegex = /https?:\/\/whatsapp\.com\/channel\//i;
let groupLinkRegex = /https?:\/\/chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i;

handler.before = async function (m, { conn, isBotAdmin, isAdmin }) {
  if ((m.isBaileys && m.fromMe) || m.fromMe || !m.isGroup || isAdmin) return true;

  let chatId = m.chat;
  let groupData = global.db.data.chats[chatId];
  if (!groupData.antiLink || !(linkRegex.test(m.text) || groupLinkRegex.test(m.text))) return false;

  let sender = m.sender;
  let tag = '@' + sender.split`@`[0];
  
  // Inisialisasi users jika belum ada
  if (!groupData.users) groupData.users = {};
  let users = groupData.users;
  
  // Inisialisasi data pengguna jika belum ada
  if (!users[sender]) users[sender] = { warn: 0 };
  
  // Tambahkan peringatan
  users[sender].warn += 1;
  
  await m.reply(`*「 ANTI LINK 」*\n\nDetected *${tag}*, kamu telah mengirimkan link!\n\nWarn Kamu *${users[sender].warn}/5*\n\n> Jika mencapai 5, kamu akan dikeluarkan dari grup!`);

  // Hapus pesan jika bot adalah admin
  if (isBotAdmin) await conn.sendMessage(m.chat, { delete: m.key });

  // Jika peringatan mencapai 5, keluarkan pengguna dari grup
  if (users[sender].warn >= 5) {
    await m.reply(`*「 ANTI LINK 」*\n\n*${tag}* telah mencapai 5 peringatan dan akan dikeluarkan dari grup.`);
    await conn.groupParticipantsUpdate(m.chat, [sender], 'remove');
    
    // Reset peringatan setelah pengguna dikeluarkan
    users[sender].warn = 0; // Reset warn ke 0
  }

  return true;
};

export default handler;