import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
    if (!text) return conn.reply(m.chat, 'Silahkan masukkan judul film yang ingin dicari\nContoh: .lk21 avengers', m);

    await conn.sendMessage(m.chat, { react: { text: "🔎", key: m.key } });

    try {
        const searchApiUrl = `https://fastrestapis.fasturl.cloud/search/lk21?action=search&query=${encodeURIComponent(text)}`;
        const response = await fetch(searchApiUrl);
        const data = await response.json();

        if (data.status !== 200 || !data.result || data.result.length === 0) {
            return conn.reply(m.chat, 'Maaf, film yang anda cari tidak ditemukan.', m);
        }

        const results = data.result.slice(0, 10); // maksimal 10

        const filmRows = results.map((film, i) => ({
            title: `${i + 1}. 🎬 ${film.title}`,
            description: `Lann4youOfc | 🎭 ${film.genres}`,
            id: `.lk21detail ${film.videoLink}`
        }));

        const streamRows = results.map((film, i) => ({
            title: `${i + 1}. ▶️ ${film.title}`,
            description: 'Klik untuk menonton langsung',
            id: `.lk21download ${film.videoLink}`
        }));

        const flowActions = [
            {
                buttonId: `.lk21`,
                buttonText: { displayText: '🎥 Pilih Film' },
                type: 4,
                nativeFlowInfo: {
                    name: 'single_select',
                    paramsJson: JSON.stringify({
                        title: `🎬 Hasil pencarian: ${text}`,
                        sections: [
                            { title: "📽️ Daftar Film", rows: filmRows },
                            { title: "▶️ Link Tonton Film", rows: streamRows }
                        ]
                    })
                }
            }
        ];

        const messageContent = {
            text: `🔍 *Hasil pencarian untuk*: _${text}_`,
            footer: "© Miyako - LK21 Movie Search",
            buttons: flowActions
        };

        return conn.sendMessage(m.chat, messageContent, { quoted: m });

    } catch (error) {
        console.error(error);
        return conn.reply(m.chat, 'Terjadi kesalahan saat mencari film. Coba lagi nanti.', m);
    }
};

handler.help = ["lk21 <judul film>"];
handler.tags = ["internet", "downloader"];
handler.command = /^(lk21|film|movie)$/i;
handler.limit = true;

export default handler;;