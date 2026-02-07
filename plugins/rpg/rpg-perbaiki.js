let handler  = async (m, { conn, command, args, usedPrefix, owner }) => {
  let type = (args[0] || '').toLowerCase()
  let user = global.db.data.users[m.sender]
  let caption = `*「 R E P A I R 」*


⎆ Pancingan

© Lann4you!
▬▭▬▭▬▭▬▭▬▭
*⎆ Pancingan*
➵ 15 Kayu
➵ 5 String
➵ 5 Iron

*Untuk Pancingan :* .perbaiki pancingan
`
  switch (type) {
      case 'pancingan':
      if (user.pancingandurability > 99) return m.reply(`Pancingan Kamu Tidak Memiliki Kerusakan`)
      if (user.iron < 5 || user.string < 5 || user.kayu < 15) return m.reply(`Kamu Membutuhkan *5 Iron⚙️* *5 String🕸️* Dan *15 Kayu🪵*`)
      if (user.iron < 5) return m.reply(`Iron Kamu Belum Cukup!!, Kamu membutuhkan *5 Iron⚙️*`)
      if (user.string < 5) return m.reply(`String Kamu Belum Cukup!!, Kamu Membutuhkan *5 String🕸️*`)
      if (user.kayu < 15) return m.reply(`Kayu Kamu Blum Cukup!!, Kamu Membutuhkan *15 Kayu🪵*`)
      user.iron -= 5
      user.string -= 5
      user.kayu -= 15
      user.pancingandurability = 100
      m.reply(`Suksess Memperbaiki Pancingan`)
      break
    default:
        return conn.reply(m.chat, caption, flok)
   }
}
handler.tags = ['rpg']
handler.help = ['perbaiki pancingan']
handler.command = /^(perbaiki)/i

export default handler;