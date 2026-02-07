import fs from "fs"

let handler = async (m, { args }) => {
  let dbPath = "./src/autoblock.json"
  let db = fs.existsSync(dbPath) ? JSON.parse(fs.readFileSync(dbPath)) : {}
  if (!db.autoblock) db.autoblock = { enabled: false }

  if (!args[0]) {
    return m.reply(`Gunakan: .autoblock on / off\n\nStatus sekarang: *${db.autoblock.enabled ? 'ON' : 'OFF'}*`)
  }

  if (args[0].toLowerCase() === "on") {
    db.autoblock.enabled = true
    m.reply("✅ Auto-block berhasil diaktifkan")
  } else if (args[0].toLowerCase() === "off") {
    db.autoblock.enabled = false
    m.reply("❎ Auto-block berhasil dimatikan")
  } else {
    return m.reply("⚠️ Pilihan tidak valid! gunakan: on / off")
  }

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2))
}

handler.command = /^autoblock$/i
handler.owner = true

export default handler