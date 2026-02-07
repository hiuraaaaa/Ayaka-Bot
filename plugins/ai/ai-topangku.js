/*
* Nama Fitur : AI Couple (GridPlus Version)
* Deskripsi : Menggabungkan 2 foto dan mengeditnya dengan AI (GridPlus)
* Author : 𝐅𝐚𝐫𝐢𝐞𝐥 (Dimodifikasi dengan GridPlus)
*/

import axios from "axios";
import FormData from "form-data";
import { fileTypeFromBuffer } from 'file-type';
import Jimp from "jimp";
import crypto from "node:crypto";

// --- KONFIGURASI ---
const fkontak = {
    key: { participant: '0@s.whatsapp.net', remoteJid: '0@s.whatsapp.net', fromMe: false, id: 'Halo' },
    message: { conversation: `AI Couple Mirror 📸` }
};

// --- PROMPT BARU YANG DIMINTA ---
const STATIC_PROMPT = `Edit dan gabungkan foto ini tanpa merubah wajah dan rambut asli foto sedang dalam momen intim di depan cermin. wanita nya mengenakan atasan tanktop hitam crop tali 1 jari dan celana hitam pendek. Ia duduk di pangkuan seorang pria yang mengenakan kaus hitam polos dan anting salib hitam. Pria itu memeluknya erat, wajahnya mendongak seolah hendak mencium. Wanita itu memegang ponsel di depan wajahnya, lampu kilatnya menyinari mereka berdua, menciptakan efek cahaya yang kuat.    
Latar belakangnya adalah pintu kayu berwarna cokelat muda, memberikan kesan ruangan yang sederhana dan nyaman. Komposisinya berpusat pada kedua subjek, menekankan kedekatan dan keintiman mereka. Suasana yang terpancar adalah kehangatan, cinta, dan kebahagiaan yang sederhana. Pencahayaan dari lampu kilat ponsel menciptakan kontras dramatis, menyoroti wajah mereka dan menambahkan sedikit sentuhan modern pada adegan tersebut., sangat detail, medium shot, rasio 3:4, kualitas ultra HD, difoto menggunakan iPhone 16 Pro Max, detail realistis.`;

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

const editSessions = {};

async function mergePhotos(buf1, buf2) {
  const img1 = await Jimp.read(buf1);
  const img2 = await Jimp.read(buf2);
  const size = 700;
  img1.cover(size, size);
  img2.cover(size, size);

  const gap = 20;
  const canvas = new Jimp(size * 2 + gap, size, 0xffffffff);
  canvas.composite(img1, 0, 0);
  canvas.composite(img2, size + gap, 0);

  return await canvas.getBufferAsync(Jimp.MIME_JPEG);
}

async function handleFirstImage(m, conn, sender) {
    await conn.sendMessage(m.chat, { text: '✅ Gambar pertama diterima.\nSilakan reply gambar kedua dengan caption yang sama.' }, { quoted: fkontak });

    const imageBuffer = await m.quoted.download();
    if (!imageBuffer) throw new Error('Gagal mengunduh gambar pertama.');

    editSessions[sender] = { buf1: imageBuffer, timestamp: Date.now() };

    setTimeout(() => {
        if (editSessions[sender]) {
            delete editSessions[sender];
            conn.reply(m.chat, '⏳ Sesi Anda telah berakhir karena tidak ada gambar kedua yang dikirim dalam 5 menit.', m);
        }
    }, 300000);
}

async function handleSecondImage(m, conn, sender) {
    await conn.sendMessage(m.chat, { text: `✅ Gambar kedua diterima.\n⏳ Memulai proses edit foto AI Couple Mirror, mohon tunggu... Ini mungkin memakan waktu 1-3 menit.` }, { quoted: fkontak });

    const { buf1 } = editSessions[sender];
    delete editSessions[sender];

    const buf2 = await m.quoted.download();
    if (!buf2) throw new Error('Gagal mengunduh gambar kedua.');
    const mergedBuffer = await mergePhotos(buf1, buf2);
    try {
        const grid = new GridPlus();
        const resultUrl = await grid.edit(mergedBuffer, STATIC_PROMPT);
        const { data } = await axios.get(resultUrl, {
            responseType: "arraybuffer",
            timeout: 120000
        });
        
        const resultBuffer = Buffer.from(data);

        if (!resultBuffer || resultBuffer.length < 1000) {
             throw new Error("❌ API (GridPlus) mengembalikan hasil gambar yang tidak valid.");
        }

        // 4. Kirim hasil
        await conn.sendFile(m.chat, resultBuffer, "couple-edit.jpg", "✨ Ini dia hasilnya!", fkontak);

    } catch (error) {
        if (error.response) {
            console.error("API Error Response (GridPlus):", error.response.status, error.response.statusText);
            throw new Error(`❗API (GridPlus) gagal memproses gambar (Status: ${error.response.status}). Coba gunakan gambar lain.`);
        }
        throw new Error(`❗Terjadi kesalahan (GridPlus): ${error.message}`);
    }
}

const handler = async (m, { conn, usedPrefix, command }) => {
    const sender = m.sender;
    const mime = m.quoted?.mimetype || '';

    if (!/image/.test(mime)) {
        return conn.reply(m.chat, `🖼️ *Cara Penggunaan:*\n\n1. Kirim gambar pertama dengan caption *${usedPrefix + command}*\n2. Balas/reply gambar kedua dengan caption *${usedPrefix + command}* lagi.`, fkontak);
    }

    const isSecondImageProcess = !!editSessions[sender];

    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

    try {
        if (isSecondImageProcess) {
            await handleSecondImage(m, conn, sender);
            await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
        } else {
            await handleFirstImage(m, conn, sender);
        }
    } catch (e) {
        console.error(e);
        if (editSessions[sender]) {
            delete editSessions[sender];
        }
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
        conn.reply(m.chat, `❗ Gagal: ${e.message}`, fkontak);
    }
};

handler.help = ['topangku'];
handler.tags = ['ai'];
handler.command = /^(topangku)$/i;
handler.limit = true;
handler.premium = false;

export default handler;