export async function before(m, { isAdmin, isBotAdmin }) {
  // Define the owner's WhatsApp number
  const owner = '6283857182374@s.whatsapp.net';

  // Exit if the message is from the bot or Baileys-specific
  if (m.isBaileys && m.fromMe) return true;

  // Retrieve chat and sender data
  let chat = global.db.data.chats[m.chat];
  let sender = m.sender;

  // Check if the message is a sticker
  let isSticker = m.mtype === 'stickerMessage';
  let hapus = m.key.participant;
  let bang = m.key.id;

  // Anti-sticker logic
  if (chat.antiSticker && isSticker) {
    // Check if the sender is admin, bot is not admin, or sender is the owner
    if (isAdmin || !isBotAdmin || sender === owner) {
      // Allow the sticker
      return true;
    } else {
      // Notify and delete the sticker
      m.reply(`*Sticker Terdeteksi*\n\nMaaf Tapi Harus Saya Hapus, Karna Admin/Owner Mengaktifkan Anti Sticker Untuk Chat Ini`);
      return this.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: hapus }});
    }
  }
  
  return true;
}