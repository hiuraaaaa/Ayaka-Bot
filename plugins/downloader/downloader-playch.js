/*
* Nama Fitur : Play Channel Sup Thumbnail, Sup ID/URL Channel
* Type : Plugins ESM
* Sumber : https://whatsapp.com/channel/0029Vb6p7345a23vpJBq3a1h
* Channel Testimoni : https://whatsapp.com/channel/0029Vb6B91zEVccCAAsrpV2q
* Group Bot : https://chat.whatsapp.com/CBQiK8LWkAl2W2UWecJ0BG
* Author : 𝐅𝐚𝐫𝐢𝐞𝐥
* Nomor Author : https://wa.me/6282152706113
*/

import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import yts from 'yt-search';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const fkontak = {
  key: {
    participant: '0@s.whatsapp.net',
    remoteJid: '0@s.whatsapp.net',
    fromMe: false,
    id: 'Halo',
  },
  message: {
    conversation: `Musik Anda Siap Diputar di Channel 🎶`,
  },
};

const parseDuration = (duration) => {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  const hours = (parseInt(match[1]) || 0);
  const minutes = (parseInt(match[2]) || 0);
  const seconds = (parseInt(match[3]) || 0);
  return [
    hours,
    minutes,
    seconds
  ].map(v => v.toString().padStart(2, '0')).join(':');
};


