//Created by Lann4you

let handler = async (m, { conn, args }) => {
  if (args.length === 2 && args[0] === 'all') {
    let users = global.db.data.users;
    let pointsToAdd = parseInt(args[1]);
    if (isNaN(pointsToAdd)) {
      return conn.reply(m.chat, '📌 Jumlah level yang dimasukkan harus berupa angka. Contoh: .addlevel 100', m)
    }
    for (let user in users) {
      users[user].level += pointsToAdd;
    }
    conn.reply(m.chat, `✅ Berhasil menambahkan ${pointsToAdd} level untuk semua pengguna.`, m);
  } else if (args.length === 2) {
    let mentionedJid = m.mentionedJid[0];
    if (!mentionedJid) {
      return conn.reply(m.chat,  '📌 Tag pengguna yang ingin diberikan level. Contoh: .addlevel @user 100', m)
    }
      
	conn.sendMessage(m.chat, {
		react: {
			text: '🕒',
			key: m.key,
		}
	})

    let pointsToAdd = parseInt(args[1]);
    if (isNaN(pointsToAdd)) {
      return conn.reply(m.chat, '🚫 Jumlah level yang dimasukkan harus berupa angka. Contoh: .addlevel @user 100', m)
    }

    let users = global.db.data.users;
    if (!users[mentionedJid]) {
      users[mentionedJid] = {
        level: 0,
        exp: 0,
        lastclaim: 0,
      };
    }

    users[mentionedJid].level += pointsToAdd;

    conn.reply(m.chat, `✅ Berhasil menambahkan ${pointsToAdd} level untuk @${mentionedJid.split('@')[0]}.`, m, {
      mentions: [mentionedJid]
    });
  } else {
    return conn.reply(m.chat,  '• *Example :* .addlevel @user 100', m)
  }
};

handler.help = ['addlevel *@user* *<jumlah>*'];
handler.tags = ['owner'];
handler.command = /^addlevel$/i;
handler.mods = true;

export default handler;;