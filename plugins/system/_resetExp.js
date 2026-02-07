let handler = async (m, { conn, args }) => {
	let list = Object.entries(global.db.data.users)
	list.map(([user, data], i) => (Number(data.exp = 0)))
	list.map(([user, data], i) => (Number(data.level = 0)))
		conn.reply(m.chat, `*Berhasil direset*`, m)
}
handler.help = ['limit'].map(v => 'reset' + v)
handler.tags = ['owner']
handler.command = /^(resetexp)$/i

handler.owner = true
export default handler 

function isNumber(x = 0) {
  x = parseInt(x)
  return !isNaN(x) && typeof x == 'number'
}