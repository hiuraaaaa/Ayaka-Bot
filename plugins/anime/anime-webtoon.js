import fetch from 'node-fetch';

let handler = async (m, { conn, text, command }) => {
  if (!text) {
    return m.reply(`❌ Masukkan judul webtoon!\n\nContoh: *${command} lookism*`);
  }

  // Kirim emoji 🍏 sebagai reaksi saat memproses
  await conn.sendMessage(m.chat, {
    react: {
      text: '🍏',
      key: m.key
    }
  });

  try {
    const url = `https://api.diioffc.web.id/api/search/webtoons?query=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    const json = await res.json();

    if (!json.result || json.result.length === 0) {
      return m.reply('❌ Tidak ditemukan hasil untuk pencarian tersebut.');
    }

    let teks = '*🔎 Hasil Pencarian WEBTOONS*\n\n';
    for (let i of json.result) {
      teks += `*◦ Judul :* ${i.judul}\n`;
      teks += `*◦ Genre :* ${i.genre}\n`;
      teks += `*◦ Author :* ${i.author}\n`;
      teks += `*◦ Likes :* ${i.likes}\n`;
      teks += `*◦ Link Url :* ${i.link}\n\n`;
    }

    await conn.sendMessage(m.chat, { text: teks }, { quoted: m });

  } catch (e) {
    console.error(e);
    m.reply('❌ Terjadi kesalahan saat mencari webtoon.');
  }
};

handler.help = ['webtoon <judul>'];
handler.tags = ['anime', 'search'];
handler.command = /^webtoon(s)?$/i;
handler.limit = true;
handler.premium = false;
handler.register = false;

export default handler;