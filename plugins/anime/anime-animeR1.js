import axios from 'axios'

const animeActions = {
  animekiss: 'kiss',
  animeawoo: 'awoo',
  animemegumin: 'megumin',
  animeshinobu: 'shinobu',
  animehandhold: 'handhold',
  animehighfive: 'highfive',
  animecringe: 'cringe',
  animedance: 'dance',
  animehappy: 'happy',
  animeglomp: 'glomp',
  animesmug: 'smug',
  animeblush: 'blush',
  animewave: 'wave',
  animesmile: 'smile',
  animepoke: 'poke',
  animewink: 'wink',
  animebonk: 'bonk',
  animebully: 'bully',
}

let handler = async (m, { conn, command }) => {
  const endpoint = animeActions[command.toLowerCase()]
  if (!endpoint) return

  await conn.sendMessage(m.chat, {
    react: {
      text: '🍏',
      key: m.key
    }
  })

  try {
    let waifudd = await axios.get(`https://waifu.pics/api/sfw/${endpoint}`)
    await conn.sendMessage(m.chat, {
      image: { url: waifudd.data.url },
      caption: '✅ Sukses!'
    }, { quoted: m })
  } catch (err) {
    await conn.sendMessage(m.chat, {
      text: '❌ Gagal mengambil gambar.',
    }, { quoted: m })
  }
}

handler.command = Object.keys(animeActions)
handler.tags = ['anime']
handler.help = Object.keys(animeActions)
handler.premium = false

export default handler