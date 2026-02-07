let before = async function (m, { conn }) {
  if (!m.audioMessage) return
  conn.karaoke = conn.karaoke || {}
  if (!conn.karaoke[m.sender]) return

  delete conn.karaoke[m.sender] // hapus flag setelah kirim VN

  const user = global.db.data.users[m.sender]
  const score = Math.floor(Math.random() * 96) + 5 // 5-100

  let reward = 0
  let text = `*Hasil Karaoke*\n\n`
  text += `🎵 Skor Suara: *${score}/100*\n`

  if (score >= 20) {
    reward = Math.floor(Math.random() * (2000000 - 50000 + 1)) + 50000
    user.money = (user.money || 0) + reward
    text += `🎁 Kamu mendapatkan: *Rp ${reward.toLocaleString('id-ID')}*`
  } else {
    text += `❌ Maaf, nilaimu kurang dari 20. Coba lagi ya!`
  }

  await conn.sendMessage(m.chat, { text }, { quoted: m })
}

export { before }