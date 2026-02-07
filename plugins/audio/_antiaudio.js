// Nama file: _antiaudio.js

import fs from 'fs';

export async function before(m, { conn, isAdmin, isBotAdmin }) {
  if (m.isBaileys && m.fromMe) return true;
  let chat = global.db.data.chats[m.chat];
  let sender = m.sender;
  let isAudio = m.mtype === "audioMessage";

  if (chat.antiAudio && isAudio) {
    if (m.msg.ptt) return true;
    if (isAdmin) return true;

    const thumb = fs.readFileSync('./media/denied.jpg');
    let text;

    if (isBotAdmin) {
      text = `*「 ANTI AUDIO 」*\n\n*❗ᴛᴇʀᴅᴇᴛᴇᴋsɪ @${sender.split('@')[0]} ᴍᴇɴɢɪʀɪᴍ ᴀᴜᴅɪᴏ!*\n\n> ᴅɪʟᴀʀᴀɴɢ ᴍᴇɴɢɪʀɪᴍ ᴀᴜᴅɪᴏ ᴋᴀʀᴇɴᴀ *ᴀᴅᴍɪɴ* ᴍᴇɴɢᴀᴋᴛɪғᴋᴀɴ *ᴀɴᴛɪᴀᴜᴅɪᴏ*!`;
    } else {
      // Diubah disini: Menggunakan teks untuk kondisi bot bukan admin
      text = `*「 ANTI AUDIO 」*\n\n*❗ᴛᴇʀᴅᴇᴛᴇᴋsɪ @${sender.split('@')[0]} ᴍᴇɴɢɪʀɪᴍ ᴀᴜᴅɪᴏ!*\n\n> ᴅɪʟᴀʀᴀɴɢ ᴍᴇɴɢɪʀɪᴍ *ᴀᴜᴅɪᴏ* ᴋᴀʀᴇɴᴀ *ᴀᴅᴍɪɴ* ᴍᴇɴɢᴀᴋᴛɪғᴋᴀɴ *ᴀɴᴛɪᴀᴜᴅɪᴏ*!\n\n> ʙᴏᴛ ᴛɪᴅᴀᴋ ᴅᴀᴘᴀᴛ ᴍᴇɴɢʜᴀᴘᴜs ᴘᴇsᴀɴ *ᴀᴜᴅɪᴏ* ᴋᴀʀᴇɴᴀ ʙᴏᴛ ʙᴜᴋᴀɴ *ᴀᴅᴍɪɴ*`;
    }
    
    await conn.sendMessage(m.chat, {
      text: text,
      contextInfo: {
        mentionedJid: [sender],
        externalAdReply: {
          title: '🚫 ᴀ ᴋ s ᴇ s  ᴅ ɪ ᴛ ᴏ ʟ ᴀ ᴋ',
          body: `${global.namebot} || ${global.author}` || '6287872545804',
          thumbnail: thumb,
          mediaType: 1,
          renderLargerThumbnail: false
        }
      }
    });

    if (isBotAdmin) {
      await conn.sendMessage(m.chat, { delete: m.key });
    }
    
    return false;
  }
  return true;
}