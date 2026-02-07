let handler = async (m, { text, args, command }) => {
  if (!args[0]) throw `Use example .${command} halo`
  m.reply(`
*Pertanyaan:* ${m.text}
*Jawaban:* ${['0%','10%','20%','30%','40%','50%','60%','70%','80%','90%','100%'].getRandom()}
  `.trim(), null, m.mentionedJid ? {
  mentions: m.mentionedJid
} : {})
}
handler.help = ['kemungkinan']
handler.tags = ['fun']
handler.command = /^kemungkinan$/i

export default handler