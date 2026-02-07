let toM = a => '@' + a.split('@')[0]

let handler = async (m, { 
conn, usedPrefix, text, participants, groupMetadata
}) => {

    let user = global.db.data.users[m.sender]
    let time = global.db.data.users[m.sender].ngocok + 600000
  if (new Date - global.db.data.users[m.sender].ngocok < 600000) throw `Kamu Sudah Ngocok\nTunggu Selama ${msToTime(time - new Date())} Lagi`
    let pengocok = await conn.getName(m.sender)
    let ps = groupMetadata.participants.map(v => v.id)
    let a = ps.getRandom()
    
    if (user.stamina < 20) return m.reply(`Stamina anda tidak cukup\nharap isi stamina anda dengan *${usedPrefix}makan`)
    
    
    let rndm1 = `${Math.floor(Math.random() * 5)}`
		let rndm2 = `${Math.floor(Math.random() * 10)}`
		let rndm3 = `${Math.floor(Math.random() * 7)}`
		let rndm4 = `${Math.floor(Math.random() * 4)}`
		let rndm5 = `${Math.floor(Math.random() * 200)}`
		let rndm6 = `${Math.floor(Math.random() * 200)}`
		let rndm7 = `${Math.floor(Math.random() * 20)}`
		let rndm8 = `${Math.floor(Math.random() * 100)}`
		let rndm9 = `${Math.floor(Math.random() * 100)}`
.trim()

let ran1 = (rndm1 * 10)
let ran2 = (rndm2 * 10)
let ran3 = (rndm3 * 10)
let ran4 = (rndm4 * 10)
let ran5 = (rndm5 * 10)
let ran6 = (rndm6 * 10)
let ran7 = (rndm7 * 10)
let ran8 = (rndm8 * 10)
let ran9 = (rndm9 * 10)

let hmsil1 = `${ran1}`
let hmsil2 = `${ran2}`
let hmsil3 = `${ran3}`
let hmsil4 = `${ran4}`
let hmsil5 = `${ran5}`
let hmsil6 = `${ran6}`
let hmsil7 = `${ran7}`
let hmsil8 = `${ran8}`
let hmsil9 = `${ran9}`

let jln = `
⬛⬛⬛⬛⬛⬛⬛⬛🚶⬛
⬛⬜⬜⬜⬛⬜⬜⬜⬛⬛
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
🏘️🏘️🏘️🏘️🌳🌳🏘️ 🌳🌳🌳

✔️ ${pengocok} Mencari Target....
`

let jln2 = `
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
⬛⬜⬜⬜⬛⬜⬜⬜⬛🚶
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
🏘️🏘️🏘️🏘️🌳🌳🏘️ 🌳🌳🌳

➕ ${pengocok} Menemukan Target....
`

let jln3 = `
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
⬛⬜⬜⬛⬛⬜⬜⬜⬛⬛
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
🏘️🏘️🏘️🏘️🌳🌳🏘️ 🌳🌳🚶

➕ ${pengocok} Mulai Mengocok Bersama Target....
`

let jln4 = `
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
⬛⬜⬜⬛⬛⬜⬜⬜⬛⬛
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
🏘️🏘️🏘️🏘️🌳🌳🏘️ 🚶

➕ ${pengocok}
💹 Menerima Gaji Ngocok....
`

let hsl = `
*《 Hasil Ngocok ${pengocok} 》*

 *💎 = [ ${hmsil1} ] Diamond*
 *⛓️ = [ ${hmsil2} ] Iron*
 *🪙 = [ ${hmsil3} ] Gold*
 *💚 = [ ${hmsil4} ] Emerald*
 *🪨 = [ ${hmsil5} ] Rock*
 *🌕 = [ ${hmsil6} ] Clay*
 *🕳️ = [ ${hmsil7} ] Coal*
 *🌑 = [ ${hmsil8} ] Sand*
 *✉️ = [ ${hmsil9} ] Exp*
 
 Stamina anda berkurang -20
 *Korban Ngocok:* ${toM(a)}
`

user.diamond += hmsil1
		user.iron += hmsil2
		user.gold += hmsil3
		user.emerald += hmsil4
		user.rock += hmsil5
		user.clay += hmsil6
		user.coal += hmsil7
		user.sand += hmsil8
		user.exp += hmsil9
		user.stamina -= 20
	
setTimeout(() => {
    conn.reply(m.chat, hsl, m, { mentions: conn.parseMention(hsl) })
                     }, 27000) 
               
                     setTimeout(() => {
                     conn.reply(m.chat, jln4, null)
                      }, 25000)
                
                     setTimeout(() => {
                     conn.reply(m.chat, jln3, null)
                     }, 20000) 
                        
                     setTimeout(() => {
                     conn.reply(m.chat, jln2, null)
                     }, 15000) 
                    
                     setTimeout(() => {
                     conn.reply(m.chat, jln, null)
                     }, 10000) 
                     
                     setTimeout(() => {
                     conn.reply(m.chat, `🔍 ${pengocok} Mencari Area ngocok.....`, null)
                     }, 0) 
  global.db.data.users[m.sender].ngocok = new Date * 1
}
handler.help = ['ngocok']
handler.tags = ['rpg']
handler.command = /^(ngocok|mengocok)$/i
handler.group = true
export default handler

function msToTime(duration) {
  var milliseconds = parseInt((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24),
    monthly = Math.floor((duration / (1000 * 60 * 60 * 24)) % 720)

  monthly  = (monthly < 10) ? "0" + monthly : monthly
  hours = (hours < 10) ? "0" + hours : hours
  minutes = (minutes < 10) ? "0" + minutes : minutes
  seconds = (seconds < 10) ? "0" + seconds : seconds

  return monthly + " Hari " +  hours + " Jam " + minutes + " Menit"
}