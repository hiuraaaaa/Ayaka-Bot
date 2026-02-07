let { MessageType } = (await import('@adiwajshing/baileys')).default
let handler = async (m, { conn }) => {

let pancing = global.db.data.users[m.sender].pancingan
let pancidura = global.db.data.users[m.sender].pancingandurability
let umpan = global.db.data.users[m.sender].umpan
let name = global.db.data.users[m.sender].name
let level = global.db.data.users[m.sender].level
let exp = global.db.data.users[m.sender].exp
let paus = global.db.data.users[m.sender].paus
let kepiting = global.db.data.users[m.sender].kepiting
let gurita = global.db.data.users[m.sender].gurita
let cumi = global.db.data.users[m.sender].cumi
let nila = global.db.data.users[m.sender].nila
let lele = global.db.data.users[m.sender].lele
let bawal = global.db.data.users[m.sender].bawal
let buntal = global.db.data.users[m.sender].buntal
let dory = global.db.data.users[m.sender].dory
let lumba = global.db.data.users[m.sender].lumba
let lobster = global.db.data.users[m.sender].lobster
let hiu = global.db.data.users[m.sender].hiu
let udang = global.db.data.users[m.sender].udang
let ikan = global.db.data.users[m.sender].ikan
let orca = global.db.data.users[m.sender].orca
let mentionedJid = [m.sender]
let past = `*—「 KOLAM  」—*
  
*📇 Pemilik :* @${m.sender.replace(/@.+/, '')}
*🎣 Pancingan :* ${pancing}
*🎣 Durability :* ${pancidura}
*🍚 Umpan :* ${umpan} 
*📊 Level :* ${level}
*🧪 Exp :* ${exp}

━─┈────────┈─━
*Kolam Kecil*

🐟 *Ikan :* ${ikan}
🐟 *Nila :* ${nila}
🐟 *Lele :* ${lele}
🐟 *Bawal :* ${bawal}
🐡 *Buntal :* ${buntal}
🐠 *Ocra :* ${orca}
🐠 *Dory :* ${dory}

━─┈────────┈─━
*Kolam Besar*

🦈 *Hiu :* ${hiu}
🐋 *Paus :* ${paus}
🐬 *Lumba Lumba:* ${lumba}

━─┈────────┈─━
*Kolam Lainnya*

🐙 *Gurita :* ${gurita}
🦞 *Lobster :* ${lobster}
🦀 *Kepiting :* ${kepiting}
🦐 *Udang :* ${udang}
🦑 *Cumi :* ${cumi}

*Jual ikan kini di (.shopfish/tokoikan) bukan di pasar lagi*
`.trim()
  conn.reply(m.chat, past, flok, {contextInfo: { mentionedJid }})
  }
  handler.help = ['kolam']
  handler.tags = ['rpg']
  handler.command = /^(kotak(ikan)?|kolam(ikan)?)$/i
  handler.group = true
export default handler 

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)