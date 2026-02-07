import fs from 'fs';
import fetch from 'node-fetch';
let handler = async (m, { conn }) => { 

         let caption = `*Mʏ Gᴄ Oғғɪᴄɪᴀʟ*`;
  conn.reply(m.chat, caption, m, {
      contextInfo: {
        externalAdReply: {
          title: "G R O U P - T S I Y U K I",
          thumbnailUrl: 'https://c.termai.cc/a84/yMuukJQ.jpg',
          sourceUrl: global.sgc,
          mediaType: 1,
          renderLargerThumbnail: true, 
          showAdAttribution: true
        }
      }
    });
 }
handler.help = ['gcAyaka'];
handler.tags = ['main','info'];
handler.command = ['gcAyaka']
export default handler;