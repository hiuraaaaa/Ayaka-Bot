import fetch from 'node-fetch';

let handler = async (m, { conn, args, command }) => {
  let text = args[0];
  if (!text) return m.reply("Masukkan link Videy!");
  if (!text.includes('videy')) return m.reply("Itu bukan link Videy!");

  try {
    let res = await fetch(`https://api.agatz.xyz/api/videydl?url=${text}`);
    let json = await res.json();
    if (!json.status || !json.data) throw json;

    await conn.sendMessage(m.chat, {
      video: { url: json.data },
      caption: "🎥 Downloader Videy"
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    m.reply("❌ Terjadi kesalahan saat mengambil data.");
  }
};

handler.command = /^videy$/i;
handler.help = ['videy <link>'];
handler.tags = ['downloader'];
handler.limit = 5;

export default handler;