import axios from "axios";

async function generateImage(prompt, count = 1) {
    try {
        const url = `https://1yjs1yldj7.execute-api.us-east-1.amazonaws.com/default/ai_image?prompt=${encodeURIComponent(prompt)}&aspect_ratio=1:1&link=writecream.com`;

        const headers = {
            "User-Agent":
                "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36",
            "Referer": "https://www.writecream.com/ai-image-generator-free-no-sign-up/",
        };

        const images = [];
        for (let i = 0; i < count; i++) {
            const response = await axios.get(url, { headers });
            if (response.data && response.data.image_link) {
                images.push(response.data.image_link);
            }
        }

        return { success: true, imageUrls: images };
    } catch (error) {
        return {
            success: false,
            message: "Terjadi kesalahan",
            error: error.response ? error.response.data : error.message,
        };
    }
}

const handler = async (m, { conn, args }) => {
    if (!args.length) return m.reply(`Promptnya mana, Senpai?\nContoh: .aigen A chibi anime girl with long yellow hair`);

    m.reply("Sabar ya, Sensei, aku buatin gambarnya...");

    const prompt = args.join(" ");
    const result = await generateImage(prompt, 4);

    if (result.success) {
        const medias = result.imageUrls.map(url => ({
            image: { url }
        }));

        if (medias.length === 0) {
            return m.reply("Yah, gagal bikin gambarnya, Sensei...");
        }

        await conn.sendAlbumMessage(
            m.chat,
            medias,
            { caption: `🖼️ AI Image Generator\n\n🎨 Prompt: ${prompt}\nJadi ${medias.length} gambar nih, Sensei!` },
            { quoted: m }
        );
    } else {
        m.reply(`Gagal nih, Sensei: ${result.message}`);
    }
};

handler.help = ["aiimage"];
handler.tags = ["ai"];
handler.command = ["aiimage", "aigen"];
handler.limit = 5;
handler.register = true;

export default handler;