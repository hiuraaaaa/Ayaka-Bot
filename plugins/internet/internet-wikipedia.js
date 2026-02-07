import fetch from 'node-fetch';

let handler = async (m, { text, usedPrefix, command, conn }) => {
  text = String(text || '').trim();
  if (!text) return m.reply(`📚 *Contoh:* ${usedPrefix}wikipedia Prabowo`);

  try {
    let res = await fetch(`https://api.siputzx.my.id/api/s/wikipedia?query=${encodeURIComponent(text)}`);
    let json = await res.json();

    if (!json.status || !json.data || !json.data.wiki) throw '⚠️ Tidak ditemukan hasil untuk kata kunci tersebut.';

    let wikiText = cleanWikiText(json.data.wiki);
    let summary = wikiText.length > 1000 ? wikiText.substring(0, 1000) + '...\n\n🔗 *Selengkapnya:* ' + `https://id.wikipedia.org/wiki/${encodeURIComponent(text)}` : wikiText;

    let caption = `📖 *Wikipedia - ${text}*\n\n${summary}`;
    let thumb = json.data.thumb || 'https://upload.wikimedia.org/wikipedia/commons/6/63/Wikipedia-logo.png';

    await conn.sendMessage(m.chat, {
      text: caption,
      contextInfo: {
        externalAdReply: {
          title: 'W I K I P E D I A',
          body: 'Sumber: Wikipedia',
          thumbnailUrl: `https://telegra.ph/file/892f227dca4258e6f2421.jpg`,
          sourceUrl: `https://id.wikipedia.org/wiki/${encodeURIComponent(text)}`,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    });
  } catch (err) {
    console.error(err);
    m.reply('⚠️ Error: Gagal mengambil data dari Wikipedia.');
  }
};

function cleanWikiText(text) {
  return text
    .replace(/\[\d+\]/g, '') 
    .replace(/\(.+?\)/g, '') 
    .replace(/\.mw-parser-output.+?\s/g, '') 
    .trim();
}

handler.help = ['wikipedia <query>'];
handler.tags = ['internet'];
handler.command = /^(wiki|wikipedia)$/i;
handler.limit = true;

export default handler;