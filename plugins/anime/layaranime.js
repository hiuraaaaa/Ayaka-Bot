import axios from 'axios';
import * as cheerio from 'cheerio';
let handler = async (m, {
    args,
    command,
    conn
}) => {
    let subcmd = args.shift();

    if (!subcmd) return m.reply("Gunakan *layaranime search judul*, *layaranime detail url*");

    if (subcmd === 'search') {
        let query = args.join(" ");
        if (!query) return m.reply("Contoh: _layaranime search tokyo revengers_");

        let surl = `https://layaranime.com/?s=${encodeURIComponent(query)}`;
        m.reply(wait);
        try {
            let {
                data: searchHtml
            } = await axios.get(surl);
            let $ = cheerio.load(searchHtml);
            let results = [];

            $('a[title^="Nonton Anime"]').each((i, el) => {
                let title = $(el).attr('title').replace('Nonton Anime ', '').split(' Subtitle')[0];
                let url = $(el).attr('href');
                if (title && url) results.push({
                    title,
                    url
                });
            });

            if (results.length === 0) return m.reply("Gak nemu animenya.");

            let pesan = "*🔍 Hasil Pencarian:*\n\n";
            results.forEach((anime, index) => {
                pesan += `*${index + 1}.* ${anime.title}\n  _pake *layaranime detail ${anime.url}*_\n\n`;
            });

            m.reply(pesan);

        } catch (error) {
            m.reply("Ups, gagal");
        }

    } else if (subcmd === 'detail') {
        let animeUrl = args[0];
        if (!animeUrl || !animeUrl.startsWith("https://layaranime.com/"))
            return m.reply("Url? Example:\n\nlayaranime detail https://layaranime.com/tokyo-revengers-seiya-kessen-hen/");

        m.reply("sabar");

        try {
            let {
                data: animeHtml
            } = await axios.get(animeUrl);
            let $ = cheerio.load(animeHtml);

            let mjudul = $("h2.font-firasans").text().trim() || "Judul gak ketemu";
            let judul = $("h1.entry-title").text().trim() || mjudul;
            let desk = $("p").eq(1).text().trim() || "Sinopsis gak ketemu";
            let poster = $("img.rounded").attr("src") || "";
            let eps = [];

            $('a[title^="Nonton Anime"]').each((i, el) => {
                let episodeTitle = $(el).text().trim();
                let episodeUrl = $(el).attr("href");
                if (episodeTitle && episodeUrl) {
                    eps.push({
                        title: episodeTitle,
                        url: episodeUrl
                    });
                }
            });

            let pesan = `*🎬 ${judul}*\n\n`;
            pesan += `*🔸 Judul Lengkap:* ${mjudul}\n\n`;
            pesan += `*🔸 Sinopsis* :\n${desk}\n\n`;
            pesan += `*🔸 List Episode* :\n`;
            eps.forEach(ep => {
                pesan += `- ${ep.title}\n  ${ep.url}\n`;
            });

            await conn.sendMessage(m.chat, {
                image: {
                    url: poster
                },
                caption: pesan
            }, {
                quoted: m
            });

        } catch (error) {
            m.reply("gagal.");
        }

    } else {
        m.reply("Gunakan layaranime search judul*, layaranime detail url");
    }
};

handler.help = ['layaranime search judul', 'layaranime detail url'];
handler.tags = ['anime'];
handler.command = /^layaranime$/i;
handler.limit = true
handler.register = true
export default handler;