import * as cheerio from "cheerio";
import { fetch } from "undici";
import { lookup } from "mime-types";

async function mediafire(url) {
    return new Promise(async (resolve, reject) => {
        if (!url || typeof url !== "string" || !url.startsWith("https://www.mediafire.com/"))
            throw new Error("Invalid or missing Mediafire URL");

        const response = await fetch(url);
        if (!response.ok)
            throw new Error(`HTTP error: ${response.status} ${response.statusText}`);

        const html = await response.text();
        const $ = cheerio.load(html);

        const filename = $(".dl-btn-label").attr("title");
        if (!filename) throw new Error("Gagal ambil nama file");

        const extMatch = filename.match(/\.([^\.]+)$/);
        const ext = extMatch ? extMatch[1].toLowerCase() : "unknown";
        const mimetype = lookup(ext) || `application/${ext}`;
        const iconClass = $(".dl-btn-cont .icon").attr("class") || "";
        const typeMatch = iconClass.match(/archive\s*(\w+)/);
        const type = typeMatch ? typeMatch[1].trim() : "unknown";
        const sizeText = $(".download_link .input").text().trim();
        const sizeMatch = sizeText.match(/(.*?)/);
        const size = sizeMatch ? sizeMatch[1] : "unknown";
        const download = $(".input").attr("href");
        if (!download) throw new Error("Gagal ambil link download");

        let uploadDate = "Unknown";
        let creationTimestamp = $("[data-creation]").attr("data-creation") || null;
        const scripts = $("script").text();
        const matchScript = scripts.match(/"creation":\s*(\d+)/);
        if (matchScript) creationTimestamp = matchScript[1];

        if (creationTimestamp) {
            const date = new Date(parseInt(creationTimestamp) * 1000);
            uploadDate = date.toLocaleDateString("en-US", {
                year: "numeric", month: "long", day: "numeric"
            });
        }

        resolve({
            filename, type, size, ext, mimetype, download, uploadDate, url
        });
    }).catch((error) => {
        reject({
            msg: `Gagal scrape Mediafire: ${error.message}`
        });
    });
}

let handler = async (m, { conn, text }) => {
    if (!text.includes('mediafire')) throw 'Contoh:\n.mediafire https://www.mediafire.com/file/xxxx';

    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    return new Promise(async (resolve, reject) => {
        await mediafire(text).then(async (mf) => {
            let caption = `╭━━〔 \`MEDIAFIRE\` 〕━━⬣  
┃ 📦 *Nama:* ${mf.filename}  
┃ 🗂️ *Tipe:* ${mf.type} (.${mf.ext})  
┃ 📏 *Ukuran:* ${mf.size}  
┃ 🧾 *MIME:* ${mf.mimetype}  
┃ 🕓 *Upload:* ${mf.uploadDate}   
╰━━━━━━━━━━━━━━━━━━⬣`;

            await conn.sendMessage(m.chat, {
                document: { url: mf.download },
                fileName: mf.filename,
                mimetype: mf.mimetype,
                caption
            }, { quoted: m });
        }).catch((err) => {
            reject({ msg: '❌ Terjadi kesalahan saat memproses link.' });
            console.error(err);
        });
    });
};

handler.help = ['mf', 'mediafire', 'mfdl'];
handler.tags = ['downloader'];
handler.command = ['mf', 'mediafire', 'mfdl'];
handler.limit = true;

export default handler;