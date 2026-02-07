const handler = async (m, { conn, text, mime }) => {
    try {
        if (!m.isGroup) return m.reply("❌ Fitur ini hanya untuk grup!");
        if (!m.isAdmin) return m.reply("❌ Hanya admin yang dapat mengirim status grup!");

        const quoted = m.quoted ? m.quoted : m;
        const caption = text || quoted.text || "";
        let payload;

        // IMAGE
        if (/image/.test(mime)) {
            const buffer = await quoted.download();
            payload = {
                groupStatusMessage: {
                    image: buffer,
                    caption: caption
                }
            };
        }

        // VIDEO
        else if (/video/.test(mime)) {
            const buffer = await quoted.download();
            payload = {
                groupStatusMessage: {
                    video: buffer,
                    caption: caption
                }
            };
        }

        // AUDIO
        else if (/audio/.test(mime)) {
            const buffer = await quoted.download();
            payload = {
                groupStatusMessage: {
                    audio: buffer,
                    mimetype: "audio/mp4"
                }
            };
        }

        // ONLY TEXT
        else if (caption) {
            payload = {
                groupStatusMessage: {
                    text: caption
                }
            };
        }

        // NO MEDIA + NO TEXT
        else {
            return m.reply(
                `⚠️ Balas media atau isi teks.\nContoh:\n\n*upsw* (reply foto/video/audio) Halo!`
            );
        }

        // KIRIM STATUS
        await conn.sendMessage(m.chat, payload, { quoted: m });
        m.reply("✅ Status grup berhasil dikirim!");

    } catch (err) {
        console.error("ERROR:", err);
        m.reply("❌ Terjadi kesalahan saat mengirim status.");
    }
};

handler.help = ["upswgc"];
handler.tags = ["group"];
handler.command = ["upswgc"];
handler.admin = true;
handler.group = true;

export default handler;