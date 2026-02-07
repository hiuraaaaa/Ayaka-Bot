import moment from 'moment-timezone'

let handler = m => m

handler.before = async function (m, { conn }) {
    if (m.chat.endsWith('broadcast')) return
    if (m.fromMe) return
    if (!m.isGroup) return

    if (m.isGroup && m.sender === global.nomorwa + '@s.whatsapp.net') {
        let user = global.db.data.users[m.sender] || {}
        let _timie = (new Date - (user.pc * 1)) * 1
        if (_timie < 1000000) return // cooldown biar gak spam

        const jam = moment.tz('Asia/Jakarta').format('HH')
        let waktuUcapan = ''
        if (jam >= 4 && jam < 11) {
            waktuUcapan = 'Selamat pagi sayang☀️'
        } else if (jam >= 11 && jam < 15) {
            waktuUcapan = 'Selamat siang sayang🌤️'
        } else if (jam >= 15 && jam < 18) {
            waktuUcapan = 'Selamat sore sayang🌇'
        } else {
            waktuUcapan = 'Selamat malam sayang🌙'
        }

        const sapaan = pickRandom([
            'Hai Rijalganzz~ 🎉',
            'Halo Rijalganzz 🌸',
            'Heii Sensei! 😚',
            'Lann~ aku di sini~ ✨',
            'Yoo Lann 😄'
        ])

        const pesan = pickRandom([
            'Semoga hari mu menyenangkan ya ganteng💫',
            'Udah makan belum Lann? Jangan lupa isi tenaga ya 🍱',
            'Rijalganzz?! jangan lupa istirahat juga~ 😴',
            'Semangat terus ya Lann, aku dukung selalu ❤️‍🩹',
            'Kalau capek, boleh kok rehat dulu sebentar~ 🤗'
        ])

        let txt = `${waktuUcapan}\n\n${pesan}`

        await conn.sendMessage(m.chat, {
            text: txt,
            footer: `${global.namebot}`,
            buttons: [
                { buttonId: 'hai', buttonText: { displayText: '👋 Hai juga~' }, type: 1 }
            ],
            headerType: 1,
            mentions: [m.sender]
        }, { quoted: m })

        user.pc = new Date * 1
    }
}

export default handler

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}