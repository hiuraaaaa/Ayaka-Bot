/*
* Nama Fitur : Send Media
* Type : Plugins ESM
* Sumber : https://whatsapp.com/channel/0029Vb6p7345a23vpJBq3a1h
* Channel Testimoni : https://whatsapp.com/channel/0029Vb6B91zEVccCAAsrpV2q
* Group Bot : https://chat.whatsapp.com/CBQiK8LWkAl2W2UWecJ0BG
* Author : 𝐅𝐚𝐫𝐢𝐞𝐥
* Nomor Author : https://wa.me/6282152706113
*/

import { areJidsSameUser } from '@adiwajshing/baileys';
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import path from 'path';
import { tmpdir } from 'os';
import { join } from 'path';
import axios from 'axios';
import BodyForm from 'form-data';
import cheerio from 'cheerio';

function getOriginalJid(lidJid, participants) {
    if (!lidJid || !lidJid.endsWith('@lid')) return lidJid;
    if (!participants || !Array.isArray(participants)) return lidJid;
    const participant = participants.find(p => p.id === lidJid);
    if (participant && participant.jid) {
        return participant.jid;
    }
    return lidJid;
}

function cleanNumber(number) {
    return number.replace(/[^0-9]/g, '');
}

function getJidFromInput(input, participants, groupMetadata) {
    if (!input) return null;
    if (input.includes('@s.whatsapp.net')) {
        return input;
    }
    if (!isNaN(input)) {
        const cleaned = cleanNumber(input);
        if (cleaned.length >= 10) {
            return cleaned + '@s.whatsapp.net';
        }
    }
    if (input.includes('@')) {
        const username = input.split('@')[0];
        if (!participants || !Array.isArray(participants)) return null;
        const participant = participants.find(p => {
            const jid = p.id?.endsWith('@lid') ? getOriginalJid(p.id, participants) : p.id;
            const numberPart = jid?.split('@')[0];
            const displayName = p.name || p.notify || '';
            return jid?.includes(username) ||
                numberPart === username ||
                displayName.toLowerCase().includes(username.toLowerCase()) ||
                (p.id && p.id.includes(username));
        });
        if (participant) {
            return participant.id?.endsWith('@lid') ? getOriginalJid(participant.id, participants) : participant.id;
        }
    }
    return null;
}

async function webp2mp4File(path) {
    return new Promise(async (resolve, reject) => {
        try {
            if (!fs.existsSync(path)) throw new Error("❌ File stiker temp tidak ditemukan!");

            const form = new BodyForm();
            form.append("new-image-url", "");
            form.append("new-image", fs.createReadStream(path));

            const upload = await axios({
                method: "post",
                url: "https://ezgif.com/webp-to-mp4",
                data: form,
                maxRedirects: 5,
                timeout: 60000,
                headers: {
                    ...form.getHeaders(),
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
                },
            });

            const $ = cheerio.load(upload.data);
            const file = $('input[name="file"]').attr("value");
            if (!file) {
                console.log(upload.data.slice(0, 200));
                throw new Error("❌ Gagal upload stiker ke ezgif (file kosong)");
            }

            const form2 = new BodyForm();
            form2.append("file", file);
            form2.append("convert", "Convert WebP to MP4!");

            const convert = await axios({
                method: "post",
                url: "https://ezgif.com/webp-to-mp4/" + file,
                data: form2,
                maxRedirects: 5,
                timeout: 60000,
                headers: {
                    ...form2.getHeaders(),
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
                },
            });

            const $$ = cheerio.load(convert.data);
            const src = $$("div#output video > source").attr("src");

            if (!src) {
                console.log(convert.data.slice(5000, 10000));
                throw new Error("❌ Gagal ambil link hasil convert stiker! (Selector tidak ditemukan)");
            }

            resolve({
                status: true,
                result: "https:" + src,
            });
        } catch (err) {
            reject(err);
        }
    });
}

