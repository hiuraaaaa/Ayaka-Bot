const handler = async (m, { conn, args, prefix, ownername }) => {
  if (args.length < 1) return m.reply(`Example:\n${prefix}fliptext ${ownername}`)
  const quere = args.join(' ')
  const flipe = quere.split('').reverse().join('')
  m.reply(`\`\`\`「 FLIP TEXT 」\`\`\`\n*•> Normal :*\n${quere}\n*•> Flip :*\n${flipe}`)
}

handler.help = ['fliptext <text>']
handler.tags = ['fun']
handler.command = /^fliptext$/i

export default handler