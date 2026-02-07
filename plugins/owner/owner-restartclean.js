import fs from 'fs'
import path from 'path'
import { spawn } from 'child_process'

const handler = async (m, { conn, isROwner }) => {
  if (!isROwner) return m.reply('Khusus Owner!')

  const sessionPath = './sessions'

  try {

    if (!fs.existsSync(sessionPath)) {
      return m.reply('Folder sessions tidak ditemukan!')
    }

    const files = fs.readdirSync(sessionPath)
    let deleted = 0

    for (const file of files) {
      if (file !== 'creds.json') {
        const target = path.join(sessionPath, file)
        fs.rmSync(target, { recursive: true, force: true })
        deleted++
      }
    }

    await m.reply(
      `Berhasil menghapus *${deleted}* file di folder sessions.\n\n` +
      `🔄 *Bot sedang direstart...*`
    )

    if (!process.send) throw 'Dont: node main.js\nDo: node index.js'
    if (global.conn.user.jid === conn.user.jid) {
      process.send('reset')
    } else {
      throw '_eeeeeiiittsssss..._'
    }

  } catch (e) {
    console.error(e)
    return m.reply('Terjadi error saat membersihkan session.')
  }
}

handler.help = ['restartclean']
handler.tags = ['owner']
handler.command = /^(restartclean|cleanrestart|fixjam)$/i

handler.owner = true

export default handler