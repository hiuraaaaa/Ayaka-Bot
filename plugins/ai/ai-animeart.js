import axios from 'axios';

const handler = async (m, { conn, text, usedPrefix, command }) => {
    
    const models = [
        'None', 'Cinematic', 'Photographic', 'Anime', 'Manga',
        'Digital Art', 'Pixel art', 'Fantasy art', 'Neonpunk', '3D Model'
    ];
    
    const resolutions = [
        'Portrait', 'Landscape', 'Square', 'Wide', 'Tall'
    ];
    
    let prompt = null;
    let selectedModel = 'None';
    let selectedResolution = 'Portrait';
    
    const maelynDomain = global.APIs.maelyn;
    const maelynApiKey = global.maelyn;
    
    if (!maelynDomain || !maelynApiKey) {
        throw 'API Key atau Domain Maelyn belum diatur di config.js! Mohon hubungi pemilik bot.';
    }
    
    if (!text) {
        throw `👋🏼 Hai! Aku bisa membuat gambar anime dari teks.\n\n*Cara Penggunaan:*\n${usedPrefix + command} Prompt | Model | Resolusi\n\n*Contoh Penggunaan:*\n${usedPrefix + command} Gadis berambut putih, mata merah | Manga | Wide\n\n*Pilihan Model:* ${models.join(', ')}\n*Pilihan Resolusi:* ${resolutions.join(', ')}\n\n*Default Model:* ${selectedModel}\n*Default Resolusi:* ${selectedResolution}`;
    }
    
    const parts = text.split('|').map(s => s.trim());
    prompt = parts[0];
    
    if (parts.length > 1) {
        
        for (let i = 1; i < parts.length; i++) {
            const part = parts[i];
            const foundModel = models.find(m => m.toLowerCase() === part.toLowerCase());
            const foundRes = resolutions.find(r => r.toLowerCase() === part.toLowerCase());
    
            if (foundModel) {
                selectedModel = foundModel;
            } else if (foundRes) {
                selectedResolution = foundRes;
            } else {
                conn.reply(m.chat, `⚠️ Pilihan '${part}' tidak valid. Menggunakan default.`, m);
            }
        }
    }
    
    if (!prompt) {
        throw `⚠️ Prompt tidak boleh kosong!\n\nContoh: *${usedPrefix + command} Gadis berambut putih, mata merah | Manga | Wide*`;
    }
    
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });
    
    try {
        const encodedPrompt = encodeURIComponent(prompt);
        const encodedModel = encodeURIComponent(selectedModel);
        const encodedResolution = encodeURIComponent(selectedResolution);
    
        const apiUrl = `${maelynDomain}/api/txt2img/animeart?prompt=${encodedPrompt}&resolution=${encodedResolution}&model=${encodedModel}&apikey=${maelynApiKey}`;
    
        const response = await axios.get(apiUrl);
        const { status, result, code } = response.data;
    
        if (status === 'Success' && code === 200 && result?.image?.url) {
            await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } }); 
    
            let captionText = `✨ *Anime Art Generated*\n\n`;
            captionText += `✍️ *Prompt:* ${result.info.prompt}\n`;
            captionText += `🧠 *Model:* ${result.info.Model.Model || 'N/A'} (${result.info.sdxl_style || 'Default Style'}) \n`;
            captionText += `🖼️ *Resolusi:* ${result.info.resolution || 'N/A'}\n`;
            captionText += `💾 *Ukuran File:* ${result.image.size || 'N/A'}\n`;
            captionText += `✅ *Status:* ${result.image.expired || 'N/A'}\n\n`;
            captionText += `> ${global.namebot}`;
    
            await conn.sendMessage(m.chat, { 
                image: { url: result.image.url },
                caption: captionText
            }, { quoted: m });
        } else {
            await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } }); 
            m.reply(`❌ Gagal menghasilkan gambar anime. Respon API: ${JSON.stringify(response.data)}`);
        }
    } catch (e) {
        console.error(e);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        m.reply(`Terjadi kesalahan saat menghubungi Anime Art Generator API: ${e.message}`);
    }
};

handler.help = ['animeart', 'txt2anime'];
handler.tags = ['ai'];
handler.command = /^(animeart|txt2anime)$/i;
handler.limit = true;
handler.premium = false;

export default handler;