/* wm Ubed Bot */

let handler = async (m, { conn }) => {
  let users = Object.entries(global.db.data.users)
    .filter(([_, u]) => u.kerjaCount)
    .sort((a, b) => b[1].kerjaCount - a[1].kerjaCount)
    .slice(0, 10)

  if (!users.length) return m.reply('Belum ada yang kerja di dunia Ubed.')

  let text = `🏆 *Top 10 Pekerja Ubed Bot*\n\n`
  for (let i = 0; i < users.length; i++) {
    let [jid, user] = users[i]
    let name = (await conn.getName(jid)) || 'Pengguna'
    text += `${i + 1}. ${name} - *${user.kerjaCount}x kerja*\n`
  }

  m.reply(text)
}

handler.help = ['lbubedkerja']
handler.tags = ['rpg']
handler.command = /^lbubedkerja$/i

export default handler