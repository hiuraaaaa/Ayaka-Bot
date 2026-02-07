import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
  if (!text) {
    return m.reply(`*Example:* .realistic gadis anime`);
  }

  try {
    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

    const response = await fetch(`https://imgen.duck.mom/prompt/${encodeURIComponent(text)}?quality=high&hdr=true`);
    
    if (!response.ok) throw new Error('Gagal mengambil image.');
    
    const imageUrl = response.url;
 
     // Mengirim Data Result Ke User
    await conn.sendMessage(m.chat, {
      image: { url: imageUrl },
      caption: `Sukses Membuat Dengan Promt: ${text}`
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: "✔️", key: m.key } });

  } catch (error) {
    console.error(error);
    
    m.reply('Yah, terjadi error! Laporkan ke owner agar diperbaiki.');
  }
}

handler.help = ['realistic', '3dmodel', 'realistis']; 
handler.tags = ['ai'];
handler.command = /^(realistic|realistis|3dmodel)/i;
handler.register = true
handler.limit = true

export default handler;