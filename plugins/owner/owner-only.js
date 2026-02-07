let handler = async (m, { conn, participants, groupMetadata }) => {
    if (m.fromMe) return
    if (!m.isGroup) return

    const isOwner = [conn.decodeJid(global.conn.user.id), ...global.owner.map(([number]) => number)].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)

    if (!isOwner) throw false

    let args = m.text.split(' ')
    if (args.length < 2) throw `Masukkan perintah!\n\n*Contoh:* .onlyowner on`

    if (!global.db.data.owneronly) global.db.data.owneronly = {}

    if (args[1] === 'on') {
        if (global.db.data.owneronly[m.chat]) return m.reply('✅Fitur onlyowner sudah aktif di grup ini.')
        global.db.data.owneronly[m.chat] = true
        m.reply('〽️ Fitur onlyowner berhasil diaktifkan di grup ini. Hanya owner yang bisa menggunakan bot.')
    } else if (args[1] === 'off') {
        if (!global.db.data.owneronly[m.chat]) return m.reply('❌Fitur onlyowner sudah nonaktifkan di grup ini.')
        global.db.data.owneronly[m.chat] = false
        m.reply('🚫Fitur owner only berhasil dinonaktifkan di grup ini. Semua anggota bisa menggunakan bot.')
    } else {
        throw `Perintah tidak valid! Gunakan *.onlyowner on* untuk mengaktifkan atau *.onlyowner off* untuk menonaktifkan.`
    }
}

handler.before = async (m, { conn, participants, groupMetadata }) => {
    if (m.fromMe) return 
    if (!m.isGroup) return

    if (global.db.data.owneronly?.[m.chat]) {
        const isOwner = [conn.decodeJid(global.conn.user.id), ...global.owner.map(([number]) => number)].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)

        if (!isOwner) throw false
    }
}

handler.command = handler.help = ['onlyowner'];
handler.tags = ['group'];
handler.group = true;
handler.owner = true;

export default handler;;