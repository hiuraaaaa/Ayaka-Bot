import axios from "axios";
import crypto from "crypto";
import { fileTypeFromBuffer } from "file-type";
import FormData from "form-data";

function fakeUserAgent() {
    const list = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Mozilla/5.0 (X11; Linux x86_64)",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
    ];
    return list[Math.floor(Math.random() * list.length)] + " AppleWebKit/537.36 Chrome/114 Safari/537.36";
}

async function uploadUguu(content) {
    try {
        const ft = (await fileTypeFromBuffer(content)) || {};
        const formData = new FormData();
        formData.append("files[]", content, `upload.${ft.ext || "bin"}`);

        const res = await axios.post("https://uguu.se/upload.php", formData, {
            headers: {
                ...formData.getHeaders(),
                "User-Agent": fakeUserAgent()
            }
        });

        if (!res.data?.files?.[0]?.url) throw new Error("Invalid Uguu response");
        return res.data.files[0].url;
    } catch (err) {
        throw new Error("Upload gagal: " + err.message);
    }
}

const fixedPrompt = `Use the nano-banana model to create a 1/7 scale commercialized figure of the character in the illustration, in a realistic style and environment. Place the figure on a computer desk, using a circular transparent acrylic base without any text. On the computer screen, display the ZBrush modeling process of the figure. Next to the computer screen, place a BANDAI-style toy packaging box printed with the original artwork.`;

async function createJob(imageUrl, prompt) {
    const payload = {
        aspectRatio: "auto",
        channel: "NANOBANANA_IMAGE",
        imageUrls: [imageUrl],
        isTemp: true,
        outputFormat: "png",
        pageId: 907,
        privateFlag: true,
        prompt,
        source: "nanobananaart.ai",
        type: "IMAGETOIAMGE",
        watermarkFlag: true
    };

    const headers = {
        "accept": "*/*",
        "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
        "content-type": "application/json",
        "origin": "https://nanobananaart.ai",
        "referer": "https://nanobananaart.ai/",
        "uniqueid": crypto.randomUUID(),
        "sec-ch-ua": `"Not.A/Brand";v="99", "Chromium";v="114", "Google Chrome";v="114"`,
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": `"Linux"`,
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "user-agent": fakeUserAgent()
    };

    const res = await axios.post(
        "https://api.nanobananaart.ai/aimodels/api/v1/ai/image/create",
        payload,
        { headers }
    );

    if (!res.data?.data) throw new Error("Gagal membuat job!");
    return res.data.data; 
}

async function getJobResult(taskId) {
    const url = `https://api.nanobananaart.ai/aimodels/api/v1/ai/${taskId}?channel=NANOBANANA_IMAGE`;

    for (let i = 0; i < 40; i++) {
        const res = await axios.get(url, {
            headers: {
                "accept": "*/*",
                "content-type": "application/json",
                "origin": "https://nanobananaart.ai",
                "referer": "https://nanobananaart.ai/",
                "sec-ch-ua": `"Not.A/Brand";v="99", "Chromium";v="114", "Google Chrome";v="114"`,
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": `"Linux"`,
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
                "user-agent": fakeUserAgent()
            }
        });

        const job = res.data;
        if (job?.data?.completeData) {
            const parsed = JSON.parse(job.data.completeData);
            const urls = parsed?.data?.result_urls;
            if (urls?.length) return urls[0];
        }
        await new Promise(r => setTimeout(r, 2000));
    }

    throw new Error("Timeout menunggu hasil NanoBanana");
}

let handler = async (m, { conn }) => {

    if (!m.quoted && !m.msg?.mimetype) {
        return m.reply(`📸 *Cara Pemakaian*:  
Kirim atau reply foto lalu ketik:

*.tofigure*

Bot akan otomatis membuatkan versi figure 1/7 dari foto kamu.`);
    }

    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || "";

    if (!mime.includes("image")) {
        return m.reply("⚠️ Silakan kirim atau reply sebuah *foto* yang ingin dijadikan figure.");
    }

    let buffer = await q.download();
    if (!buffer) return m.reply("❌ Gagal mengambil file gambar.");

    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

    try {
        const imgUrl = await uploadUguu(buffer);
        const taskId = await createJob(imgUrl, fixedPrompt);
        const resultUrl = await getJobResult(taskId);

        await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });


        await conn.sendMessage(
            m.chat,
            {
                image: { url: resultUrl },
            caption: `✨ *Figure 1/7 Generated!*

🧸 *Style*: Realistic Figure  
🖥️ *Desk Scene*: ZBrush modeling  
📦 *Bonus*: Bandai-style toy box  

Gunakan lagi command:
*.tofigure*`
            },
            { quoted: m }
        );

    } catch (err) {
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
        m.reply("❌ Error: " + err.message);
    }
};

handler.help = ["tofigure"];
handler.tags = ["ai"];
handler.command = ["tofigure","jadifigure"]; 
handler.limit = 5;
handler.register = true;

export default handler;