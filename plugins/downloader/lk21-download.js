import fetch from 'node-fetch';

let handler = async (m, { conn, args }) => {
    const url = args[0];
    if (!url) return conn.reply(m.chat, 'Masukkan URL film dari LK21\nContoh: .lk21download https://lk21.film/avengers-endgame-2019', m);

    try {
        const apiUrl = `https://fastrestapis.fasturl.cloud/search/lk21?action=download&query=${encodeURIComponent(url)}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.status !== 200 || !data.result || !data.result.streaming) {
            return conn.reply(m.chat, 'Gagal mendapatkan link streaming.', m);
        }

        let teks = `🎬 *Link Streaming untuk Film:*\n${data.result.videoLink}\n\n`;
        for (const provider of data.result.streaming) {
            teks += `*${provider.provider}* (${provider.qualities.join(', ')}p):\n${provider.url}\n\n`;
        }

        return conn.reply(m.chat, teks.trim(), m);
    } catch (e) {
        console.error(e);
        return conn.reply(m.chat, 'Terjadi kesalahan saat mengambil data streaming.', m);
    }
};

handler.help = ["lk21download <url film>"];
handler.tags = ["downloader"];
handler.command = /^lk21download$/i;
handler.limit = true;

export default handler;;