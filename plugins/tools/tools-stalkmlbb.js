import fetch from "node-fetch";

let handler = async (m, { conn, text, usedPrefix, command }) => {
  let [userId, zoneId] = text.split("|").map(v => v.trim());

  if (!userId || !zoneId) {
    throw `📌 Contoh penggunaan:\n*${usedPrefix + command} 106101371|2540*`;
  }

  m.reply("🔍 Mencari data akun MLBB...");

  try {
    let res = await fetch(`https://fastrestapis.fasturl.cloud/stalk/mlbb?userId=${userId}&zoneId=${zoneId}`);
    let json = await res.json();

    if (json.status !== 200 || !json.result) {
      throw "❌ Akun tidak ditemukan atau server error!";
    }

    const { username, region } = json.result;

    let caption = `
╭─❍ *『 MLBB ACCOUNT INFO 』* ❍─╮
│
│  🧑‍💼 *Username:* ${username}
│  🌍 *Region:* ${region}
│  🆔 *User ID:* ${userId}
│  📍 *Zone ID:* ${zoneId}
│
╰───────────────✦
*Powered by ${global.namebot}*
`.trim();

    await conn.sendMessage(m.chat, {
      text: caption,
      contextInfo: {
        externalAdReply: {
          title: `MLBB Stalker by ${global.namebot}`,
          body: "Dapatkan info akun MLBB dengan ID & Zone",
          thumbnailUrl: `${global.thumb}`, // ganti kalau ada thumbnail khusus
          sourceUrl: `https://m.mobilelegends.com/en/career?role=mlbb`,
          mediaType: 1,
          renderLargerThumbnail: true,
          showAdAttribution: true
        }
      }
    }, { quoted: m });
  } catch (e) {
    console.error(e);
    m.reply("❌ Gagal mengambil data akun MLBB.");
  }
};

handler.help = ["mlbbstalk <userId>|<zoneId>"];
handler.tags = ["stalker"];
handler.command = ["mlbbstalk", "stalkml", "cekmlbb"];
handler.limit = true;

export default handler;