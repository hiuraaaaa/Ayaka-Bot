import fetch from 'node-fetch'

const handler = async (m, { conn }) => {
  // Kirim reaksi emoji saat memproses
  await conn.sendMessage(m.chat, { react: { text: '🍏', key: m.key } });

  const res = await fetch('https://raw.githubusercontent.com/inirey/RESTAPI/master/data/deidara.json')
  const data = await res.json()

  const imageUrl = data[Math.floor(Math.random() * data.length)]

  await conn.sendFile(m.chat, imageUrl, 'deidara.jpg', '✅ Done!', m)
}

handler.help = ['deidara']
handler.tags = ['anime']
handler.command = /^deidara$/i

export default handler