import fs from 'fs'
import path from 'path'

const unicodeMap = {}

const addFancy = (start, base, count) => {
  for (let i = 0; i < count; i++) {
    unicodeMap[String.fromCodePoint(start + i)] = base[i]
  }
}

addFancy(0x1D400, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 26)
addFancy(0x1D41A, 'abcdefghijklmnopqrstuvwxyz', 26)
addFancy(0x1D434, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 26)
addFancy(0x1D44E, 'abcdefghijklmnopqrstuvwxyz', 26)
addFancy(0x1D468, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 26)
addFancy(0x1D482, 'abcdefghijklmnopqrstuvwxyz', 26)
addFancy(0x1D49C, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 26)
addFancy(0x1D4B6, 'abcdefghijklmnopqrstuvwxyz', 26)
addFancy(0x1D504, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 26)
addFancy(0x1D51E, 'abcdefghijklmnopqrstuvwxyz', 26)
addFancy(0x1D538, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 26)
addFancy(0x1D552, 'abcdefghijklmnopqrstuvwxyz', 26)
addFancy(0x1D56C, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 26)
addFancy(0x1D586, 'abcdefghijklmnopqrstuvwxyz', 26)
addFancy(0x1D5A0, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 26)
addFancy(0x1D5BA, 'abcdefghijklmnopqrstuvwxyz', 26)
addFancy(0x1D5D4, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 26)
addFancy(0x1D5EE, 'abcdefghijklmnopqrstuvwxyz', 26)
addFancy(0x1D608, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 26)
addFancy(0x1D622, 'abcdefghijklmnopqrstuvwxyz', 26)
addFancy(0x1D63C, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 26)
addFancy(0x1D656, 'abcdefghijklmnopqrstuvwxyz', 26)
addFancy(0x1D670, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 26)
addFancy(0x1D68A, 'abcdefghijklmnopqrstuvwxyz', 26)
addFancy(0x1D7CE, '0123456789', 10)
addFancy(0x1D7D8, '0123456789', 10)
addFancy(0x1D7E2, '0123456789', 10)
addFancy(0x1D7EC, '0123456789', 10)
addFancy(0x1D7F6, '0123456789', 10)

Object.assign(unicodeMap, {
  '＠': '@', '❗': '!', '❕': '!', '❓': '?', '❔': '?', '！': '!', '？': '?', '＄': '$',
  '（': '(', '）': ')', '［': '[', '］': ']', '＋': '+', '－': '-', '＝': '=', '＿': '_',
  '｛': '{', '｝': '}', '＜': '<', '＞': '>', '｜': '|', '＊': '*', '＆': '&', '％': '%',
  '：': ':', '；': ';', '＂': '"', '＇': "'", '，': ',', '．': '.', '／': '/', '～': '~'
})

function normalizeFancyText(text) {
  if (!text) return ''
  return text.normalize('NFKC')
    .split('')
    .map(char => unicodeMap[char] || char)
    .join('')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function getAllJsFiles(dir) {
  let result = []
  for (const item of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory()) {
      result = result.concat(getAllJsFiles(fullPath))
    } else if (fullPath.endsWith('.js')) {
      result.push(fullPath)
    }
  }
  return result
}

let handler = async (m, { text, usedPrefix, command, __dirname }) => {
  if (!text || !text.includes('|')) throw `Contoh penggunaan: *${usedPrefix}${command} teks_lama|teks_baru*`

  let [oldText, newText] = text.split('|').map(v => normalizeFancyText(v.trim()))
  if (!oldText || !newText) throw `Format salah!\nContoh: *${usedPrefix}${command} agas|agasBaru*`

  const pluginDir = path.resolve(__dirname, './') 
  const files = getAllJsFiles(pluginDir)
  let totalReplaced = 0
  let editedFiles = []

  for (const filePath of files) {
    const isi = fs.readFileSync(filePath, 'utf8')
    const regex = new RegExp(escapeRegex(oldText), 'gi')

    if (regex.test(isi)) {
      const baru = isi.replace(regex, newText)
      fs.writeFileSync(filePath, baru)
      totalReplaced++
      editedFiles.push(path.relative(pluginDir, filePath))
    }
  }

  if (!totalReplaced) throw `Tidak ditemukan teks yang cocok dengan *${oldText}*`

  m.reply(
    `✅ Berhasil mengganti *${oldText}* → *${newText}* di ${totalReplaced} file plugin:\n\n` +
    editedFiles.map(f => `- ${f}`).join('\n')
  )
}

handler.command = /^renameplug$/i
handler.rowner = true

export default handler