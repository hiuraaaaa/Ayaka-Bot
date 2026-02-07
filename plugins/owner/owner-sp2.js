import fs from 'fs'
import path from 'path'

const _fs = fs.promises

function findFileInPlugins(dir, fileName) {
  for (const item of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory()) {
      const found = findFileInPlugins(fullPath, fileName)
      if (found) return found
    } else if (path.basename(fullPath) === fileName) {
      return fullPath
    }
  }
  return null
}

let handler = async (m, { text, usedPrefix, command }) => {
  if (!m.quoted) throw `Reply file yang ingin disimpan!`

  const quoted = m.quoted
  const originalName = quoted.fileName || `file_${Date.now()}`
  const pluginsDir = path.join(process.cwd(), 'plugins')

  let savePath

  if (text) {

    const args = text.trim().split(/\s+/)
    if (args.length < 2) throw `Format salah!\nContoh: *${usedPrefix + command} ai namaplugin*`

    const [folder, name] = args
    savePath = path.join(pluginsDir, folder, `${name}.js`)
  } else {

    const foundPath = findFileInPlugins(pluginsDir, originalName)
    if (foundPath) {
      savePath = foundPath
    } else {
      throw `❌ File *${originalName}* tidak ditemukan!\n\nKetik:\n*${usedPrefix + command} ai namaplugin*\nuntuk menyimpannya ke subfolder.`
    }
  }

  const folderPath = path.dirname(savePath)
  await _fs.mkdir(folderPath, { recursive: true })

  if (quoted.mediaMessage) {
    const media = await quoted.download()
    await _fs.writeFile(savePath, media)
    m.reply(`✅ Sukses menyimpan file ke:\n*${path.relative(process.cwd(), savePath)}*`)
  } else {
    throw '❌ Hanya mendukung file media!'
  }
}

handler.help = ['sp2 [folder nama]']
handler.tags = ['owner']
handler.command = /^sp2$/i
handler.rowner = true

export default handler