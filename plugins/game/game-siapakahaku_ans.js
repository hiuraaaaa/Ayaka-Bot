import similarity from 'similarity'
const threshold = 0.72
let handler = m => m

handler.before = async function (m, { conn }) {
  try {
    const id = m.chat
    const q = m.quoted
    if (!q) return true
    const fromBot = q.fromMe || (q.key && q.key.fromMe)
    if (!fromBot) return true
    const qtext = (q.text || q.caption || '').toLowerCase()
    const mtext = (m.text || '').toLowerCase()
    if (!/ketik.*(who|hint)/i.test(qtext)) return true
    if (/(who|hint)/i.test(mtext)) return true
    this.siapakahaku = this.siapakahaku || {}
    if (!(id in this.siapakahaku))
      return conn.reply(m.chat, '❗ Soal itu telah berakhir', m)
    const [msg, json, exp, timeout] = this.siapakahaku[id]
    const quotedId = q.key?.id || q.id
    const questionId = msg.key?.id || msg.id
    if (quotedId !== questionId) return true
    const text = m.text.toLowerCase().trim()
    const answer = json.jawaban.toLowerCase().trim()
    if (text === answer) {
      global.db.data.users[m.sender].exp += exp
      conn.reply(m.chat, `*🎉 Benar!*\n💥 +${exp} XP`, m)
      clearTimeout(timeout)
      delete this.siapakahaku[id]
    } else if (similarity(text, answer) >= threshold) {
      m.reply('*💢 Dikit lagi!*')
    } else {
      m.reply('*🚫 Salah!*')
    }
  } catch (e) {
    console.error('❌ Error in siapakahaku:', e)
  }
  return true
}

handler.exp = 0
export default handler