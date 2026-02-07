let { MessageType } = (await import('@adiwajshing/baileys')).default
let handler = async (m, { conn, text }) => {
    if (!text) throw 'Masukkan jumlah Cupon yang akan ditambahkan'
    let who
    if (m.isGroup) who = m.mentionedJid[0]
    else who = m.chat
    if (!who) throw 'Tag salah satu lah'
    let txt = text.replace('@' + who.split`@`[0], '').trim()
    if (isNaN(txt)) throw 'Hanya angka'
    let poin = parseInt(txt)
    let cupon = poin
    if (cupon < 1) throw 'Minimal 1'
    let users = global.db.data.users
    users[who].cupon += poin

    conn.reply(m.chat, `Selamat Kak @${who.split`@`[0]}. Kamu Mendapatkan Cupon Dari Owner Sebanyak +${poin} Cupon!`, m, { mentions: [who] }, {
        mentions: [m.sender]
    }) 
}

handler.help = ['addcupon @user <amount>']
handler.tags = ['owner']
handler.command = /^addcupon$/
handler.owner = true

export default handler