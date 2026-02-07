import fs from 'fs'
import path from 'path'

let handler = async (m, { text, usedPrefix, command, __dirname }) => {
  if (!text || !text.includes('|')) throw `Contoh penggunaan: *${usedPrefix}${command} teks_lama|teks_baru*`

  let [oldText, newText] = text.split('|').map(v => v.trim())
  if (!oldText || !newText) throw `Format salah!\nContoh: *${usedPrefix}${command} agas|agas*`

  let pluginDir = path.join(__dirname, '../node_modules/@bochilteam')

  // Fungsi rekursif untuk ambil semua file .js
  const getAllJsFiles = dir => {
    let results = []
    let list = fs.readdirSync(dir)
    for (let file of list) {
      let filePath = path.join(dir, file)
      let stat = fs.statSync(filePath)
      if (stat && stat.isDirectory()) {
        results = results.concat(getAllJsFiles(filePath))
      } else if (filePath.endsWith('.js')) {
        results.push(filePath)
      }
    }
    return results
  }

  let files = getAllJsFiles(pluginDir)

  let totalReplaced = 0
  let editedFiles = []

  for (let filePath of files) {
    let isi = fs.readFileSync(filePath, 'utf-8')

    let regex = new RegExp(`\\b${oldText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi')
    if (regex.test(isi)) {
      let baru = isi.replace(regex, newText)
      fs.writeFileSync(filePath, baru)
      totalReplaced++
      editedFiles.push(filePath.replace(pluginDir + '/', ''))
    }
  }

  if (!totalReplaced) throw `Tidak ada file di @bochilteam yang mengandung kata *${oldText}* sebagai kata utuh.`

  m.reply(`Berhasil mengganti *${oldText}* => *${newText}* di *${totalReplaced}* file:\n\n` + editedFiles.map(f => `- ${f}`).join('\n'))
}

handler.command = /^renamemod$/i
handler.rowner = true

export default handler