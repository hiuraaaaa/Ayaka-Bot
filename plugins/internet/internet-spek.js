import axios from 'axios';
import * as cheerio from 'cheerio';

async function searchPhone(phoneName) {
  try {
    const searchUrl = `https://www.gsmarena.com/results.php3?sQuickSearch=yes&sName=${encodeURIComponent(phoneName)}`;
    const { data } = await axios.get(searchUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $ = cheerio.load(data);
    const phoneLink = $('.makers ul li a').first().attr('href');
    return phoneLink ? `https://www.gsmarena.com/${phoneLink}` : null;
  } catch (error) {
    console.error('Error searching phone:', error.message);
    return null;
  }
}

async function getExchangeRates() {
  try {
    const response = await axios.get('https://api.exchangerate-api.com/v4/latest/EUR');
    return response.data.rates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error.message);
    return null;
  }
}

async function scrapeAllSpecs(url) {
  try {
    const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $ = cheerio.load(data);
    const specs = {};
    
    $('div#specs-list table').each((_, table) => {
      const category = $(table).find('th').text().trim();
      const specDetails = {};
      $(table).find('tr').each((_, row) => {
        const key = $(row).find('td.ttl').text().trim();
        const value = $(row).find('td.nfo').text().trim();
        if (key && value) specDetails[key] = value;
      });
      if (category && Object.keys(specDetails).length) specs[category] = specDetails;
    });

    const phoneName = $('h1').text().trim();
    const priceEur = specs['Misc']?.['Price'] || 'N/A';
    let prices = { EUR: priceEur };
    if (priceEur !== 'N/A' && priceEur.includes('EUR')) {
      const eurValue = parseFloat(priceEur.match(/[\d.]+/)[0]);
      const rates = await getExchangeRates();
      if (rates) {
        prices = {
          EUR: `${eurValue.toFixed(2)} EUR`,
          USD: (eurValue * rates.USD).toFixed(2) + ' USD',
          IDR: (eurValue * rates.IDR).toFixed(0) + ' IDR'
        };
      }
    }

    const imageUrl = $('.specs-photo-main img').attr('src') || 'N/A';

    return { phoneName, specs, prices, imageUrl, url };
  } catch (error) {
    console.error('Error scraping data:', error.message);
    return null;
  }
}

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    throw `Contoh penggunaan: ${usedPrefix + command} Xiaomi 14\n\nEh Sensei, jangan lupa kasih nama HP-nya ya!`;
  }

  const query = args.join(' ');
  const phoneUrl = await searchPhone(query);
  if (!phoneUrl) {
    return m.reply(`HP "${query}" nggak ditemuin, Sensei! Coba periksa lagi namanya ya.`);
  }

  const result = await scrapeAllSpecs(phoneUrl);
  if (!result) {
    return m.reply(`Gagal mengambil data untuk "${query}", Sensei!`);
  }

  const { phoneName, specs, prices, imageUrl, url } = result;

  const caption = `
*📱 ${phoneName} - Spesifikasi Lengkap*  
*💵 Harga:*  
  • ${prices.EUR || 'N/A'}  
  • ${prices.USD || 'N/A'}  
  • ${prices.IDR || 'N/A'}  

*🔍 Detail Spesifikasi:*  
${Object.entries(specs).map(([cat, data]) => 
`*${cat}:*
${Object.entries(data).map(([key, val]) => `  • *${key}:* ${val}`).join('\n')}`).join('\n\n')}

*🔗 Link:* ${url}
`.trim();

  try {
    const imgBuffer = imageUrl !== 'N/A'
      ? Buffer.from((await axios.get(imageUrl, { responseType: 'arraybuffer' })).data)
      : null;

    if (imgBuffer) {
      await conn.sendFile(m.chat, imgBuffer, `${phoneName}.jpg`, caption, m);
    } else {
      await m.reply(caption);
    }
  } catch (e) {
    console.error('Send file error:', e.message);
    await m.reply(caption);
  }
};

handler.help = ['spekHp'].map(v => v + ' <nama hp>');
handler.tags = ['tools'];
handler.command = /^(spekHp|spesifikasiHp|shp)$/i;
handler.limit = 1;

export default handler;