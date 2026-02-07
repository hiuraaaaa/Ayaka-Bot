import fetch from 'node-fetch'

const timeout = 60000 // 60 detik
const rewardMoney = 10000
const rewardExp = 5000

let handler = async (m, { conn }) => {
  try {
    const res = await fetch('https://api.siputzx.my.id/api/games/karakter-freefire')
    const json = await res.json()
    if (!json.status || !json.data?.name) throw 'Data karakter tidak ditemukan.'

    const karakter = json.data
    const nama = karakter.name.toLowerCase()

    conn.tebakff = conn.tebakff || {}
    conn.tebakff[m.chat] = {
      jawab: nama,
      timeout: setTimeout(() => {
        m.reply(`⏰ Waktu habis!\nJawabannya adalah *${karakter.name}*`)
        delete conn.tebakff[m.chat]
      }, timeout)
    }

    await conn.sendMessage(m.chat, {
      image: { url: karakter.gambar },
      caption: `*Tebak Karakter Free Fire!*\n\nBalas dengan nama karakternya dari gambar di atas.\n(Waktu: 60 detik)`
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    m.reply('⚠️ Gagal memulai game tebak karakter.')
  }
}

handler.before = async function (m, { conn }) {
  conn.tebakff = conn.tebakff || {}
  if (m.chat in conn.tebakff) {
    const jawaban = conn.tebakff[m.chat].jawab
    const user = global.db.data.users[m.sender]
    if (m.text.toLowerCase() === jawaban) {
      clearTimeout(conn.tebakff[m.chat].timeout)
      delete conn.tebakff[m.chat]
      user.money += rewardMoney
      user.exp += rewardExp
      m.reply(`🎉 *Benar!* Jawabannya adalah *${jawaban}*\n\n💰 +${rewardMoney} money\n💎 +${rewardExp} exp`)
    } else {
      m.reply(`❌ *Salah!* Coba lagi.\nClue: Nama terdiri dari *${jawaban.length}* huruf.`)
    }
    return true
  }
}

handler.command = /^tebakff$/i
handler.tags = ['game']
handler.help = ['tebakff']

export default handler