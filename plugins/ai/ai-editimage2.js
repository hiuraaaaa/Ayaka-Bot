import axios from "axios";
import FormData from "form-data";
import crypto from "node:crypto";
import {
    fileTypeFromBuffer
} from "file-type";

const fkontak = {
    key: {
        participant: "0@s.whatsapp.net",
        remoteJid: "0@s.whatsapp.net",
        fromMe: false,
        id: "Hello"
    },
    message: {
        conversation: "AI Image Editing 🖌️"
    }
};

class GridPlus {
    constructor() {
        this.ins = axios.create({
            baseURL: "https://api.grid.plus/v1",
            headers: {
                "user-agent": "Mozilla/5.0 (Android 15; Mobile; SM-F958; rv:130.0) Gecko/130.0 Firefox/130.0",
                "X-AppID": "808645",
                "X-Platform": "h5",
                "X-Version": "8.9.7",
                "X-SessionToken": "",
                "X-UniqueID": this.uid(),
                "X-GhostID": this.uid(),
                "X-DeviceID": this.uid(),
                "X-MCC": "id-ID",
                sig: `XX${this.uid() + this.uid()}`
            }
        });
    }

    uid() {
        return crypto.randomUUID().replace(/-/g, "");
    }

    form(dt) {
        const form = new FormData();
        Object.entries(dt).forEach(([key, value]) => {
            form.append(key, String(value));
        });
        return form;
    }

    async upload(buff, method) {
        try {
            if (!Buffer.isBuffer(buff)) throw new Error("Data is not a valid buffer!");

            const fileInfo = await fileTypeFromBuffer(buff);
            if (!fileInfo) throw new Error("❌ Unable to detect file type!");
            const {
                mime,
                ext
            } = fileInfo;

            const d = await this.ins.post("/ai/web/nologin/getuploadurl", this.form({
                    ext,
                    method
                }))
                .then(i => i.data);

            if (!d?.data?.upload_url || !d?.data?.img_url)
                throw new Error("Upload URL not received from server!");

            await axios.put(d.data.upload_url, buff, {
                headers: {
                    "content-type": mime
                }
            });

            return d.data.img_url;
        } catch (e) {
            console.error("UPLOAD ERROR:", e.message);
            throw new Error("Upload failed: " + e.message);
        }
    }

    async task({
        path,
        data,
        sl = () => false
    }) {
        const [start, interval, timeout] = [Date.now(), 3000, 60000];
        return new Promise(async (resolve, reject) => {
            const check = async () => {
                if (Date.now() - start > timeout) {
                    return reject(new Error(`Polling timed out for path: ${path}`));
                }
                try {
                    const dt = await this.ins({
                        url: path,
                        method: data ? "POST" : "GET",
                        ...(data ? {
                            data
                        } : {})
                    });
                    if (!!dt.errmsg?.trim()) return reject(new Error(`Error message: ${dt.errmsg}`));
                    if (!!sl(dt.data)) return resolve(dt.data);
                    setTimeout(check, interval);
                } catch (error) {
                    reject(error);
                }
            };
            check();
        });
    }

    async edit(buff, prompt) {
        try {
            const up = await this.upload(buff, "wn_aistyle_nano");
            const dn = await this.ins.post("/ai/nano/upload", this.form({
                prompt,
                url: up
            })).then(i => i.data);
            if (!dn.task_id) throw new Error("taskId not found on request!");
            const res = await this.task({
                path: `/ai/nano/get_result/${dn.task_id}`,
                sl: (dt) => dt.code === 0 && !!dt.image_url
            });
            return res.image_url;
        } catch (e) {
            throw new Error("Something error, message: " + e.message);
        }
    }
}

let handler = async (m, {
    conn,
    usedPrefix,
    command,
    text
}) => {
    try {
        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q.imageMessage || q.stickerMessage || q).mimetype || q.mediaType || "";
        if (!mime || !/image\/(jpe?g|png|webp)/.test(mime)) {
            return conn.sendMessage(m.chat, {
                text: `*❗Reply to an image or sticker with a caption prompt.*\n\n*📝 Example:* ${usedPrefix + command} turn into anime style`
            }, {
                quoted: fkontak
            });
        }
        if (!text) {
            return conn.sendMessage(m.chat, {
                text: `*⚠️ Where's the prompt?*\n\n*📝 Example:* ${usedPrefix + command} add beard, mafia style`
            }, {
                quoted: fkontak
            });
        }

        let imgBuffer = await q.download();

        conn.sendMessage(m.chat, {
            react: {
                text: "🖌️",
                key: m.key
            }
        }, {
            quoted: m
        });

        const grid = new GridPlus();
        const resultUrl = await grid.edit(imgBuffer, text);
        const {
            data
        } = await axios.get(resultUrl, {
            responseType: "arraybuffer"
        });
        const result = Buffer.from(data);

        await conn.sendMessage(m.chat, {
            image: result,
            caption: `\`PROMPT\`\n\n*${text}*`
        }, {
            quoted: fkontak
        });

        conn.sendMessage(m.chat, {
            react: {
                text: "✅",
                key: m.key
            }
        }, {
            quoted: m
        });

    } catch (e) {
        console.error("PLUGINS ERROR:", e);
        conn.sendMessage(m.chat, {
            text: `*ERROR:*\n\n${e.message}`
        }, {
            quoted: fkontak
        });
        
        conn.sendMessage(m.chat, {
            react: {
                text: "❗",
                key: m.key
            }
        }, {
            quoted: m
        });
    }
};

handler.help = ["editimage2"];
handler.tags = ["ai"];
handler.command = ["editimage2", "editimg2", "editfoto"];
handler.limit = true;
handler.register = true;

export default handler;