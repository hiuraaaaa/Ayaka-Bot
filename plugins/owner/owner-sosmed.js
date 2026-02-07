/*
* Nama Fitur : Sosial Media
* Type : Plugins ESM
* Sumber : https://whatsapp.com/channel/0029Vb6p7345a23vpJBq3a1h
* Channel Testimoni : https://whatsapp.com/channel/0029Vb6B91zEVccCAAsrpV2q
* Group Bot : https://chat.whatsapp.com/HqYS4bZEyLU4OiDnw8XDcH
* Author : 𝐅𝐚𝐫𝐢𝐞l
* Nomor Author : https://wa.me/6288705574039
*/

import fs from 'fs';

let handler = async (m, { conn, usedPrefix }) => {
  let today = new Date();
  let curHr = today.getHours();
  let timeOfDay;

  if (curHr < 12) {
    timeOfDay = 'pagi';
  } else if (curHr < 18) {
    timeOfDay = 'siang';
  } else {
    timeOfDay = 'malam';
  }

  let payText = `
Halo Kak, selamat ${timeOfDay} 🌞🌛

╭‒‒‒‒‒‒‒‒‒‒‒‒╼
╰‒╼ *Instagram*
    ≡ ${link.ig}
╭‒‒‒‒‒‒‒‒‒‒‒‒╼
╰‒╼ *TikTok*
    ≡ ${link.tt}
╭‒‒‒‒‒‒‒‒‒‒‒‒╼
╰‒╼ *Group Chat 𝐄𝐥𝐚𝐫𝐚-𝐌𝐃*
    ≡ ${link.gc}    
╭‒‒‒‒‒‒‒‒‒‒‒‒╼
╰‒╼ *Group Store 𝐄𝐥𝐚𝐫𝐚-𝐌𝐃* ≡ ${link.gcs}
╭‒‒‒‒‒‒‒‒‒‒‒‒╼
╰‒╼ *Channel 𝐄𝐥𝐚𝐫𝐚-𝐌𝐃* ≡ ${link.ch}
╭‒‒‒‒‒‒‒‒‒‒‒‒╼
╰‒╼ *Channel Testimoni 𝐄𝐥𝐚𝐫𝐚-𝐌𝐃*
    ≡ ${link.cht}

Ini adalah akun media sosial pemikik bot WhatsApp ini. Silakan kunjungi dan ikuti untuk mendapatkan pembaruan terbaru tentang bot ini.
`;

  // Definisikan fkontak
  const fkontak = {
    key: { 
      participant: '0@s.whatsapp.net', 
      remoteJid: '0@s.whatsapp.net', 
      fromMe: false, 
      id: 'Halo' 
    },
    message: { 
      conversation: `👥 Sosial Media` 
    }
  };

  conn.sendMessage(m.chat, {
    audio: fs.readFileSync('./media/Lann4you.mp3'),
    mimetype: 'audio/mp4',
    ptt: true
  }, { quoted: fkontak });
  conn.sendMessage(m.chat, { 
    react: { 
      text: '📱', 
      key: m.key 
    }
  });

  conn.sendMessage(m.chat, {
    text: payText, 
    contextInfo: {
      externalAdReply: {
        title: '𝙸 𝙽 𝙵 𝙾  𝚂 𝙾 𝚂 𝙼 𝙴 𝙳',
        body: `${global.author} || ${global.namebot}`,
        thumbnailUrl: global.thumb, 
        sourceUrl: global.link.ch,
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  });

};

handler.command = /^(sosmed)$/i;
handler.tags = ['info'];
handler.help = ['sosmed'];

export default handler;