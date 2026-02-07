import axios from 'axios';

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) return m.reply(`URL!\n\nContoh: ${usedPrefix + command} https://vt.tiktok.com/xxxxx`);
await conn.sendMessage(m.chat, {
        react: {
            text: "⏰",
            key: m.key,
        }
    })

    try {
        let response = await axios.get(`https://skizoasia.xyz/api/tiktok?apikey=${global.skizo}&url=${encodeURIComponent(args[0])}`);
        const { creator, code, msg, data } = response.data;

        if (code === 0) {
            const { title, duration, author, music, hdplay } = data;
           await conn.sendFile(m.chat, hdplay, '', `Caption: ${title}`, m, 0, {
            mimetype: "video/mp4",
            fileName: `ipah28.mp4`
        });
            conn.sendFile(m.chat, music, 'enuyyy.opus', null, m, true);
        } else {
            m.reply(`Eror bang!`);
        }
    } catch (error) {
        console.error(error);
        m.reply('Terjadi kesalahan saat memproses permintaan.');
    }
    await conn.sendMessage(m.chat, {
        react: {
            text: "✅",
            key: m.key,
        }
    })
};
handler.tags = ['downloader','premium'];
handler.help = ['tiktokhd <url>', 'tthd <url>'];
handler.command = /^(tthd|hdtt|tiktokhd)/i;
handler.premium = true

export default handler;