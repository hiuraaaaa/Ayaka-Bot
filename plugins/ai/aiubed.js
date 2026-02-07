import axios from "axios";

let conversations = {}; // Penyimpanan percakapan pengguna
const timeout = 60000; // 1 menit

const handler = async (m, { conn, usedPrefix, command, text, quoted }) => {
    if (!text && !quoted) {
        throw `📌 Apa yang ingin kamu tanyakan?\n\nContoh: ${usedPrefix + command} Halo bot`;
    }

    try {
        console.log(`[DEBUG] Memproses permintaan:`, text);
        await conn.sendMessage(m.chat, { react: { text: "💬", key: m.key } });

        let d = new Date();
        let locale = 'id';
        let jam = d.toLocaleTimeString("en-US", { timeZone: "Asia/Jakarta" });
        let hari = d.toLocaleDateString(locale, { weekday: 'long' });
        let tgl = d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });

        let logic = `Kamu adalah furina. Kamu pemalu, manja, mudah marah, tapi peka. Kamu dibuat oleh Rijalganzz Owner. Gunakan kata khas *sensei* untuk panggilan orang. Gunakan emoji dalam setiap jawaban agar terasa lebih ekspresif. Gunakan format tanggal ${tgl}, jam ${jam}, hari ${hari}`;

        let userId = m.sender;

        // **🗨️ Menjaga kelangsungan percakapan**
        if (quoted && quoted.sender === conn.user.jid && quoted.text?.includes("[AI-FURINA]")) {
            console.log(`[DEBUG] Melanjutkan percakapan AI`);
            conversations[userId] = `${conversations[userId] || ""}\nUser: ${text}`;
        } else {
            console.log(`[DEBUG] Memulai percakapan baru`);
            conversations[userId] = `User: ${text}`;
        }

        let response = await chatWithAI(conversations[userId], logic);
        if (!response) {
            console.log(`[ERROR] Respons dari AI kosong!`);
            await m.reply("❌ Maaf, terjadi kesalahan dalam memproses jawaban.");
            return;
        }

        conversations[userId] += `\nBot: ${response}`;

        // Mengirim pesan hanya berupa teks tanpa thumbnail atau judul besar
        await conn.sendMessage(m.chat, {
            text: `[AI-FURNA] ${response}`
        }, { quoted: m });

        console.log(`[DEBUG] Bot berhasil merespons`);
        await conn.sendMessage(m.chat, { react: { text: "🔥", key: m.key } });

    } catch (e) {
        console.error(`[ERROR] Terjadi kesalahan:`, e);
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    }
};

// **💬 Fungsi untuk percakapan AI**
const chatWithAI = async (text, logic) => {
    try {
        let response = await axios.post("https://chateverywhere.app/api/chat/", {
            "model": {
                "id": "gpt-4",
                "name": "GPT-4",
                "maxLength": 32000,
                "tokenLimit": 8000,
                "completionTokenLimit": 5000,
                "deploymentName": "gpt-4"
            },
            "messages": [
                {
                    "pluginId": null,
                    "content": text,
                    "role": "user"
                }
            ],
            "prompt": logic,
            "temperature": 0.5
        }, {
            headers: {
                "Accept": "/*/",
                "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, seperti Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
            }
        });

        console.log(`[DEBUG] Respons OpenAI diterima`);
        return response.data;
    } catch (error) {
        console.error(`[ERROR] Gagal mendapatkan respons dari AI:`, error);
        return null;
    }
};

// **📌 Informasi perintah**
handler.help = ["ai <teks>", "aiubed"];
handler.tags = ["ai"];
handler.command = /^(aifurina|ai-furina|ai)$/i;

export default handler;