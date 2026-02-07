import fs from 'fs'

const delPath = './src/autodel.json'
if (!fs.existsSync(delPath)) fs.writeFileSync(delPath, JSON.stringify([]), 'utf-8')

export async function before(m, { conn }) {
  try {
    if (!m.isGroup) return 
    const data = JSON.parse(fs.readFileSync(delPath))
    if (data.includes(m.sender)) {
      await conn.sendMessage(m.chat, { delete: m.key })
    }
  } catch (e) {
    console.error('❌ Gagal hapus pesan otomatis:', e)
  }
}