const handler = async (m, { conn, text, command, usedPrefix }) => {
    if (!text || !text.includes('|')) {
        return conn.reply(m.chat, `*Format salah!*\n*Contoh:*\n> ${usedPrefix + command} NDX AKA | ${global.link.ch || 'https://whatsapp.com/channel/0029Vb...'}\n> ${usedPrefix + command} Orang Yang Salah Luvia Band | ${global.idch}`, m, { quoted: fkontak });
    }

    const [query, recipient] = text.split('|').map(s => s.trim());

    if (!query) {
        return conn.reply(m.chat, `*Nama lagu tidak boleh kosong!*\n*Contoh:*\n> ${usedPrefix + command} NDX AKA | ${global.idch}\n> ${usedPrefix + command} Orang Yang Salah Luvia Band | ${global.link.ch}`, m, { quoted: fkontak });
    }
    if (!recipient) {
        return conn.reply(m.chat, `*ID atau URL channel tidak boleh kosong!*\n*Contoh:*\n> ${usedPrefix + command} NDX AKA | ${global.idch}\n> ${usedPrefix + command} Orang Yang Salah Luvia Band | ${global.link.ch}`, m, { quoted: fkontak });
    }

    await conn.reply(m.chat, `⏳ Sedang memproses lagu Anda untuk diupload ke Channel...`, m, { quoted: fkontak });

    const tmpInput = path.join(__dirname, `temp_playch_in_${m.sender}.mp3`);
    const tmpOutput = path.join(__dirname, `temp_playch_out_${m.sender}.ogg`);

    try {
        let channelId;
        if (recipient.startsWith('https://whatsapp.com/channel/')) {
            try {
                const parts = recipient.split('/');
                const inviteCode = parts.filter(part => part.length > 0).pop();

                if (!inviteCode || inviteCode.length < 20) throw '❌ URL channel tidak valid!';
                
                const metadata = await conn.newsletterMetadata('invite', inviteCode, 'GUEST');
                if (!metadata || !metadata.id) {
                    throw 'Channel tidak ditemukan atau URL/Invite Code tidak valid.';
                }
                channelId = metadata.id;
                if (!channelId.includes('@newsletter')) throw '❌ Gagal mengambil ID channel dari URL!';
            } catch (err) {
                throw `❌ Gagal memvalidasi URL channel: ${err.message || err}`;
            }
        } else {
            channelId = recipient;
            if (!channelId.includes('@newsletter')) throw '❌ ID channel tidak valid! Harus berakhiran @newsletter';
        }
        const results = await yts(query);
        const video = results.all[0];
        if (!video) {
            throw '❌ Video tidak ditemukan, coba cari dengan kata kunci lain.';
        }
        const { url: ytUrl, videoId, title } = video;
        const YOUTUBE_API_KEY = global.youtube;
        if (!YOUTUBE_API_KEY) {
            throw new Error('YouTube API Key (global.youtube) tidak ditemukan. Harap konfigurasi terlebih dahulu.');
        }

        const videoDetailsResponse = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${YOUTUBE_API_KEY}`);
        const videoDetails = await videoDetailsResponse.json();

        if (!videoDetails.items || videoDetails.items.length === 0) {
          throw new Error('Detail video tidak dapat ditemukan. Mungkin video ini pribadi atau telah dihapus.');
        }

        const { snippet, statistics, contentDetails } = videoDetails.items[0];
        const publishedAt = new Date(snippet.publishedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
        const duration = parseDuration(contentDetails.duration);
        const viewCount = Number(statistics.viewCount).toLocaleString('id-ID');
        const likeCount = Number(statistics.likeCount).toLocaleString('id-ID');
        const commentCount = Number(statistics.commentCount).toLocaleString('id-ID');
        if (!global.APIs || !global.APIs.faa) {
             throw 'API (global.APIs.faa) tidak dikonfigurasi.';
        }
        
        const apiUrl = `${global.faa}/faa/ytmp3?url=${encodeURIComponent(ytUrl)}`;
        const downloaderResponse = await fetch(apiUrl);
        const downloaderJson = await downloaderResponse.json();

        if (!downloaderJson.status || !downloaderJson.result || !downloaderJson.result.mp3) {
            throw 'Gagal mendapatkan link unduhan audio. API mungkin sedang down.';
        }

        const { mp3: mp3Link, thumbnail: thumbnailUrl } = downloaderJson.result;
        const audioBuffer = await (await fetch(mp3Link)).buffer();
        if (!Buffer.isBuffer(audioBuffer)) throw new Error("Gagal mengunduh audio dari API.");

        let thumbnailBuffer;
        try {
            thumbnailBuffer = await (await fetch(thumbnailUrl)).buffer();
        } catch (e) {
            console.error("Gagal download thumbnail.");
            thumbnailBuffer = undefined;
        }

        fs.writeFileSync(tmpInput, audioBuffer);

        await new Promise((resolve, reject) => {
            ffmpeg(tmpInput)
                .toFormat("ogg")
                .audioCodec("libopus")
                .on("end", resolve)
                .on("error", reject)
                .save(tmpOutput);
        });

        const converted = fs.readFileSync(tmpOutput);
        const caption = `
*${title}*
🎵 *Durasi:* ${duration}
👀 *Tayangan:* ${viewCount}
❤️ *Suka:* ${likeCount}
💬 *Komentar:* ${commentCount}
📅 *Upload:* ${publishedAt}
`;
        const newBody = `🎵${duration} | 👀${viewCount} | ❤️${likeCount} | 💬${commentCount}`;
        const contextInfo = {
             externalAdReply: {
                title: `🎶 ${title} || 📅 ${publishedAt}`,
                body: newBody,
                thumbnailUrl: thumbnailUrl,
                sourceUrl: global.link.ch,
                mediaType: 1,
                renderLargerThumbnail: true,
                showAdAttribution: false
            }
        };

        await conn.sendMessage(channelId, {
            audio: converted,
            mimetype: "audio/ogg; codecs=opus",
            ptt: true,
            caption: caption,
            jpegThumbnail: thumbnailBuffer,
            contextInfo: contextInfo
        });

        await conn.reply(m.chat, `✅ Berhasil mengirimkan *"${title}"* ke channel sebagai Voice Note!`, m, { quoted: fkontak });

    } catch (err) {
        console.error(err);
        await conn.reply(m.chat, `❌ Gagal: ${err.message || err}`, m, { quoted: fkontak });
    } finally {
        try {
            if (fs.existsSync(tmpInput)) fs.unlinkSync(tmpInput);
            if (fs.existsSync(tmpOutput)) fs.unlinkSync(tmpOutput);
        } catch (e) {
            console.error("Gagal membersihkan file temp:", e);
        }
    }
};

handler.command = ["playch", "musicch"];
handler.help = ['playch <nama_lagu>|<id/url_channel>', 'musicch <nama_lagu>|<id/url_channel>'];
handler.tags = ['owner'];
handler.owner = true;
handler.limit = true; 

export default handler;

/*
* Nama Fitur : Play Channel Sup Thumbnail, Sup ID/URL Channel
* Type : Plugins ESM
* Sumber : https://whatsapp.com/channel/0029Vb6p7345a23vpJBq3a1h
* Channel Testimoni : https://whatsapp.com/channel/0029Vb6B91zEVccCAAsrpV2q
* Group Bot : https://chat.whatsapp.com/CBQiK8LWkAl2W2UWecJ0BG
* Author : 𝐅𝐚𝐫𝐢𝐞𝐥
* Nomor Author : https://wa.me/6282152706113
*/