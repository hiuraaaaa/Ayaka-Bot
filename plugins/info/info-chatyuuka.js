let handler = async(m, { conn, text }) => {
   conn.ryou = conn.ryou || {};
   let data = [conn.ryou]
   
   if (data && data.length > 0) {
   let user = []
   data.map(item => {
      let key = Object.keys(item)[0]
        for (let key in item) {
        if (item.hasOwnProperty(key)) {
        let name = item[key].name
        let sender = item[key].sender
       // conn.reply(m.chat, , flok)
           // console.log(`Kunci: ${key}, Data: ${item[key].datanya}`);
         user.push({ name, sender })
        }
    }
       })
    let sender = user.map(player => {
        return player.sender
      }).join()
    let teks = user.map((ipah, i) => {
         return `\n*${i + 1}.*\n* *Name:* ${ipah.name}\n* *Number:* ${ipah.sender.replace(/@.+/, '')}`.trim()
       }).join(`\n\n✦─────────────✦\n\n`)
       await conn.reply(m.chat, `\`<\\> Chat Ayaka Kamisato Aktif <\\>\`\n\n` + teks, flok, { contextInfo: { mentionedJid: [sender] }})
      // m.reply(sender)
    } else {
    m.reply(`Tidak Ada Chat Yang Aktif`)
    }
}
handler.tags = ['info']
handler.help = ['cekchat']
handler.command = /^(cekchat)$/i;
handler.register = true

export default handler