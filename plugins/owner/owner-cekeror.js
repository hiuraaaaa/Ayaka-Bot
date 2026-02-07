import fs from 'fs'
import path from 'path'
import chalk from 'chalk'

let handler = async (m, { conn }) => {
  const pluginRoot = './plugins'
  const errorList = []
  const excludedFolders = ['lib', 'lowdb', 'canvas', 'helper', 'temp'] // folder yg akan di-skip

  if (!fs.existsSync(pluginRoot)) {
    return m.reply('❌ Folder plugins tidak ditemukan!')
  }

  const getAllPluginFiles = (dir) => {
    let results = []
    const list = fs.readdirSync(dir)

    for (const file of list) {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)

      // skip folder yg di blacklist
      if (stat.isDirectory()) {
        const folderName = path.basename(filePath)
        if (excludedFolders.includes(folderName)) continue
        results = results.concat(getAllPluginFiles(filePath))
      } else if (file.endsWith('.js')) {
        results.push(filePath)
      }
    }
    return results
  }

  const pluginFiles = getAllPluginFiles(pluginRoot)

  if (pluginFiles.length === 0) {
    return m.reply('📂 Tidak ada file .js di dalam folder plugins!')
  }

  for (const file of pluginFiles) {
    try {
      await import(`file://${path.resolve(file)}?check=${Date.now()}`)
    } catch (err) {
      const relativePath = path.relative(process.cwd(), file)
      errorList.push(`${chalk.red('❌')} ${relativePath}: ${err.message}`)
    }
  }

  if (errorList.length === 0) {
    m.reply(`✅ Semua fitur aman!\n📦 Total plugin dicek: ${pluginFiles.length}`)
  } else {
    let report = `🚨 ${errorList.length} Error Ditemukan\n📦 Total plugin dicek: ${pluginFiles.length}\n\n`
    // batasi agar output tidak terlalu panjang di WhatsApp
    const preview = errorList.slice(0, 40).join('\n')
    if (errorList.length > 40) {
      report += preview + `\n\n🔻 Dan ${errorList.length - 40} error lainnya disembunyikan...`
    } else {
      report += preview
    }
    m.reply(report)
  }
}

handler.help = ['checkerror']
handler.tags = ['owner']
handler.command = /^checkerror$/i
handler.rowner = true

export default handler