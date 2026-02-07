let handler = async (m, { conn, command, args }) => {
  let user = global.db.data.users[m.sender];
  const tag = '@' + m.sender.split`@`[0];

  try {
    if (command === 'tweet') {
      if (!user.twitter_account) {
        return conn.sendMessage(m.chat, {
          text: `📢 Hey Kamu, ${tag}!\nBuat akun Twitter dulu.\nKetik: .createtw [Nama]`,
          mentions: [m.sender]
        }, { quoted: flok });
      }

      const content = (args?.length > 0) ? args.join(' ') : '';

      if (!content || content.trim().length === 0) {
        return conn.sendMessage(m.chat, {
          text: `${tag} Tulis isi tweetmu. ✍️`,
          mentions: [m.sender]
        }, { quoted: flok });
      }

      const cooldownTime = 900000;
      const lastTweetTime = user.lastTweetTime || 0;
      const timeSinceLastTweet = new Date() - lastTweetTime;

      if (timeSinceLastTweet < cooldownTime) {
        const remainingCooldown = cooldownTime - timeSinceLastTweet;
        const formattedCooldown = msToTime(remainingCooldown);
        throw `⏳ Kamu baru saja tweet. Coba lagi dalam\n${formattedCooldown}`;
      }

      setTimeout(() => {
        conn.sendMessage(m.chat, {
          text: `👋 Hai Kak ${tag}, followers-mu ingin lihat tweet baru!`,
          mentions: [m.sender]
        }, { quoted: flok });
      }, cooldownTime);

      const gainFollowers = Math.floor(Math.random() * (1000 - 50 + 1)) + 50;
      const gainLikes = Math.floor(Math.random() * (500 - 20 + 1)) + 20;
      const gainViews = Math.floor(Math.random() * (10000 - 500 + 1)) + 500;
      const gainMoney = Math.floor(Math.random() * (100000 - 10000 + 1)) + 10000;

      user.folltwit = (user.folltwit || 0) + gainFollowers;
      user.twlikes = (user.twlikes || 0) + gainLikes;
      user.twviews = (user.twviews || 0) + gainViews;
      user.money = (user.money || 0) + gainMoney;
      user.lastTweetTime = new Date();

      const tweetHistory = user.tweetHistory || [];
      tweetHistory.push({ content, time: new Date() });
      if (tweetHistory.length > 5) tweetHistory.shift();
      user.tweetHistory = tweetHistory;

      checkAchievements(user, conn, m);

      conn.sendMessage(m.chat, {
        text: `📢 \`Tweet Berhasil Diposting!\`\n\n👤 *User:* ${tag}\n✍️ *Isi Tweet:* ${content}\n🔥 *Follower Baru:* +${formatNumber(gainFollowers)}\n👍 *Likes Baru:* +${formatNumber(gainLikes)}\n👁️‍🗨️ *Viewers Baru:* +${formatNumber(gainViews)}\n💰 *Uang:* Rp.${formatNumber(gainMoney)}\n\n> Cek Akunmu: .akuntw`,
        mentions: [m.sender]
      }, { quoted: flok });

    } else if (command === 'createtw') {
      if (user.twitter_account) {
        return conn.sendMessage(m.chat, { text: '🚫 Kamu sudah punya akun Twitter.' }, { quoted: flok });
      }

      if (!args.length) {
        return conn.sendMessage(m.chat, { text: '🚨 Masukkan nama untuk akun Twitter. Contoh: `.createtw SaaCantik`' }, { quoted: flok });
      }

      const twitterName = args.join(' ');
      user.twitter_account = true;
      user.twitter_name = twitterName;
      user.folltwit = 0;
      user.twlikes = 0;
      user.twviews = 0;
      user.money = 0;
      user.lastTweetTime = 0;
      user.tweetHistory = [];
      user.achievements = [];

      conn.sendMessage(m.chat, {
        text: `✅ Akun Twitter berhasil dibuat dengan nama: *${twitterName}*!\nSekarang kamu bisa tweet dengan perintah: .tweet [Isi Tweet]`
      }, { quoted: flok });

    } else if (command === 'changetwname') {
      if (!user.twitter_account) {
        return conn.sendMessage(m.chat, { text: '🚫 Kamu belum membuat akun Twitter. Ketik: .createtw' }, { quoted: flok });
      }

      if (!args.length) {
        return conn.sendMessage(m.chat, { text: '🚨 Masukkan nama baru untuk akun Twitter. Contoh: `.changetwname @NewName`' }, { quoted: flok });
      }

      const newTwitterName = args.join(' ');
      user.twitter_name = newTwitterName;

      conn.sendMessage(m.chat, {
        text: `✅ Nama Twitter berhasil diganti menjadi: *${newTwitterName}*`
      }, { quoted: flok });

    } else if (command === 'akuntw') {
      if (!user.twitter_account) {
        return conn.sendMessage(m.chat, { text: '🚫 Kamu belum membuat akun Twitter. Ketik: .createtw' }, { quoted: flok });
      }

      const tweetHistory = (user.tweetHistory || []).length > 0
        ? user.tweetHistory.map((tweet, i) =>
            `${i + 1}. ${tweet.content} (${new Date(tweet.time).toLocaleString()})`
          ).join('\n')
        : 'Belum ada tweet.';

      const achievements = user.achievements || [];
      const achievementText = achievements.length
        ? achievements.map(a => `🏆 ${a}`).join('\n')
        : 'Belum ada pencapaian.';

      conn.sendMessage(m.chat, {
        text: `🛜 \`Info Akun Twitter-mu:\`\n\n👤 *Nama:* ${user.twitter_name}\n👥 *Followers:* ${formatNumber(user.folltwit)}\n👍 *Total Likes:* ${formatNumber(user.twlikes)}\n👁️‍🗨️ *Total Viewers:* ${formatNumber(user.twviews)}\n💰 *Money:* Rp.${formatNumber(user.money)}\n\n📚 *Riwayat Tweet:* \n${tweetHistory}\n\n🎯 *Pencapaian:* \n${achievementText}`
      }, { quoted: flok });

    } else if (command === 'lbtw') {
      let users = Object.entries(global.db.data.users)
        .filter(([_, u]) => u.twitter_account)
        .sort((a, b) => (b[1].folltwit || 0) - (a[1].folltwit || 0))
        .slice(0, 10);

      let leaderboard = users.map(([jid, u], i) => `${i + 1}. @${jid.split('@')[0]} 👥 ${formatNumber(u.folltwit)} followers`).join('\n');

      conn.sendMessage(m.chat, {
        text: `📊 \`Top 10 Twitterers:\`\n\n${leaderboard}\n\nGunakan .tweet untuk naik peringkat!`,
        mentions: users.map(([jid]) => jid)
      }, { quoted: flok });
    }

  } catch (err) {
    conn.sendMessage(m.chat, {
      text: 'Heyy! ' + err
    }, { quoted: flok });
  }
};

