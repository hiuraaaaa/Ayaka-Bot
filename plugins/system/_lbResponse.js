let handler = async(m, { conn, command, args, participants }) => {
   let users = Object.entries(global.db.data.users).map(([key, value]) => {
    return {...value, jid: key}
  })
  let sortedExp = users.map(toNumber('exp')).sort(sort('exp'))
   let len = args[0] && args[0].length > 0 ? Math.min(10, Math.max(parseInt(args[0]), 10)) : Math.min(10, sortedExp.length)
   
   if (command === 'lbexp') {
   let usersExp = sortedExp.map(enumGetKey)
   let text = `\tぶ 𝗹 𝗲 𝗮 𝗱 𝗲 𝗿 𝗯 𝗼 𝗮 𝗿 𝗱 🏆
• *🧪 XP Leaderboard Top ${len}* •
🎖️ Posisi Kamu : *${usersExp.indexOf(m.sender) + 1}* dari *${usersExp.length}*

${sortedExp.slice(0, len).map(({ jid, exp }, i) => `${formatRank(i)}. *${participants.some(p => jid === p.jid) ? `(${conn.getName(jid)}) wa.me/` : '@'}${jid.split`@`[0]}*    ${formatNumber(exp)}`).join`\n`}
▬▭▬▭▬▭▬▭▬▭▬▭`
   conn.reply(m.chat, text, flok, {
    contextInfo: {
      mentionedJid: [...usersExp.slice(0, len)].filter(v => !participants.some(p => v === p.jid))
    }
  })
   } else if (command === 'lbmoney') {
   let sortedMoney = users.map(toNumber('money')).sort(sort('money'))
   let usersMoney = sortedMoney.map(enumGetKey)
   let text = `\tぶ 𝗹 𝗲 𝗮 𝗱 𝗲 𝗿 𝗯 𝗼 𝗮 𝗿 𝗱 🏆
   
• *💵 Money Leaderboard Top ${len}* •
🎖️ Posisi Kamu : *${usersMoney.indexOf(m.sender) + 1}* dari *${usersMoney.length}*

${sortedMoney.slice(0, len).map(({ jid, money }, i) => `${formatRank(i)}. *${participants.some(p => jid === p.jid) ? `(${conn.getName(jid)}) wa.me/` : '@'}${jid.split`@`[0]}*    ${formatNumber(money)}`).join`\n`}
▬▭▬▭▬▭▬▭▬▭▬▭`
   conn.reply(m.chat, text, flok, {
    contextInfo: {
      mentionedJid: [...usersMoney.slice(0, len)].filter(v => !participants.some(p => v === p.jid))
    }
  })
   } else if (command === 'lblimit') {
   let sortedLim = users.map(toNumber('limit')).sort(sort('limit'))
   let usersLim = sortedLim.map(enumGetKey)
   let text = `\tぶ 𝗹 𝗲 𝗮 𝗱 𝗲 𝗿 𝗯 𝗼 𝗮 𝗿 𝗱 🏆
   
• *💳 Limit Leaderboard Top ${len}* •
🎖️ Posisi Kamu : *${usersLim.indexOf(m.sender) + 1}* dari *${usersLim.length}*

${sortedLim.slice(0, len).map(({ jid, limit }, i) => `${formatRank(i)}. *${participants.some(p => jid === p.jid) ? `(${conn.getName(jid)}) wa.me/` : '@'}${jid.split`@`[0]}*    ${formatNumber(limit)}`).join`\n`}
▬▭▬▭▬▭▬▭▬▭▬▭`
   conn.reply(m.chat, text, flok, {
    contextInfo: {
      mentionedJid: [...usersLim.slice(0, len)].filter(v => !participants.some(p => v === p.jid))
    }
  })
   } else if (command === 'lblevel') {
   let sortedLevel = users.map(toNumber('level')).sort(sort('level'))
   let usersLevel = sortedLevel.map(enumGetKey)
   let text = `\tぶ 𝗹 𝗲 𝗮 𝗱 𝗲 𝗿 𝗯 𝗼 𝗮 𝗿 𝗱 🏆

• *🎗️ Level Leaderboard Top ${len}* •
🎖️ Posisi Kamu : *${usersLevel.indexOf(m.sender) + 1}* dari *${usersLevel.length}*

${sortedLevel.slice(0, len).map(({ jid, level }, i) => `${formatRank(i)}. *${participants.some(p => jid === p.jid) ? `(${conn.getName(jid)}) wa.me/` : '@'}${jid.split`@`[0]}*    Level ${level}`).join`\n`}
▬▭▬▭▬▭▬▭▬▭▬▭`
   conn.reply(m.chat, text, flok, {
    contextInfo: {
      mentionedJid: [...usersLevel.slice(0, len)].filter(v => !participants.some(p => v === p.jid))
    }
  })
   } else if (command === 'lbsub') {
   let sortedSubscriber = users.map(toNumber('subscriber')).sort(sort('subscriber'))
   let usersSubs = sortedSubscriber.map(enumGetKey)
   let text = `\tぶ 𝗹 𝗲 𝗮 𝗱 𝗲 𝗿 𝗯 𝗼 𝗮 𝗿 𝗱 🏆

• *🌐 Subscriber Leaderboard Top ${len}* •
🎖️ Posisi Kamu : *${usersSubs.indexOf(m.sender) + 1}* dari *${usersSubs.length}*

${sortedSubscriber.slice(0, len).map(({ jid, subscriber }, i) => `${formatRank(i)}. *${participants.some(p => jid === p.jid) ? `(${conn.getName(jid)}) wa.me/` : '@'}${jid.split`@`[0]}*    ${formatNumber(subscriber)}`).join`\n`}
▬▭▬▭▬▭▬▭▬▭▬▭`
    conn.reply(m.chat, text, flok, {
    contextInfo: {
      mentionedJid: [...usersSubs.slice(0, len)].filter(v => !participants.some(p => v === p.jid))
    }
  })
   } else if (command === 'lbdamage') {
   let sortedResultDamage = users.map(toNumber('resultdamage')).sort(sort('resultdamage'))
   let usersResultDamage = sortedResultDamage.map(enumGetKey)
   let text = `\tぶ 𝗹 𝗲 𝗮 𝗱 𝗲 𝗿 𝗯 𝗼 𝗮 𝗿 𝗱 🏆

• *💥 Damage Leaderboard Top ${len}* •
🥇 Posisi Kamu : *${usersResultDamage.indexOf(m.sender) + 1}* dari *${usersResultDamage.length}*

${sortedResultDamage.slice(0, len).map(({ jid, resultdamage }, i) => `${formatRank(i) }. *${participants.some(p => jid === p.jid) ? `(${conn.getName(jid)}) wa.me/` : '@'}${jid.split`@`[0]}* ${formatNumber(resultdamage)}`).join`\n`}
▬▭▬▭▬▭▬▭▬▭▬▭`
    conn.reply(m.chat, text, flok, {
    contextInfo: {
      mentionedJid: [...usersResultDamage.slice(0, len)].filter(v => !participants.some(p => v === p.jid))
    }
  })
   } else if (command === 'lbastro') {
   let sortedTotal = users.map(toNumber('totalb')).sort(sort('totalb'))
   let usersTotal = sortedTotal.map(enumGetKey)
   let nuy = args[0] && args[0].length > 0 ? Math.min(10, Math.max(parseInt(args[0]), 10)) : Math.min(10, sortedTotal.length)
   let text = `\tぶ 𝗹 𝗲 𝗮 𝗱 𝗲 𝗿 𝗯 𝗼 𝗮 𝗿 𝗱 🏆

• *👨🏻‍🚀 Astronot Leaderboard Top ${nuy}* •
🥇 Posisi Kamu : *${usersTotal.indexOf(m.sender) + 1}* dari *${usersTotal.length}*

${sortedTotal.slice(0, nuy).map(({ jid, totalb }, i) => `${formatRank(i) }. *${participants.some(p => jid === p.jid) ? `(${conn.getName(jid)}) wa.me/` : '@'}${jid.split`@`[0]}* ${formatNumber(totalb)}x Berangkat`).join`\n`}
▬▭▬▭▬▭▬▭▬▭▬▭`
    conn.reply(m.chat, text, flok, {
    contextInfo: {
      mentionedJid: [...usersTotal.slice(0, len)].filter(v => !participants.some(p => v === p.jid))
    }
  })
  } else if (command === 'lbdokter') {
   let sortedTotals = users.map(toNumber('totaldokter')).sort(sort('totaldokter'))
   let usersTotals = sortedTotals.map(enumGetKey)
   let saa = args[0] && args[0].length > 0 ? Math.min(10, Math.max(parseInt(args[0]), 10)) : Math.min(10, sortedTotals.length)
   let text = `\tぶ 𝗹 𝗲 𝗮 𝗱 𝗲 𝗿 𝗯 𝗼 𝗮 𝗿 𝗱 🏆

• *📦 Mulung Leaderboard Top ${saa}* •
🥇 Posisi Kamu : *${usersTotals.indexOf(m.sender) + 1}* dari *${usersTotals.length}*

${usersTotals.slice(0, saa).map(({ jid, totaldokter }, i) => `${formatRank(i) }. *${participants.some(p => jid === p.jid) ? `(${conn.getName(jid)}) wa.me/` : '@'}${jid.split`@`[0]}* ${formatNumber(totaldokter)}`).join`\n`}
▬▭▬▭▬▭▬▭▬▭▬▭`
    conn.reply(m.chat, text, flok, {
    contextInfo: {
      mentionedJid: [...usersTotals.slice(0, len)].filter(v => !participants.some(p => v === p.jid))
    }
  })
   } else if (command === 'lbreward') {
   let sortedExp = users.map(toNumber('exp')).sort(sort('exp'))
   let usersExp = sortedExp.map(enumGetKey)
   let ipeh = args[0] && args[0].length > 0 ? Math.min(3, Math.max(parseInt(args[0]), 3)) : Math.min(3, sortedExp.length)
   let cap = `\t*Hadiah Top Global 🏆🎁*
\n\n*🥇 JUARA 1*\n* 💵Money: 7M\n* 💳Limit 7000\n* 💰Cash: 1000\n\n*🥈 JUARA 2*\n* 💵Money: 5M\n* 💳Limit: 5000\n* 💰Cash: 600\n\n*🥉 JUARA 3*\n* 💵Money: 3M\n* 💳Limit: 3000\n* 💰 Cash: 300\n\`Setiap Hadiah akan di bagikan manual oleh owner\`\n\n*🔔 Time:*\n* Hari Minggu\n* Jam 12+\n* Khusus Grup Bot\n\`Semoga, Dengan ini kalian nyaman\`

*🏆 Top Global Saat Ini*
${sortedExp.slice(0, ipeh).map(({ jid, exp }, i) => `${formatRank(i)}. *${participants.some(p => jid === p.jid) ? `(${conn.getName(jid)}) wa.me/` : '@'}${jid.split`@`[0]}*    ${formatNumber(exp)}`).join`\n`}
▬▭▬▭▬▭▬▭▬▭▬▭`
    
    conn.reply(m.chat, cap, flok, {
    contextInfo: {
      mentionedJid: [...usersExp.slice(0, ipeh)].filter(v => !participants.some(p => v === p.jid))
    }
  })
   }
}

