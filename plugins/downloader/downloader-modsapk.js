import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { basename } from 'path';
import { writeFile } from 'fs/promises';

let handler = async (m, { conn, args, command }) => {
  const subcommand = args[0];
  const query = args.slice(1).join(" ");
  if (!subcommand) return m.reply("Contoh: *.getmodsapk search super vpn*");

  if (subcommand === 'search') {
    if (!query) return m.reply("Contoh: *.getmodsapk search super vpn*");
    const results = await Search(query);
    if (!results.length) return m.reply("😔 Tidak ditemukan hasil.");

    let rows = results.slice(0, 10).map(item => ({
      header: '📦 GetModsApk',
      title: item.title,
      description: `Versi: ${item.version} | Ukuran: ${item.size}`,
      id: `.getmodsapk detail ${item.link}`
    }));

    conn.sendMessage(m.chat, {
      text: `🔍 Hasil pencarian untuk *${query}*`,
      footer: 'Pilih aplikasi untuk lihat detail.',
      buttons: [{
        buttonId: 'action',
        buttonText: { displayText: '📥 Pilih Aplikasi' },
        type: 4,
        nativeFlowInfo: {
          name: 'single_select',
          paramsJson: JSON.stringify({
            title: 'Pilih Aplikasi',
            sections: [
              { title: 'Hasil Pencarian', rows }
            ]
          })
        }
      }]
    }, { quoted: m });

  } else if (subcommand === 'detail') {
    if (!query.startsWith('http')) return m.reply('Masukkan URL valid dari hasil pencarian!');
    const detail = await Detail(query);
    if (!detail.downloadLink) return m.reply('❌ Gagal mengambil link download.');

    const teks = `*📱 ${detail.judul}*

🧑 Developer: ${detail.developer}
🆙 Versi: ${detail.versi}
📦 Ukuran: ${detail.size}
📅 Update: ${detail.lastUpdate}
⭐ Rating: ${detail.rating} (${detail.ratingCount} suara)
💻 OS: ${detail.requirements}

📝 Deskripsi:
${detail.deskripsi}`.trim();

    await conn.sendMessage(m.chat, {
      image: { url: detail.thumbnail },
      caption: teks,
      buttons: [
        { buttonId: `.getmodsapk download ${detail.downloadLink}`, buttonText: { displayText: '⬇ Download Sekarang' }, type: 1 }
      ]
    }, { quoted: m });

  } else if (subcommand === 'download') {
    if (!query.startsWith('http')) return m.reply('Masukkan link download valid!');
    const url = await Download(query);
    if (!url || !url.endsWith('.apk')) return m.reply('❌ File bukan .apk atau gagal mengambil link.');

    const res = await fetch(url);
    const buffer = await res.buffer();
    const filename = basename(url).split('?')[0];

    await conn.sendMessage(m.chat, {
      document: buffer,
      fileName: filename,
      mimetype: 'application/vnd.android.package-archive',
      caption: `✅ Berikut file *${filename}*\n\n📥 Download berhasil!\n📦 Sumber: getmodsapk.com`,
    }, { quoted: m });

  } else {
    m.reply('Subcommand tidak dikenal. Gunakan: *search | detail | download*');
  }
};

handler.help = ['getmodsapk search <keyword>','getmodsapk detail <link>','getmodsapk download <link>'];
handler.tags = ['tools','downloader'];
handler.command = /^getmodsapk$/i;
handler.register = true;
handler.limit = 5;

export default handler;

async function Search(query) {
  try {
    const url = `https://getmodsapk.com/search?query=${encodeURIComponent(query)}`;
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const html = await res.text();
    const $ = cheerio.load(html);
    const results = [];

    $('div.grid > a').each((i, el) => {
      const title = $(el).find('h3').text().trim();
      const link = $(el).attr('href');
      const version = $(el).find('span.text-xs.text-gray-600').first().text().trim();
      const size = $(el).find('span:contains("Size:")').next().text().trim();
      if (title && link) {
        results.push({
          title,
          link: link.startsWith('http') ? link : `https://getmodsapk.com${link}`,
          version: version || '-',
          size: size || '-',
        });
      }
    });
    return results;
  } catch {
    return [];
  }
}

async function Detail(url) {
  try {
    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);

    const jsonLd = $('script[type="application/ld+json"]').map((i, el) => $(el).html()).get().find(j => j.includes('"SoftwareApplication"'));
    let schema = {};
    if (jsonLd) schema = JSON.parse(jsonLd);

    const judul = schema.name || $('title').text().trim();
    const versi = schema.softwareVersion || '-';
    const size = schema.fileSize || '-';
    const rating = schema.aggregateRating?.ratingValue || '-';
    const ratingCount = schema.aggregateRating?.ratingCount || '-';
    const lastUpdate = schema.dateModified || '-';
    const developer = schema.author?.name || '-';
    const requirements = schema.operatingSystem || '-';
    const deskripsi = schema.description || $('meta[name="description"]').attr('content') || '-';

    let thumbnail = schema.thumbnailUrl || '';
    if (thumbnail && !/^https?:/.test(thumbnail)) thumbnail = new URL(thumbnail, url).href;

    let downloadLink = '';
    $('a').each((i, el) => {
      const href = $(el).attr('href');
      const text = $(el).text().toLowerCase();
      if (href && text.includes('download')) {
        downloadLink = href.startsWith('http') ? href : new URL(href, url).href;
        return false;
      }
    });

    return {
      judul, versi, size, rating, ratingCount, lastUpdate,
      developer, thumbnail, requirements, downloadLink, deskripsi
    };
  } catch {
    return {};
  }
}

async function Download(downloadPageUrl) {
  try {
    const res = await fetch(downloadPageUrl);
    const html = await res.text();
    const $ = cheerio.load(html);
    let finalUrl = '';

    const intermediateLink = $('a').filter((i, el) => $(el).attr('href')?.includes('/download/')).first().attr('href');
    if (!intermediateLink) return null;

    const res2 = await fetch(intermediateLink.startsWith('http') ? intermediateLink : new URL(intermediateLink, downloadPageUrl).href);
    const html2 = await res2.text();
    const $2 = cheerio.load(html2);
    const final = $2('a').map((i, el) => $2(el).attr('href')).get().find(h => h.includes('/dl-track/'));

    if (final) {
      finalUrl = final.startsWith('http') ? final : new URL(final, intermediateLink).href;
      if (!finalUrl.endsWith('.apk')) finalUrl += '.apk';
    }

    return finalUrl;
  } catch {
    return null;
  }
}