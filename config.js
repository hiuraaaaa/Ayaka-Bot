import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import moment from 'moment-timezone'
import { group } from 'console'
import PhoneNumber from 'awesome-phonenumber'

/*============= WAKTU =============*/
let wibh = moment.tz('Asia/Jakarta').format('HH')
let wibm = moment.tz('Asia/Jakarta').format('mm')
let wibs = moment.tz('Asia/Jakarta').format('ss')
let wktuwib = `${wibh} H ${wibm} M ${wibs} S`

let d = new Date(new Date + 3600000)
let locale = 'id'
let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
let week = d.toLocaleDateString(locale, { weekday: 'long' })
let date = d.toLocaleDateString(locale, {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
})
const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

// Owner
global.owner = [
['6283821920285'],
['6283821920285', 'Hiura', true],
]
// cek lid mu pake .getlid
global.ownerLid = [
  ['216437025165553', 'Hiura', true], // Owner via LID
]

// ingat ini id gc kosongan, untuk mengirim log error! 
global.logerror = "120363407099549098@g.us"

global.mods = ['']
global.prems = []
// Info
global.nomorwa = '6283821920285'
global.packname = '© Lumina-Md'
global.author = 'Hiura'
global.waktuSholat = {
     subuh: '04:39',
     dhuhur: '11:54',
     ashar: '15:12',
     maghrib: '17:53',
     isya: '19:23',
}
global.pairing = 'LUMINAMD'
global.namebot = 'Lumina-Md'
global.botNumber = '62882006639544'
global.wm = '© Hiura'
global.stickpack = '© Hiura 🥪'
global.stickauth = 'Lumina-Md'
global.fotonya = 'https://raw.githubusercontent.com/hiuraaaaa/media/main/banner.jpg'
global.fotonya2 = `https://raw.githubusercontent.com/hiuraaaaa/media/main/banner.jpg`
global.thumbmenu = 'https://raw.githubusercontent.com/hiuraaaaa/media/main/banner.jpg'
global.tfitur = 'https://raw.githubusercontent.com/hiuraaaaa/media/main/banner.jpg'
global.premv2 = 'https://raw.githubusercontent.com/hiuraaaaa/media/main/banner.jpg'
global.yae22 = 'https://raw.githubusercontent.com/hiuraaaaa/media/main/banner.jpg'
// Link Sosmed
global.sesiId = '19RUq6mJA4En2cfdPXjnl8t4YBSSCIWCiQK4YMsnrIg'
global.sig = 'https://github.com/hiuraaaaa'
global.syt = 'Ga Punya Yete'
global.sgh = 'https://github.com/hiuraaaaa'
global.sgc = 'me.luminaa.web.id'
global.myweb = 'me.luminaa.web.id'
global.nisajpg = 'https://raw.githubusercontent.com/RIJALGANZZZ/dat1/main/uploads/1ab18d12.jpg'
global.bio = 'https://raw.githubusercontent.com/RIJALGANZZZ/dat1/main/uploads/1ab18d12.jpg'
global.youtube = 'AIzaSyDIYncRwLjGqDjwWbsREwJ0BFXUfBeR6wE'
global.sanka = 'planaai'
global.maelyn = '-'
global.faa = 'https://api-faa.my.id'

// Panel
global.domain = 'https://lannofc.prvt-panel.my.id' // Domain Web
global.apikey = 'ptla_cb0J5wYMGh1s7IRcTBFwyIOOt3RWpeoDMPtato4gj6W' // Key PTLA
global.capikey = 'ptlc_5Bl56lorWYbXq5MYoTG3rmqZEaUCoM4tIgURK4A2SY8' // Key PTLC
global.egg = '15'
global.nestid = "5" // Isi id nest
global.loc = '1'

