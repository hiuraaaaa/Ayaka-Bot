import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  const suppVoice = [
    "airi","akane","akari","ako","aris","arona","aru","asuna","atsuko","ayane","azusa",
    "cherino","chihiro","chinatsu","chise","eimi","erica","fubuki","fuuka","hanae",
    "hanako","hare","haruka","haruna","hasumi","hibiki","hihumi","himari","hina",
    "hinata","hiyori","hoshino","iori","iroha","izumi","izuna","juri","kaede","karin",
    "kayoko","kazusa","kirino","koharu","kokona","kotama","kotori","main","maki","mari",
    "marina","mashiro","michiru","midori","miku","mimori","misaki","miyako","miyu","moe",
    "momoi","momoka","mutsuki","NP0013","natsu","neru","noa","nodoka","nonomi","pina",
    "rin","saki","saori","saya","sena","serika","serina","shigure","shimiko","shiroko",
    "shizuko","shun","ShunBaby","sora","sumire","suzumi","tomoe","tsubaki","tsurugi",
    "ui","utaha","wakamo","yoshimi","Ayaka","yuzu","zunko"
  ]

  if (args.length < 2) {
    return conn.reply(m.chat, `Usage: ${usedPrefix + command} <char> <text>\n\nSupported chars:\n${suppVoice.join(', ')}`, m)
  }

  let char = args[0].toLowerCase()
  if (!suppVoice.includes(char)) {
    return conn.reply(m.chat, `Karakter '${char}' tidak didukung.\nPilih dari:\n${suppVoice.join(', ')}`, m)
  }

  let textToSpeak = args.slice(1).join(' ')
  if (textToSpeak.length > 200) {
    return conn.reply(m.chat, 'Teks terlalu panjang, maksimal 200 karakter.', m)
  }

  await conn.sendMessage(m.chat, {
    react: {
      text: '🔊',
      key: m.key
    }
  })

  try {
    const url = `https://api.nekorinn.my.id/tools/ttsba?text=${encodeURIComponent(textToSpeak)}&char=${char}&speed=1`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP error ${res.status}`)

    const arrayBuffer = await res.arrayBuffer()
    const audioBuffer = Buffer.from(arrayBuffer)

    await conn.sendMessage(
      m.chat,
      { audio: audioBuffer, mimetype: 'audio/mpeg', ptt: true },
      { quoted: m }
    )
  } catch (e) {
    return conn.reply(m.chat, `Gagal mendapatkan suara: ${e.message}`, m)
  }
}

handler.help = ['ttsba <char> <text>']
handler.tags = ['tools','ai']
handler.command = ['ttsba']
handler.register = true
handler.limit = 5

export default handler