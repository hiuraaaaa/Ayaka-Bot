let handler = m => m
handler.before = m => {
  let user = global.db.data.users[m.sender]
  let d = new Date(new Date + 3600000)
  let timer = user.afkTime
    let locale = 'id'
    // d.getTimeZoneOffset()
    // Offset -420 is 18.00
    // Offset    0 is  0.00
    // Offset  420 is  7.00
    let date = d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'Asia/Jakarta'
    })
    let time = d.toLocaleTimeString(locale, { timeZone: 'Asia/Jakarta' })
    time = time.replace(/[.]/g, ':')
  if (user.afk > -1) {
   let mentionedJid = [m.sender]
    conn.reply(m.chat, `
*@${m.sender.replace(/@.+/, '')} Telah Kembali*\n ${user.afkReason ? ' \n♻️ *Setelah:* ' + user.afkReason : ''}
⏱️ *AFK Selama:* ${(new Date - user.afk).toTimeString()}
🕓 *Dari Jam:* _${timer}_

⎙ *${date}*`.trim(), flok, {contextInfo: { mentionedJid }})
    user.afk = -1
    user.afkReason = ''
    user.afkTime = ''
  }
  let jids = [...new Set([...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : [])])]
  for (let jid of jids) {
    let user = global.db.data.users[jid]
    if (!user) continue
    let afkTimer = user.afk
    if (!afkTimer || afkTimer < 0) continue
    let reason = user.afkReason || ''
    let timie = user.afkTime
    conn.reply(m.chat, `
*@${jid.replace(/@.+/, '')} Sedang AFK*\n\n${reason ? '📝 *Dengan Alasan:* ' + reason : '📝 *Dengan Alasan:* Tanpa Alasan'}
⏱️ *Selama:* ${(new Date - user.afk).toTimeString()}
🕑 *Dari Jam:* ${timie}
`.trim(), flok, { contextInfo: { mentionedJid: [jid] }})
  }
  return true
}

export default handler