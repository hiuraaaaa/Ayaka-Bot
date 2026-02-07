let handler = async (m, { conn, usedPrefix }) => {
let loadd = [
' 𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑑𝑎𝑡𝑎...',
'▒▒▒▒▒▒▒▒▒▒ 0%',
'█▒▒▒▒▒▒▒▒▒ 10%',
'███▒▒▒▒▒▒▒ 30%',
'████▒▒▒▒▒▒ 40%',
'█████▒▒▒▒▒ 50%',
'███████▒▒▒ 70%',
'█████████▒ 90%',
'██████████ 100%',
'Ｓｕｃｃｅｓｓ...'
 ]

let { key } = await conn.sendMessage(m.chat, {text: '_Loading_'})//Pengalih isu

for (let i = 0; i < loadd.length; i++) {
await conn.sendMessage(m.chat, {text: loadd[i], edit: key })}
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
Halo Kak, Ini Sosmed Owner 🍁

╭‒‒‒‒‒‒‒‒‒‒‒‒╼
╰‒╼ *Instagram*
    ≡ ${global.sig}
╭‒‒‒‒‒‒‒‒‒‒‒‒╼
╰‒╼ *Whatsapp*
    ≡ ${global.nomorwa}
╭‒‒‒‒‒‒‒‒‒‒‒‒╼
╰‒╼ *Info Lengkap*
    ≡ ${global.bio}

Ini adalah akun media sosial pengembang bot WhatsApp ini. Silakan kunjungi dan ikuti untuk mendapatkan pembaruan terbaru tentang bot ini.
`;

  await conn.relayMessage(m.chat, { reactionMessage: { key: m.key, text: '🍁' }}, { messageId: m.key.id });
  conn.sendMessage(m.chat, {
    text: payText, 
    contextInfo: {
      externalAdReply: {
        title: 'I N F O  S O S M E D',
        body: global.author,
        thumbnailUrl: global.Lann4youjpg, 
        sourceUrl: 'https://www.facebook.com/Lann4youa.gblike',
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  });

  // Kirim file audio baru
  let vn = "https://files.catbox.moe/ry7ibk.mp3";
  conn.sendFile(m.chat, vn, "sepuh.mp3", null, m, true, {
    type: "audioMessage",
    ptt: true,
  });
};

handler.command = /^(sosmedowner)$/i;
handler.tags = ['info'];
handler.help = ['sosmedowner'];

export default handler;