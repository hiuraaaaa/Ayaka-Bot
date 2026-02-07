let { MessageType } = (await import('@adiwajshing/baileys')).default
let handler = async (m, { conn, text }) => {
    if (!text) throw 'Masukkan jumlah Exp yang akan dikurangi'
    let who
    if (m.isGroup) who = m.mentionedJid[0]
    else who = m.chat
    if (!who) throw 'Tag salah satu lah'
    let txt = text.replace('@' + who.split`@`[0], '').trim()
    if (isNaN(txt)) throw 'Hanya angka'
    let poin = parseInt(txt)
    let exp = poin
    if (exp < 1) throw 'Minimal 1'
    let users = global.db.data.users
    users[who].exp -= poin

    conn.reply(m.chat, `Maaf Kak @${who.split`@`[0]}. Exp Kamu Dikurangi Oleh Owner Sebanyak -${poin} Exp!`, m, { mentions: [who] }, {
        mentions: [m.sender]
    }) 
}

handler.help = ['remexp @user <amount>']
handler.tags = ['owner']
handler.command = /^remexp$/
handler.owner = true

export default handler