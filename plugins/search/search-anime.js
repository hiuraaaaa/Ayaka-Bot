import fetch from 'node-fetch';

const handler = async (m, { conn, text }) => {
  if (!text) throw '*Masukan judul anime yang ingin kamu cari!*';

  conn.reply(m.chat, 'Sedang mencari ANIME... Silahkan tunggu', m);

  const res = await fetch(`https://api.jikan.moe/v4/anime?q=${text}`);
  if (!res.ok) throw 'Anime tidak ditemukan!';

  const json = await res.json();
  const anime = json.data[0];

  const {
    episodes,
    url,
    type,
    score,
    rating,
    scored_by,
    popularity,
    rank,
    season,
    year,
    members,
    background,
    status,
    duration,
    synopsis,
    favorites,
    trailer,
    titles,
    producers,
    studios,
    genres,
    images
  } = anime;

  const producerList = producers.map(p => `${p.name} (${p.url})`).join('\n');
  const studioList = studios.map(s => `${s.name} (${s.url})`).join('\n');
  const genreList = genres.map(g => g.name).join('\n');
  const titleList = titles.map(t => `${t.title} [${t.type}]`).join('\n');
  const trailerUrl = trailer?.url || '-';

  const animeInfo = `
📺 Title: ${titleList}
📺 Trailer: ${trailerUrl}
🎬 Episodes: ${episodes}
✉️ Tipe: ${type}
👺 Genre: ${genreList}
🗂 Status: ${status}
⌛ Durasi: ${duration}
🌟 Favorite: ${favorites}
🧮 Score: ${score}
😍 Rating: ${rating}
😎 Scored by: ${scored_by}
💥 Popularitas: ${popularity}
⭐ Rank: ${rank}
✨ Season: ${season}
🏁 Tahun: ${year}
🤗 Produser: ${producerList}
🤠 Studio: ${studioList}
👥 Members: ${members}
⛓️ URL: ${url}
📝 Background: ${background || '-'}
💬 Sinopsis: ${synopsis}
`.trim();

  conn.sendFile(m.chat, images.jpg.image_url, 'anime.jpg', `*ANIME INFO*\n\n${animeInfo}`, m);
};

handler.help = ['animeinfo <anime>'];
handler.tags = ['anime'];
handler.command = /^(animeinfo|anime|infoanime|nimeinfo|nime)$/i;

export default handler;