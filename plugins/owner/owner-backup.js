import fs from 'fs'
import archiver from 'archiver'
import path from 'path'

const handler = async (m, { conn }) => {
  m.reply('🗂️ Code Backup Sedang Dikirim...')

  const d = new Date(new Date() + 3600000)
  const locale = 'id'
  const date = d.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta'
  })

  const backupName = `${global.namebot} || ${date}.zip`
  const output = fs.createWriteStream(backupName)
  const archive = archiver('zip', { zlib: { level: 9 } })

  output.on('close', function () {
    const caption = `\`Backup Code Bot\`\n\n` +
      `*Nama File:* ${backupName}\n` +
      `*Ukuran:* ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB\n\n` +
      `📅 *Tanggal:* ${date}`

    conn.sendFile(global.nomorwa + '@s.whatsapp.net', backupName, backupName, caption, m)
      .then(() => {
        m.reply('*[✅]* Sukses Backup Script Bot')
        fs.unlinkSync(backupName) 
      })
      .catch(err => {
        console.error('❌ Gagal mengirim backup:', err)
      })
  })

  archive.on('warning', err => {
    if (err.code === 'ENOENT') console.warn(err)
    else throw err
  })

  archive.on('error', err => { throw err })

  archive.pipe(output)

  const ignoredPlugins = [
    'plugins/lib**',
    'plugins/src**',
    'plugins/json**',
    'plugins/tmp**',
    'plugins/sessions**'
  ]

  const ignoredRoot = [
    'node_modules/**',
    'tmp/**'
  ]

  // Tambahan pengecualian
  const ignoredExtra = [
    '.npm/**',
    backupName
  ]

  archive.glob('**/*', {
    cwd: '/home/container',
    ignore: [...ignoredPlugins, ...ignoredRoot, ...ignoredExtra]
  })

  await archive.finalize()
}

handler.help = ['backup']
handler.tags = ['owner']
handler.command = /^backuplan$/i
handler.owner = true

export default handler