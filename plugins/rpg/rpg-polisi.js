let handler = async (m, { conn }) => {
    let __timers = (new Date - global.db.data.users[m.sender].lastngojek)
    let _timers = (3600000 - __timers)
    let order = global.db.data.users[m.sender].ojekk
    let timers = clockString(_timers) 
let name = conn.getName(m.sender)
    let user = global.db.data.users[m.sender]
    
     if (new Date - global.db.data.users[m.sender].lastngojek > 3600000) {
let randomaku1 = `${Math.floor(Math.random() * 10)}`
let randomaku2 = `${Math.floor(Math.random() * 10)}`
let randomaku3 = `${Math.floor(Math.random() * 5)}`
let randomaku4 = `${Math.floor(Math.random() * 200000)}`
let randomaku5 = `${Math.floor(Math.random() * 50000)}`

.trim()

let rbrb1 = (randomaku1 * 2)
let rbrb2 = (randomaku2 * 10) 
let rbrb3 = (randomaku3 * 1)
let rbrb4 = (randomaku4 * 1)
let rbrb5 = (randomaku5 * 1)

var zero1 = `${rbrb1}`
var zero2 = `${rbrb2}`
var zero3 = `${rbrb3}`
var zero4 = `${rbrb4}`
var zero5 = `${rbrb5}`

let polis = `👮🏻‍♂️ Kamu berhasil menangkap maling, yang mencuri ${pickRandom(['*Ayam Tetangga*', '*Baju*', '*Sapi*', '*Handphone*', '*Kotak Amal*', '*Di Rumah Mu*', '*Korekmu*', '*Hati kekasihmu*'])},`
var hsl = `${polis}\n\n*Ini Gajimu*
💵 Uang: ${zero4}
🧪 Exp: ${zero5} 

_Teruslah Berbuat Kebaikan.._
`

var dimas5 = `
*Waktunya Cosplay Jadi Polisi Lagi Kak....*
`

global.db.data.users[m.sender].money += rbrb4
global.db.data.users[m.sender].exp += rbrb5
global.db.data.users[m.sender].lastngojek = new Date * 1
                     setTimeout(() => {
                     m.reply(`Yuu Saat Nya Mencari Dan Menangkap Maling, Untuk Keamanan Rakyat..`)
                      }, 3600000)
                      
                     setTimeout(() => {
                     m.reply(hsl)
                     }, 0)
    } else conn.reply(m.chat, `Sepertinya Kamu Sudah Kecapekan Silahkan Istirahat Dulu Sekitar\n${timers}`, m)
}
handler.tags = ['rpg']
handler.help = ['polisi']
handler.command = /^(polisi)$/i
handler.register = true
handler.group = true
export default handler

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}


function clockString(ms) {
  let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000)
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return ['\n' + d, ' *Hari*\n ', h, ' *Jam*\n ', m, ' *Menit*\n ', s, ' *Detik* '].map(v => v.toString().padStart(2, 0)).join('')
}