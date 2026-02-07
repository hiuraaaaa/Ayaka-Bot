import fetch from "node-fetch";

const calculateDimensions = (aspectRatio) => {
    const maxDimension = 1024;
    
    if (aspectRatio === "1:1") {
        return { width: 1024, height: 1024 };
    } else if (aspectRatio === "16:9") {
        return { width: 1024, height: 576 };
    } else if (aspectRatio === "9:16") {
        return { width: 576, height: 1024 };
    } else if (aspectRatio === "4:3") {
        return { width: 1024, height: 768 };
    } else if (aspectRatio === "3:4") {
        return { width: 768, height: 1024 };
    } else {
        return { width: 1024, height: 1024 };
    }
};

const styleList = `style yang tersedia:
1. flux
2. flux-pro
3. flux-realism
4. flux-3d
5. flux-cablyai
6. turbo`;

let handler = async (m, { conn, text, usedPrefix, command }) => {
    console.log(`Command ${command} executed by ${m.sender}`);
    let wm = global.wm;
    
    if (!global.db.data.users[m.sender]) {
        global.db.data.users[m.sender] = {};
    }
    
    let user = global.db.data.users[m.sender];
    
    if (!text) {
        throw `Fitur ini menghasilkan gambar dari prompt.\n\ncontoh penggunaan:\n${usedPrefix + command} a beautiful landscape flux 16:9\n\n${styleList}`;
    }
    
    const lockTimeoutKey = `loadingTimeout_${m.sender}`;
    
    if (user.isLoadingAnimeDif && global[lockTimeoutKey] && (Date.now() - global[lockTimeoutKey] < 300000)) {
        await m.reply("⏱️ Sedang dalam proses, harap tunggu hingga selesai.");
        return;
    }
    
    if (user.isLoadingAnimeDif) {
        user.isLoadingAnimeDif = false;
    }
    
    user.isLoadingAnimeDif = true;
    global[lockTimeoutKey] = Date.now();
    
    const safetyClearTimeout = setTimeout(() => {
        if (user.isLoadingAnimeDif) {
            user.isLoadingAnimeDif = false;
            console.log(`Safety timeout cleared lock for ${m.sender}`);
        }
    }, 300000); 
    
    await m.reply(wait);
    await conn.relayMessage(m.chat, { reactionMessage: { key: m.key, text: '⏱️' } }, { messageId: m.key.id });
    
    let model = "flux"; 
    let aspectRatio = "1:1";
    let prompt = text;
    
    const parts = text.split(" ");
    const lastPart = parts[parts.length - 1];
    
    if (["16:9", "9:16", "4:3", "3:4", "1:1"].includes(lastPart)) {
        aspectRatio = lastPart;
        prompt = parts.slice(0, -1).join(" ");
        
        if (parts.length > 1) {
            const styleCandidate = parts[parts.length - 2].toLowerCase();
            
            if (["flux", "flux-pro", "flux-realism", "flux-3d", "flux-cablyai", "turbo"].includes(styleCandidate)) {
                model = styleCandidate;
                prompt = parts.slice(0, -2).join(" ");
            }
        }
    } 
    else {
        const lastPartLower = lastPart.toLowerCase();
        if (["flux", "flux-pro", "flux-realism", "flux-3d", "flux-cablyai", "turbo"].includes(lastPartLower)) {
            model = lastPartLower;
            prompt = parts.slice(0, -1).join(" ");
        }
    }
    
    const { width, height } = calculateDimensions(aspectRatio);
    
    const apiUrl = `https://fastrestapis.fasturl.cloud/aiimage/flux/dimension?prompt=${encodeURIComponent(prompt)}&model=${model}&width=${width}&height=${height}&enhance=true`;
    
    try {
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`API returned status: ${response.status}`);
        }
        
        const imageBuffer = await response.buffer();
        
        if (!imageBuffer || imageBuffer.length === 0) {
            throw new Error('Received empty image buffer from API');
        }
        
        await conn.sendFile(m.chat, imageBuffer, 'image.jpg', `✅ Model: ${model}\n✅ Aspect Rasio: ${aspectRatio}\n✅ Resolution: ${width}x${height}\n\n${wm}`, m);
        m.reply('ini hasilnya...');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        conn.reply(m.chat, `Error: ${error.message || 'Unknown error occurred'}. Please try again later.`, m);
        m.reply('❌error');
    } finally {
        clearTimeout(safetyClearTimeout);
        user.isLoadingAnimeDif = false;
    }
}

handler.help = ['flux <prompt> [model] [ratio]'];
handler.tags = ['ai', 'premium'];
handler.command = /^(flux)$/i;
handler.premium = true;
handler.register = true;

export default handler;