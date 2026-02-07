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
    return (
        list[Math.floor(Math.random() * list.length)] +
        " AppleWebKit/537.36 Chrome/114 Safari/537.36"
    );
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

const promptTogoblin = `
Change your appearance into a goblin style starting from the body, face, nose, mouth, and so on.
`.trim();

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
        "content-type": "application/json",
        "origin": "https://nanobananaart.ai",
        "referer": "https://nanobananaart.ai/",
        "uniqueid": crypto.randomUUID(),
        "sec-ch-ua": `"Chromium";v="114", "Google Chrome";v="114"`,
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
        return m.reply(
`👺 *Cara Pakai Togoblin!*

1️⃣ Reply atau kirim foto kamu  
2️⃣ Ketik: *.togoblin*

Bot akan memanggil sihir hijau & mengubahmu menjadi *Goblin Fantasi Penuh!*`
        );
    }

    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || "";

    if (!mime.includes("image")) {
        return m.reply("⚠️ Silakan kirim atau reply *foto*.");
    }

    let buffer = await q.download();
    if (!buffer) return m.reply("❌ Gagal mengambil gambar.");

    await conn.sendMessage(m.chat, { react: { text: "🔮", key: m.key } });

    try {

        const imgUrl = await uploadUguu(buffer);

        const taskId = await createJob(imgUrl, promptTogoblin);

        const resultUrl = await getJobResult(taskId);

        await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

        await conn.sendMessage(
            m.chat,
            {
                image: { url: resultUrl },
                caption: 
`👺✨ *Togoblin Transformation Complete!*  

Sihir hijau telah bekerja...  
Kamu sekarang resmi menjadi *Goblin Dunia Fantasi!*`
            },
            { quoted: m }
        );

    } catch (err) {
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
        m.reply("❌ Error: " + err.message);
    }
};

handler.help = ["togoblin"];
handler.tags = ["ai"];
handler.command = ["togoblin"];
handler.limit = 5;
handler.register = true;

export default handler;