import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, args, text }) => {
  if (!text) throw `📦 *Masukkan nama plugin yang ingin dihapus!*\n\nContoh:\n.df ai-toreall`

  const pluginName = args[0].replace('.js', '')
  const baseDir = path.join(process.cwd(), 'plugins')

  function findPluginsRecursively(dir, name) {
    const found = []
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        found.push(...findPluginsRecursively(fullPath, name))
      } else if (entry.isFile() && entry.name === `${name}.js`) {
        found.push(fullPath)
      }
    }
    return found
  }

  const foundFiles = findPluginsRecursively(baseDir, pluginName)

  if (foundFiles.length === 0) {
  
    const pluginsByFolder = {}

    function walk(dir, parent = '') {
      const entries = fs.readdirSync(dir, { withFileTypes: true })
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)
        if (entry.isDirectory()) {
          walk(fullPath, entry.name)
        } else if (entry.isFile() && entry.name.endsWith('.js')) {
          const folder = parent || 'root'
          if (!pluginsByFolder[folder]) pluginsByFolder[folder] = []
          pluginsByFolder[folder].push(entry.name.replace('.js', ''))
        }
      }
    }

    walk(baseDir)

    let message = `❌ *Plugin tidak ditemukan!*\n\n🧩 *Daftar plugin tersedia:*\n\n`
    for (const folder of Object.keys(pluginsByFolder).sort()) {
      message += `📂 *${folder}*\n`
      message += pluginsByFolder[folder].map(v => `  • ${v}`).join('\n')
      message += '\n\n'
    }

    return m.reply(message.trim())
  }

  for (const filePath of foundFiles) {
    try {
      fs.unlinkSync(filePath)
      await conn.sendMessage(m.chat, {
        text: `🗑️ *Berhasil menghapus:*\n> ${filePath.replace(process.cwd(), '').replace(/^\//, '')}`
      })
    } catch (err) {
      await conn.sendMessage(m.chat, {
        text: `❌ Gagal menghapus: ${filePath}\n> ${err.message}`
      })
    }
  }
}

handler.help = ['df <nama plugin>']
handler.tags = ['owner']
handler.command = /^(df|delplugin)$/i
handler.rowner = true

export default handler