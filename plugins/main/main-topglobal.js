const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": "0@s.whatsapp.net",
        "fromMe": false,
        "id": "Halo",
    },
    "message": {
        "conversation": `topglobal ${global.namebot || 'Bot'} ✨`,
    }
};

function formatMoney(money) { // PERUBAHAN: formateris diubah menjadi formatMoney
  const suffixes = ['', 'k', 'm', 'b', 't', 'q', 'Q', 's', 'S', 'o', 'n', 'd', 'U', 'D', 'Td', 'qd', 'Qd', 'sd', 'Sd', 'od', 'nd', 'V', 'Uv', 'Dv', 'Tv', 'qv', 'Qv', 'sv', 'Sv', 'ov', 'nv', 'T', 'UT', 'DT', 'TT', 'qt', 'QT', 'st', 'ST', 'ot', 'nt'];
  if (typeof money !== 'number' || isNaN(money)) return '0';
  if (money === 0) return '0';
  const suffixIndex = Math.floor(Math.log10(money) / 3);
  const suffix = suffixes[suffixIndex] || '';
  const scaled = money / Math.pow(10, suffixIndex * 3);
  return scaled.toFixed(2) + suffix;
}

let handler = async (m, { conn, participants }) => {
  conn.sendMessage(m.chat, {
    react: {
      text: '🕒',
      key: m.key,
    }
  });

  // Ambil dan sortir user berdasarkan money
  let allUsers = Object.entries(global.db.data.users || {});
  let moneyData = allUsers // PERUBAHAN: eris diubah menjadi moneyData
    .map(([id, data]) => ({
      id,
      money: data?.money || 0, // PERUBAHAN: eris diubah menjadi money
      level: data?.level || 0
    }))
    .sort((a, b) => b.money - a.money); // PERUBAHAN: eris diubah menjadi money

  let rankMoney = moneyData.map(u => u.id); // PERUBAHAN: rankeris diubah menjadi rankMoney
  let show = Math.min(10, moneyData.length);

  let teks = `[ 🌐 ] *T O P - G L O B A L*\n`;
  teks += `[ 🏆 ] *Kamu:* *${rankMoney.indexOf(m.sender) + 1}* dari *${rankMoney.length}*\n\n`; // PERUBAHAN: rankeris diubah menjadi rankMoney

  teks += moneyData // PERUBAHAN: eris diubah menjadi moneyData
    .slice(0, show)
    .map((user, i) =>
      `${i + 1}. @${user.id.split`@`[0]}\n` +
      `   ◦ *Money* : *${formatMoney(user.money)}*\n` + // PERUBAHAN: formateris dan user.eris diubah
      `   ◦ *Level* : *${user.level}*`
    )
    .join('\n');

  teks += `\n\n> © ${global.namebot}`;

  conn.reply(m.chat, teks, fkontak); // Menggunakan fkontak
};

handler.command = ["topglobal"];
handler.tags = ["main"];
handler.help = ["topglobal"];
handler.register = true;

export default handler;