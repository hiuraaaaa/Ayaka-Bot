import { load } from 'cheerio';
import fetch from 'node-fetch';
const { proto, generateWAMessageFromContent, prepareWAMessageMedia } = (await import('@adiwajshing/baileys')).default;

const handler = async (m, { conn, text }) => {
  if (!text) {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    return m.reply('Harap masukkan ID karakter Free Fire.\nContoh: .ffchar 580');
  }

  const charId = parseInt(text);
  if (isNaN(charId)) {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    return m.reply('ID karakter harus berupa angka!');
  }

  try {
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    const url = `https://ff.garena.com/id/chars/${charId}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Gagal mengambil data karakter.');

    const html = await response.text();
    const $ = load(html);

    const charImage = $('.char-pic img').attr('src') || null;
    if (!charImage) throw new Error('Gambar karakter tidak ditemukan.');

    const prevLink = $('.char-prev a').attr('href') || null;
    const nextLink = $('.char-next a').attr('href') || null;
    const prevName = $('.char-prev .pre-next .prev div').text().trim() || 'Tidak ada';
    const nextName = $('.char-next .pre-next .next div').text().trim() || 'Tidak ada';
    const prevId = prevLink ? prevLink.match(/\/chars\/(\d+)/)?.[1] || null : null;
    const nextId = nextLink ? nextLink.match(/\/chars\/(\d+)/)?.[1] || null : null;

    const char = [
      `\`F R E E  F I R E  C H A R A C T E R\`\n`,
      `🔥 *Nama:* ${$('.char-name').text().trim() || 'Tidak ditemukan'}`,
      `📝 *Abstrak:* ${$('.char-abstract').text().trim() || 'Tidak ada'}`,
      `💪 *Kemampuan:* ${$('.skill-profile-name').text().trim() || 'Tidak ada'}`,
      `📖 *Deskripsi Kemampuan:* ${$('.skill-introduction').text().trim() || 'Tidak ada'}`,
      `🧑‍🎤 *Biografi:* ${$('.detail p').text().trim() || 'Tidak ada'}`,
      `📊 *Profil:*`,
      ...$('.profile-item').map((i, el) => `  ➡️ ${$(el).find('.profile-key').text().trim()}: ${$(el).find('.profile-value').text().trim()}`).get(),
      `🖼️ *Gambar:*`,
      `  🧑 Karakter: ${charImage}`,
      `  🌌 Latar Belakang: ${$('.char-detail-bg-pic div').first().css('background-image')?.match(/url\("(.+)"\)/)?.[1] || 'Tidak ada'}`,
      `  📸 Biografi: ${$('.pic-img').css('background-image')?.match(/url\("(.+)"\)/)?.[1] || 'Tidak ada'}`,
      `⬅️ *Karakter Sebelumnya:* ${prevName}`,
      `➡️ *Karakter Berikutnya:* ${nextName}`
    ].join('\n');
    
    conn.sendMessage(m.key.remoteJid, {
  text: char, 
  footer: "Powered by Lann4you",
  buttons: [
    { buttonId: `.ffchar ${nextId}`, buttonText: { displayText: `➡️ ${nextName}` }, type: 1 },
    { buttonId: `.ffchar ${prevId}`, buttonText: { displayText: `⬅️ ${prevName}` }, type: 1 }
  ],
  headerType: 4,
  viewOnce: true
}, { quoted: flok })

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
  } catch (e) {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    m.reply(`❌ Oops, ada error: ${e.message}`);
  }
};

handler.help = ['ffchar <ID karakter>'];
handler.tags = ['tools'];
handler.command = /^(ffchar|ffcharacter)$/i;
handler.limit = 5;
handler.register = true;

export default handler;