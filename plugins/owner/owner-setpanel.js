import fs from 'fs'

const configPath = './config.js'

function updateGlobalConfig(key, value) {
  let config = fs.readFileSync(configPath, 'utf-8')
  const regex = new RegExp(`global\\.${key}\\s*=\\s*(['"]).*?\\1`)
  if (!regex.test(config)) throw new Error(`global.${key} tidak ditemukan di config.js`)
  const updated = config.replace(regex, `global.${key} = '${value}'`)
  fs.writeFileSync(configPath, updated)
}

let handler = async (m, { args, isOwner }) => {
  if (!isOwner) return m.reply('❌ Hanya owner yang dapat menggunakan perintah ini.')

  if (args.length < 2) {
    return m.reply(`⚙️ *Format:*\n.setconfig [key] [value]\n\nContoh:\n.setconfig domain https://example.com`)
  }

  const [rawKey, ...valueArr] = args
  const key = rawKey.trim()
  const value = valueArr.join(' ')

  try {
    updateGlobalConfig(key, value)
    global[key] = value 
    m.reply(`✅ *global.${key}* berhasil diupdate ke:\n${value}`)
  } catch (e) {
    m.reply(`❌ Gagal update global.${key}:\n${e.message}`)
  }
}

handler.command = /^setconfig$/i
handler.owner = true
handler.tags = ['owner']
handler.help = ['setconfig [key] [value]']

export default handler