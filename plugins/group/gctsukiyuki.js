import fs from 'fs';
import fetch from 'node-fetch';
let handler = async (m, { conn }) => { 

         let caption = `*Mʏ Gᴄ Oғғɪᴄɪᴀʟ*`;
  conn.reply(m.chat, caption, m, {
      contextInfo: {
        externalAdReply: {
          title: "G R O U P - C A S T O R I C E",
          thumbnailUrl: global.thumbmenu,
          sourceUrl: global.sgc,
          mediaType: 1,
          renderLargerThumbnail: true, 
          showAdAttribution: true
        }
      }
    });
 }
handler.help = ['gccastoAyaka'];
handler.tags = ['main','info'];
handler.command = ['gccastoAyaka']
export default handler;