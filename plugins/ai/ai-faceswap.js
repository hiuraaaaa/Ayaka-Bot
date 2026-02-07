import fetch from 'node-fetch';

let handler = async (m, { args, conn }) => {
  if (args.length < 2) return m.reply('⚠️ *Format Salah!*\n\nGunakan:\n.facewap <URL_GAMBAR_ASLI> <URL_WAJAH>\ncontoh:\n.faceswap https://i.supa.codes/Ht4YS https://i.supa.codes/jAHRC');

  let original = encodeURIComponent(args[0]);
  let face = encodeURIComponent(args[1]);

  let apiUrl = `https://api.ryzendesu.vip/api/ai/faceswap?original=${original}&face=${face}`;

  try {
    let loadingMsg = await m.reply('⏳ *Memproses Face Swap...* Mohon tunggu sebentar.');

    let res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`❌ *Gagal! Server tidak merespons (${res.status})*`);

    let buffer = await res.buffer();
    
    await conn.sendMessage(m.chat, { 
      image: buffer, 
      caption: '✨ *Face Swap Berhasil!*\n\n🔄 *Gunakan gambar lain untuk hasil berbeda!*' 
    }, { quoted: m });

    await conn.sendMessage(m.chat, { delete: loadingMsg.key });
  } catch (err) {
    console.error(err);
    m.reply(`❌ *Gagal melakukan Face Swap!*\n\n🚨 *Error:* ${err.message}\n⚠️ Pastikan URL gambar valid.`);
  }
};

handler.help = ["faceswap"];
handler.tags = ["ai"];
handler.command = /^faceswap$/i;
export default handler;;