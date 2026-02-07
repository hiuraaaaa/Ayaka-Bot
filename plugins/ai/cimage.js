import axios from "axios";

let handler = async (m, { conn, command, text }) => {
    if (!text) {
        return m.reply(`[!] Usage: ${command} [prompt]\nExample: ${command} anime`);
    }

    const responseMessage = m.isGroup 
        ? `${wait}, image will be sent to your private chat`
        : wait;

    await m.reply(responseMessage);

    try {
        let { results } = await generateImages(text);
        for (let res of results) {
            await conn.sendFile(m.sender, res.url, '', `Style: \`${res.model}\``, m);
        }
    } catch (error) {
        m.reply(`Error: ${error.message}`);
    }
};

handler.help = ['cimage'];
handler.command = ['cimage'];
handler.tags = ['ai'];

export default handler;

async function generateImages(prompt) {
    const randomIP = Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join('.');
    const userAgent = randomUserAgent();
    const models = [
        "Glowing Forest", "Vector Art", "Princess", "LoL", 
        "Realistic Anime", "West Coast", "Blue Rhapsody", 
        "Graffiti", "Clown", "Elf"
    ];

    let images = [];

    for (let model of models) {
        const batchId = await initiateImageGeneration(prompt, model, randomIP, userAgent);
        const resultImages = await fetchGeneratedImages(batchId, model, randomIP, userAgent);
        images.push(...resultImages);
    }

    return { results: images };
}

async function initiateImageGeneration(prompt, model, ip, userAgent) {
    const response = await axios.post(
        'https://restapi.cutout.pro/web/ai/generateImage/generateAsync',
        { prompt, style: model, quantity: 1, width: 512, height: 512 },
        { headers: { "Content-Type": "application/json", "User-Agent": userAgent, "X-Forwarded-For": ip } }
    );

    const { data } = response.data;
    if (!data || !data.batchId) {
        throw new Error(`Failed to retrieve batchId for model: ${model}`);
    }

    return data.batchId;
}

async function fetchGeneratedImages(batchId, model, ip, userAgent) {
    let status = false;
    let images = [];

    while (!status) {
        const response = await axios.get(
            `https://restapi.cutout.pro/web/ai/generateImage/getGenerateImageTaskResult?batchId=${batchId}`,
            { headers: { "User-Agent": userAgent, "X-Forwarded-For": ip } }
        );

        const imageList = response.data.data?.text2ImageVoList || [];
        status = imageList.every(image => image.status === 1);

        if (status) {
            images = imageList.map(image => ({
                model,
                url: image.resultUrl
            }));
        } else {
            await delay(1000); // Wait before checking again
        }
    }

    return images;
}

function randomUserAgent() {
    const agents = [
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Mozilla/5.0 (Linux; Android 10; SM-G960U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Mobile Safari/537.36'
    ];
    return agents[Math.floor(Math.random() * agents.length)];
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}