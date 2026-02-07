import fs from 'fs'
import path from 'path'
import moment from 'moment-timezone'
const { proto, generateWAMessageFromContent } = (await import('@adiwajshing/baileys')).default

let handler = async (m, { conn }) => {
    const filePath = path.resolve('./store-data.json')
    const configPath = path.resolve('./src/store-config.json')

    if (!fs.existsSync(filePath)) throw '❌ Database *store-data.json* tidak ditemukan.'
    if (!fs.existsSync(configPath)) fs.writeFileSync(configPath, '{}')

    const dbData = JSON.parse(fs.readFileSync(filePath))
    const config = JSON.parse(fs.readFileSync(configPath))

    const chatStore = dbData[m.chat]
    const isGroup = m.isGroup && m.chat.endsWith('@g.us')
    const chatConfig = isGroup ? (config[m.chat] || { mode: 'both' }) : { mode: 'text' }
    const mode = chatConfig.mode || 'text'

    if (!chatStore || !chatStore.msgs || Object.keys(chatStore.msgs).length === 0) {
        throw `📭 *Belum ada list produk.*\n\nKetik *.addlist <nama>* untuk menambahkan produk ke store.`
    }

    const groupMetadata = isGroup ? await conn.groupMetadata(m.chat) : {}
    const pushname = conn.getName(m.sender)
    const tanggal = moment().tz('Asia/Jakarta').format('DD MMMM YYYY')
    const time = moment().tz('Asia/Jakarta').format('HH:mm:ss')

    const msgs = chatStore.msgs
    const msgList = Object.keys(msgs).sort((a, b) => a.localeCompare(b))

    const textList = `🛍️ *DAFTAR LIST PRODUK*\n\n✨ Silakan pilih list yang tersedia!\n\n` +
        msgList.map((v, i) => `  ${i + 1}. ${v}`).join('\n') +
        `\n\n🗂️ Total: *${msgList.length}* list tersimpan.`

    if (mode === 'text' || mode === 'both') {
        await conn.sendMessage(m.chat, { text: textList }, { quoted: m })
    }

    if (mode === 'button' || mode === 'both') {
        const caption =
`╭─❏ 🛍️ \`Daftar List\`
│
│✨ *Informasi Anda:*
│╭───────────────
│├ 👥 *Group:* ${groupMetadata.subject || 'Private Chat'}
│├ 👤 *Nama:* ${pushname}
│├ 📆 *Tanggal:* ${tanggal}
│├ ⏰ *Waktu:* ${time}
│╰───────────────
│
│🗂️ Klik tombol di bawah untuk melihat detail list!
╰───────────────`

        const sections = [{
            title: "📦 Daftar List",
            rows: msgList.map(name => ({
                title: `🛒 ${name}`,
                description: "📝 Klik untuk melihat detail list",
                id: `${name}`
            }))
        }]

        const listMessage = {
            title: "🛍️ Daftar List Tersimpan",
            sections
        }

        const msg = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    interactiveMessage: proto.Message.InteractiveMessage.create({
                        body: proto.Message.InteractiveMessage.Body.create({ text: caption }),
                        header: proto.Message.InteractiveMessage.Header.create({ title: "", hasMediaAttachment: false }),
                        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                            buttons: [{
                                name: "single_select",
                                buttonParamsJson: JSON.stringify(listMessage)
                            }]
                        })
                    })
                }
            }
        }, {
            quoted: m,
            contextInfo: {
                mentionedJid: [m.sender]
            }
        })

        return conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
    }
}

handler.help = ['list']
handler.tags = ['group']
handler.command = ['list']

export default handler