import similarity from 'similarity'
const threshold = 0.72

export async function before(m, { conn }) {
  try {
    const id = 'tebakbendera-' + m.chat
    const q = m.quoted
    if (!q) return true
    const fromBot = q.fromMe || (q.key && q.key.fromMe)
    if (!fromBot) return true
    const qtext = (q.text || q.caption || '').toLowerCase()
    const mtext = (m.text || '').toLowerCase()
    if (!/ketik.*teben/i.test(qtext)) return true
    if (/teben/i.test(mtext)) return true
    this.game = this.game || {}
    if (!(id in this.game))
      return m.reply('❗ Soal itu telah berakhir')
    const [msg, json, exp, timeout] = this.game[id]
    const quotedId = q.key?.id || q.id
    const questionId = msg.key?.id || msg.id
    if (quotedId !== questionId) return true
    const text = m.text.toLowerCase().trim()
    const answer = json.name.toLowerCase().trim()
    const isSurrender = /^((me)?nyerah|surr?ender)$/i.test(text)
    if (isSurrender) {
      clearTimeout(timeout)
      delete this.game[id]
      return m.reply('*Yah Menyerah :( !*')
    }
    if (text === answer) {
      global.db.data.users[m.sender].exp += exp
      m.reply(`*🎉 Benar!*\n💥 +${exp} XP`)
      clearTimeout(timeout)
      delete this.game[id]
    } else if (similarity(text, answer) >= threshold) {
      m.reply('*💢 Dikit lagi!*')
    } else {
      m.reply('*🚫 Salah!*')
    }
  } catch (e) {
    console.error('❌ Error in tebakbendera:', e)
  }
  return true
}

export const exp = 0