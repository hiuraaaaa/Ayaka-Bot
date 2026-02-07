let handler = async (m, { conn, text }) => {
  let user = global.db.data.users[m.sender]
  let opponent = m.mentionedJid[0]
  
  if (!user || !global.db.data.users[opponent]) {
    return m.reply('*Contoh*: .bertarung @user')
  }

  conn.sendMessage(m.chat, {
    react: {
      text: '🕒',
      key: m.key,
    }
  })

  let userLevel = user.level || 0
  let opponentData = global.db.data.users[opponent]
  let opponentLevel = opponentData.level || 0

  let alasanKalah = pickRandom([
    'bodoh gitu doang aja kalah tolol lu di denda',
    'lemah lu kontol mending lu di rumah aja dah lu di denda dek',
    'Jangan beratem kalo cupu dek wkwkwk kamu di denda',
    'Dasar tolol lawan itu doang aja ga bisa lu di denda',
    'Hadehh sono lu mending di rumah aja deh lu di denda'
  ])

  let alasanMenang = pickRandom([
    'kamu berhasil menggunakan kekuatan elemental untuk menghancurkan pertahanan lawan dan mendapatkan',
    'kamu berhasil melancarkan serangan mematikan dengan gerakan akrobatik yang membingungkan lawan, dan mendapatkan',
    'Kamu berhasil menang karena baru selesai coli dan mendapatkan',
    'Kamu berhasil menang karena menyogok lawan dan mendapatkan',
    'Kamu berhasil menang karena raiden merasa kasihan sama kamu, dan kamu mendapatkan',
    'Kamu berhasil menang karena kamu melawan orang cupu dan mendapatkan'
  ])

  let betAmount = Math.floor(Math.random() * (10000000 - 10000 + 1)) + 10000

  if (user.money < betAmount || opponentData.money < betAmount) {
    return m.reply('Salah satu dari kalian tidak memiliki cukup uang.')
  }

  if (user.lastWar && (new Date - user.lastWar) < 10000) {
    let remainingTime = Math.ceil((10000 - (new Date() - user.lastWar)) / 1000)
    return m.reply(`Tunggu ${remainingTime} detik sebelum bertarung lagi`)
  }

  m.reply('Mempersiapkan arena...')

  setTimeout(() => {
    m.reply('Mendapatkan arena...')

    setTimeout(() => {
      m.reply('Bertarung...')

      setTimeout(async () => {
        let playerWins = userLevel >= opponentLevel
        let winner = playerWins ? user : opponentData
        let loser = playerWins ? opponentData : user

        winner.money += betAmount
        loser.money -= betAmount

        let opponentName = await conn.getName(opponent)
        let caption = `❏  *F I G H T*\n\n`
        caption += `Lawan Anda Adalah: ${opponentName}\n`
        caption += `Level Anda: [${userLevel}] — Lawan: [${opponentLevel}]\n\n`

        if (playerWins) {
          caption += `*Menang!*, ${alasanMenang}, +${betAmount} Money\n`
          caption += `Uang Anda saat ini: ${user.money}\n`
          conn.sendFile(m.chat, 'https://telegra.ph/file/e3d5059b970d60bc438ac.jpg', 'You_Win.jpg', caption, m)
        } else {
          caption += `*Kalah!*, ${alasanKalah}, -${betAmount} Money\n`
          caption += `Uang Anda saat ini: ${user.money}\n`
          conn.sendFile(m.chat, 'https://telegra.ph/file/86b2dc906fb444b8bb6f7.jpg', 'You_Lose.jpg', caption, m)
        }

        user.lastWar = new Date()

      }, 2000)
    }, 2000)
  }, 2000)
}

handler.help = ['bertarung @user', 'fight @user']
handler.tags = ['game']
handler.command = /^(fight|bertarung)$/i
handler.group = true
export default handler

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}