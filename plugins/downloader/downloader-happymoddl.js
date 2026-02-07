import fetch from 'node-fetch';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Masukkan URL!\nContoh: ${usedPrefix + command} https://www.happymod.com/garena-free-fire-max-app-mod/com.dts.freefiremax`;
  
  let response = await fetch(`https://api.zahwazein.xyz/webzone/happymod/download?url=${text}&apikey=e6acac24b9`);
  let data = await response.json();
  
  if (data.status !== 200) throw 'Gagal mengambil APK dari HappyMod.';
  
  await conn.sendFile(m.chat, data.result, 'happymod.apk', 'Nih', m);
}

handler.help = ['happymoddl <url>'];
handler.tags = ['downloader'];
handler.command = /^happymoddl$/i;
handler.premium = false;

export default handler;