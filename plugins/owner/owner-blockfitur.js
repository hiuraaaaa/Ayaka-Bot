import fs from 'fs'
import path from 'path'

const dbPath = path.resolve('./src/blockfitur.json')
if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify({}, null, 2))

let handler = async (m, { command, text }) => {
  const chatId = m.chat
  let db = JSON.parse(fs.readFileSync(dbPath))
  if (!db[chatId]) db[chatId] = []

  switch (command) {
    case 'blockfitur': {
      if (!m.isGroup) throw '⚠️ Hanya bisa digunakan di grup!'
      if (!text) throw '⚙️ Contoh: .blockfitur menu'
      const fitur = text.toLowerCase().trim()
      if (db[chatId].includes(fitur)) throw `🚫 Fitur *${fitur}* sudah diblokir di grup ini!`
      db[chatId].push(fitur)
      fs.writeFileSync(dbPath, JSON.stringify(db, null, 2))
      m.reply(`✅ Fitur *${fitur}* berhasil diblok di grup ini.`)
      break
    }

    case 'unblockfitur': {
      if (!m.isGroup) throw '⚠️ Hanya bisa digunakan di grup!'
      if (!text) throw '⚙️ Contoh: .unblockfitur menu'
      const fitur = text.toLowerCase().trim()
      if (!db[chatId].includes(fitur)) throw `❌ Fitur *${fitur}* tidak diblok di grup ini.`
      db[chatId] = db[chatId].filter(f => f !== fitur)
      fs.writeFileSync(dbPath, JSON.stringify(db, null, 2))
      m.reply(`✅ Fitur *${fitur}* telah dibuka kembali di grup ini.`)
      break
    }

    case 'listblockfitur': {
      if (!m.isGroup) throw '⚠️ Hanya bisa digunakan di grup!'
      const list = db[chatId]
      if (!list || list.length === 0) return m.reply('✅ Tidak ada fitur yang diblok di grup ini.')
      const teks = list.map((v, i) => `${i + 1}. ${v}`).join('\n')
      m.reply(`🚫 *Daftar Fitur Diblokir di Grup Ini:*\n\n${teks}`)
      break
    }
  }
}

handler.command = /^blockfitur|unblockfitur|listblockfitur$/i
handler.tags = ['owner']
handler.group = true
handler.owner = true
handler.help = [
  'blockfitur <nama>',
  'unblockfitur <nama>',
  'listblockfitur'
]

export default handler