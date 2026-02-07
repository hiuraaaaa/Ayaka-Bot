let handler = async (m, { conn, args }) => {
  let userId = m.sender;
  let mentionedUser = m.mentionedJid && m.mentionedJid[0];
  
  if (mentionedUser) {
    userId = mentionedUser;
  }

  let user = global.db.data.users[userId] || {};

  const pp = await conn.profilePictureUrl(userId, "image").catch(() => "https://telegra.ph/file/ee60957d56941b8fdd221.jpg");

  const money = Number(user.money) || 0;
  const cash = Number(user.cash) || 0;
  const dana = Number(user.dana) || 0;
  const gopay = Number(user.gopay) || 0;
  const ovo = Number(user.ovo) || 0;

  const formattedMoney = new Intl.NumberFormat().format(money);
  const formattedCash = new Intl.NumberFormat().format(cash);
  const formattedDana = new Intl.NumberFormat().format(dana);
  const formattedGopay = new Intl.NumberFormat().format(gopay);
  const formattedOvo = new Intl.NumberFormat().format(ovo);

  const tag = '@' + (userId.split('@')[0] || 'unknown');

  const isPremium = (Number(user.premiumTime) || 0) > 0;
  const premiumStatus = isPremium ? `*🌟 Premium*` : 'Free';

  let premiumProgress = '';
  if (isPremium) {
    const premiumStartTime = Number(user.premiumTime);
    const currentTime = Date.now();
    const timeRemaining = premiumStartTime - currentTime;
    
    const totalPremiumTime = 30 * 24 * 60 * 60 * 1000;
    
    let percentageRemaining = (timeRemaining / totalPremiumTime) * 100;
    percentageRemaining = Math.max(0, Math.min(100, percentageRemaining));

    premiumProgress = `*✨ Progress:* ${Math.round(percentageRemaining)}%`;
  }

  const premiumLevelIcon = isPremium ? 'Silver Member' : '🚫 Not Premium';

  const uptime = global.uptime || process.uptime();
  const runtime = clockString(uptime * 1000);

  const sakutext = `「 \`S A K U - U S E R\` 」
  
*👤 Name:* *${tag}*
*💸 Money:* ${formattedMoney}
*🪙 Cash:* ${formattedCash}
*🪪 Dana:* ${formattedDana}
*🟢 Gopay:* ${formattedGopay}
*🫧 Ovo:* ${formattedOvo}
*🛜 Status:* ${premiumStatus}
  
*💎 ${premiumLevelIcon}*
${premiumProgress}`;

  conn.reply(m.chat, sakutext, flok, {
    mentions: [userId],
    contextInfo: {
      mentionedJid: [userId],
      externalAdReply: {
        title: m.pushName,
        body: `Runtime: ${runtime}`,
        mediaUrl: pp,
        thumbnailUrl: pp,
      }
    }
  });
}

handler.help = ['saku'];
handler.tags = ['rpg'];
handler.command = /^(saku)$/i;
handler.register = false;

export default handler;

function clockString(ms) {
  let h = Math.floor(ms / 3600000);
  let m = Math.floor((ms % 3600000) / 60000);
  let s = Math.floor((ms % 60000) / 1000);
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':');
}