/*
* Nama Fitur : AI To Doraemon (Versi GridPlus)
* Type : Plugins ESM
* Sumber : https://whatsapp.com/channel/0029Vb6p7345a23vpJBq3a1h
* Channel Testimoni : https://whatsapp.com/channel/0029Vb6B91zEVccCAAsrpV2q
* Group Bot : https://chat.whatsapp.com/CBQiK8LWkAl2W2UWecJ0BG
* Author : 𝐅𝐚𝐫𝐢𝐞𝐥 (Dimodifikasi dengan GridPlus)
* Nomor Author : https://wa.me/6288705574039
*/

import axios from "axios";
import FormData from "form-data";
import crypto from "node:crypto";
import {
    fileTypeFromBuffer
} from "file-type";

const fkontak = {
    key: {
        participant: '0@s.whatsapp.net',
        remoteJid: '0@s.whatsapp.net',
        fromMe: false,
        id: 'Halo'
    },
    message: {
        conversation: `AI To Doraemon 🐱`
    }
};

const Prompt = () => `
buatlah menjadi perempuan muda sedang foto studio menggunakan Hoodie Doraemon sambil memeluk boneka Doraemon
`
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
    command
}) => { // 'text' dihapus dari argumen
    const q = m.quoted ? m.quoted : m
    const mime = (q.msg || q).mimetype || ""
    if (!/image\/(png|jpe?g|webp)/i.test(mime)) {
        return conn.reply(
            m.chat,
            `❗Balas/Reply gambar dengan caption *${usedPrefix + command}*`,
            m, {
                quoted: fkontak
            }
        )
    }

    const reactDone = {
        react: {
            text: "✅",
            key: m.key
        }
    }

    try {
        await conn.reply(m.chat, '⏳ Sedang memproses AI To Doraemon, mohon tunggu sebentar...', m, {
            quoted: fkontak
        })
        await conn.sendMessage(m.chat, {
            react: {
                text: "⏳",
                key: m.key
            }
        })

        const imgBuffer = await q.download()
        if (!imgBuffer?.length) throw new Error("❌ Gagal download media")
        
        const grid = new GridPlus();
        const finalPrompt = Prompt()
        const caption = `🐱 *Poster Doraemon Selesai*`
        
        const resultUrl = await grid.edit(imgBuffer, finalPrompt);
        const {
            data
        } = await axios.get(resultUrl, {
            responseType: "arraybuffer",
            timeout: 120000
        });
        const result = Buffer.from(data);
        await conn.sendFile(m.chat, result, "doraemon_poster.jpg", caption, fkontak);
        await conn.sendMessage(m.chat, reactDone)

    } catch (e) {
        await conn.sendMessage(m.chat, {
            react: {
                text: "❌",
                key: m.key
            }
        })
        console.error("PLUGINS ERROR:", e);
        conn.reply(m.chat, `❌ Error: ${e.message || e}`, m, {
            quoted: fkontak
        })
    }
}

handler.help = ["todoraemon"]
handler.tags = ["ai"]
handler.command = /^(todoraemon|doraemon)$/i
handler.register = true

export default handler

/*
* Nama Fitur : AI To Doraemon (Versi GridPlus)
* Type : Plugins ESM
* Sumber : https://whatsapp.com/channel/0029Vb6p7345a23vpJBq3a1h
* Channel Testimoni : https://whatsapp.com/channel/0029Vb6B91zEVccCAAsrpV2q
* Group Bot : https://chat.whatsapp.com/CBQiK8LWkAl2W2UWecJ0BG
* Author : 𝐅𝐚𝐫𝐢𝐞𝐥 (Dimodifikasi dengan GridPlus)
* Nomor Author : https://wa.me/6288705574039
*/