import fs from 'fs'
import path from 'path'

const dbPath = './src/autodb.json'
if (!fs.existsSync('./src')) fs.mkdirSync('./src')
if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify({ status: false }))

let autoDbInterval = null

const getStatus = () => JSON.parse(fs.readFileSync(dbPath)).status
const setStatus = (val) => fs.writeFileSync(dbPath, JSON.stringify({ status: val }))

const getOwnerJid = () => global.nomorwa + '@s.whatsapp.net'

const getCurrentDate = () => {
  const now = new Date()
  return now.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })
}

const formatBytes = (bytes) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  if (bytes === 0) return '0 Byte'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i]
}

async function sendDatabase(conn) {
  try {
    const file = './database.json'
    const sesi = fs.readFileSync(file)
    const stats = fs.statSync(file)

    const caption = `📦 *Backup Database*\n` +
      `📅 Tanggal: ${getCurrentDate()}\n` +
      `📁 Ukuran: ${formatBytes(stats.size)}\n` +
      `⚙️ Status Auto-backup: ${getStatus() ? '✅ Aktif' : '❌ Nonaktif'}`

    await conn.sendMessage(getOwnerJid(), {
      document: sesi,
      mimetype: 'application/json',
      fileName: 'database.json',
      caption
    })
  } catch (e) {
    console.error('Gagal mengirim database:', e)
  }
}

const startAutoBackup = (conn) => {
  if (autoDbInterval) clearInterval(autoDbInterval)
  autoDbInterval = setInterval(() => sendDatabase(conn), 60 * 60 * 1000) // 1 jam
}

let handler = async (m, { conn, args, command }) => {
  if (command === 'autodb') {
    const current = getStatus()
    if (!args[0]) return m.reply(`Contoh: .autodb on/off\nStatus saat ini: ${current ? 'Aktif' : 'Nonaktif'}`)

    if (args[0].toLowerCase() === 'on') {
      if (current) return m.reply('Auto backup sudah aktif.')
      setStatus(true)
      startAutoBackup(conn)
      m.reply('Auto backup database setiap 1 jam diaktifkan.')
    } else if (args[0].toLowerCase() === 'off') {
      if (!current) return m.reply('Auto backup sudah nonaktif.')
      setStatus(false)
      clearInterval(autoDbInterval)
      m.reply('Auto backup database dinonaktifkan.')
    } else {
      m.reply('Gunakan perintah: .autodb on / .autodb off')
    }
  }

  if (command === 'getdb') {
    m.reply('Tunggu sebentar, sedang mengirim file database...')
    const file = './database.json'
    const sesi = fs.readFileSync(file)
    const stats = fs.statSync(file)

    const caption = `📦 *Database Manual*\n` +
      `📅 Tanggal: ${getCurrentDate()}\n` +
      `📁 Ukuran: ${formatBytes(stats.size)}\n` +
      `⚙️ Status Auto-backup: ${getStatus() ? '✅ Aktif' : '❌ Nonaktif'}`

    await conn.sendMessage(m.chat, {
      document: sesi,
      mimetype: 'application/json',
      fileName: 'database.json',
      caption
    }, { quoted: m })
  }
}

handler.help = ['getdb', 'autodb on/off']
handler.tags = ['owner']
handler.command = /^getdb|autodb$/i
handler.owner = true

export default handler

// Mulai interval jika status on
if (getStatus()) setTimeout(() => startAutoBackup(global.conn), 3000)