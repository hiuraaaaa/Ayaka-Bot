/*
ubed bot
*/

let handler = async (m, { conn, args, usedPrefix }) => {
  if (args.length < 2) return m.reply('❌ Format salah. Gunakan: .rating <bintang 1-5>|<ulasan>')

  let [rating, ...review] = args.join(' ').split('|')
  review = review.join(' ').trim()

  // Validasi rating
  if (!rating || isNaN(rating) || rating < 1 || rating > 5) {
    return m.reply('❌ Rating harus antara 1 hingga 5!')
  }

  // Menyimpan voting dan ulasan
  const user = m.sender
  if (!global.db.data.voting) global.db.data.voting = {}  // Pastikan voting terdefinisi
  global.db.data.voting[user] = { rating: parseInt(rating), review }

  m.reply(`✅ Terima kasih atas voting dan ulasan kamu! Rating: ${rating} ⭐\nUlasan: ${review}`)
}

handler.help = ['rating <rating> | <ulasan>']
handler.tags = ['tools']
handler.command = /^rating$/i

export default handler