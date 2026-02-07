var handler = async (m, { text }) => {
    let user = global.db.data.users[m.sender]
    let d = new Date(new Date + 3600000)
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
    user.afk = + new Date
    user.afkReason = text
    user.afkTime = time
    let mentionedJid = [m.sender]
    let nama = user.name
    conn.reply(m.chat, `*@${m.sender.replace(/@.+/, '')} Telah AFK*
    
🔖 *Nama:* ${nama}
📝 *Alasan:* ${text ? ' ' + text : 'Tanpa Alasan'}
🕓 *Pada Jam:* _${time}_

⎙ *${date}*`, flok, {contextInfo: { mentionedJid }})
  }
  handler.help = ['afk']
  handler.tags = ['user']
  handler.command = /^afk$/i
  
  export default handler