// Donasi
global.pgopay = '083870750111'
global.pdana = '083870750111'
// Info Wait
global.wait = '⏳ *ᴘ ʟ ᴇ ᴀ s ᴇ  ᴡ ᴀ ɪ ᴛ...*'
global.eror = '🤖 *Information Bot*\n> Mohon maaf atas ketidaknyamanan dalam menggunakan *Furina-Md.* Ada kesalahan dalam sistem saat menjalankan perintah, silahkan hubungi owner agar cepat di perbaiki.'
global.multiplier = 69
global.diskonprem = 'true'
global.diskoncash = 'true'
global.payprem = 'open'
global.paycash = 'open'
global.listdiskon = 'bulanin'
global.flok = {
	"key": {
        "participant": '0@s.whatsapp.net',
            "remoteJid": "status@broadcast",
		    "fromMe": false,
		    "id": "Halo"
                        },
       "message": {
                    "locationMessage": {
                    "name": `Lumina-Md ✨`,
                    "jpegThumbnail": ''
                          }
                        }
                      }
global.rpg = {
  emoticon(string) {
    string = string.toLowerCase()
    let emot = {
      agility: '🤸‍♂️',
      arc: '🏹',
      armor: '🥼',
      bank: '🏦',
      bibitanggur: '🍇',
      bibitapel: '🍎',
      bibitjeruk: '🍊',
      bibitmangga: '🥭',
      bibitpisang: '🍌',
      bow: '🏹',
      bull: '🐃',
      cat: '🐈',
      chicken: '🐓',
      common: '📦',
      cow: '🐄',
      crystal: '🔮',
      darkcrystal: '♠️',
      diamond: '💎',
      dog: '🐕',
      dragon: '🐉',
      elephant: '🐘',
      emerald: '💚',
      exp: '✉️',
      fishingrod: '🎣',
      fox: '🦊',
      gems: '🍀',
      giraffe: '🦒',
      gold: '👑',
      health: '❤️',
      horse: '🐎',
      intelligence: '🧠',
      iron: '⛓️',
      keygold: '🔑',
      keyiron: '🗝️',
      knife: '🔪',
      legendary: '🗃️',
      level: '🧬',
      limit: '🌌',
      lion: '🦁',
      magicwand: '⚕️',
      mana: '🪄',
      money: '💵',
      mythic: '🗳️',
      pet: '🎁',
      petFood: '🍖',
      pickaxe: '⛏️',
      pointxp: '📧',
      potion: '🥤',
      rock: '🪨',
      snake: '🐍',
      stamina: '⚡',
      strength: '🦹‍♀️',
      string: '🕸️',
      superior: '💼',
      sword: '⚔️',
      tiger: '🐅',
      trash: '🗑',
      uncommon: '🎁',
      upgrader: '🧰',
      wood: '🪵'
    }
    let results = Object.keys(emot).map(v => [v, new RegExp(v, 'gi')]).filter(v => v[1].test(string))
    if (!results.length) return ''
    else return emot[results[0][0]]
  }
}
// Apikey
//global.skizo = "Sayangibu1",
global.skizo = "AnisaDevYae",
global.lann = "AnisaOfc",
global.lol = "de4youyt",
global.btc = "AnisaDevYae",
global.cookie = "g.a000kAgeOL-c8fcR_Fn_73TKInEppEhjELmu-tdSlQvE8bWoqOdV_glwjA8xx6ugKI5P2UiW3wACgYKAU4SARASFQHGX2MicBDFOErs68Lkm15Zg0lRsxoVAUF8yKpG3SIE-Xntf21rgM4NN1QJ0076",

global.APIs = {
    skizo: "https://skizoasia.xyz",
    xyro: "https://api.xyroinee.xyz",
    maelyn: 'https://api.maelyn.sbs',
    popcat : 'https://api.popcat.xyz'
}
/*Apikey*/
global.APIKeys = {
    "https://api.xyroinee.xyz": "AnisaOfc",
}
global.api = {
  xterm: {
    url: "https://api.termai.cc",
    key: "anisa"
  }
}

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})
