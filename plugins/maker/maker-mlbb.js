import fetch from 'node-fetch';

const handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) throw `Contoh:\n${usedPrefix + command} Eudora`;

  // Kirim reaksi ⏳
  await conn.sendMessage(m.chat, {
    react: {
      text: '⏳',
      key: m.key
    }
  });

  try {
    const name = args.join(' ');
    const res = await fetch(`https://fastrestapis.fasturl.cloud/character/mlbb?name=${encodeURIComponent(name)}`);
    const json = await res.json();

    if (!json || json.status !== 200 || !json.result?.name) throw 'Hero tidak ditemukan.';

    const hero = json.result;
    const caption = `*${hero.name}*\n\n` +
      `*ID:* ${hero.id}\n` +
      `*Story:* ${hero.story}\n` +
      `*Role:* ${hero.role.map(r => r.name).filter(n => n !== 'No role').join(', ') || '-'}\n` +
      `*Lane:* ${hero.lane.map(l => l.name).filter(n => n !== 'No lane').join(', ') || '-'}\n` +
      `*Specialty:* ${hero.speciality.join(', ') || '-'}\n\n` +
      `*Ability*\n` +
      `- Durability: ${hero.ability.durability}\n` +
      `- Offense: ${hero.ability.offense}\n` +
      `- Ability Effects: ${hero.ability.ability_effects}\n` +
      `- Difficulty: ${hero.ability.difficulty}\n\n` +
      `*Skill: ${hero.skills[0].name}*\n${hero.skills[0].desc}`;

    await conn.sendFile(m.chat, hero.media.potrait, 'hero.jpg', caption, m);

    // Reaksi sukses
    await conn.sendMessage(m.chat, {
      react: {
        text: '✅',
        key: m.key
      }
    });
  } catch (e) {
    console.error(e);
    await conn.sendMessage(m.chat, {
      react: {
        text: '❌',
        key: m.key
      }
    });
    throw 'Terjadi kesalahan saat mencari data hero MLBB.';
  }
};

handler.help = ['mlbb <nama>'];
handler.tags = ['tools'];
handler.command = /^mlbb$/i;

export default handler;