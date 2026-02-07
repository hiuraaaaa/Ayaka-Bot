import axios from 'axios';
import * as cheerio from 'cheerio';

const Lann4youofc = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return await conn.reply(m.chat, `[!] *Wrong input*\n\nEx : ${usedPrefix + command} ayam bakar`, m);

    try {
        const isUrl = text.startsWith("http");
        let result;

        if (isUrl) {
            result = await detailresep(text);
        } else {
            const searchResult = await cariresep(text);
            if (!searchResult.data || searchResult.data.length === 0) return await conn.reply(m.chat, "No recipes found for the given query.", m);

            const firstRecipe = searchResult.data[0];
            result = await detailresep(firstRecipe.link);
        }

        let caption = `*[ RECIPE DETAILS ]*\n\n`;
        caption += `📚 *Title:* ${result.data.judul}\n`;
        caption += `⏱️ *Cooking Time:* ${result.data.waktu_masak}\n`;
        caption += `🍽️ *Serves:* ${result.data.hasil}\n`;
        caption += `💪 *Difficulty Level:* ${result.data.tingkat_kesulitan}\n\n`;
        caption += `📝 *Ingredients:*\n${result.data.bahan}\n\n`;
        caption += `📖 *Steps:*\n${result.data.langkah_langkah}`;

        if (result.data.thumb) {
            await conn.sendFile(
                m.chat,
                result.data.thumb,
                'thumbnail.jpg',
                caption,
                m 
            );
        } else {
            await conn.reply(m.chat, caption, m);
        }
    } catch (error) {
        console.error(error);
        await conn.reply(m.chat, `Error: ${error.message}`, m);
    }
};

const cariresep = async (query) => {
    try {
        const { data } = await axios.get(`https://resepkoki.id/?s=${encodeURIComponent(query)}`);
        const $ = cheerio.load(data);

        const link = [];
        const judul = [];

        $('body > div.all-wrapper.with-animations > div:nth-child(5) > div > div.archive-posts.masonry-grid-w.per-row-2 > div.masonry-grid > div > article > div > div.archive-item-media > a').each(function () {
            link.push($(this).attr('href'));
        });

        $('body > div.all-wrapper.with-animations > div:nth-child(5) > div > div.archive-posts.masonry-grid-w.per-row-2 > div.masonry-grid > div > article > div > div.archive-item-content > header > h3 > a').each(function () {
            judul.push($(this).text().trim());
        });

        const format = [];
        for (let i = 0; i < link.length; i++) {
            format.push({
                judul: judul[i],
                link: link[i],
            });
        }

        return {
            creator: 'Lann4you-Ofc',
            data: format.filter(v => v.link.startsWith('https://resepkoki.id/resep')),
        };
    } catch (error) {
        throw error;
    }
};

const detailresep = async (url) => {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const abahan = [];
        const atakaran = [];
        const atahap = [];

        $('body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-details > div > div.single-recipe-ingredients-nutritions > div > table > tbody > tr > td:nth-child(2) > span.ingredient-name').each(function () {
            abahan.push($(this).text().trim());
        });

        $('body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-details > div > div.single-recipe-ingredients-nutritions > div > table > tbody > tr > td:nth-child(2) > span.ingredient-amount').each(function () {
            atakaran.push($(this).text().trim());
        });

        $('body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-main > div.single-content > div.single-steps > table > tbody > tr > td.single-step-description > div > p').each(function () {
            atahap.push($(this).text().trim());
        });

        const judul = $('body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-title.title-hide-in-desktop > h1').text().trim();
        const waktu = $('body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-main > div.single-meta > ul > li.single-meta-cooking-time > span').text().trim();
        const hasil = $('body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-main > div.single-meta > ul > li.single-meta-serves > span').text().split(': ')[1].trim();
        const level = $('body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-main > div.single-meta > ul > li.single-meta-difficulty > span').text().split(': ')[1].trim();
        const thumb = $('body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-details > div > div.single-main-media > img').attr('src');

        let tbahan = 'bahan\n';
        for (let i = 0; i < abahan.length; i++) {
            tbahan += `${abahan[i]} ${atakaran[i]}\n`;
        }

        let ttahap = 'tahap\n';
        for (let i = 0; i < atahap.length; i++) {
            ttahap += `${atahap[i]}\n\n`;
        }

        return {
            creator: 'Lann4you-Ofc',
            data: {
                judul: judul,
                waktu_masak: waktu,
                hasil: hasil,
                tingkat_kesulitan: level,
                thumb: thumb,
                bahan: tbahan.split('bahan\n')[1],
                langkah_langkah: ttahap.split('tahap\n')[1],
            },
        };
    } catch (error) {
        throw error;
    }
};

Lann4youofc.help = ["resep"];
Lann4youofc.tags = ['internet'];
Lann4youofc.command = ["resep"];

export default Lann4youofc;