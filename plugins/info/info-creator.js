let handler = async (m, { conn }) => {
 
  if (!global.owner || !Array.isArray(global.owner) || global.owner.length === 0)
    return m.reply('⚠️ Data owner belum diatur di global.owner!')

  const nomor1 = global.owner[0]?.[0] || global.owner[0]
  const nomor2 = global.owner[1]?.[0] || global.owner[1]

  const contacts = [
    [
      nomor1,
      'Co-Owner',
      'Asisten Developer',
      'Ponsel',
      'coowner@stoore.rijal',
      'Tokyo - Japan',
      'https://github.com/RIJALGANZZZ',
      'Pendamping setia developer'
    ],
    [
      nomor2,
      'Developer',
      'Creator Bot',
      'Ponsel',
      'developer@stoore.rijal',
      'Washington - USA',
      'https://github.com/RIJALGANZZZ',
      'Pemilik utama bot'
    ]
  ]

  await conn.sendMessage(m.chat, { react: { text: '📞', key: m.key } })
  await conn.sendContactArray(m.chat, contacts, flok)
  await conn.reply(m.chat, `Tuh kontak para ownerku 😋`, m)
}

handler.help = ['owner', 'creator']
handler.tags = ['main']
handler.command = /^(owner|creator)$/i

export default handler