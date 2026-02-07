import axios from 'axios'
import cheerio from 'cheerio'
import request from 'request'
let handler = async (m, { text, usedPrefix, command }) => {
    if (!text) return m.reply(`Masukan Daerah Kamu!\n\nContoh:\n${usedPrefix + command} Sidotopo Wetan`)
    let res = await kodepos(text)
    if (!res.length) return m.reply(`Daerah ${text} Tidak Ditemukan!`)
    let cap = res.map((v, i) => {
        return `
*Hasil Pencarian:*
  🏙️ Kota: _${v.city}_
  📍 Wilayah: _${v.subdistrict}_
  🏢 Perkotaan: _${v.urban}_
  🔢 Kode Pos: _${v.postalcode}_
`.trim()
    }).join('\n\n')
    m.reply(cap)
}
handler.help = ['kodepos'].map(v => v + ' <daerah>')
handler.tags = ['tools']
handler.command = ['kodepos']
handler.limit = true
export default handler

async function kodepos(daerah) {
    return new Promise(async (resolve, reject) => {
        let postalcode = 'https://carikodepos.com/';
        let url = postalcode+'?s='+daerah;
        await request.get({
            headers: {
                'Accept': 'application/json, text/javascript, */*;',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4209.3 Mobile Safari/537.36',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                'Origin': postalcode,
                'Referer': postalcode
            }, url: url, }, function(error, response, body) {
            if (error) return reject(error);
            let $ = cheerio.load(body);
            var search = $('tr');
            if (!search.length) return reject('No result could be found');
            var results = [];
            search.each(function(i) {
                if (i != 0) {
                    var td = $(this).find('td');
                    var result = {};
                    td.each(function(i) {
                        var value = $(this).find('a').html();
                        var key = (i == 0) ? 'province': (i == 1) ? 'city': (i == 2) ? 'subdistrict': (i == 3) ? 'urban': 'postalcode';
                        result[key] = value;
                    })
                    results.push(result);
                }
            });
            
            if (results.length > 0) {
              // Filter results based on the provided daerah
              const filteredResults = results.filter(item => {
                const daerahLower = daerah.toLowerCase();
                return (
                  item.city.toLowerCase().includes(daerahLower) ||
                  item.subdistrict.toLowerCase().includes(daerahLower) ||
                  item.urban.toLowerCase().includes(daerahLower)
                );
              });

              if (filteredResults.length > 0) {
                return resolve(filteredResults);
              } else {
                return reject('Tidak ada data yang cocok dengan daerah tersebut.');
              }
            } else {
              return reject('Tidak ada hasil yang ditemukan untuk daerah tersebut.');
            }

        });
    });
};