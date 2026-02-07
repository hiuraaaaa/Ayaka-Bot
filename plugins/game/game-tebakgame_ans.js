import similarity from 'similarity'
const threshold = 0.72

export async function before(m, { conn }) {
  try {
    const id = m.chat
    const q = m.quoted
    if (!q) return true
    const fromBot = q.fromMe || (q.key && q.key.fromMe)
    if (!fromBot) return true
    const qtext = (q.text || q.caption || '').toLowerCase()
    const mtext = (m.text || '').toLowerCase()
    if (!/ketik.*hgame/i.test(qtext)) return true
    if (/hgame/i.test(mtext)) return true
    this.tebakgame = this.tebakgame || {}
    if (!(id in this.tebakgame))
      return conn.reply(m.chat, '❗ Soal itu telah berakhir', m)
    const [msg, json, exp, timeout] = this.tebakgame[id]
    const quotedId = q.key?.id || q.id
    const questionId = msg.key?.id || msg.id
    if (quotedId !== questionId) return true
    const text = m.text.toLowerCase().trim()
    const answer = json.jawaban.toLowerCase().trim()
    const isSurrender = /^((me)?nyerah|surr?ender)$/i.test(text)
    if (isSurrender) {
      clearTimeout(timeout)
      delete this.tebakgame[id]
      return conn.reply(m.chat, '*😔 Yah Menyerah!*', m)
    }
    if (text === answer) {
      global.db.data.users[m.sender].exp += exp
      conn.reply(m.chat, `*🎉 Benar!*\n💥 +${exp} XP`, m)
      clearTimeout(timeout)
      delete this.tebakgame[id]
    } else if (similarity(text, answer) >= threshold) {
      m.reply('*💢 Dikit lagi!*')
    } else {
      conn.reply(m.chat, '*🚫 Salah!*', m)
    }
  } catch (e) {
    console.error('❌ Error in tebakgame:', e)
  }
  return true
}

export const exp = 0