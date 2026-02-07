let handler = async (m, { conn, text }) => {
    let who
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text
    else who = m.chat
    if (!who) throw `Tag Orangnya!`
    
    if (!/^\d+$/.test(who.split`@`[0])) throw 'Nomor telepon tidak valid!'
    
    if (global.mods.some(mods => mods[0] === who.split`@`[0])) throw 'Dia Udah Menjadi Mods!'
    
    global.mods.push([who.split`@`[0], '', true])
    
    conn.reply(m.chat, `@${who.split`@`[0]} Sekarang Mods!`, m, {
        contextInfo: {
            mentionedJid: [who]
        }
    })
}

handler.help = ['addmods']
handler.tags = ['owner']
handler.command = /^(add|tambah|\+)mods$/i

handler.owner = true

export default handler