let handler = async (m, { conn, usedPrefix }) => {
const fkontak = {
	"key": {
    "participants":"0@s.whatsapp.net",
		"remoteJid": "status@broadcast",
		"fromMe": false,
		"id": "Halo"
	},
	"message": {
		"contactMessage": {
			"vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
		}
	},
	"participant": "0@s.whatsapp.net"
}
let health = global.db.data.users[m.sender].health
let user = global.db.data.users[m.sender]
let healt = global.db.data.users[m.sender].healt
let bararmor = global.db.data.users[m.sender].bararmor
let barsword = global.db.data.users[m.sender].barsword
let leather = global.db.data.users[m.sender].leather
let roket = global.db.data.users[m.sender].roket
let totalb = global.db.data.users[m.sender].totalb
let aerozine = global.db.data.users[m.sender].aerozine
    let armor = global.db.data.users[m.sender].armor
    let armordura = global.db.data.users[m.sender].armordurability
    let pancing = global.db.data.users[m.sender].pancingan
    let pancidura = global.db.data.users[m.sender].pancingandurability 
   // let warn = global.db.data.users[m.sender].warn
    let pet = global.db.data.users[m.sender].pet
    let sarung = global.db.data.users[m.sender].glovesuse
    let sepatu = global.db.data.users[m.sender].sepatuuse
    let topi = global.db.data.users[m.sender].magichatsuse
    let kucing = global.db.data.users[m.sender].kucing
    let _kucing = global.db.data.users[m.sender].anakkucing
    let stamina = global.db.data.users[m.sender].stamina
    let rubah = global.db.data.users[m.sender].rubah
    let _rubah = global.db.data.users[m.sender].anakrubah
    let serigala = global.db.data.users[m.sender].serigala
    let _serigala = global.db.data.users[m.sender].anakserigala
    let naga = global.db.data.users[m.sender].naga
    let _naga = global.db.data.users[m.sender].anaknaga
    let coal = global.db.data.users[m.sender].coal
    let kuda = global.db.data.users[m.sender].kuda
    let _kuda = global.db.data.users[m.sender].anakkuda
    let phonix = global.db.data.users[m.sender].phonix
    let _phonix = global.db.data.users[m.sender].anakphonix
    let griffin = global.db.data.users[m.sender].griffin
    let _griffin = global.db.data.users[m.sender].anakgriffin
    let kyubi = global.db.data.users[m.sender].kyubi
    let _kyubi = global.db.data.users[m.sender].anakkyubi
    let centaur = global.db.data.users[m.sender].centaur
    let _centaur = global.db.data.users[m.sender].anakcentaur
    let diamond = global.db.data.users[m.sender].diamond
    let sniper = global.db.data.users[m.sender].sniper
    let redam = global.db.data.users[m.sender].resultdamage
    let peluru = global.db.data.users[m.sender].peluru
    let potion = global.db.data.users[m.sender].potion
    let ramuan = global.db.data.users[m.sender].ramuan
    let common = global.db.data.users[m.sender].common
    let makananpet = global.db.data.users[m.sender].makananpet
    let makanannaga = global.db.data.users[m.sender].makanannaga
    let makananphonix = global.db.data.users[m.sender].makananphonix
    let makanangriffin = global.db.data.users[m.sender].makanangriffin
    let makanankyubi = global.db.data.users[m.sender].makanankyubi
    let makanancentaur = global.db.data.users[m.sender].makanancentaur
    let uncommon = global.db.data.users[m.sender].uncommon
    let mythic = global.db.data.users[m.sender].mythic
    let legendary = global.db.data.users[m.sender].legendary
    let level = global.db.data.users[m.sender].level
    let money = global.db.data.users[m.sender].money
    let exp = global.db.data.users[m.sender].exp
    let role = global.db.data.users[m.sender].role
    let sampah = global.db.data.users[m.sender].sampah
    let anggur = global.db.data.users[m.sender].anggur
    let jeruk = global.db.data.users[m.sender].jeruk
    let apel = global.db.data.users[m.sender].apel
    let mangga = global.db.data.users[m.sender].mangga
    let pisang = global.db.data.users[m.sender].pisang
    let bibitanggur = global.db.data.users[m.sender].bibitanggur
    let bibitjeruk = global.db.data.users[m.sender].bibitjeruk
    let bibitapel = global.db.data.users[m.sender].bibitapel
    let bibitmangga = global.db.data.users[m.sender].bibitmangga
    let bibitpisang = global.db.data.users[m.sender].bibitpisang 
    let gardenboxs = global.db.data.users[m.sender].gardenboxs
    let nabung = global.db.data.users[m.sender].nabung
    let bank = global.db.data.users[m.sender].bank
    let limit = global.db.data.users[m.sender].limit
    let cupon = global.db.data.users[m.sender].cupon
    let tiketcoin = global.db.data.users[m.sender].tiketcoin
    let tiketm = global.db.data.users[m.sender].healtmonster
    let aqua = global.db.data.users[m.sender].aqua
    let expg = global.db.data.users[m.sender].expg
    let boxs = global.db.data.users[m.sender].boxs
    let botol = global.db.data.users[m.sender].botol
    let kayu = global.db.data.users[m.sender].kayu
    let plastik = global.db.data.users[m.sender].pelastik 
    let batu = global.db.data.users[m.sender].batu
    let iron = global.db.data.users[m.sender].iron
    let sword = global.db.data.users[m.sender].sword
    let sworddura = global.db.data.users[m.sender].sworddurability
    let sworddamage = global.db.data.users[m.sender].sworddamage
    let string = global.db.data.users[m.sender].string
    let kaleng = global.db.data.users[m.sender].kaleng
    let kardus = global.db.data.users[m.sender].kardus
    let berlian = global.db.data.users[m.sender].berlian
    let emas = global.db.data.users[m.sender].emas
    let emaspro = global.db.data.users[m.sender].emasbatang
    let hero = global.db.data.users[m.sender].hero
    let exphero = global.db.data.users[m.sender].exphero
    let fulls = user.fullstamina
    let cash = user.cash
    let who = m.sender
   let pp = await conn.profilePictureUrl(who, 'image').catch(_ => './src/avatar_contact.png')
    let name = m.sender
    let sortedmoney = Object.entries(global.db.data.users).sort((a, b) => b[1].money - a[1].money)
    let sortedlevel = Object.entries(global.db.data.users).sort((a, b) => b[1].level - a[1].level)
    let sorteddiamond = Object.entries(global.db.data.users).sort((a, b) => b[1].diamond - a[1].diamond)
    let sortedpotion = Object.entries(global.db.data.users).sort((a, b) => b[1].potion - a[1].potion)
    let sortedsampah = Object.entries(global.db.data.users).sort((a, b) => b[1].sampah - a[1].sampah)
    let sortedcommon = Object.entries(global.db.data.users).sort((a, b) => b[1].common - a[1].common)
    let sorteduncommon = Object.entries(global.db.data.users).sort((a, b) => b[1].uncommon - a[1].uncommon)
    let sortedmythic = Object.entries(global.db.data.users).sort((a, b) => b[1].mythic - a[1].mythic)
    let sortedlegendary = Object.entries(global.db.data.users).sort((a, b) => b[1].legendary - a[1].legendary)
    let usersmoney = sortedmoney.map(v => v[0])
    let usersdiamond = sorteddiamond.map(v => v[0])
    let userspotion = sortedpotion.map(v => v[0])
    let userssampah = sortedsampah.map(v => v[0])
    let userslevel = sortedlevel.map(v => v[0])
    let userscommon = sortedcommon.map(v => v[0])
    let usersuncommon = sorteduncommon.map(v => v[0])
    let usersmythic = sortedmythic.map(v => v[0])
    let userslegendary = sortedlegendary.map(v => v[0])
    let mentionedJid = [m.sender]
    let str = `
    [ 𝙄 𝙣 𝙫 𝙚 𝙣 𝙩 𝙤 𝙧 𝙮 ]
    
*〔 Condition 〕*
👤 *User :*     @${m.sender.replace(/@.+/, '')}
❤️ *Health :*    ${healt.toLocaleString()} | ${health.toLocaleString()}
🛡️ *Stamina :*    ${stamina.toLocaleString()} | ${fulls.toLocaleString()}
💉 *Potion :*    ${potion.toLocaleString()}
🔮 *Ramuan :*    ${ramuan}
🎣 *Pancingan :*    ${pancing == 0 ? 'Tidak Punya' : '' || pancing == 1 ? 'Equip ✓' : ''}
🎣 *Pancingan Durability :*    ${pancidura}

*〔 Equipment 〕*
🧥 *Armor :*    ${armor == 0 ? 'Tidak punya' : '' || armor == 1 ? 'Leather Armor' : '' || armor == 2 ? 'Padded Armor' : '' || armor == 3 ? 'Studded Leather Armor' : '' || armor == 4 ? 'Chainmail Armor' : '' || armor == 5 ? 'Scale Armor' : '' || armor == 6 ? 'Breastplate' : '' || armor == 7 ? 'Half Plate Armor' : '' || armor == 8 ? 'Full Plate Armor' : '' || armor == 9 ? 'Mithril Armor' : '' || armor == 10 ? 'Adamantine Armor' : '' || armor == 11 ? 'Dragonhide Armor' : '' || armor == 12 ? 'Celestial Armor' : '' || armor == 13 ? 'Demonic Armor' : '' || armor == 14 ? 'Divine Armor' : '' || armor == 15 ? 'Ethereal Armor' : '' || armor == 16 ? 'Elemental Armor' : '' || armor == 17 ? 'Phantom Armor' : '' || armor == 18 ? 'Ancient Armor' : '' || armor == 19 ? 'Legendary Armor' : '' || armor == 20 ? 'Godslayer Armor' : ''}
🦺 *Armor durability :*    ${armordura.toLocaleString()} / ${bararmor.toLocaleString()}
👒 *Topi Sihir :*    ${topi == 0 ? 'Unequip' : '' || topi == 1 ? 'Equip ✓' : ''}
🧤 *Sarung Tangan :*    ${sarung == 0 ? 'Unequip' : '' || sarung == 1 ? 'Equip ✓' : ''}
👞 *Sepatu Sihir :*    ${sepatu == 0 ? 'Unequip' : '' || sepatu == 1 ? 'Equip ✓' : ''}

*〔 Senjata 〕*
⚔️ *Sword :*    ${sword == 0 ? 'Tidak punya' : '' || sword == 1 ? 'Rusty Sword' : '' || sword == 2 ? 'Iron Sword' : '' || sword == 3 ? 'Steel Sword' : '' || sword == 4 ? 'Bronze Sword' : '' || sword == 5 ? 'Silver Sword' : '' || sword == 6 ? 'Golden Sword' : '' || sword == 7 ? 'Elven Sword' : '' || sword == 8 ? 'Dwarven Sword' : '' || sword == 9 ? 'Katana' : '' || sword == 10 ? 'Longsword' : '' || sword == 11 ? 'Claymore' : '' || sword == 12 ? 'Rapier' : '' || sword == 13 ? 'Flame Sword' : '' || sword == 14 ? 'Frost Sword' : '' || sword == 15 ? 'Thunderblade' : '' || sword == 16 ? 'Shadow Sword' : '' || sword == 17 ? 'Lightbringer' : '' || sword == 18 ? 'Bloodthirster' : '' || sword == 19 ? 'Dragonfang' : '' || sword == 20 ? 'Soulreaper' : '' || sword == 21 ? 'Ethereal Blade' : '' || sword == 22 ? 'Mystic Blade' : '' || sword == 23 ? 'Holy Sword' : '' || sword == 24 ? 'Demonic Blade' : '' || sword == 25 ? 'Legendary Sword' : '' || sword == 26 ? 'Excalibur' : '' || sword == 27 ? 'Godslayer' : '' || sword == 28 ? 'Celestial Sword' : '' || sword == 29 ? 'Phantom Blade' : '' || sword == 30 ? 'Ancient Blade' : ''}
🗡️ *Sword durability :*    ${sworddura.toLocaleString()} / ${barsword.toLocaleString()}
💥 *Damage Sword :*    ${sworddamage.toLocaleString()}
💥 *Damage Rslt :*    ${redam.toLocaleString()}
🦯 *Sniper :*    ${sniper == 0 ? 'Tidak Punya' : '' || sniper == 1 ? 'Equip ✓' : ''}
🖍️ *Peluru :*    ${peluru.toLocaleString()}
‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎
*〔 Astronot 〕*
🚀 *Roket:* ${roket == 1 ? 'Equip ✓' : 'Tidak Punya'}
🛢️ *Aerozine:* ${aerozine.toLocaleString()}
👨🏻‍🚀 *Total Berangkat:* ${totalb.toLocaleString()}

*〔 Your Rangking 〕*
🎖️ *Role :*    ${role}
📊 *Level :*    ${level.toLocaleString()}
🧪 *Exp :*    ${exp.toLocaleString()}

*〔 Rekening 〕*
💵 *Money :*    Rp.${money.toLocaleString()}
💳 *Limit :*    ${limit.toLocaleString()}
🏦 *Bank :*    Rp.${bank.toLocaleString()}
💰 *Cash :*    Rp.${cash.toLocaleString()}

*〔 Item 〕*
⚙️ *Iron :*    ${iron.toLocaleString()}
🧶 *String :*     ${string.toLocaleString()}
🪣 *Sampah :*    ${sampah.toLocaleString()}
🪵 *Kayu :*    ${kayu.toLocaleString()}
🪨 *Batu :*    ${batu.toLocaleString()}
🍾 *Aqua :*     ${aqua.toLocaleString()}
🪨 *Coal :*     ${coal.toLocaleString()}
🧣 *Leather:*     ${leather.toLocaleString()}

*〔 Kotak Harta 〕*
📦 *Boxs :*    ${boxs.toLocaleString()}
📦 *Common :*    ${common.toLocaleString()}
📦 *Uncommon :*    ${uncommon.toLocaleString()}
👑 *Mythic :*    ${mythic.toLocaleString()}
💎 *Legendary :*    ${legendary.toLocaleString()}
🐶 *Pet Boxs:*    ${pet.toLocaleString()}
💍 *Gardenboxs :*    ${gardenboxs.toLocaleString()}
💸Tiketm:    *${tiketm.toLocaleString()}*
💰Tiketcoin:    *${tiketcoin.toLocaleString()}*

*〔 Buah-Buahan 〕*
🥭 *Mangga :*    ${mangga.toLocaleString()}
🍇 *Anggur :*    ${anggur.toLocaleString()}
🍌 *Pisang :*    ${pisang.toLocaleString()}
🍊 *Jeruk :*    ${jeruk.toLocaleString()}
🍎 *Apel :*    ${apel.toLocaleString()}

*〔 Bibit Buah 〕*
🥭 *Bibit Mangga :*    ${bibitmangga.toLocaleString()}
🍇 *Bibit Anggur :*    ${bibitanggur.toLocaleString()}
🍌 *Bibit Pisang :*    ${bibitpisang.toLocaleString()}
🍊 *Bibit Jeruk :*    ${bibitjeruk.toLocaleString()}
🍎 *Bibit Apel :*    ${bibitapel.toLocaleString()}

*〔 Sampah 〕*
📦 *Kardus :*    ${kardus.toLocaleString()}
🗑️ *Kaleng :*    ${kaleng.toLocaleString()}
🍾 *Botol :*    ${botol.toLocaleString()}
🥡 *Plastik :*    ${plastik.toLocaleString()}

*〔 Mining Result 〕*
💍 *Berlian :*    ${berlian.toLocaleString()}
🪙 *Emas :*    ${emas.toLocaleString()}
💎 *Diamond :*    ${diamond.toLocaleString()}

*〔 Pet 〕*
🐈 *Kucing :*    ${kucing == 0 ? 'Tidak Punya' : '' || kucing == 1 ? 'Level 1 / Max Level 5' : '' || kucing == 2 ? 'Level 2 / Max Level 5' : '' || kucing == 3 ? 'Level 3 / Max Level 5' : '' || kucing == 4 ? 'Level 4 / Max Level 5' : '' || kucing == 5 ? 'Level MAX' : ''}
🐎 *Kuda :*    ${kuda == 0 ? 'Tidak Punya' : '' || kuda == 1 ? 'Level 1 / Max Level 5' : '' || kuda == 2 ? 'Level 2 / Max Level 5' : '' || kuda == 3 ? 'Level 3 / Max Level 5' : '' || kuda == 4 ? 'Level 4 / Max Level 5' : '' || kuda == 5 ? 'Level MAX' : ''}
🐉 *Naga :*    ${naga == 0 ? 'Tidak Punya' : '' || naga == 1 ? 'Level 1 / Max Level 20' : '' || naga == 2 ? 'Level 2 / Max Level 20' : '' || naga == 3 ? 'Level 3 / Max Level 20' : '' || naga == 4 ? 'Level 4 / Max Level 20' : '' || naga == 5 ? 'Level 5 / Max Level 20' : '' || naga == 6 ? 'Level 6 / Max Level 20' : '' || naga == 7 ? 'Level 7 / Max Level 20' : '' || naga == 8 ? 'Level 8 / Max Level 20' : '' || naga == 9 ? 'Level 9 / Max Level 20' : '' || naga == 10 ? 'Level 10 / Max Level 20' : '' || naga == 11 ? 'Level 11 / Max Level 20' : '' || naga == 12 ? 'Level 12 / Max Level 20' : '' || naga == 13 ? 'Level 13 / Max Level 20' : '' || naga == 14 ? 'Level 14 / Max Level 20' : '' || naga == 15 ? 'Level 15 / Max Level 20' : '' || naga == 16 ? 'Level 16 / Max Level 20' : '' || naga == 17 ? 'Level 17 / Max Level 20' : '' || naga == 18 ? 'Level 18 / Max Level 20' : '' || naga == 19 ? 'Level 19 / Max Level 20' : '' || naga == 20 ? 'Level MAX' : ''}
🦊 *Kyubi :*.    ${kyubi === 0 ? 'Tidak Punya' : kyubi === 1 ? 'Level 1 / Max Level 20' : kyubi === 2 ? 'Level 2 / Max Level 20' : kyubi === 3 ? 'Level 3 / Max Level 20' : kyubi === 4 ? 'Level 4 / Max Level 20' : kyubi === 5 ? 'Level 5 / Max Level 20' : kyubi === 6 ? 'Level 6 / Max Level 20' : kyubi === 7 ? 'Level 7 / Max Level 20' : kyubi === 8 ? 'Level 8 / Max Level 20' : kyubi === 9 ? 'Level 9 / Max Level 20' : kyubi === 10 ? 'Level 10 / Max Level 20' : kyubi === 11 ? 'Level 11 / Max Level 20' : kyubi === 12 ? 'Level 12 / Max Level 20' : kyubi === 13 ? 'Level 13 / Max Level 20' : kyubi === 14 ? 'Level 14 / Max Level 20' : kyubi === 15 ? 'Level 15 / Max Level 20' : kyubi === 16 ? 'Level 16 / Max Level 20' : kyubi === 17 ? 'Level 17 / Max Level 20' : kyubi === 18 ? 'Level 18 / Max Level 20' : kyubi === 19 ? 'Level 19 / Max Level 20' : kyubi === 20 ? 'Level MAX' : ''}
🦖 *Centaur :*    ${centaur == 0 ? 'Tidak Punya' : '' || centaur == 1 ? 'Level 1 / Max Level 20' : '' || centaur == 2 ? 'Level 2 / Max Level 20' : '' || centaur == 3 ? 'Level 3 / Max Level 20' : '' || centaur == 4 ? 'Level 4 / Max Level 20' : '' || centaur == 5 ? 'Level 5 / Max Level 20' : '' || centaur == 6 ? 'Level 6 / Max Level 20' : '' || centaur == 7 ? 'Level 7 / Max Level 20' : '' || centaur == 8 ? 'Level 8 / Max Level 20' : '' || centaur == 9 ? 'Level 9 / Max Level 20' : '' || centaur == 10 ? 'Level 10 / Max Level 20' : '' || centaur == 11 ? 'Level 11 / Max Level 20' : '' || centaur == 12 ? 'Level 12 / Max Level 20' : '' || centaur == 13 ? 'Level 13 / Max Level 20' : '' || centaur == 14 ? 'Level 14 / Max Level 20' : '' || centaur == 15 ? 'Level 15 / Max Level 20' : '' || centaur == 16 ? 'Level 16 / Max Level 20' : '' || centaur == 17 ? 'Level 17 / Max Level 20' : '' || centaur == 18 ? 'Level 18 / Max Level 20' : '' || centaur == 19 ? 'Level 19 / Max Level 20' : '' || centaur == 20 ? 'Level MAX' : ''}
🦊 *Rubah :*    ${rubah == 0 ? 'Tidak Punya' : '' || rubah == 1 ? 'Level 1 / Max Level 5' : '' || rubah == 2 ? 'Level 2 / Max Level 5' : '' || rubah == 3 ? 'Level 3 / Max Level 5' : '' || rubah == 4 ? 'Level 4 / Max Level 5' : '' || rubah == 5 ? 'Level MAX' : ''}
🕊️ *Phonix :*    ${phonix == 0 ? 'Tidak Punya' : '' || phonix == 1 ? 'Level 1 / Max Level 15' : '' || phonix == 2 ? 'Level 2 / Max Level 15' : '' || phonix == 3 ? 'Level 3 / Max Level 15' : '' || phonix == 4 ? 'Level 4 / Max Level 15' : '' || phonix == 5 ? 'Level 5 / Max Level 15' : '' || phonix == 6 ? 'Level 6 / Max Level 15' : '' || phonix == 7 ? 'Level 7 / Max Level 15' : '' || phonix == 8 ? 'Level 8 / Max Level 15' : '' || phonix == 9 ? 'Level 9 / Max Level 15' : '' || phonix == 10 ? 'Level 10 / Max Level 15' : '' || phonix == 11 ? 'Level 11 / Max Level 15' : '' || phonix == 12 ? 'Level 12 / Max Level 15' : '' || phonix == 13 ? 'Level 13 / Max Level 15' : '' || phonix == 14 ? 'Level 14 / Max Level 15' : '' || phonix == 15 ? 'Level MAX' : ''}
🦅 *Griffin :*    ${griffin == 0 ? 'Tidak Punya' : '' || griffin == 1 ? 'Level 1 / Max Level 15' : '' || griffin == 2 ? 'Level 2 / Max Level 15' : '' || griffin == 3 ? 'Level 3 / Max Level 15' : '' || griffin == 4 ? 'Level 4 / Max Level 15' : '' || griffin == 5 ? 'Level 5 / Max Level 15' : '' || griffin == 6 ? 'Level 6 / Max Level 15' : '' || griffin == 7 ? 'Level 7 / Max Level 15' : '' || griffin == 8 ? 'Level 8 / Max Level 15' : '' || griffin == 9 ? 'Level 9 / Max Level 15' : '' || griffin == 10 ? 'Level 10 / Max Level 15' : '' || griffin == 11 ? 'Level 11 / Max Level 15' : '' || griffin == 12 ? 'Level 12 / Max Level 15' : '' || griffin == 13 ? 'Level 13 / Max Level 15' : '' || griffin == 14 ? 'Level 14 / Max Level 15' : '' || griffin == 15 ? 'Level MAX' : ''}
🐺 *Serigala :*    ${serigala == 0 ? 'Tidak Punya' : '' || serigala == 1 ? 'Level 1 / Max Level 15' : '' || serigala == 2 ? 'Level 2 / Max Level 15' : '' || serigala == 3 ? 'Level 3 / Max Level 15' : '' || serigala == 4 ? 'Level 4 / Max Level 15' : '' || serigala == 5 ? 'Level 5 / Max Level 15' : '' || serigala == 6 ? 'Level 6 / Max Level 15' : '' || serigala == 7 ? 'Level 7 / Max Level 15' : '' || serigala == 8 ? 'Level 8 / Max Level 15' : '' || serigala == 9 ? 'Level 9 / Max Level 15' : '' || serigala == 10 ? 'Level 10 / Max Level 15' : '' || serigala == 11 ? 'Level 11 / Max Level 15' : '' || serigala == 12 ? 'Level 12 / Max Level 15' : '' || serigala == 13 ? 'Level 13 / Max Level 15' : '' || serigala == 14 ? 'Level 14 / Max Level 15' : '' || serigala == 15 ? 'Level MAX' : ''}
`.trim()
conn.sendMessage(m.chat, {
    text: str, 
    contextInfo: {
    mentionedJid,
    externalAdReply :{
    mediaUrl: '', 
    mediaType: 1,
    title: 'Y o u  I n v e n t o r y',
    body: `${await conn.getName(name)}`, 
    thumbnailUrl: 'https://telegra.ph/file/8915442b3e2e1a82a8100.jpg', 
    sourceUrl: 'https://www.instagram.com/mycyll.7',
    renderLargerThumbnail: true, 
    showAdAttribution: false
    }}}, { quoted: flok})
    }
handler.help = ['inv']
handler.tags = ['rpg']
handler.command = /^(inv|inventory)$/i
handler.register = true
handler.limit = false
handler.group = false
export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)