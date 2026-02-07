import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const handler = async (m, { conn, quoted, command }) => {
    let loadd = [];
    let { key } = await conn.sendMessage(m.chat, { text: '_Tunggu ya kak.._\n*Note:* Semakin lama durasi video, semakin lama prosesnya, dan semakin besar ukuran file.' }, m);

    for (let i = 0; i < loadd.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 50));
        await conn.sendMessage(m.chat, { text: loadd[i], edit: key });
    }

    try {
        const q = quoted ? quoted : m;
        const mime = (q.msg || q).mimetype || '';

        if (!mime || !mime.includes('video')) {
            return m.reply(`Send a video and use the .${command} command.`);
        }

        const videoData = await q.download();
        const outputDir = '/tmp';
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }
        const outputFilename = `${uuidv4()}.mp4`;
        const outputPath = `${outputDir}/${outputFilename}`;
        fs.writeFileSync(outputPath, videoData);

        ffmpeg()
            .input(outputPath)
            .output(`${outputDir}/${outputFilename}_processed.mp4`)
            .outputOptions('-vf', 'scale=iw*2:ih*2,unsharp=5:5:1.0:5:5:1.0') // Meningkatkan resolusi dan memperjelas gambar
            .outputOptions('-crf', '20') // Nilai CRF untuk kualitas kompresi yang baik
            .outputOptions('-preset', 'medium')
            .outputOptions('-pix_fmt', 'yuv420p')
            .on('end', async () => {
                await conn.sendFile(m.chat, `${outputDir}/${outputFilename}_processed.mp4`, `${outputFilename}_processed.mp4`, `☁️ *Result From HD Video*`, m, null, async (e, d) => {
                    // Hapus file setelah berhasil dikirim
                    try {
                        await fs.promises.unlink(outputPath);
                        await fs.promises.unlink(`${outputDir}/${outputFilename}_processed.mp4`);
                    } catch (err) {
                        console.error('Error while deleting file:', err);
                    }
                });
            })
            .on('error', (err) => {
                console.error(err);
                conn.reply(m.chat, 'An error occurred while processing the video. ' + err);
            })
            .run();
    } catch (error) {
        console.error(error);
        conn.reply(m.chat, 'An error occurred while processing the video.');
    }
};

handler.help = ["videohd","hdvideo"];
handler.tags = ["tools","premium"];
handler.command = /^(hdvid|vidhd|videohd|hdvideo)/i;
handler.limit = 5;
handler.premium = true

export default handler;