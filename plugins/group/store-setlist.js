import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, args, isGroup, isAdmin, isBotAdmin, command }) => {
    const configPath = path.resolve('./src/store-config.json')
    if (!fs.existsSync(configPath)) fs.writeFileSync(configPath, '{}')

    const config = JSON.parse(fs.readFileSync(configPath))
    const chatId = m.chat

    if (isGroup && !isAdmin && !m.fromMe)
        throw '❌ Hanya admin grup yang dapat mengatur mode list.'

    const mode = (args[0] || '').toLowerCase()
    const validModes = ['text', 'button', 'both']

    if (!validModes.includes(mode)) {
        return m.reply(
`❌ Mode tidak valid.

Gunakan:
  • *.${command} text* – hanya kirim teks
  • *.${command} button* – hanya kirim tombol
  • *.${command} both* – kirim teks + tombol`
        )
    }

    config[chatId] = config[chatId] || {}
    config[chatId].mode = mode
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2))

    m.reply(`✅ Mode list berhasil diubah ke *${mode}*.`)
}

handler.help = ['setlistmode <text|button|both>']
handler.tags = ['group']
handler.command = ['setlistmode']
handler.admin = true

export default handler