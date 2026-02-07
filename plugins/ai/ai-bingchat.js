import axios from 'axios';

const handler = async (m, { conn, text, usedPrefix, command }) => {

    if (!text) {
        throw `*Contoh:* ${usedPrefix + command} Apa Itu JavaScript`;
    }

    const maelynDomain = global.APIs.maelyn;
    const maelynApiKey = global.maelyn;

    if (!maelynDomain || !maelynApiKey) {
        throw 'API Key atau Domain Maelyn untuk Bing Chat belum diatur di config.js! Mohon hubungi pemilik bot.';
    }

    await m.reply("Sedang memproses, mohon tunggu...");

    try {
        const apiUrl = `${maelynDomain}/api/bing/chat?q=${encodeURIComponent(text)}&apikey=${maelynApiKey}`;
        const response = await axios.get(apiUrl);
        const { status, result, code } = response.data;

        if (status === 'Success' && code === 200 && typeof result === 'string' && result) {

            const bingResponse = result;
            
            await conn.sendMessage(m.chat, {
                text: bingResponse,
                contextInfo: {
                    externalAdReply: {
                        title: '🤖 B I N G C H A T  A I',
                        body: `${global.namebot} || ${global.author}`,
                        thumbnailUrl: 'https://cdn.yupra.my.id/yp/24d38mxw.jpg',
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            }, { quoted: m });

        } else {

            m.reply(`❌ Gagal mendapatkan respons dari Bing Chat. Respon API tidak valid atau kosong. Respon: ${JSON.stringify(response.data)}`);
        }
    } catch (e) {
        console.error(e);
        m.reply(`Terjadi kesalahan saat menghubungi Bing Chat API: ${e.message}`);
    }
};

handler.help = ['bingchat', 'bingai'];
handler.tags = ['ai'];
handler.command = /^(bingchat|bingai)$/i;
handler.limit = true;
handler.premium = false;

export default handler;