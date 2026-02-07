let handler = async (m, { conn, participants }) => {
    if (!m.isGroup) return

    const groupAdmins = participants.filter(p => p.admin).map(p => p.id)
    const isAdmin = groupAdmins.includes(m.sender)
    const isOwner = [conn.decodeJid(conn.user.id), ...global.owner.map(([number]) => number)]
        .map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net')
        .includes(m.sender)

    if (!isAdmin && !isOwner) return

    let args = m.text.trim().split(' ')
    if (args.length < 2) return m.reply(`Masukkan perintah!\n\n*Contoh:* .adminonly on`)

    if (!global.db.data.adminonly) global.db.data.adminonly = {}

    if (args[1] === 'on') {
        if (global.db.data.adminonly[m.chat]) return m.reply('✅ Fitur adminonly sudah aktif.')
        global.db.data.adminonly[m.chat] = true
        m.reply('✅ Fitur adminonly *diaktifkan*. Hanya admin yang bisa menggunakan bot.')
    } else if (args[1] === 'off') {
        if (!global.db.data.adminonly[m.chat]) return m.reply('❌ Fitur adminonly sudah nonaktif.')
        global.db.data.adminonly[m.chat] = false
        m.reply('✅ Fitur adminonly *dinonaktifkan*. Semua anggota bisa menggunakan bot.')
    } else {
        return m.reply(`Perintah tidak valid!\nGunakan *.adminonly on* atau *.adminonly off*`)
    }
}

handler.before = async (m, { conn, participants, isGroup, isCommand }) => {
    if (!isGroup || m.fromMe || !isCommand) return

    if (global.db.data.adminonly?.[m.chat]) {
        const groupAdmins = participants.filter(p => p.admin).map(p => p.id)
        const isAdmin = groupAdmins.includes(m.sender)
        const isOwner = [conn.decodeJid(conn.user.id), ...global.owner.map(([number]) => number)]
            .map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net')
            .includes(m.sender)

        if (!isAdmin && !isOwner) throw false
    }
}

handler.command = handler.help = ['adminonly']
handler.tags = ['group']
handler.group = true

export default handler