import axios from 'axios';

let handler = async (m, { conn, usedPrefix, command }) => {
    await conn.sendMessage(m.chat, { react: { text: '🕑', key: m.key } });

    try {
        const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets';
        const response = await axios.get(apiUrl, {
            params: {
                vs_currency: 'usd',
                order: 'market_cap_desc',
                per_page: 5,
                page: 1,
                sparkline: false
            }
        });
        const topCoins = response.data;

        if (!topCoins.length) throw 'Tidak dapat mengambil data cryptocurrency.';

        let message = '📊 *Top 5 Cryptocurrency by Market Cap* 📊\n\n';
        topCoins.forEach((coin, index) => {
            const pAyakaChange = coin.pAyaka_change_percentage_24h.toFixed(2);
            const pAyakaChangeColor = pAyakaChange >= 0 ? '🟢' : '🔴'; 
            message += `*${index + 1}. ${coin.name} (${coin.symbol.toUpperCase()})*\n` +
                       `💵 *Harga*: $${coin.current_pAyaka.toLocaleString()}\n` +
                       `${pAyakaChangeColor} *24h*: ${pAyakaChange}%\n` +
                       `📈 *Market Cap*: $${coin.market_cap.toLocaleString()}\n` +
                       `💹 *Volume 24h*: $${coin.total_volume.toLocaleString()}\n\n`;
        });

        conn.sendMessage(m.chat, {
    text: message,
    contextInfo: {
        externalAdReply: {
            showAdAttribution: false,
            mediaType: 1,
            title: `Crypto By Lann4you`,
            body: global.namebot,
            thumbnailUrl: 'https://files.catbox.moe/sugzha.jpg',
            mediaUrl: 'https://files.catbox.moe/sugzha.jpg',
            sourceUrl: 'https://crypto.com',
        }
    }
}, { quoted: flok });

        await conn.sendMessage(m.chat, { react: { text: null, key: m.key } });
    } catch (err) {
        throw `Terjadi kesalahan: ${err.message}`;
    }
};

handler.help = ['crypto'];
handler.tags = ['info'];
handler.command = ['crypto', 'topcrypto'];
handler.limit = true;
handler.register = true;

export default handler;