/*
📌 Nama Fitur: Fake Tweet [ nyesuain jam ama hari dan pp nya ]
🏷️ Type : Plugin ESM
🔗 Sumber : https://whatsapp.com/channel/0029Vb91Rbi2phHGLOfyPd3N
🔗 Sumber Api : https://fastrestapis.fasturl.cloud
✍️ Convert By ZenzXD x GRAGALL
*/

import fetch from 'node-fetch';

function formatDate() {
  const date = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
  const options = { month: 'long', day: 'numeric', year: 'numeric' };
  const formattedDate = date.toLocaleDateString('en-US', options);
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  const formattedTime = `${hour12}:${minutes} ${ampm}`;
  return { formattedTime, formattedDate };
}

const handler = async (m, { conn, args, usedPrefix, command }) => {
  const input = args.join(' ').split(',');
  if (input.length < 3) {
    return m.reply(`Contoh:\n${usedPrefix + command} ${global.author},${global.namebot},Hai👋 Member Kroco`);
  }

  const name = input[0].trim();
  const username = input[1].trim();
  const content = input.slice(2).join(',').trim();

  const { formattedTime, formattedDate } = formatDate();

  let ppUrl;
  try {
    ppUrl = await conn.profilePictureUrl(m.sender, 'image');
  } catch {
    ppUrl = 'https://files.catbox.moe/h3njeb.jpg'; 
  }

  const imageUrl = `https://fastrestapis.fasturl.cloud/maker/tweet?content=${encodeURIComponent(content)}&ppUrl=${encodeURIComponent(ppUrl)}&name=${encodeURIComponent(name)}&username=${encodeURIComponent(username)}&verified=true&time=${encodeURIComponent(formattedTime)}&date=${encodeURIComponent(formattedDate)}&retweets=1115&quotes=245&likes=5885&mode=dim`;

  try {
    await conn.sendMessage(m.chat, {
      image: { url: imageUrl },
      caption: `*✅ 𝚃𝚠𝚎𝚎𝚝 𝙱𝚎𝚛𝚑𝚊𝚜𝚒𝚕 𝙳𝚒𝚋𝚞𝚊𝚝*\n\n• *ɴᴀᴍᴇ:* ${name}\n• *ᴜsᴇʀɴᴀᴍᴇ:* ${username}`,
      jpegThumbnail: await (await fetch(ppUrl)).buffer()
    }, { quoted: m });
  } catch (e) {
    console.error(e);
    m.reply('❌ Gagal membuat tweet. Coba lagi nanti.');
  }
};

handler.command = ['ftweet', 'faketweet'];
handler.tags = ['maker'];
handler.help = ['ftweet <nama>,<username>,<teks>'];
handler.limit = 3;

export default handler;

/* JANGAN HAPUS WM INI MEK! 
SCRIPT BY © 𝐅𝐚𝐫𝐢𝐞𝐥
•• contacts: (6287872545804)
•• instagram: @Ayakaai__
*/