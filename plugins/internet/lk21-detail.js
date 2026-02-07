import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
    if (!text) return conn.reply(m.chat, 'Silakan masukkan link film.\nContoh: .lk21detail https://lk21.film/avengers-endgame-2019', m);

    try {
        const apiUrl = `https://fastrestapis.fasturl.cloud/search/lk21?action=detail&query=${encodeURIComponent(text)}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.status !== 200 || !data.result) {
            return conn.reply(m.chat, 'Detail film tidak ditemukan.', m);
        }

        const result = data.result;
        const detailText = `
*🎬 Judul:* ${result.title}
*📅 Tahun:* ${result.year}
*🌍 Negara:* ${result.country.join(', ')}
*🎭 Genre:* ${result.genres.join(', ')}
*⭐ Bintang:* ${result.stars.join(', ')}
*🎬 Sutradara:* ${result.directors.join(', ')}
*⏱️ Durasi:* ${result.duration}
*📅 Rilis:* ${result.releaseDate}
*📅 Upload:* ${result.uploadDate}
*📽️ Kualitas:* ${result.quality.join(', ')}
*🌐 IMDB:* ${result.imdbRating}
*💬 Translator:* ${result.translator.join(', ')}
*🧑‍💻 Diunggah oleh:* ${result.uploadedBy}
*🏆 Penghargaan:* ${result.awards}
*💰 Budget:* ${result.budget}
*🌍 Pendapatan:* ${result.worldwideGross}
*🎵 Soundtrack:* ${result.soundtrack}
*🔗 IMDB:* https://www.imdb.com/title/${result.imdbId}
*📝 Sinopsis:*\n${result.synopsis}
        `.trim();

        await conn.sendMessage(m.chat, {
            image: { url: result.poster },
            caption: detailText
        }, { quoted: m });

    } catch (e) {
        console.error(e);
        conn.reply(m.chat, 'Gagal mengambil detail film.', m);
    }
};

handler.help = ['lk21detail <link_film>'];
handler.tags = ['internet'];
handler.command = /^lk21detail$/i;
handler.limit = true;

export default handler;;