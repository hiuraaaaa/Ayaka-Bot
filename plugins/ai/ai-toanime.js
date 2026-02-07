import axios from "axios";
import fetch from "node-fetch";
import FormData from "form-data";
import { Readable } from "stream";
import sharp from "sharp";

let handler = async (m, { conn, text, usedPrefix: prefix, command: cmd }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || q.mediaType || "";

    if (!/image/.test(mime)) {
        return await conn.reply(m.chat, `H-huh?! Kirim atau reply gambar pakai caption:\n> _*${prefix + cmd}*_`, m);
    }

    await conn.sendMessage(m.chat, {
        react: {
            text: "🌟",
            key: m.key
        }
    });

    try {
        const aiease = new Aiease();
        const image = await q.download();
        const result = await aiease.generateImage(image);

        if (!result) {
            return await conn.reply(m.chat, "Ugh... gagal berubah jadi anime, coba lagi nanti ya! B-bukan karena aku peduli!", m);
        }

        await conn.sendMessage(m.chat, {
            image: { url: result },
            mimetype: "image/png",
            caption: "Nih! Jangan banyak komentar ya... B-bukan karena aku ingin bantu kamu... 😳",
        }, { quoted: m });

    } catch (err) {
        await conn.reply(m.chat, `I-it’s not like I wanted this to fail or anything...\nError: ${err.message}`, m);
    }
};

handler.help = ["toanime"];
handler.tags = ["ai"];
handler.command = ["jadianime", "toanime"];
handler.premium = true;

export default handler;

class Aiease {
    constructor() {
        this.api = {
            upload: "https://api.pixnova.ai/aitools/upload-img",
            create: "https://api.pixnova.ai/aitools/of/create",
            status: "https://api.pixnova.ai/aitools/of/check-status",
            uploadPng: "https://uguu.se/upload.php",
        };
        this.headersBase = {
            fp: "c74f54010942b009eaa50cd58a1f4419",
            fp1: "3LXezMA2LSO2kESzl2EYNEQBUWOCDQ/oQMQaeP5kWWHbtCWoiTptGi2EUCOLjkdD",
            origin: "https://pixnova.ai",
            referer: "https://pixnova.ai/",
            "theme-version": "83EmcUoQTUv50LhNx0VrdcK8rcGexcP35FcZDcpgWsAXEyO4xqL5shCY6sFIWB2Q",
            "x-code": "1752930995556",
            "x-guide": "SjwMWX+LcTqkoPt48PIOgZzt3eQ93zxCGvzs1VpdikRR9b9+HvKM0Qiceq6Zusjrv8bUEtDGZdVqjQf/bdOXBb0vEaUUDRZ29EXYW0kt047grMMceXzd3zppZoHZj9DeXZOTGaG50PpTHxTjX3gb0D1wmfjol2oh7d5jJFSIsY0=",
            "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
            accept: "application/json, text/plain, */*",
        };
        this.constants = { maxRetry: 30, retryDelay: 2000 };
    }

    randomIP() {
        return Array(4).fill(0).map(() => Math.floor(Math.random() * 256)).join(".");
    }

    randomUserAgent() {
        const userAgents = [
            "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36",
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
            "Mozilla/5.0 (Android 12; Mobile; rv:102.0) Gecko/102.0 Firefox/102.0",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Safari/605.1.15",
        ];
        return userAgents[Math.floor(Math.random() * userAgents.length)];
    }

    async uploadImage(buffer) {
        const stream = Readable.from(buffer);
        const form = new FormData();
        form.append("file", stream, { filename: "image.jpg" });
        form.append("fn_name", "demo-photo2anime");
        form.append("request_from", "2");
        form.append("origin_from", "111977c0d5def647");

        const response = await axios.post(this.api.upload, form, {
            headers: {
                ...this.headersBase,
                ...form.getHeaders(),
                "user-agent": this.randomUserAgent(),
                "X-Forwarded-For": this.randomIP(),
                "Client-IP": this.randomIP(),
            },
        });
        return response.data?.data?.path;
    }

    async createTask(sourceImage) {
        const payload = {
            fn_name: "demo-photo2anime",
            call_type: 3,
            input: {
                source_image: sourceImage,
                strength: 0.6,
                prompt: "use anime style, hd, 8k, smooth, aesthetic",
                negative_prompt: "(worst quality, low quality:1.4), (greyscale, monochrome:1.1), cropped, lowres, username, blurry, trademark, watermark, title, multiple view, Reference sheet, curvy, plump, fat, strabismus, clothing cutout, side slit, worst hand, (ugly face:1.2), extra leg, extra arm, bad foot, text, name",
                request_from: 2,
            },
            request_from: 2,
            origin_from: "111977c0d5def647",
        };

        const response = await axios.post(this.api.create, payload, {
            headers: {
                ...this.headersBase,
                "content-type": "application/json",
                "user-agent": this.randomUserAgent(),
                "X-Forwarded-For": this.randomIP(),
                "Client-IP": this.randomIP(),
            },
        });
        return response.data?.data?.task_id;
    }

    async checkTaskStatus(taskId) {
        const payload = {
            task_id: taskId,
            fn_name: "demo-photo2anime",
            call_type: 3,
            request_from: 2,
            origin_from: "111977c0d5def647",
        };

        for (let i = 0; i < this.constants.maxRetry; i++) {
            const response = await axios.post(this.api.status, payload, {
                headers: {
                    ...this.headersBase,
                    "content-type": "application/json",
                    "user-agent": this.randomUserAgent(),
                    "X-Forwarded-For": this.randomIP(),
                    "Client-IP": this.randomIP(),
                },
            });

            const data = response.data?.data;
            if (data?.status === 2 && data?.result_image) {
                return data.result_image.startsWith("http")
                    ? data.result_image
                    : `https://oss-global.pixnova.ai/${data.result_image}`;
            }
            await new Promise((resolve) => setTimeout(resolve, this.constants.retryDelay));
        }
        throw new Error("Waktu habis, proses gagal!");
    }

    async convertToPNG(url) {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const webpBuffer = Buffer.from(arrayBuffer);
        return await sharp(webpBuffer).png().toBuffer();
    }

    async uploadPNG(buffer) {
        const stream = Readable.from(buffer);
        const form = new FormData();
        form.append("files[]", stream, { filename: "converted.png" });

        const response = await axios.post(this.api.uploadPng, form, {
            headers: {
                ...form.getHeaders(),
                "user-agent": this.randomUserAgent(),
                "X-Forwarded-For": this.randomIP(),
                "Client-IP": this.randomIP(),
            },
        });
        return response.data.files[0].url;
    }

    async generateImage(input) {
        const sourceImage = await this.uploadImage(input);
        const taskId = await this.createTask(sourceImage);
        const resultUrl = await this.checkTaskStatus(taskId);
        const pngBuffer = await this.convertToPNG(resultUrl);
        return await this.uploadPNG(pngBuffer);
    }
}