import fetch from 'node-fetch'
let handler = async (m, { conn, args, text, command, usedPrefix, isCreator, isPrems }) => {
  if (!text) return m.reply(`Example: ${usedPrefix}${command} Lann4youOffc`)
	conn.sendMessage(m.chat, {
		react: {
			text: '🕒',
			key: m.key,
		}
	})
  let res = `https://api.lolhuman.xyz/api/ephoto1/${command}?apikey=${global.lol}&text=${text}`
  conn.sendFile(m.chat, res, 'goldplaybutton.jpg', '```Success...\nDont forget to donate```', m, false)
}
handler.help = ['snow3d','anonymhacker','avatarlolnew','beautifulflower','birthdaycake','birthdayday','cartoongravity','codwarzone','cutegravity','fpslogo','freefire','galaxybat','galaxystyle','galaxywallpaper','glittergold','greenbush','greenneon','heartshaped','hologram3d','lighttext','logogaming','lolbanner','luxurygold','metallogo','multicolor3d','noeltext','pubgmaskot','royaltext','silverplaybutton','starsnight','textbyname','textcake','watercolor','wetglass','wooden3d'].map(v => v + ' <text>')
handler.tags = ['maker']
handler.command = /^(snow3d|anonymhacker|avatarlolnew|beautifulflower|birthdaycake|birthdayday|cartoongravity|fpslogo|freefire|galaxybat|galaxystyle|galaxywallpaper|glittergold|greenbush|greenneon|heartshaped|hologram3d|lighttext|logogaming|lolbanner|luxurygold|metallogo|multicolor3d|noeltext|pubgmaskot|royaltext|silverplaybutton|starsnight|textbyname|textcake|watercolor|wetglass|wooden3d)$/i
handler.limit = true

export default handler