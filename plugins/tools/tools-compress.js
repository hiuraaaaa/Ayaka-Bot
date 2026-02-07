import sharp from "sharp";

let handler = async (m, { conn, usedPrefix, command, args }) => {
    const fkontak = {
        key: { participant: '0@s.whatsapp.net', remoteJid: '0@s.whatsapp.net', fromMe: false, id: 'Halo' },
        message: { conversation: `Kompress Gambar 🖼` }
    };

    const levelArg = parseInt(args[0], 10);
    const widthArg = parseInt(args[1], 10);

    const level = Number.isInteger(levelArg) && levelArg >= 1 && levelArg <= 5 ? levelArg : null;
    const resizeWidth = Number.isInteger(widthArg) && widthArg > 0 ? widthArg : null;

    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || q.mediaType || "";
    if (!/^image\/(jpe?g|png|webp)$/i.test(mime)) {
        const errorMsg = `Kirim/Balas gambar (jpg/png/webp) dengan perintah:\n` +
                       `*${usedPrefix + command} [level] [width]*\n\n` +
                       `*level* (opsional): 1 (ringan) - 5 (kuat)\n` +
                       `*width* (opsional): Lebar gambar baru (mis: 512)`;
        return conn.sendMessage(m.chat, { text: errorMsg }, { quoted: fkontak });
    }

    // [MODIFIKASI 3] - Mengubah pesan info/error sesuai permintaan
    if (!level && !resizeWidth) {
        const infoMsg = `*❗Silahkan tentukan setidaknya level kompresi atau lebar gambar*

*📝 Contoh Kompresi:*
${usedPrefix + command} 3
*📝 Contoh Resize:*
${usedPrefix + command} 0 152
*📝 Contoh Keduanya:*
${usedPrefix + command} 3 512

*ℹ️ List Kompresi:*
1, 2, 3, 4, 5
*ℹ️ List Resize:*
(Angka lebar, mis: 512)`;
        return conn.sendMessage(m.chat, { text: infoMsg }, { quoted: fkontak });
    }

    await conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } }); 
    try {
        const input = await q.download();
        if (!input?.length) {
            return conn.sendMessage(m.chat, { text: "Gagal mengunduh gambar." }, { quoted: fkontak });
        }

        const img = sharp(input, { failOn: "none" });
        const meta = await img.metadata().catch(() => ({}));
        const format = (meta.format || "").toLowerCase();
        const hasAlpha = !!meta.hasAlpha;
        const beforeBytes = input.length;
        const sizeKB = Math.ceil(beforeBytes / 1024);

        const autoLevel = (() => {
            if (level) return level; 
            if (resizeWidth && !level) return 0;
            if (sizeKB <= 300) return 1;
            if (sizeKB <= 1000) return 2;
            if (sizeKB <= 3000) return 3;
            if (sizeKB <= 8000) return 4;
            return 5;
        })();
        
        const baseQ = { 0: 100, 1: 90, 2: 75, 3: 60, 4: 45, 5: 30 }[autoLevel];
        let quality = baseQ;

        if (autoLevel > 0) {
            if (sizeKB > 3000) quality -= 10;
            if (sizeKB > 6000) quality -= 10;
            if (sizeKB > 10000) quality -= 10;
            if (sizeKB < 200) quality += 5;
        }
        quality = Math.max(20, Math.min(100, quality)); 

        let outFormat;
        const pipe = sharp(input, { failOn: "none" });

        if (resizeWidth) {
            pipe.resize({ width: resizeWidth, withoutEnlargement: true, fit: 'inside' });
        }

        if (format === "jpeg" || format === "jpg") {
            pipe.jpeg({ quality, mozjpeg: true, chromaSubsampling: "4:2:0" });
            outFormat = "jpeg";
        } else if (format === "webp") {
            pipe.webp({ quality, effort: 4, nearLossless: quality === 100 });
            outFormat = "webp";
        } else if (format === "png") {
            if (autoLevel >= 3 && !resizeWidth) { 
                pipe.webp({ quality, effort: 4, nearLossless: quality === 100 });
                outFormat = "webp";
            } else {
                pipe.png({ 
                    compressionLevel: quality === 100 ? 3 : 9, 
                    palette: true, 
                    quality: quality 
                });
                outFormat = "png";
            }
        } else {
             // [MODIFIKASI 2] - Menggunakan fkontak
            return conn.sendMessage(m.chat, { text: "❌ Format gambar tidak didukung." }, { quoted: fkontak });
        }

        const output = await pipe.toBuffer();
        if (!output?.length) {
            return conn.sendMessage(m.chat, { text: "❌ Gagal memproses gambar." }, { quoted: fkontak });
        }

        const afterBytes = output.length;
        const saved = Math.max(0, beforeBytes - afterBytes);
        const ratio = beforeBytes ? ((saved / beforeBytes) * 100).toFixed(1) : "0.0";

        const result = [
            `🖼️ Image Processing 🖼️`,
            `⏫ Level   : ${autoLevel === 0 ? "N/A (Resize Only)" : `${autoLevel} (Q≈${quality})`}`,
            `🔄 Resize  : ${resizeWidth ? `${resizeWidth}px width` : "N/A"}`,
            `🪛 Format  : ${format} → ${outFormat}`,
            `---------`,
            `⬅ Before  : ${formatBytes(beforeBytes)}`,
            `➡ After   : ${formatBytes(afterBytes)}`,
            `💾 Saved   : ${formatBytes(saved)} (${ratio}%)`,
            `---------`,
            `✔️ Proses berhasil.`
        ].join("\n");

        await conn.sendMessage(
            m.chat,
            {
                document: output,
                mimetype: outMime(outFormat, hasAlpha),
                fileName: `processed_${m.id || Date.now()}.${outFormat}`,
                caption: result
            },
            { quoted: fkontak }
        );
    } catch (e) {
        console.error(e);
        await conn.sendMessage(m.chat, { text: `*ERROR:*\n\n${e.message || e}` }, { quoted: fkontak });
    } finally {
        await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    }
};

handler.help = ["compress [level 0-5] [width_px]"];
handler.tags = ["tools"];
handler.command = /^(compress|kompres|resize)$/i; 

export default handler;

function outMime(fmt, hasAlpha) {
    if (fmt === "jpeg") return "image/jpeg";
    if (fmt === "webp") return "image/webp";
    if (fmt === "png") return "image/png";
    return hasAlpha ? "image/png" : "image/jpeg";
}

function formatBytes(b) {
    if (!b && b !== 0) return "-";
    const u = ["B", "KB", "MB", "GB"];
    let i = 0;
    let n = b;
    while (n >= 1024 && i < u.length - 1) {
        n /= 1024;
        i++;
    }
    return `${n.toFixed(n >= 100 ? 0 : n >= 10 ? 1 : 2)} ${u[i]}`;
}