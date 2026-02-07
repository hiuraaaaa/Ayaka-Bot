import fs from 'fs'

const path = './src/autodel.json'

if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify([]), 'utf-8')

let handler = async (m, { conn, command, args, usedPrefix }) => {
    let data = JSON.parse(fs.readFileSync(path))

    let target
    if (m.mentionedJid[0]) {
        target = m.mentionedJid[0]
    } else if (args[0]) {
        let nomor = args[0].replace(/[^0-9]/g, '')
        if (!nomor) throw `❌ Nomor tidak valid!\nContoh:\n${usedPrefix + command} 628xxxx`
        target = nomor + '@s.whatsapp.net'
    } else {
        throw `Tag atau ketik nomor yang ingin ditambahkan!\n\nContoh:\n${usedPrefix + command} @user\n${usedPrefix + command} 628123456789`
    }

    if (command === 'adddelchat') {
        if (data.includes(target)) throw 'User sudah ada di daftar auto-delete.'
        data.push(target)
        fs.writeFileSync(path, JSON.stringify(data, null, 2))
        await conn.sendMessage(m.chat, { 
            text: `✅ Pesan dari @${target.split('@')[0]} akan otomatis dihapus di *semua grup*.`,
            mentions: [target]
        }, { quoted: m })
    }

    if (command === 'deldelchat') {
        if (!data.includes(target)) throw 'User tidak ada di daftar auto-delete.'
        data = data.filter(u => u !== target)
        fs.writeFileSync(path, JSON.stringify(data, null, 2))
        await conn.sendMessage(m.chat, { 
            text: `🗑️ Pesan dari @${target.split('@')[0]} tidak akan dihapus lagi.`,
            mentions: [target]
        }, { quoted: m })
    }

    if (command === 'listdelchat') {
        let list = data
        if (!list || list.length === 0)
            return conn.sendMessage(m.chat, { text: '📭 Tidak ada user di daftar auto-delete.' }, { quoted: m })

        let txt = `📋 *Daftar Global Auto Delete Chat:*\n\n${list.map((u, i) => `${i + 1}. @${u.split('@')[0]}`).join('\n')}`
        await conn.sendMessage(m.chat, { text: txt, mentions: list }, { quoted: m })
    }
}

handler.help = ['adddelchat', 'deldelchat', 'listdelchat']
handler.tags = ['owner']
handler.command = /^(adddelchat|deldelchat|listdelchat)$/i
handler.owner = true

export default handler