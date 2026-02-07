let handler = async (m, { command, conn, text }) => {
  let user = global.db.data.users[m.sender]
  let bsubs = user.subscriber
  let namayt = user.nameyt
  let spbutton = user.silverplaybutton
  let gpbutton = user.goldplaybutton
  let dpbutton = user.diamondplaybutton
  let nama = user.name
  let blike = user.liketotal
  let like = blike.toLocaleString()
  let subs = bsubs.toLocaleString()
  let mentionedJid = [m.sender]
  
  let stt = `*🎧 YOUTUBE STUDIO 🎧*

*• 👤 Pemilik:* @${m.sender.replace(/@.+/, '')}
*• 🏷️ Nama:* ${nama}
*• 🌐 Nama Channel:* ${namayt}
*• 👥 Subscribers:* ${subs}
*• 👍🏻 Total like:* ${like}

*• ⬜ Silver play button:* ${spbutton == 0 ? 'Tidak Punya' : '' || spbutton == 1 ? '✅' : ''}
*• 🟨 Gold play button:* ${gpbutton == 0 ? 'Tidak Punya' : '' || gpbutton == 1 ? '✅' : ''}
*• 💎 Diamond play button:* ${dpbutton == 0 ? 'Tidak Punya' : '' || dpbutton == 1 ? '✅' : ''}
▬▭▬▭▬▭▬▭▬▭▬▭▬▭▬▭`
    conn.reply(m.chat, stt, flok, {contextInfo: { mentionedJid }})
}
handler.tags = ['game','rpg']
handler.help = ['akunyt']
handler.command = /^(akunyt)/i
handler.register = true

export default handler;