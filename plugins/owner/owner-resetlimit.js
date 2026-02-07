let handler = async (m, { conn, args }) => {
	let list = Object.entries(global.db.data.users)
	list.map(([user, data], i) => (Number(data.limit = 100)))
		conn.reply(m.chat, `*Berhasil Direset*`, m)
}

handler.command = /^(resetlimit)$/i

handler.owner = true
export default handler 

function isNumber(x = 0) {
  x = parseInt(x)
  return !isNaN(x) && typeof x == 'number'
}