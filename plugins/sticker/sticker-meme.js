import uploadImage from '../lib/memek.js';
import { sticker } from '../lib/sticker.js';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let [atas, bawah] = text.split`|`;
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    if (!mime) throw `Balas gambar atau video dengan perintah\n\n${usedPrefix + command} <${atas ? atas : 'teks atas'}>|<${bawah ? bawah : 'teks bawah'}>`;

    if (/image\/(jpe?g|png)/.test(mime)) {
        // Proses gambar
        let img = await q.download();
        let url = await uploadImage(img);
        let meme = `https://api.memegen.link/images/custom/${encodeURIComponent(atas ? atas : '')}/${encodeURIComponent(bawah ? bawah : '')}.png?background=${url}`;
        let stiker = await sticker(false, meme, global.stickpack, global.stickauth);
        if (stiker) await conn.sendFile(m.chat, stiker, '', global.stickauth, m, '', { asSticker: 1 });
    } else if (/video\/mp4/.test(mime)) {
        // Proses video
        let video = await q.download();
        if (!video) throw 'Gagal mengunduh video. Silakan coba lagi.';
        
        let inputFile = path.join('/tmp', `input_${Date.now()}.mp4`);
        let outputFile = path.join('/tmp', `output_${Date.now()}.mp4`);
        
        // Simpan video ke file sementara
        fs.writeFileSync(inputFile, video);

        await new Promise((resolve, reject) => {
            ffmpeg(inputFile)
                .videoFilter(`drawtext=text='${atas || ''}':x=(w-text_w)/2:y=10:fontsize=24:fontcolor=white, drawtext=text='${bawah || ''}':x=(w-text_w)/2:y=h-30:fontsize=24:fontcolor=white`)
                .output(outputFile)
                .on('end', () => {
                    resolve();
                    fs.unlinkSync(inputFile); // Hapus file input setelah selesai
                })
                .on('error', (err) => {
                    reject(err);
                    fs.unlinkSync(inputFile); // Hapus file input jika terjadi kesalahan
                })
                .run();
        });

        await conn.sendFile(m.chat, outputFile, 'meme.mp4', 'Berikut adalah video dengan teks.', m);
        fs.unlinkSync(outputFile); // Hapus file output setelah dikirim
    } else {
        throw `_*Mime ${mime} tidak didukung!*_`;
    }
};

handler.help = ['smeme <teks atas>|<teks bawah>'];
handler.tags = ['tools'];
handler.command = /^(smeme)$/i;

handler.limit = true;

export default handler;