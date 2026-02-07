import axios from 'axios';

const handler = async (m, { conn }) => {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;

  try {
    const query = `
      query {
        Page(page: 1, perPage: 100) {
          characters(sort: FAVOURITES_DESC) {
            name { full }
            media { nodes { title { romaji } } }
            dateOfBirth { day month }
            image { large }
          }
        }
      }
    `;

    const response = await axios({
      url: 'https://graphql.anilist.co',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0',
      },
      data: { query },
      timeout: 10000,
    });

    const { data } = response.data;
    const characters = data?.Page?.characters || [];

    const birthdayChars = characters
      .filter(char => char.dateOfBirth?.day === day && char.dateOfBirth?.month === month)
      .map(char => ({
        name: char.name.full,
        anime: char.media.nodes[0]?.title.romaji || 'Unknown',
        birthday: `${char.dateOfBirth.day}/${char.dateOfBirth.month}`,
        imageUrl: char.image?.large || 'https://via.placeholder.com/150?text=No+Image',
      }));

    if (birthdayChars.length === 0) {
      return conn.reply(m.chat, `😢 Tidak ada karakter anime yang ulang tahun hari ini (${day}/${month}), Sensei!`, m);
    }

    for (const char of birthdayChars) {
      await conn.sendMessage(m.chat, {
        image: { url: char.imageUrl },
        caption:
          `🎉 *Karakter Ulang Tahun Hari Ini!*\n\n` +
          `🧑‍🦰 *Nama:* ${char.name}\n` +
          `🎬 *Anime:* ${char.anime}\n` +
          `📅 *Tanggal Lahir:* ${char.birthday}\n` +
          `🖼️ *Gambar:* ${char.imageUrl}`,
      }, { quoted: m });
    }

  } catch (error) {
    console.error(error);
    conn.reply(m.chat, `⚠️ Gagal mengambil data dari AniList.\n\n📝 Error: ${error.message}`, m);
  }
};

handler.help = ['birthdayanime'];
handler.tags = ['anime'];
handler.command = /^(ultahanime|birthdayanime)$/i;
handler.limit = true;
handler.register = true;

export default handler;