import fs from 'fs'
import path from 'path'
import util from 'util'
import syntaxError from 'syntax-error'

const _fs = fs.promises

function findPlugin(dir, fileName) {
  for (const item of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory()) {
      const found = findPlugin(fullPath, fileName)
      if (found) return found
    } else if (path.basename(fullPath) === fileName) {
      return fullPath
    }
  }
  return null
}

let handler = async (m, { text, usedPrefix, command, __dirname }) => {
  if (!m.quoted) throw `Reply kodenya!`

  const pluginsDir = path.join(process.cwd(), 'plugins')
  let content = m.quoted.text
  if (!content) throw '❌ Tidak ada teks di reply!'

  if (/^(sf|saveplugin|sp)$/i.test(command)) {
    let savePath

    if (text) {
      const args = text.trim().split(/\s+/)
      if (args.length === 1) {

        const filename = `${args[0]}.js`
        const found = findPlugin(pluginsDir, filename)
        if (found) {
          savePath = found
        } else {
          throw `❌ Plugin *${args[0]}* tidak ditemukan!\n\nKetik path manual:\n*${usedPrefix + command} ai ai-toreall*`
        }
      } else if (args.length >= 2) {

        const [folder, name] = args
        savePath = path.join(pluginsDir, folder, `${name}.js`)
      }
    } else {
      throw `Gunakan format:\n• ${usedPrefix + command} namaplugin\n• ${usedPrefix + command} ai namaplugin`
    }

    const filename = path.basename(savePath)
    const error = syntaxError(content, filename, {
      sourceType: 'module',
      allowReturnOutsideFunction: true,
      allowAwaitOutsideFunction: true
    })
    if (error) throw error

    await _fs.mkdir(path.dirname(savePath), { recursive: true })

    await _fs.writeFile(savePath, content)

    m.reply(`✅ Sukses menyimpan di *${path.relative(process.cwd(), savePath)}*`)
  } else {

    if (m.quoted.mediaMessage) {
      if (!text) throw `Masukkan path dan nama file!\nContoh: ${usedPrefix + command} folder/nama.ext`
      const media = await m.quoted.download()
      await _fs.writeFile(text, media)
      return m.reply(`✅ Sukses menyimpan di *${text}*`)
    } else if (m.quoted.text) {
      if (!text) throw `Masukkan nama file!\nContoh: ${usedPrefix + command} main.js`
      const error = syntaxError(content, text, {
        sourceType: 'module',
        allowReturnOutsideFunction: true,
        allowAwaitOutsideFunction: true
      })
      if (error) throw error
      await _fs.writeFile(text, content)
      return m.reply(`✅ Sukses menyimpan di *${text}*`)
    } else {
      throw '❌ Format tidak dikenali!'
    }
  }
}

handler.help = ['saveplugin']
handler.tags = ['owner']
handler.command = /^(sf|saveplugin|sp)$/i
handler.rowner = true

export default handler