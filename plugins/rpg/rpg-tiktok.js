function msToTime(duration) {
    let seconds = Math.floor((duration / 1000) % 60);
    let minutes = Math.floor((duration / (1000 * 60)) % 60);
    let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    let h = hours > 0 ? `${hours} jam ` : '';
    let m = minutes > 0 ? `${minutes} menit ` : '';
    let s = seconds > 0 ? `${seconds} detik` : '';
    return (h + m + s).trim();
}

let handler = async (m, { conn, command, args }) => {
  let user = global.db.data.users[m.sender];
  let mentionedJid = [m.sender];

  if (command === 'creatett') {
    const username = args.join(' ');
    if (!username) return conn.reply(m.chat, 'Kirim nama akun TikTokmu!\nContoh: .creatett Lann4you!', flok);

    user.tiktok_account = username;
    user.tiktok_followers = 0;
    user.tiktok_likes = 0;
    user.tiktok_comments = 0;
    user.tiktok_shares = 0;
    user.tiktok_views = 0;
    user.tiktok_posts = [];

    return conn.reply(m.chat, `Akun TikTok *${username}* berhasil dibuat!`, flok, { mentions: [m.sender] });
  }

  if (command === 'postt') {
    if (!user.tiktok_account) return conn.reply(m.chat, 'Buat dulu akun TikTok kamu pakai:\n.creatett [nama akun]', flok);

    let caption = args.join(' ');
    if (!caption || caption.length < 5) return conn.reply(m.chat, 'Caption harus lebih dari 5 huruf.', flok);
    if (caption.length > 100) return conn.reply(m.chat, 'Caption maksimal 100 huruf.', flok);

    const cooldown = 900000;
    const last = user.lastTikTokPost || 0;
    const remaining = cooldown - (new Date() - last);
    if (remaining > 0) {
      let mins = Math.ceil(remaining / 60000);
      return conn.reply(m.chat, `Tunggu ${mins} menit sebelum posting lagi!`, flok);
    }

    const views = rand(5000, 100000);
    const likes = rand(300, 10000);
    const comments = rand(50, 500);
    const shares = rand(20, 300);
    const followers = rand(50, 500);
    const money = rand(100000, 5000000);
    const engagement = ((likes + comments + shares) / views * 100).toFixed(2);
    const trending = views > 50000 && engagement > 10;

    user.tiktok_views += views;
    user.tiktok_likes += likes;
    user.tiktok_comments += comments;
    user.tiktok_shares += shares;
    user.tiktok_followers += followers;
    user.money += money;
    user.lastTikTokPost = new Date();
    user.tiktok_posts.push({ caption, views, likes, comments, shares, followers, money, engagement, trending, time: new Date() });
    if (user.tiktok_posts.length > 5) user.tiktok_posts.shift();

    conn.reply(m.chat, `✨ \`POSTING TIKTOK\`

👤 Nama Akun: ${user.tiktok_account}
📝 Caption: ${caption}
👁️ Views: ${formatNumber(views)}
❤️ Likes: ${formatNumber(likes)}
💬 Komentar: ${formatNumber(comments)}
🔁 Shares: ${formatNumber(shares)}
➕ Followers Baru: ${formatNumber(followers)}
📊 Engagement: ${engagement}% ${trending ? '🔥 Video ini masuk Trending!' : ''}
💰 Hadiah Uang: Rp${formatNumber(money)}`, flok, { mentions: [m.sender] });

    setTimeout(() => {
      conn.reply(m.chat, `@${m.sender.replace(/@.+/, '')}, kamu bisa *Post TikTok* lagi sekarang!`, null, {
        mentions: [m.sender]
      });
    }, cooldown);
  }

  if (command === 'akuntt') {
    if (!user.tiktok_account) return conn.reply(m.chat, 'Kamu belum punya akun TikTok!\nBuat dulu pakai .creatett [nama akun]', flok);

    let postList = user.tiktok_posts.map((post, i) => `\n${i + 1}. *${post.caption}*\n> Views: ${formatNumber(post.views)} | Likes: ${formatNumber(post.likes)} | Trending: ${post.trending ? '🔥' : '❌'}\n> Engagement: ${post.engagement}%`).join('');

    conn.reply(m.chat, `💥 \`ACCOUNT TIKTOK\`

👤 Akun: @${m.sender.replace(/@.+/, '')}
👁️ Total Views: ${formatNumber(user.tiktok_views)}
❤️ Total Likes: ${formatNumber(user.tiktok_likes)}
💬 Total Komentar: ${formatNumber(user.tiktok_comments)}
🔁 Total Shares: ${formatNumber(user.tiktok_shares)}
👤 Total Followers: ${formatNumber(user.tiktok_followers)}

Top 5 Postingan Terakhir:${postList || '\nBelum ada postingan.'}`, flok, { mentions: [m.sender] });
  }

  if (command === 'lbtt') {
    let users = Object.entries(global.db.data.users)
      .filter(([_, data]) => data.tiktok_account)
      .map(([jid, data]) => ({ jid, account: data.tiktok_account, followers: data.tiktok_followers }))
      .sort((a, b) => b.followers - a.followers)
      .slice(0, 10);

    if (users.length === 0) return conn.reply(m.chat, 'Belum ada yang membuat akun TikTok di sini.', flok);

    let board = users.map((u, i) => `${i + 1}. @${u.jid.split('@')[0]} — ${formatNumber(u.followers)} followers`).join('\n');
    let mentions = users.map(u => u.jid);

    conn.reply(m.chat, `🎊 \`TOP GLOBAL TIKTOK\` 🎊\n\n${board}`, flok, { mentions });
  }

  if (command === 'misitt') {
    conn.reply(m.chat, `Misi Harian TikTok:

1. Posting 1 video — 🎁 Rp100.000
2. Capai 10.000 views — 🎁 Rp250.000
3. Masuk trending — 🎁 Rp500.000

Gunakan .postt untuk menyelesaikan misi.`, flok);
  }

  if (command === 'tokott') {
    conn.reply(m.chat, `Toko TikTok:

1. Boost Views (10.000) — 💸 Rp3.000 Cash (.belitt boost)
2. Tambah Followers (1.000) — 💸 Rp10.000 Cash (.belitt followers)
3. Ganti Nama Akun — 💸 Rp1.000 Cash (.belitt rename [nama baru])

Note: Toko Ini Menggunakan Cash!`, flok);
  }

  if (command === 'belitt') {
    let pilihan = args[0];
    if (!pilihan) return conn.reply(m.chat, 'Contoh: .belitt boost', flok);

    if (pilihan === 'boost') {
      if (user.cash < 3000) return conn.reply(m.chat, 'Uangmu tidak cukup untuk membeli boost views.', flok);
      user.cash -= 3000;
      user.tiktok_views += 10000;
      return conn.reply(m.chat, 'Kamu membeli *Boost Views*! (+10.000 Views)', flok);
    }

    if (pilihan === 'followers') {
      if (user.cash < 10000) return conn.reply(m.chat, 'Uangmu tidak cukup untuk membeli followers.', flok);
      user.cash -= 10000;
      user.tiktok_followers += 1000;
      return conn.reply(m.chat, 'Kamu membeli *1.000 Followers* tambahan!', flok);
    }

    if (pilihan === 'rename') {
      let newName = args.slice(1).join(' ');
      if (!newName) return conn.reply(m.chat, 'Gunakan: .belitt rename [nama baru]', flok);
      if (user.cash < 1000) return conn.reply(m.chat, 'Uangmu tidak cukup untuk ganti nama akun.', flok);
      user.cash -= 1000;
      user.tiktok_account = newName;
      return conn.reply(m.chat, `Nama akun TikTok kamu kini: *${newName}*`, flok);
    }
  }

  if (command === 'colabtt') {
    let mention = m.mentionedJid[0];
    if (!mention || !global.db.data.users[mention]?.tiktok_account) {
        return conn.reply(m.chat, 'Tag satu pengguna yang punya akun TikTok untuk kolaborasi!', flok);
    }

    let cooldown = 15 * 60 * 1000;
    user.colabtt_cooldown = user.colabtt_cooldown || 0;

    if (new Date - user.colabtt_cooldown < cooldown) {
        let remaining = ((user.colabtt_cooldown + cooldown) - new Date);
        return conn.reply(m.chat, `⏳ Tunggu dulu! Kamu bisa *collab* lagi dalam ${msToTime(remaining)}.`, flok);
    }

    const views = rand(10000, 200000);
    const likes = rand(500, 15000);
    const comments = rand(100, 700);
    const shares = rand(50, 500);
    const followers = rand(100, 1000);
    const money = rand(200000, 7000000);

    user.tiktok_views += views;
    user.tiktok_likes += likes;
    user.tiktok_comments += comments;
    user.tiktok_shares += shares;
    user.tiktok_followers += followers;
    user.money += money;
    user.colabtt_cooldown = +new Date;

    global.db.data.users[mention].tiktok_views += views;
    global.db.data.users[mention].tiktok_likes += likes;
    global.db.data.users[mention].tiktok_comments += comments;
    global.db.data.users[mention].tiktok_shares += shares;
    global.db.data.users[mention].tiktok_followers += followers;
    global.db.data.users[mention].money += money;

    conn.reply(m.chat, `🎬 \`Collab TikTok\`

👥 *Kolaborasi*: @${m.sender.replace(/@.+/, '')} & @${mention.split('@')[0]}
👁️ *Views*: ${formatNumber(views)}
❤️ *Likes*: ${formatNumber(likes)}
💬 *Komentar*: ${formatNumber(comments)}
🔁 *Shares*: ${formatNumber(shares)}
➕ *Followers*: +${formatNumber(followers)}
💰 *Uang*: Rp${formatNumber(money)} (masing-masing)

Tunggu 15 menit untuk collab lagi.`, flok, {
        mentions: [m.sender, mention]
    });

    setTimeout(() => {
        conn.reply(m.chat, `⏰ *Pengingat Collab!*\n\n@${m.sender.replace(/@.+/, '')} & @${mention.split('@')[0]}, kalian sudah bisa *Collab TikTok* lagi sekarang!`, flok, {
            mentions: [m.sender, mention]
        });
    }, cooldown);
}

   if (command === 'achievementtt') {
  if (!user.tiktok_account) return conn.reply(m.chat, 'Kamu belum punya akun TikTok!', flok);

  const list = {
    '10k_views': { label: '10.000 total views', icon: '👀' },
    'trending_post': { label: 'Video pertama trending', icon: '🔥' },
    '100k_views': { label: '100.000 total views', icon: '🎯' },
    '1k_followers': { label: '1.000 followers', icon: '👥' },
    '1m_views': { label: '1.000.000 total views', icon: '💥' },
    '5_trending': { label: '5 video trending', icon: '🚀' },
  };

  let achieved = user.tiktok_achievements || [];
  let text = `🏅 \`DAFTAR ACHIEVEMENT TIKTOK\`\n\n`;
  for (let [key, { label, icon }] of Object.entries(list)) {
    text += `${achieved.includes(key) ? '✅' : '❌'} ${icon} ${label}\n`;
  }

  text += '\nKumpulkan semua dan dapatkan hadiah menarik!';

  conn.reply(m.chat, text, flok);
}

  function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
};

handler.help = ['creatett','postt','akuntt','lbtt','misitt','tokott','belitt','colabtt','achievementtt'];
handler.tags = ['rpg'];
handler.command = /^(creatett|postt|akuntt|lbtt|misitt|tokott|belitt|colabtt|achievementtt)$/i;

export default handler;