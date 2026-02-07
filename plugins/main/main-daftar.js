import { createHash } from 'crypto'
import fetch from 'node-fetch'
import moment from 'moment-timezone'
import fs from 'fs'
let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i

let handler = async function (m, { text, usedPrefix, command }) {
    function pickRandom(list) {
        return list[Math.floor(Math.random() * list.length)]
    }
    let namae = conn.getName(m.sender)
    let d = new Date(new Date + 3600000)
    let locale = 'id'
    let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
    let week = d.toLocaleDateString(locale, {
        weekday: 'long'
    })
    let date = d.toLocaleDateString(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
    let wibh = moment.tz('Asia/Jakarta').format('HH')
    let wibm = moment.tz('Asia/Jakarta').format('mm')
    let wibs = moment.tz('Asia/Jakarta').format('ss')
    let wktuwib = `${wibh} H ${wibm} M ${wibs} S`
    let pp = await conn.profilePictureUrl(m.sender, 'image').catch(_ => 'https://i.ibb.co/2WzLyGk/profile.jpg')
    let user = global.db.data.users[m.sender]
    if (user.registered === true) throw `[💬] *Kamu sudah terdaftar*\nMau daftar ulang? _${usedPrefix}unreg <code sn>_`
    if (!Reg.test(text)) return m.reply(`Silahkan Ketik:\n${usedPrefix + command} nama.umur\n\nContoh:\n${usedPrefix + command} anisa.20`)
    let [_, name, splitter, age] = text.match(Reg)
    if (!name) return m.reply('Nama tidak boleh kosong (Alphanumeric)')
    if (!age) return m.reply('Umur tidak boleh kosong (Angka)')
    age = parseInt(age)
    if (age > 35) return m.reply('Bapak bapak anjer')
    if (age < 5) return m.reply('Wah bocil')
    if (name.split('').length > 100) return m.reply('Nama Maksimal 100 Karakter')
    user.name = name.trim()
    user.age = age
    user.regTime = + new Date
    user.registered = true
    let sn = createHash('md5').update(m.sender).digest('hex')
    let cap = `
╭───• *USER*
│֎ *Status:*  _*Successful ✓*_
│֎ *Nama:* ${name}
│֎ *Umur:* ${age} tahun
╰───•
 ᯽ *sɴ:* ${sn}
 
 _Sekarang anda bisa berinteraksi dengan ${global.namebot}_
 
⻝ 𝗗𝗮𝘁𝗲: ${week} ${date}
⻝ 𝗧𝗶𝗺𝗲: ${wktuwib}
`
    await conn.sendMessage(m.chat, { text: cap,
contextInfo:
					{
						"externalAdReply": {
							"title": "Register Success ✓",
							"body": `${global.namebot}`,
							"showAdAttribution": false,
							"mediaType": 1,
							"sourceUrl": 'https://github.com/RIJALGANZZZ',
							"thumbnailUrl": 'https://telegra.ph/file/82fbafe6003d9507965b2.jpg' ,
							"renderLargerThumbnail": true

						}
					}}, {quoted: flok})
}
handler.help = ['daftar']
handler.tags = ['main']
handler.command = /^(daftar|verify|reg(ister)?)$/i

export default handler