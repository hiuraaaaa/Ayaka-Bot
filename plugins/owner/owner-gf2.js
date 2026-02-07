import fs from 'fs/promises'
import path from 'path'

let handler = async (m, { conn, isROwner, text }) => {
    await conn.sendMessage(m.chat, { react: { text: '🕓', key: m.key } })
    if (!isROwner) return

    const rootDir = './'
    if (!text || !text.includes('.')) throw 'Format: .gf2 <namaFile.ext> (wajib pakai ekstensi)'

    const files = await fs.readdir(rootDir)
    if (!files.includes(text)) {
        const available = files.filter(f => f.includes('.')).join('\n')
        return m.reply(`*File tidak ditemukan!*\n\nFile yang tersedia:\n${available}`)
    }

    try {
        const filePath = path.join(rootDir, text)
        const fileBuffer = await fs.readFile(filePath)
        const ext = path.extname(text)

        const mimeTypes = {
            '.json': 'application/json',
            '.js': 'application/javascript',
            '.txt': 'text/plain',
            // tambahkan ekstensi dan MIME type lain jika perlu
        }

        await conn.sendMessage(m.chat, {
            document: fileBuffer,
            mimetype: mimeTypes[ext] || 'application/octet-stream',
            fileName: text
        })

        await conn.sendMessage(m.chat, { react: { text: null, key: m.key } })
    } catch (e) {
        m.reply(`Gagal membaca file: ${e.message}`)
    }
}

handler.help = ['gf2 <namaFile.ext>']
handler.tags = ['owner']
handler.command = /^gf2$/i
handler.rowner = true

export default handler