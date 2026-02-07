import axios from 'axios';

const headers = {
  "Content-Type": "application/json; charset=UTF-8",
  "Origin": "https://enka.network",
  "Referer": "https://enka.network/",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.5993.89 Safari/537.36",
};

const handler = async (m, { conn, args }) => {
  if (!args[0]) {
    return m.reply('Mana UID Genshin Nya?\n\n*Example :* 741910533');
  }

  const text = args[0];

  try {
    m.reply(wait);
    
    let res = await axios.get(`https://enka.network/api/uid/${text.trim()}`, { headers });
    const player = res.data.playerInfo;
    const screenshot = `https://mini.s-shot.ru/990x810/PNG/975/Z100/?https://enka.network/u/${res.data.uid}/`;

    const caption = `
*====== \`[Genshin Profile Info]\` ======*
- Nickname : ${player.nickname}
- Level : ${player.level}
- World Level : ${player.worldLevel}
- Achievement : ${player.finishAchievementNum}
- Card ID : ${player.nameCardId}
- Spiral Abyss : ${player.towerFloorIndex} - ${player.towerLevelIndex}

- Detai l: https://enka.network/u/${res.data.uid}
- UID : ${res.data.uid}
    `.trim();
    
    await conn.sendMessage(
      m.chat,
      { image: { url: screenshot }, caption },
      { quoted: m }
    );
  } catch (error) {
    console.error(`${error.message}`);
    m.reply(`${error.message}`);
  }
};

handler.help = ['cekgenshin'].map((v) => v + ' <uid>');
handler.command = /^(cekgenshin)$/i;
handler.tags = ["internet"]

export default handler;