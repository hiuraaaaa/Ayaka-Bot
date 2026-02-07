import axios from "axios";

let handler = async (m, { conn, usedPrefix, command }) => {
    let apiUrl = "https://beforelife.me/api/info/trend/youtube?country=indonesia&apikey=ubed2407";

    try {
        let response = await axios.get(apiUrl);
        let result = response.data.result;

        if (!result || result.length === 0) {
            throw "❌ Tidak ada video trending yang ditemukan!";
        }

        let message = `📺 *Trending YouTube di Indonesia*\n\n`;
        result.forEach((item, index) => {
            message += `*${index + 1}.* ${item.title}\n`;
            message += `   👤 *Channel:* ${item.channel}\n`;
            message += `   👀 *Views:* ${item.views}\n`;
            message += `   🔗 [Tonton di YouTube](${item.url})\n\n`;
        });

        await conn.sendMessage(m.chat, { text: message }, { quoted: m });
    } catch (e) {
        console.error("[ERROR]", e);
        await conn.sendMessage(m.chat, { text: "❌ Terjadi kesalahan saat mengambil data trending YouTube!" }, { quoted: m });
    }
};

handler.help = ["trendyoutube"];
handler.tags = ["info"];
handler.command = /^(trendyoutube)$/i;

export default handler;