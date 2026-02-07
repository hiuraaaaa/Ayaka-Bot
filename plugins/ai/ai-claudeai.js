import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    
    if (!text) {
        throw `Hai! Saya adalah Claude AI. Apa yang ingin kamu tanyakan hari ini?\n\n*Contoh:* ${usedPrefix + command} Apa Itu JavaScript`;
    }

    const maelynDomain = global.APIs.maelyn;
    const maelynApiKey = global.maelyn;

    if (!maelynDomain || !maelynApiKey) {
        throw 'API Key atau Domain Maelyn untuk Claude AI belum diatur di config.js! Mohon hubungi pemilik bot.';
    }

    await m.reply("Sedang memproses, mohon tunggu...");

    try {
        const encodedQuery = encodeURIComponent(text);
        const apiUrl = `${maelynDomain}/api/claude?q=${encodedQuery}&apikey=${maelynApiKey}`;

        const response = await axios.get(apiUrl);
        const { status, result, code } = response.data;

        if (status === 'Success' && code === 200 && result) {

            await conn.sendMessage(m.chat, {
                text: result,
                contextInfo: {
                    externalAdReply: {
                        title: '🤖 C L A U D E  A I',
                        body: `${global.namebot} || ${global.author}`,
                        thumbnailUrl: 'https://uploader.zenzxz.dpdns.org/uploads/1759050043314.jpeg',
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            }, { quoted: m });
        } else {
            m.reply(`❌ Gagal mendapatkan respons dari Claude AI. Respon API: ${JSON.stringify(response.data)}`);
        }
    } catch (e) {
        console.error(e);
        m.reply(`Terjadi kesalahan saat menghubungi Claude AI API: ${e.message}`);
    }
};

handler.help = ['claudechat', 'claudeai'];
handler.tags = ['ai'];
handler.command = /^(claudechat|claudeai|claude)$/i;
handler.limit = true;
handler.premium = false;

export default handler;