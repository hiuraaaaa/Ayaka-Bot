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
    if (!/ketik.*suska/i.test(qtext)) return true
    this.susunkata = this.susunkata || {}
    if (!(id in this.susunkata))
      return m.reply('❗ Soal itu telah berakhir')
    const [msg, json, exp, timeout] = this.susunkata[id]
    const quotedId = q.key?.id || q.id
    const questionId = msg.key?.id || msg.id
    if (quotedId !== questionId) return true
    const text = m.text.toLowerCase().trim()
    const answer = json.jawaban.toLowerCase().trim()
    if (text === answer) {
      global.db.data.users[m.sender].limit += 1
      global.db.data.users[m.sender].money += 5000
      m.reply(`*🎉 Benar!*\n\nHadiahmu:\n💵 Money +5000\n📦 Limit +1`)
      clearTimeout(timeout)
      delete this.susunkata[id]
    } else if (similarity(text, answer) >= threshold) {
      m.reply('*💢 Dikit lagi!*')
    } else {
      m.reply('*🚫 Salah!*')
    }
  } catch (e) {
    console.error('❌ Error in susunkata:', e)
  }
  return true
}

handler.exp = 0
export default handler