handler.command = /^lb(exp|money|limit|level|sub|reward|damage|astro|sampah|dokter)$/i

export default handler;

function sort(property, ascending = true) {
  if (property) return (...args) => args[ascending & 1][property] - args[!ascending & 1][property]
  else return (...args) => args[ascending & 1] - args[!ascending & 1]
}

function toNumber(property, _default = 0) {
  if (property) return (a, i, b) => {
    return {...b[i], [property]: a[property] === undefined ? _default : a[property]}
  }
  else return a => a === undefined ? _default : a
}

function enumGetKey(a) {
  return a.jid
}

function formatRank(i) {
    return i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : (i + 1).toString();
  }
  
function formatNumber(num) {
  const suffixes = ['', 'Rb', 'Jt', 'M', 'T', 'Qa', 'Qi', 'Sk', 'Sp', 'Ot', 'Nn', 'Ds'];
  const numString = Math.abs(num).toString();
  const numDigits = numString.length;

  if (numDigits <= 3) {
    return numString;
  }

  const suffixIndex = Math.floor((numDigits - 1) / 3);
  let formattedNum = (num / Math.pow(1000, suffixIndex)).toFixed(1);
  
  // Menghapus desimal jika angka sudah bulat
  if (formattedNum.endsWith('.0')) {
    formattedNum = formattedNum.slice(0, -2);
  }

  return formattedNum + suffixes[suffixIndex];
}