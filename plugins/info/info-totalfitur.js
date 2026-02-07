import fs from 'fs'

let handler = async (m, { conn }) => {
    // --- Ambil file plugin ---
    let pluginFiles = []
    try {
        pluginFiles = fs.readdirSync('./plugins')
    } catch (e) {
        pluginFiles = []
    }
    
    let totalFiles = pluginFiles.length

    // --- Ambil fitur dari global.plugins ---
    let fitur = Object.values(global.plugins)
        .filter(v => v.help && !v.disabled)
        .map(v => v.help)
        .flat(1)

    let totalFitur = fitur.length

    // --- Hitung kategori fitur ---
    let plugins = Object.values(global.plugins)
    let categories = {}

    for (let plugin of plugins) {
        if (plugin.tags && plugin.help) {
            for (let tag of plugin.tags) {
                if (!categories[tag]) categories[tag] = { files: 0, features: 0 }
                categories[tag].files++
                categories[tag].features += plugin.help.length
            }
        }
    }

    // --- Teks utama ---
    let txt = `🚀 *\`BOT FEATURE LIST\`* 🚀\n\n` +
              `*Total Files:* _${totalFiles}_\n` + 
              `*Total Fitur:* _${totalFitur}_\n` +
              `*Name Bot:* _${global.namebot}_\n` +
              `*Creator:* _${global.author}_\n\n`

    txt += `🗂 *Kategori Fitur:*\n`
    txt += `----------------------------------------------\n`

    for (let [tag, { files, features }] of Object.entries(categories)) {
        let categoryName = tag.charAt(0).toUpperCase() + tag.slice(1)
        txt += `* Menu ${categoryName}\n    ╰╼ \`\`\`File ${files} | Fitur ${features}\`\`\`\n`
    }

    txt += `----------------------------------------------`

    // --- Kirim dengan buttons ---

    await conn.sendMessage(m.chat, {
        text: txt,
        footer: global.namebot,
        buttons: [
            { buttonId: '.menu', buttonText: { displayText: '📒 Menu Utama' }, type: 1 },
            { buttonId: '.sc', buttonText: { displayText: '💻 Source Code' }, type: 1 },
            { buttonId: '.owner', buttonText: { displayText: '☎ Owner' }, type: 1 }
        ],
        headerType: 1
    }, { quoted: m })
}

handler.help = ['totalfitur']
handler.tags = ['info']
handler.command = /^(totalfitur|totalfeature|totalcmd)$/i

export default handler