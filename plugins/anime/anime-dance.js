import fetch from 'node-fetch'


let handler = async (m, { conn, command }) => {
	let china = 'https://xiranimg.com/api.php?type=dyxjj'
	conn.sendMessage(m.chat, { video: { url: china }, caption: 'Tiktok dance cute~~🦊🐾 ' }, m)
}


handler.command = /^(dance|randomdance)$/i
handler.tags = ['anime']
handler.help = ['randomdance']


export default handler