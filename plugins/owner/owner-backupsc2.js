import fs from 'fs'
import archiver from 'archiver'
import path from 'path'
import moment from 'moment'

const handler = async (m, { conn }) => {
  m.reply('🗂️ Sedang mempersiapkan backup...')

  if (!global.logerror) {
    return m.reply('❌ ID grup untuk backup belum disetel di global.logerror!')
  }

  const waktuBackup = moment().format('YYYY-MM-DD HH:mm:ss')
  const backupName = `SC ${global.namebot} ${waktuBackup}.zip`
  const output = fs.createWriteStream(backupName)
  const archive = archiver('zip', { zlib: { level: 9 } })

  output.on('close', function () {
    const caption = [
      '`Berikut adalah file backup kode bot`',
      '',
      `*Nama file:* ${backupName}`,
      `*Ukuran file:* ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`
    ].join('\n')

    const groupId = global.logerror
    conn.sendFile(groupId, backupName, backupName, caption)
      .then(() => fs.unlinkSync(backupName))
      .catch(err => console.error('❌ Gagal mengirim backup:', err))
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

handler.help = ['backupsc']
handler.tags = ['owner']
handler.command = /^(backup(sc)?)$/i
handler.owner = true
handler.private = false

export default handler