import axios from 'axios'
import cheerio from 'cheerio'

let handler = async (m, { text, command, usedPrefix }) => {
    if (!text) throw `Masukan Query!\n\nContoh:\n${usedPrefix + command} minecraft`
    try {
        let result = await happymod(text);
        let teks = result.map((v, i) => {
            return `
*${i + 1}.* ${v.name}
❃ Link: ${v.link}
`.trim()
        }).filter(v => v).join('\n\n\n');
        await m.reply(teks);
    } catch (error) {
        console.error("Error in handler:", error);
        m.reply("Terjadi kesalahan saat mencari.  Coba lagi nanti.");
    }
}
handler.help = ['happymod'].map(v => v + ' <query>')
handler.tags = ['internet']
handler.command = /^happymod$/i
export default handler

async function happymod(query, retry = 3) {
    try {
        const response = await axios.get(`https://www.happymod.com/search.html?q=${query}`);
        const $ = cheerio.load(response.data);
        let hasil = [];
        $("div.pdt-app-box").each(function (c, d) {
            let name = $(d).find("a").text().trim();
            let icon = $(d).find("img.lazy").attr('data-original');
            let link = $(d).find("a").attr('href');
            let link2 = `https://www.happymod.com${link}`;
            const Data = {
                icon: icon,
                name: name,
                link: link2
            };
            hasil.push(Data);
        });
        return hasil;
    } catch (error) {
        console.error(`Error in happymod (retry ${retry}):`, error.message);
        if (retry > 0 && error.code === 'ENOTFOUND') {  // Hanya retry jika error ENOTFOUND
            console.log(`Retrying in ${5 * (4 - retry)} seconds...`);
            await new Promise(resolve => setTimeout(resolve, 5 * (4 - retry) * 1000)); // Penundaan eksponensial
            return happymod(query, retry - 1);
        } else {
            throw error; // Lempar error jika retry habis atau error bukan ENOTFOUND
        }
    }
}