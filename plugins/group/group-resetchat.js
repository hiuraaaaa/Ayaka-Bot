import fs from 'fs'
const FILE_PATH = './src/totalPesan.json'

let handler = async (m, { isAdmin }) => {
    if (!m.isGroup) return m.reply('Hanya untuk grup!')
    if (!isAdmin) return m.reply('Hanya admin yang bisa mereset data!')

    const db = JSON.parse(fs.readFileSync(FILE_PATH))
    delete db[m.chat]
    fs.writeFileSync(FILE_PATH, JSON.stringify(db, null, 2))

    m.reply('✅ Data total pesan grup ini berhasil direset.')
}

handler.help = ['resetchat']
handler.tags = ['group']
handler.command = /^reset(chat|pesan)$/i
handler.group = true
handler.admin = true

export default handler