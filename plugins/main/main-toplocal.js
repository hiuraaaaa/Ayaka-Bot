const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": "0@s.whatsapp.net",
        "fromMe": false,
        "id": "Halo",
    },
    "message": {
        "conversation": `toplokal ${global.namebot || 'Bot'} ✨`,
    }
};

let handler = async (m, { conn, participants }) => {
  // Kirim reaksi loading
  conn.sendMessage(m.chat, {
    react: {
      text: '🕒',
      key: m.key,
    }
  });

  // Ambil ID semua member grup
  let member = participants.map(u => u.id);
  let kontol = {}; // Ini bisa diganti nama menjadi lebih umum, misal 'userDataMap'

  for (let i = 0; i < member.length; i++) {
    let user = global.db.data.users[member[i]];
    // Pastikan user ada dan bukan bot itu sendiri
    if (typeof user !== 'undefined' && member[i] !== conn.user.jid && member[i] !== conn.user.jid.split('@')[0] + '@s.whatsapp.net') {
      kontol[member[i]] = {
        money: user.money || 0, // PERUBAHAN: eris diubah menjadi money
        level: user.level || 0,
        limit: user.limit || 0
      };
    }
  }

  // Urutkan berdasarkan money dan limit
  let moneyData = Object.entries(kontol).sort((a, b) => b[1].money - a[1].money); // PERUBAHAN: eris diubah menjadi moneyData
  let limitData = Object.entries(kontol).sort((a, b) => b[1].limit - a[1].limit); // PERUBAHAN: limit diubah menjadi limitData

  // Ambil ranking
  let rankMoney = moneyData.map(v => v[0]); // PERUBAHAN: rankeris diubah menjadi rankMoney
  let rankLimit = limitData.map(v => v[0]);

  // Jumlah yang akan ditampilkan
  let showCount = Math.min(10, moneyData.length); // PERUBAHAN: iseris diubah menjadi showCount

  let teks = `*[ 🚩 ] T O P - L O K A L*\n`;
  teks += `*[ 🏆 ] Kamu : ${rankMoney.indexOf(m.sender) + 1}* dari *${rankMoney.length}*\n`; // PERUBAHAN: rankeris diubah menjadi rankMoney
  teks += `*[ 🔥 ] Grup :* ${await conn.getName(m.chat)}\n\n`;

  // Tambahkan daftar top money
  teks += moneyData.slice(0, showCount).map(([user, data], i) => // PERUBAHAN: eris diubah menjadi moneyData, iseris diubah menjadi showCount
    `${i + 1}. @${user.split`@`[0]}\n   ◦  *Money:* ${formatNumber(data.money)}\n   ◦  *Level:* ${data.level}` // PERUBAHAN: data.eris diubah menjadi data.money
  ).join('\n');

  teks += `\n\n> © ${global.namebot}`;

  conn.reply(m.chat, teks, fkontak); // Menggunakan fkontak
};

handler.command = /^toplokal|toplocal$/i;
handler.tags = ["main"];
handler.help = ["toplocal"];
handler.register = true;
handler.group = true;
handler.admin = true

export default handler;

// Fungsi format angka biar ada titik ribuan
function formatNumber(num) {
  if (typeof num !== 'number') return '0';
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}