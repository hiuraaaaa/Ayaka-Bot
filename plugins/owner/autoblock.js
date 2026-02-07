import fs from "fs"

let handler = m => m

handler.before = async function (m, { conn }) {
  if (!m) return true
  if (m.isBaileys && m.fromMe) return true
  if (m.fromMe) return true
  if (m.isGroup || m.chat === 'status@broadcast') return true

  let dbPath = "./src/autoblock.json"
  let db = fs.existsSync(dbPath) ? JSON.parse(fs.readFileSync(dbPath)) : {}
  if (!db.autoblock) db.autoblock = { enabled: false }
  if (!db.autoblock.enabled) return true 

  console.log('[AUTO-BLOCK] Pesan private terdeteksi dari:', m.sender)

  let ownerJids = (global.owner || [])
    .filter(v => Array.isArray(v) && v[0])
    .map(v => v[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net')

  if (ownerJids.includes(m.sender)) return true

  try {
    if (typeof conn.updateBlockStatus === 'function') {
      await conn.updateBlockStatus(m.sender, 'block')
    } else if (typeof conn.blockUser === 'function') {
      await conn.blockUser(m.sender, 'block')
    } else {
      console.log('[AUTO-BLOCK] Method block tidak ada di conn')
    }
    console.log('[AUTO-BLOCK] Sukses block:', m.sender)
  } catch (e) {
    console.error('AUTO-BLOCK ERROR:', e)
  }

  return true
}

export default handler