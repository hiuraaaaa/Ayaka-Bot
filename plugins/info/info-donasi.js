let handler = async (m, { conn }) => {
let fotonya = 'https://telegra.ph/file/4e14c7ffc11e17183e4e3.png'
let sewa = ` Haii 👋🏻 do you want to donate? Please choose payment below, sis, I hope that by donating, we will be more enthusiastic!

▧「 *P E M B A Y A R A N* 」

*🎗️ E-Walet*
• Dana = 085794161086
• Gopay = 085794161086



Thank you to those who have donated to our owner, I hope you are always healthy ❤️
`
conn.sendFile(m.chat, fotonya, 'anu.jpg', sewa, flok)
}
handler.help = ['donasi']
handler.tags = ['main']
handler.command = /^(donasi|donate)$/i

export default handler