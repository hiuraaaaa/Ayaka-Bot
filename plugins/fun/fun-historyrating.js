let handler = async (m, { conn }) => {
  if (!global.db.data.voting || Object.keys(global.db.data.voting).length === 0) {
    return m.reply('❌ Belum ada voting yang diberikan.')
  }

  let text = '*🔎 History Voting & Ulasan:* \n\n'
  for (let user in global.db.data.voting) {
    let voting = global.db.data.voting[user]
    let name = (await conn.getName(user)) || 'No Name'
    text += `\n*User:* ${name}\n*Rating:* ${voting.rating} ⭐\n*Ulasan:* ${voting.review}\n`
  }

  m.reply(text)
}

handler.help = ['historyrating']
handler.tags = ['tools']
handler.command = /^historyrating$/i

export default handler