handler.help = ['tweet','createtw','changetwname','akuntw','lbtw'];
handler.tags = ['rpg'];
handler.command = /^(tweet|createtw|changetwname|akuntw|lbtw)$/i;

export default handler;;

function checkAchievements(user, conn, m) {
  
  user.achievements = user.achievements || [];

  if (user.folltwit >= 50000 && !user.achievements.includes('50K Followers')) {
    user.achievements.push('50K Followers');
    conn.sendMessage(m.chat, {
      text: `🎉 Kamu mendapatkan pencapaian baru!🏆\n*50K Followers*`
    }, { quoted: flok });
  }

  if (user.folltwit >= 30000 && !user.achievements.includes('30K Followers')) {
    user.achievements.push('30K Followers');
    conn.sendMessage(m.chat, {
      text: `🎉 Kamu mendapatkan pencapaian baru!🏆\n*30K Followers*`
    }, { quoted: flok });
  }

  if (user.folltwit >= 10000 && !user.achievements.includes('10K Followers')) {
    user.achievements.push('10K Followers');
    conn.sendMessage(m.chat, {
      text: `🎉 Kamu mendapatkan pencapaian baru!🏆\n*10K Followers*`
    }, { quoted: flok });
  }

  if (user.tweetHistory.length >= 10 && !user.achievements.includes('10 Tweets')) {
    user.achievements.push('10 Tweets');
    conn.sendMessage(m.chat, {
      text: `🎉 Kamu mendapatkan pencapaian baru!🏆\n*10 Tweets*`
    }, { quoted: flok });
  }

  if (user.money >= 1000000000 && !user.achievements.includes('1M Money')) {
    user.achievements.push('1M Money');
    conn.sendMessage(m.chat, {
      text: `🎉 Kamu mendapatkan pencapaian baru!🏆\n*1M Money*`
    }, { quoted: flok });
  }
}

function formatNumber(num) {
  if (num >= 100000000) return (num / 100000000).toFixed(1).replace(/\.0$/, '') + 'T';
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return num.toString();
}

function msToTime(ms) {
  let seconds = Math.floor((ms / 1000) % 60);
  let minutes = Math.floor((ms / (1000 * 60)) % 60);
  let hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  return `${hours}h ${minutes}m ${seconds}s`;
}