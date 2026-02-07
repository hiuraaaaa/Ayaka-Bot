import fetch from 'node-fetch';

const handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `*🚩 Example:* ${usedPrefix}${command} https://krakenfiles.com/view/neTIvR1wIz/file.html`;
    await m.reply(wait);

    let apiKey = 'IAXBPHme';
    let data = await (await fetch(`https://api.botcahx.eu.org/api/download/kraken?url=${text}&apikey=${apiKey}`)).json();

    if (!data || !data.result) {
        throw 'Error: Unable to retrieve data from Kraken. Please check the URL and try again.';
    }

    let msg = `乂 *K R A K E N  D O W N L O A D E R*\n\n`;
    msg += ` ◦ *📁Name :* ${data.result.fileName || 'N/A'}\n`;
    msg += ` ◦ *⌛View :* ${data.result.views || 'N/A'}\n`;
    msg += ` ◦ *📊Size :* ${data.result.fileSize || 'N/A'}\n`;
    msg += ` ◦ *🃏Type :* ${data.result.fileType || 'N/A'}\n`;
    msg += ` ◦ *📦Uploaded :* ${data.result.uploadDate || 'N/A'}\n`;
    msg += ` ◦ *📮Download :* ${data.result.downloads || 'N/A'}\n`;
    msg += ` ◦ *📪Last Download :* ${data.result.lastDownloadDate || 'N/A'}\n`;
    msg += ` ◦ *🖇Link :* ${data.result.urlDownload || 'N/A'}`;
    msg += `\n`;

    await conn.sendFile(m.chat, 'https://krakenfiles.com/images/kf_logo_dark.png', 'thumb_.png', msg, m);
    await conn.sendMessage(m.chat, { document: { url: data.result.urlDownload }, fileName: data.result.fileName, mimetype: data.result.fileType }, { quoted: m });
};

handler.help = ['krakendownload'].map(v => v + ' <url>');
handler.tags = ['downloader', 'premium'];
handler.command = /^(krakendl|krakendownload|kraken)$/i;
handler.limit = false;
handler.register = false;
handler.premium = true;

export default handler;