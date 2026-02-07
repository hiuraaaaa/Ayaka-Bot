let handler = async (m, {text, conn, usedPrefix, command}) => {
try {

if (!text) return conn.reply(m.chat, `Masukan Text!`, m)

conn.sendMessage(m.chat, {react: {text: '⏱️', key: m.key}})

// function json 
let result = (`https://api.tioprm.eu.org/dalle?text=${text}`)

// sending_ file
conn.sendFile(m.chat, result || emror, 'error.jpg', `📣 *Result from ${usedPrefix+command} ${text}*`, m)

conn.sendMessage(m.chat, {react: {text: '📢', key: m.key}})
} catch (e) {
console.log(`${global.eror} : ${e}`)
m.reply(`${global.eror} : ${e}`)
conn.sendMessage(m.chat, {react: {text: '✖️', key: m.key}})

}

}
handler.help = handler.command = ['dalle']
handler.tags = ['ai']
handler.limit = true
handler.register = true

export default handler