let handler = async (m, { conn, text, usedPrefix, command, participants, groupMetadata }) => {

    if (!text || !text.includes('|')) {
        return conn.reply(m.chat, `
❌ *Format salah!*
📝 *Contoh penggunaan:*
${usedPrefix + command} <target>|<teks_pesan>

🎯 *Target bisa berupa:*
- @tag
- ${global.nomorown}
- 120363404563729037@g.us
- ${global.link.gc}`, m);
    }

    let [targetInput, ...messageParts] = text.split('|');
    targetInput = targetInput.trim();
    let messageText = messageParts.join('|').trim();
    if (!targetInput || !messageText) {
        return conn.reply(m.chat, `❌ *Format tidak lengkap!*
❗Pastikan Anda memasukkan target dan teks pesan.

🪛 *Contoh:*
${usedPrefix + command} ${global.nomorown}|Halo, ini pesan media.`, m);
    }


    let targetJid = null;
    let targetName = targetInput;

    try {
        if (targetInput.startsWith('https://chat.whatsapp.com/')) {
        
            const parts = targetInput.split('/');
            const inviteCode = parts.filter(part => part.length > 0).pop();
            if (!inviteCode || inviteCode.length < 20) throw new Error('Link/Invite Code grup tidak valid.');
            
            let groupInfo;
            try {
            
                groupInfo = await conn.groupGetInviteInfo(inviteCode);
                targetJid = groupInfo.id;
                targetName = groupInfo.subject || targetJid;
            } catch (e) {
                console.error("❌ Gagal resolve link invite:", e);
                throw new Error(`❌ Gagal mengambil info dari link: ${e.message}`);
            }

        } else if (targetInput.includes('@g.us')) {
            targetJid = targetInput;
            try {
                let meta = await conn.groupMetadata(targetJid);
                targetName = meta.subject;
            } catch (e) {
                targetName = "❗Grup (Bot bukan member)";
            }
        } else {
        
            let who;
            if (m.isGroup) {
            
                who = m.mentionedJid[0] || getJidFromInput(targetInput, participants, groupMetadata);
            } else {
            
                who = targetInput.replace(/\D/g, '') + '@s.whatsapp.net';
            }

            if (!who) throw new Error('❗User (PC) tidak ditemukan. Pastikan tag/nomor benar.');
            
            who = getOriginalJid(who, participants); 
            
            if (!who || !who.endsWith('@s.whatsapp.net')) throw new Error('👤 JID User (PC) tidak valid.');
            
            targetJid = who;
            targetName = `@${targetJid.split('@')[0]}`;
        }

        if (!targetJid) {
            return conn.reply(m.chat, `❌ *Target tidak valid:* ${targetInput}\nPastikan format benar.`, m);
        }

    } catch (err) {
        console.error("Error Resolusi Target:", err);
        return conn.reply(m.chat, `*Gagal memproses target:*\n> ${err.message}`, m);
    }

    let q = m.quoted ? m.quoted : null;
    let mime = (q && q.mimetype) ? q.mimetype : '';
    let options = {};
    let tempPath = '';

    try {
        if (q) {
            // === JIKA ME-REPLY MEDIA ===
            m.reply(`⏳ Mempersiapkan media untuk dikirim ke *${targetName}*`);
            let mediaBuffer = await q.download();
            if (!mediaBuffer) throw new Error("❗Gagal mengunduh media yang di-reply.");

            if (/image/.test(mime)) {
                // --- FOTO ---
                options = { image: mediaBuffer, caption: messageText };
            } else if (/video/.test(mime)) {
                // --- VIDEO ---
                options = { video: mediaBuffer, caption: messageText };
            } else if (/audio/.test(mime)) {
                // --- AUDIO ---
                options = { audio: mediaBuffer, mimetype: 'audio/mp4' };
            } else if (/document/.test(mime)) {
                // --- DOKUMEN ---
                options = {
                    document: mediaBuffer,
                    mimetype: mime,
                    fileName: q.fileName || 'Dokumen.bin',
                    caption: messageText // Caption di dokumen
                };
            } else if (/webp/.test(mime)) {
                if (q.isAnimated) {
                    tempPath = join(tmpdir(), `${Date.now()}.webp`);
                    await fsPromises.writeFile(tempPath, mediaBuffer);
                    
                    m.reply(`⏳ Mengonversi stiker animasi ke video...`);
                    let webpToMp4 = await webp2mp4File(tempPath);
                    if (!webpToMp4.result) throw new Error('Gagal konversi stiker (API).');
                    
                    const videoBuffer = await (await axios.get(webpToMp4.result, { responseType: 'arraybuffer' })).data;
                    if (!videoBuffer) throw new Error('Gagal unduh video hasil konversi.');
                    
                    options = { video: videoBuffer, caption: messageText, gifPlayback: true };
                } else {
                    options = { image: mediaBuffer, caption: messageText };
                }
            } else {
                m.reply(`⚠️ Media yang di-reply (${mime}) tidak didukung. Mengirim sebagai teks saja.`);
                options = { text: messageText };
            }
        } else {
            options = { text: messageText };
        }

        await conn.sendMessage(targetJid, options);

        return conn.reply(m.chat, `*「 PENGIRIMAN MEDIA ✔️ 」*

👥 𝗧𝗮𝗿𝗴𝗲𝘁: ${targetName}
🆔 𝗜𝗗: ${targetJid}

> ᴘᴇsᴀɴ *ᴏᴡɴᴇʀ ʙᴇʀʜᴀsɪʟ ᴅɪᴋɪʀɪᴍ* ᴋᴇᴘᴀᴅᴀ ᴛᴀʀɢᴇᴛ!`, m);

    } catch (e) {
        console.error("Error saat SendMedia:", e);
        return conn.reply(m.chat, `*「 PENGIRIMAN MEDIA ❌ 」*

👥 𝗧𝗮𝗿𝗴𝗲𝘁: ${targetName}
🆔 𝗜𝗗: ${targetJid}

> ᴘᴇsᴀɴ *ᴏᴡɴᴇʀ ɢᴀɢᴀʟ ᴅɪᴋɪʀɪᴍ* ᴅᴇɴɢᴀɴ ʟᴏɢ ᴇʀʀᴏʀ:
> ${e.message}`, m);
    } finally {
        if (tempPath && fs.existsSync(tempPath)) {
            await fsPromises.unlink(tempPath);
        }
    }
};

handler.help = ['sendmedia <target>|<teks>'];
handler.tags = ['owner'];
handler.command = /^(sendmedia)$/i;
handler.owner = true;

export default handler;

/*
* Nama Fitur : Send Media
* Type : Plugins ESM
* Sumber : https://whatsapp.com/channel/0029Vb6p7345a23vpJBq3a1h
* Channel Testimoni : https://whatsapp.com/channel/0029Vb6B91zEVccCAAsrpV2q
* Group Bot : https://chat.whatsapp.com/CBQiK8LWkAl2W2UWecJ0BG
* Author : 𝐅𝐚𝐫𝐢𝐞𝐥
* Nomor Author : https://wa.me/6282152706113
*/