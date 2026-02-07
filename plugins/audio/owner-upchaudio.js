import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const handler = async (m, { conn, args, command, usedPrefix }) => {
    try {
        if (!args[0]) {
            throw `*Masukkan ID channel atau URL channel*\n*Contoh:*\n${usedPrefix + command} ${global.idch || '120xxx@newsletter'}\n${usedPrefix + command} ${global.link.ch || 'https://whatsapp.com/channel/0029Vb...'}`;
        }

        let channelId;
        const recipient = args[0].trim();

        if (recipient.startsWith('https://whatsapp.com/channel/')) {
            try {
                const inviteCode = recipient.split('/').pop();
                if (!inviteCode || inviteCode.length < 20) throw '❌ URL tidak valid!';
                
                const metadata = await conn.newsletterMetadata('invite', inviteCode, 'GUEST');
                if (!metadata || !metadata.id) {
                    throw 'Channel tidak ditemukan atau URL/Invite Code tidak valid.';
                }
                
                channelId = metadata.id;
                if (!channelId.includes('@newsletter')) throw '❌ Gagal ambil ID dari URL!';
            } catch (err) {
                return m.reply(`❌ Gagal ambil data channel: ${err.message || err}`);
            }
        } else {
            channelId = recipient;
            if (!channelId.includes('@newsletter')) throw '❌ ID channel tidak valid!';
        }

        const q = m.quoted ? m.quoted : m;
        const mime = q.mimetype || "";

        if (!m.quoted) return m.reply(`Reply audio yang ingin dikirim!\n\n*Contoh:*\nReply audio lalu ketik:\n${usedPrefix + command} <id_channel>/<URL_channel>`);
        if (!/audio/.test(mime)) return m.reply("❗Reply file audio");
        if (q.isPtt) {
            return m.reply("❌ Gagal: Ini adalah voice note.\nHarap reply file *audio* (seperti MP3), bukan voice note.");
        }

        await m.reply("⏳ Sedang memproses audio...");

        const media = await q.download();
        if (!Buffer.isBuffer(media)) throw new Error("Gagal mengunduh audio.");

        const tmpInput = path.join(__dirname, `temp_input_${m.sender}.mp3`);
        const tmpOutput = path.join(__dirname, `temp_output_${m.sender}.ogg`);
        
        fs.writeFileSync(tmpInput, media);

        await new Promise((resolve, reject) => {
            ffmpeg(tmpInput)
                .toFormat("ogg")
                .audioCodec("libopus")
                .on("end", resolve)
                .on("error", reject)
                .save(tmpOutput);
        });

        const converted = fs.readFileSync(tmpOutput);
        const caption = q.caption || q.text || '';
        let newsletterName = `ᴀᴜᴅɪᴏ ᴜᴘʟᴏᴀᴅᴇʀ || ${global.namebot}`;
        try {
            const meta = await conn.newsletterMetadata(channelId);
            newsletterName = meta.name || newsletterName;
        } catch {}

        const contextInfo = {
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: channelId,
                newsletterName
            }
        };

        await conn.sendMessage(channelId, {
            audio: converted,
            mimetype: "audio/ogg; codecs=opus",
            ptt: true,
            caption: caption,
            contextInfo: contextInfo
        });

        await m.reply("✅ Berhasil mengirimkan audio ke channel!");

        fs.unlinkSync(tmpInput);
fs.unlinkSync(tmpOutput);

    } catch (err) {
        console.error(err);
        await m.reply(`❌ Gagal: ${err.message || err}`);
        
        try {
            const tmpInput = path.join(__dirname, `temp_input_${m.sender}.mp3`);
            const tmpOutput = path.join(__dirname, `temp_output_${m.sender}.ogg`);
            if (fs.existsSync(tmpInput)) fs.unlinkSync(tmpInput);
            if (fs.existsSync(tmpOutput)) fs.unlinkSync(tmpOutput);
        } catch (e) {
            console.error("Gagal membersihkan file temp:", e);
        }
    }
};

handler.command = ["upmp3", "upch2"];
handler.help = ['upmp3 <id/url>', 'upch2 <id/url>'];
handler.tags = ['owner'];
handler.owner = true;

export default handler;