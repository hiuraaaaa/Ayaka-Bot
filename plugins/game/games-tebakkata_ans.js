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
    if (!/ketik.*teka/i.test(qtext)) return true
    if (/hint|teka/i.test(mtext)) return true

    this.tebakkata = this.tebakkata || {}

    if (!(id in this.tebakkata))
      return conn.reply(m.chat, '❗ Soal itu telah berakhir', m)

    const [msg, json, exp, timeout] = this.tebakkata[id]
    const quotedId = q.key?.id || q.id
    const questionId = msg.key?.id || msg.id
    
    if (quotedId !== questionId) return true

    const answer = json.jawaban.toLowerCase().trim()
    const text = m.text.toLowerCase().trim()

    if (text === answer) {
      global.db.data.users[m.sender].exp += exp
      conn.reply(m.chat, `*🎉 Benar!*\n\n💥 +${exp} XP`, m)
      clearTimeout(timeout)
      delete this.tebakkata[id]
    } else if (similarity(text, answer) >= threshold) {
      m.reply('*💢 Dikit lagi!*')
    } else {
      m.reply('*🚫 Salah!*')
    }
  } catch (e) {
    console.error('❌ Error in tebakkata:', e)
  }
  return true
}

export const exp = 0