import axios from "axios";
import FormData from "form-data";
import fs from "fs/promises";
import fssync from "fs";
import path from "path";
import crypto from "crypto";

const cartoony = {
    api: {
        base: "https://api.cartoony.app",
        endpoint: {
            generate: "/api/v1/generate/image",
            styles: "/api/v1/styles?platform=android",
        },
        keyX: [
            97, 50, 100, 98, 53, 101, 54, 98, 45, 100, 49, 99, 99, 45, 52, 50, 54, 102, 45, 56, 51, 51, 99, 45, 50, 48, 50, 53,
            51, 49, 102, 50, 100, 50, 57, 97,
        ],
        get key() {
            return String.fromCharCode(...this.keyX);
        },
    },

    headers: {
        "user-agent": "NB Android/1.0.0",
        accept: "application/json",
        "accept-encoding": "gzip",
        "accept-charset": "UTF-8",
    },

    now: () => Date.now(),
    genUuid: () => crypto.randomUUID(),
    genDeviceId: () => crypto.randomBytes(8).toString("hex"),
    genRcUserId: () => `$RCAnonymousID:${crypto.randomBytes(16).toString("hex")}`,

    getStyles: async () => {
        try {
            const res = await axios.get(`${cartoony.api.base}${cartoony.api.endpoint.styles}`, {
                headers: {
                    ...cartoony.headers,
                    "x-api-key": cartoony.api.key
                },
            });
            return res.data?.styles ?? [];
        } catch {
            return [];
        }
    },

    retry: async (fn, retries = 3, delay = 1000) => {
        let lastErr;
        for (let i = 0; i < retries; i++) {
            try {
                return await fn();
            } catch (err) {
                lastErr = err;
                if (i <retrie) await new Promise((r) => setTimeout(r, delay));
            }
        }
        throw lastErr;
    },

    generate: async (buffer, opts = {}) => {
        let tmpPath = null;
        try {
            const tmpDir = path.resolve("./tmp");
            if (!fssync.existsSync(tmpDir)) await fs.mkdir(tmpDir);
            tmpPath = path.join(tmpDir, `cartoony_${Date.now()}.png`);
            await fs.writeFile(tmpPath, buffer);

            const styles = await cartoony.getStyles();
            const sid = new Set(styles.map((s) => s.id?.toLowerCase()));
            const styleId = (opts.style_id ?? "").toString().trim().toLowerCase();

            if (!styleId || !sid.has(styleId)) {
                return {
                    success: false,
                    result: {
                        error: "Style ID tidak valid atau kosong.",
                        availableStyles: styles.map((s) => ({
                            id: s.id,
                            name: s.name,
                            isPro: s.isPro,
                        })),
                    },
                };
            }

            const form = new FormData();
            form.append("image", fssync.createReadStream(tmpPath));
            form.append("style_id", styleId);
            form.append("quality", opts.quality ?? "low");
            form.append("generation_type", "image_to_image");
            form.append("user_id", cartoony.genUuid());
            form.append("timestamp", cartoony.now());
            form.append("platform", "android");
            form.append("app_version", "1.2.0");
            form.append("locale", "en-MM");
            form.append("is_pro_user", "true");
            form.append("daily_count", "1");
            form.append("rc_user_id", cartoony.genRcUserId());
            form.append("package_id", "com.gigantic.cartoony");
            form.append("device_id", cartoony.genDeviceId());

            const res = await cartoony.retry(() =>
                axios.post(`${cartoony.api.base}${cartoony.api.endpoint.generate}`, form, {
                    headers: {
                        ...cartoony.headers,
                        ...form.getHeaders(),
                        "x-api-key": cartoony.api.key
                    },
                    maxBodyLength: Infinity,
                    timeout: opts.timeout ?? 60000,
                })
            );

            const data = res.data;
            const imgBase64 = data?.generatedImage?.data ?? null;
            if (!imgBase64) throw new Error("No image data in response");

            return {
                success: true,
                buffer: Buffer.from(imgBase64, "base64"),
                mime: data?.generatedImage?.mimeType ?? "image/png",
            };
        } catch (err) {
            throw new Error(err.message);
        } finally {
            if (tmpPath) try {
                await fs.unlink(tmpPath);
            } catch {}
        }
    },
};

const fkontak = {
    key: {
        participant: '0@s.whatsapp.net',
        remoteJid: '0@s.whatsapp.net',
        fromMe: false,
        id: 'Halo'
    },
    message: {
        conversation: `Editing Image 🖌️`
    }
};

let handler = async (m, {
    conn,
    text,
    usedPrefix,
    command
}) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q.imageMessage || q).mimetype || "";
    if (!mime || !/image\/(jpe?g|png|webp)/.test(mime)) return m.reply(`*❗Kirim/Reply gambar dengan caption:*
> ${usedPrefix + command} [styles]
*📝 Contoh:*
> ${usedPrefix + command} ghibli`);

    try {
        let buffer = await q.download();

        if (!text) {
            let styles = await cartoony.getStyles();
            if (!styles.length) return m.reply("❌ Failed to fetch styles list.");

            let list = styles
                .map(
                    (s, i) =>
                    `${i + 1}. *${s.name}*\nID: ${s.id}\nTipe: ${s.isPro ? "Pro" : "Free"}`
                )
                .join("\n\n");

            return m.reply(`*❗Style tidak ditemukan*
*🗃️ Daftar style yang tersedia:*

${list}

*📝 Example:* *${usedPrefix + command} ghibli*`);
        }

        await conn.sendMessage(m.chat, {
            react: {
                text: "🖌️",
                key: m.key
            }
        });
        let result = await cartoony.generate(buffer, {
            style_id: text,
            quality: "high"
        });
        if (!result.success) {
            let available = result.result?.availableStyles || [];
            if (available.length) {
                let list = available
                    .map((s, i) => `${i + 1}. *${s.name}*\nID: ${s.id}\nTipe: ${s.isPro ? "Pro" : "Free"}`)
                    .join("\n\n");
                return m.reply(`*❗Style tidak ditemukan*
*🗃️ Daftar style yang tersedia:*

${list}`);
            } else {
                throw new Error(result.result?.error || "Generation failed");
            }
        }

        await conn.sendFile(m.chat, result.buffer, "cartoony.png", `✔️ \`S U C C E S S\``, fkontak);
        await conn.sendMessage(m.chat, {
            react: {
                text: "✅",
                key: m.key
            }
        });

    } catch (err) {
        console.error(err);
        m.reply("ERROR " + err.message);
        await conn.sendMessage(m.chat, {
            react: {
                text: "❗",
                key: m.key
            }
        });
    }
};

handler.help = ["tocartoon"];
handler.tags = ["ai"];
handler.command = ["cartoony", "toonify", "cartoonai", "tocartoon"];
handler.limit = true;

export default handler;