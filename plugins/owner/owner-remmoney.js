let { MessageType } = (await import('@adiwajshing/baileys')).default
let handler = async (m, { conn, text }) => {
    if (!text) throw 'Masukkan jumlah Eris yang akan dikurangi'

    let who
    let phoneRegex = /^\+?\d+(-\d+)*$/

    if (m.isGroup) {
        if (phoneRegex.test(text.split(' ')[0])) {
            who = text.split(' ')[0].replace(/\D/g, '') + '@s.whatsapp.net'
        } else {
            who = m.mentionedJid[0]
        }
    } else {
        if (phoneRegex.test(text.split(' ')[0])) {
            who = text.split(' ')[0].replace(/\D/g, '') + '@s.whatsapp.net'
        } else {
            who = m.chat
        }
    }

    if (!who) throw 'Tag salah satu atau masukkan nomor telepon yang valid'

    let txt = text.replace('@' + who.split`@`[0], '').replace(text.split(' ')[0], '').trim()
    if (isNaN(txt)) throw 'Hanya angka'

    let poin = parseInt(txt)
    let eris = poin
    if (eris < 1) throw 'Minimal 1'

    let users = global.db.data.users
    if (!users[who]) throw 'User tidak ditemukan di database'

    users[who].eris -= poin

    conn.reply(m.chat, `Maaf Kak @${who.split`@`[0]}. Eris Kamu Dikurangi Oleh Owner Sebanyak -${poin} Eris!`, m, { mentions: [who] })
}

handler.help = ['remmoney @user']
handler.tags = ['owner']
handler.command = /^remmoney$/
handler.owner = true

export default handler