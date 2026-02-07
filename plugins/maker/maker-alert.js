import axios from "axios";

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `📌 *Gunakan format:*\n${usedPrefix}${command} <teks>\n\n📌 *Contoh:*\n${usedPrefix}${command} Beforelife`;

    let query = encodeURIComponent(text.trim());
    let apiUrl = `https://beforelife.me/api/maker/alert?query=${query}&apikey=ubed2407`;

    // Mengirim reaksi emoji saat mulai proses
    await conn.sendMessage(m.chat, { react: { text: "🍊", key: m.key } });

    try {
        // Mengambil data dari API
        let response = await axios({ url: apiUrl, method: "GET", responseType: "arraybuffer" });

        // Mengirim gambar yang diterima dari API
        await conn.sendMessage(m.chat, {
            image: response.data,
            caption: `✅ *Alert berhasil dibuat!*\n📌 *Teks:* ${text.trim()}`,
        }, { quoted: m });

        // Mengirim reaksi emoji selesai
        await conn.sendMessage(m.chat, { react: { text: "🍏", key: m.key } });

    } catch (e) {
        console.error("[ERROR]", e);
        // Mengirim reaksi error jika ada masalah
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
        throw `❌ Terjadi kesalahan saat membuat alert.\n\n🔍 *Error:* ${e.message || e}`;
    }
};

handler.help = ["alert"];
handler.tags = ["fun"];
handler.command = /^(alert)$/i;

export default handler;