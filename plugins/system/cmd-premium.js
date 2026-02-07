global.db.data.sticker = global.db.data.sticker || {}

const handler = async (m, { conn, text, usedPrefix, command }) => {
    let sticker = global.db.data.sticker
    let hash = m.quoted && m.quoted.fileSha256 ? m.quoted.fileSha256.toString(command === 'setcmd' ? 'base64' : 'hex') : null

    switch (command.toLowerCase()) {
        case 'setcmd':
            if (!m.quoted) throw 'Balas stiker pake *' + usedPrefix + command + '* dong, Sensei!'
            if (!m.quoted.fileSha256) throw 'SHA256 Hash-nya ilang, bro!'
            if (!text) throw `Cara pake: ${usedPrefix + command} <teks>\nContoh: ${usedPrefix + command} tes`
            if (hash in sticker && sticker[hash].creator !== m.sender) throw 'Sticker ini punya orang lain, Sensei! Bikin sendiri pake stiker lu!'
            sticker[hash] = {
                text,
                mentionedJid: m.mentionedJid || [],
                creator: m.sender,
                at: +new Date,
                locked: false,
            }
            m.reply(`Sukses banget, Sensei! Sticker udah diset cuma buat lu!`)
            break

        case 'lockcmd':
        case 'unlockcmd':
            if (!m.quoted) throw 'Tag pesennya dong, Sensei!'
            if (!hash) throw 'SHA256 Hash-nya mana nih?'
            if (!(hash in sticker)) throw 'Hash ga ketemu di database, sabar ya!'
            if (sticker[hash].creator !== m.sender) throw 'Ini bukan sticker lu, Sensei! Ga bisa diutak-atik!'
            sticker[hash].locked = command === 'lockcmd'
            m.reply(`Done, Sensei! Kunci udah ${command === 'lockcmd' ? 'dipasang' : 'dibuka'}!`)
            break

        case 'listcmd':
            let creatorStickers = Object.entries(sticker).filter(([_, value]) => value.creator === m.sender)
            if (creatorStickers.length === 0) throw 'Lu belum punya sticker command, Sensei! Bikin dulu pake .setcmd ya!'
            conn.reply(m.chat, `
*DAFTAR CMD KEREN MILIK LU*
\`\`\`
${creatorStickers.map(([key, value], index) => `${index + 1}. ${value.locked ? `(Terkunci) ${key}` : key} : ${value.text}`).join('\n')}
\`\`\`
`.trim(), null, {
                mentions: creatorStickers.flatMap(([_, x]) => x.mentionedJid || [])
            })
            break

        case 'delcmd':
            if (!text) throw `Cara pake: ${usedPrefix + command} <hash/nomor>\nContoh: ${usedPrefix + command} 1`
            if (/^\d+$/.test(text)) {
                let creatorEntries = Object.entries(sticker).filter(([_, value]) => value.creator === m.sender)
                let index = parseInt(text) - 1
                if (index < 0 || index >= creatorEntries.length) throw `Nomor ${text} ga ada di daftar lu, Sensei! Cek ${usedPrefix}listcmd dulu ya!`
                hash = creatorEntries[index][0]
                if (sticker[hash].locked) throw 'Lu ga bisa hapus ini, terkunci nih!'
                delete sticker[hash]
                m.reply(`Sukses hapus, Sensei! Command nomor ${text} udah ilang dari daftar lu!`)
            } else {
                hash = text || (m.quoted && m.quoted.fileSha256 ? m.quoted.fileSha256.toString('hex') : null)
                if (!hash) throw `Hash-nya mana, Sensei?`
                if (!(hash in sticker)) throw 'Hash ga ada di database, bro!'
                if (sticker[hash].creator !== m.sender) throw 'Ini bukan sticker lu, Sensei! Ga bisa dihapus!'
                if (sticker[hash].locked) throw 'Lu ga bisa hapus ini, terkunci nih!'
                delete sticker[hash]
                m.reply(`Sukses hapus, Sensei! Sticker command udah ilang dari database!`)
            }
            break

        default:
            throw `Command *${command}* ga ada, Sensei! Coba cek lagi ya!`
    }
}

handler.before = async (m, { conn, text, usedPrefix, command }) => {
    let sticker = global.db.data.sticker
    let hash = m.quoted && m.quoted.fileSha256 ? m.quoted.fileSha256.toString('hex') : null
    if (hash && hash in sticker && sticker[hash].text === text) {
        if (sticker[hash].creator !== m.sender) throw 'Ini sticker punya orang lain, Sensei! Bikin sendiri dong!'
        conn.sendMessage(m.chat, { sticker: m.quoted }, { quoted: m })
    }
}

handler.help = ['setcmd <teks>', 'lockcmd', 'unlockcmd', 'listcmd', 'delcmd <hash/nomor>']
handler.tags = ['premium']
handler.command = /^(setcmd|lockcmd|unlockcmd|listcmd|delcmd)$/i
handler.premium = true

export default handler