import axios from 'axios';

async function gpt(prompt) {
    const model = 'chatgpt4';
    const modelData = {
        api: 'https://stablediffusion.fr/gpt4/predict2',
        referer: 'https://stablediffusion.fr/chatgpt4'
    };

    if (!prompt) throw 'Prompt tidak boleh kosong!';

    const hmm = await axios.get(modelData.referer);
    const { data } = await axios.post(modelData.api, { prompt }, {
        headers: {
            accept: '*/*',
            'content-type': 'application/json',
            origin: 'https://stablediffusion.fr',
            referer: modelData.referer,
            cookie: hmm.headers['set-cookie'].join('; '),
            'user-agent': 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36'
        }
    });

    return data.message;
}

let handler = async (m, { conn, args }) => {
    const prompt = args.join(' ');
    if (!prompt) return m.reply(`Contoh penggunaan:\n.gpt Apa itu machine learning?`);

    await conn.sendMessage(m.chat, {
        react: {
            text: '✨',
            key: m.key
        }
    });

    try {
        const content = await gpt(prompt);

        await conn.sendMessage(m.chat, {
            text: content,
            contextInfo: {
                externalAdReply: {
                    mediaUrl: 'https://whatsapp.com/channel/0029VakezCJDp2Q68C61RH2C',
                    mediaType: 1,
                    title: '✦ ChatGPT',
                    body: 'Gpt By Lann4you',
                    thumbnailUrl: 'https://files.catbox.moe/4rnbtb.jpg',
                    sourceUrl: 'https://chat.whatsapp.com/E5otWQQMRGj1qYUqzf2yPM',
                    renderLargerThumbnail: true,
                    showAdAttribution: false
                }
            }
        }, { quoted: flok });

        await conn.sendMessage(m.chat, {
            react: {
                text: '✅',
                key: m.key
            }
        });
    } catch (e) {
        await conn.sendMessage(m.chat, {
            react: {
                text: '❌',
                key: m.key
            }
        });
        m.reply(`Gagal mengambil respons: ${e}`);
    }
};

handler.command = ["gpt","gpt4"];
handler.tags = ['ai'];
handler.help = ['gpt <prompt>'];
handler.register = true;
handler.limit = 5;

export default handler;