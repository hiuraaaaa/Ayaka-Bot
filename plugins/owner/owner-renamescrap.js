import fs from 'fs'
import path from 'path'

let handler = async (m, { text, usedPrefix, command, __dirname }) => {
  if (!text || !text.includes('|')) throw `Contoh penggunaan: *${usedPrefix}${command} teks_lama|teks_baru*`

  let [oldText, newText] = text.split('|').map(v => v.trim())
  if (!oldText || !newText) throw `Format salah!\nContoh: *${usedPrefix}${command} agas|agas*`

  let pluginDir = path.join(__dirname, '../scraper') // Ubah ke folder scraper
  let files = fs.readdirSync(pluginDir).filter(file => file.endsWith('.js'))

  let totalReplaced = 0
  let editedFiles = []

  for (let file of files) {
    let filePath = path.join(pluginDir, file)
    let isi = fs.readFileSync(filePath, 'utf-8')

    // Pencarian kata utuh
    let regex = new RegExp(`\\b${oldText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi')
    if (regex.test(isi)) {
      let baru = isi.replace(regex, newText)
      fs.writeFileSync(filePath, baru)
      totalReplaced++
      editedFiles.push(file)
    }
  }

  if (!totalReplaced) throw `Tidak ada file di folder scraper yang mengandung kata *${oldText}* sebagai kata utuh.`

  m.reply(`Berhasil mengganti *${oldText}* => *${newText}* di *${totalReplaced}* file:\n\n` + editedFiles.map(f => `- ${f}`).join('\n'))
}

handler.command = /^renamescrap$/i
handler.rowner = true

export default handler