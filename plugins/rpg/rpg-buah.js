let handler = async (m, {
	conn,
	usedPrefix
}) => {
	let jeruk = global.db.data.users[m.sender].jeruk
	let apel = global.db.data.users[m.sender].apel
	let anggur = global.db.data.users[m.sender].anggur
	let pisang = global.db.data.users[m.sender].pisang
	let mangga = global.db.data.users[m.sender].mangga
	let mentionedJid = [m.sender]

	let nuy = `List Buah"an 
	👤 @${m.sender.replace(/@.+/, '')}
    
•🍌 *Pisang:* ${pisang}
•🥭 *Mangga:* ${mangga}
•🍊 *Jeruk:* ${jeruk}
•🍎 *Apel:* ${apel}
•🍇 *Anggur:* ${anggur}
 `.trim()
    
	conn.reply(m.chat, nuy, flok, {contextInfo: { mentionedJid }})

}
handler.help = ['buah']
handler.tags = ['rpg']
handler.command = /^(buah)$/i

export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)