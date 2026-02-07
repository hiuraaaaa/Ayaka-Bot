let cooldown = 420000 // 7 menit dalam ms
let handler = async (m, { conn, command }) => {
  conn.karaoke = conn.karaoke || {}
  global.db.data.users = global.db.data.users || {}
  let user = global.db.data.users[m.sender]

  if (command === 'karaoke') {
    user.karaokeTime = user.karaokeTime || 0
    let now = Date.now()

    if (now - user.karaokeTime < cooldown) {
      let remaining = ((cooldown - (now - user.karaokeTime)) / 60000).toFixed(1)
      return m.reply(`⏱️ Tunggu ${remaining} menit sebelum ikut karaoke lagi.`)
    }

    conn.karaoke[m.sender] = true
    user.karaokeTime = now
    return m.reply(`🎤 *Karaoke Challenge*\n\nSilakan kirim *voice note (VN)* menyanyikan lagu favoritmu.\n\nJika sudah, *reply* ke VN dengan perintah *.karaokenilai* untuk dinilai dan dapat hadiah!`)
  }

  if (command === 'karaokenilai') {
    if (!m.quoted || m.quoted.mtype !== 'audioMessage') {
      return m.reply('❗Reply ke *voice note* peserta karaoke dengan perintah ini.')
    }

    let target = m.quoted.sender
    if (!conn.karaoke[target]) return m.reply('❌ Orang ini belum mulai karaoke, gunakan perintah .karaoke dulu.')

    let score = Math.floor(Math.random() * 91) + 10 // 10–100
    let feedbackBagus = [
      "Penampilanmu luar biasa! Juri sampai berdiri.",
      "Suaranya bikin merinding, beneran!",
      "Kamu punya bakat jadi idola!",
      "Aksi panggungmu memukau banget!"
    ]
    let feedbackJelek = [
      "Mikrofonnya error atau emang suaranya gitu?",
      "Kamu nyanyi... atau nangis sih?",
      "Hmm, mungkin kamu cocoknya jadi pendengar aja.",
      "Juri: *membisu*"
    ]

    let cerita = score >= 25
      ? feedbackBagus[Math.floor(Math.random() * feedbackBagus.length)]
      : feedbackJelek[Math.floor(Math.random() * feedbackJelek.length)]

    let result = `📝 *Skor Karaoke: ${score}*\n🗣️ *Komentar Juri:* ${cerita}\n\n`

    if (score >= 25) {
      let money = Math.floor(Math.random() * 800001) + 200000
      let exp = Math.floor(Math.random() * 4000) + 1000
      let limit = 1

      global.db.data.users[target].money += money
      global.db.data.users[target].exp += exp
      global.db.data.users[target].limit += limit

      result += `🎉 Selamat! Kamu dapat:\n💸 Uang: Rp${money.toLocaleString()}\n✨ Exp: ${exp}\n🎫 Limit: ${limit}`
    } else {
      result += `😢 Sayang sekali, belum dapat hadiah. Ayo latihan lagi!`
    }

    delete conn.karaoke[target]
    return m.reply(result)
  }
}

handler.command = /^(karaoke|karaokenilai)$/i
handler.help = ['karaoke', 'karaokenilai']
handler.tags = ['game']

export default handler