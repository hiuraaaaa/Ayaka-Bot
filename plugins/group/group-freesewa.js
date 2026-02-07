let handler = async (m, { conn, args, usedPrefix, command, isROwner }) => {
    global.db.data.settings.freesewa = global.db.data.settings.freesewa ?? false
    global.db.data.users[m.sender] = global.db.data.users[m.sender] || {}

    if (args[0] === 'on' || args[0] === 'off') {
        if (!isROwner) throw '⛔ Hanya owner yang bisa mengatur fitur ini!'
        global.db.data.settings.freesewa = args[0] === 'on'
        return m.reply(`✅ Fitur *freesewa* sekarang: *${args[0].toUpperCase()}*`)
    }

    if (!global.db.data.settings.freesewa) throw '🚫 Fitur *freesewa* sedang dimatikan oleh owner.'
    if (global.db.data.users[m.sender].usedFreesewa) throw '⚠️ Kamu sudah pernah menggunakan fitur *freesewa*. Hanya bisa 1x!'

    if (!args[0] || !args[0].includes('whatsapp.com')) {
        throw `Masukkan *link grup WhatsApp* yang valid!\n\nContoh: *${usedPrefix + command} https://chat.whatsapp.com/xxxxxxxxxxxxxxxx*`
    }

    let linkRegex = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i
    let [_, code] = args[0].match(linkRegex) || []
    if (!code) throw '❌ Link undangan tidak valid!'

    let res = await conn.groupAcceptInvite(code).catch(() => null)
    if (!res) throw '❌ Gagal join ke grup. Pastikan link aktif dan bot belum ada di grup tersebut.'

    let groupId = res
    let now = new Date() * 1
    let expired = now + (3 * 24 * 60 * 60 * 1000)

    global.db.data.chats[groupId] = global.db.data.chats[groupId] || {}
    global.db.data.chats[groupId].expired = expired

    global.db.data.users[m.sender].usedFreesewa = true

    return conn.reply(m.chat, `✅ Bot berhasil masuk grup dan aktif selama *3 hari*!\n\nID Grup: ${groupId}\nSewa berlaku sampai: ${msToDate(expired - now)}\n\n📌 *Freesewa hanya bisa digunakan sekali per pengguna.*`, m)
}

handler.help = ['freesewa <link>', 'freesewa on/off']
handler.tags = ['sewa']
handler.command = /^freesewa$/i

export default handler

function msToDate(ms) {
    let d = Math.floor(ms / 86400000)
    let h = Math.floor(ms % 86400000 / 3600000)
    let m = Math.floor(ms % 3600000 / 60000)
    return `${d} Hari ${h} Jam ${m} Menit`
}