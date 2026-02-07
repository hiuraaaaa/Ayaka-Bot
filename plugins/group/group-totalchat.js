import fs from 'fs'
import path from 'path'

const FILE_PATH = './src/totalPesan.json'

function loadData() {
    if (!fs.existsSync(FILE_PATH)) fs.writeFileSync(FILE_PATH, '{}')
    return JSON.parse(fs.readFileSync(FILE_PATH))
}

function saveData(data) {
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2))
}

let handler = async (m, { conn }) => {
    const db = loadData()
    if (!db[m.chat]) db[m.chat] = {}

    const metadata = await conn.groupMetadata(m.chat)
    const members = metadata.participants.map(v => v.id)

    Object.keys(db[m.chat]).forEach(jid => {
        if (!members.includes(jid)) {
            delete db[m.chat][jid]
        }
    })
    saveData(db)

    const participantCounts = db[m.chat]

    const sortedData = Object.entries(participantCounts)
        .sort((a, b) => b[1] - a[1])

    const totalM = sortedData.reduce((acc, [, total]) => acc + total, 0)
    const totalPeople = sortedData.length

    const pesan = sortedData
        .map(([jid, total], index) =>
            `*${index + 1}.* @${jid.split('@')[0]}: *${total}* pesan`
        )
        .join('\n')

    await m.reply(
        `📊 *Total Pesan Group*: *${totalM}* pesan dari *${totalPeople}* orang\n\n${pesan}`,
        null,
        {
            contextInfo: {
                mentionedJid: sortedData.map(([jid]) => jid)
            }
        }
    )
}

handler.help = ['totalpesan']
handler.tags = ['group']
handler.command = /^(total(pesan|chat)?)$/i
handler.group = true
handler.admin = true

handler.before = function (m) {
    if (!m.isGroup) return

    const db = loadData()
    if (!db[m.chat]) db[m.chat] = {}

    db[m.chat][m.sender] = (db[m.chat][m.sender] || 0) + 1

    saveData(db)
}

export default handler