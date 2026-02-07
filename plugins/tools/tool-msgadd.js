import pkg from '@adiwajshing/baileys'
const { WAProto } = pkg

let handler = async (m, { conn, command, usedPrefix, text }) => {
    let M = WAProto.WebMessageInfo
    let which = command.replace(/add/i, '')
    if (!m.quoted) throw `Balas Pesan Dengan Perintah *${usedPrefix + command}*`
    if (!text) throw `Penggunaan:\n${usedPrefix + command} <teks>\n\nContoh:\n${usedPrefix + command} tes`
    
    let msgs = global.db.data.msgs
    if (text in msgs) throw `${text} Telah Terdaftar!`

    msgs[text] = M.fromObject(await m.getQuotedObj()).toJSON()

    if (global.db.data.chats[m.chat].getmsg) {
        return m.reply(`Berhasil Menambahkan Pesan *${text}*\n\nAkses dengan mengetik namanya`)
    } else {
        return m.reply(`Berhasil Menambahkan Pesan *${text}*\n\nAkses dengan:\n${usedPrefix}get${which} ${text}`)
    }
}

handler.help = ['addvn', 'addmsg', 'addvideo', 'addaudio', 'addimg', 'addstiker', 'addgif']
handler.tags = ['tools']
handler.admin = true
handler.command = /^add(vn|msg|video|audio|img|stic?ker|gif)$/

export default handler