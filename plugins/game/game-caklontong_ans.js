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
    if (!/ketik.*calo/i.test(qtext)) return true
    if (/(calo|bantuan)/i.test(mtext)) return true
    this.caklontong = this.caklontong || {}
    if (!(id in this.caklontong))
      return m.reply('❗ Soal itu telah berakhir')
    const [msg, json, exp, timeout] = this.caklontong[id]
    const quotedId = q.key?.id || q.id
    const questionId = msg.key?.id || msg.id
    if (quotedId !== questionId) return true
    const text = m.text.toLowerCase().trim()
    const answer = json.jawaban.toLowerCase().trim()
    if (text === answer) {
      global.db.data.users[m.sender].exp += exp
      await this.reply(
        m.chat,
        `*🎉 Benar!*\n\nHadiahmu:\n💥 XP: ${exp}\n${json.deskripsi}`,
        m
      )
      clearTimeout(timeout)
      delete this.caklontong[id]
    } else if (similarity(text, answer) >= threshold) {
      m.reply('*💢 Dikit lagi!*')
    } else {
      m.reply('*🚫 Salah!*')
    }
  } catch (e) {
    console.error('❌ Error in caklontong:', e)
  }
  return true
}

export const exp = 0