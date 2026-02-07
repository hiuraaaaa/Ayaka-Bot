import fs from "fs"
import path from "path"

const dbPath = "./src/antinsfw.json"
if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify({}, null, 2))

function loadDB() {
  return JSON.parse(fs.readFileSync(dbPath, "utf8"))
}
function saveDB(db) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2))
}

let handler = async (m, { text, args, command, isAdmin }) => {
  if (!m.isGroup) throw "Fitur ini hanya untuk grup!"
  if (!isAdmin) throw "Fitur ini hanya bisa digunakan oleh *admin grup!*"

  let db = loadDB()
  if (!db[m.chat]) db[m.chat] = { active: false, caption: "🚫 NSFW terdeteksi! Pesanmu dihapus otomatis." }

  let opt = (args[0] || "").toLowerCase()

  if (opt === "on") {
    db[m.chat].active = true
    saveDB(db)
    return m.reply("✅ *Anti-NSFW diaktifkan* untuk grup ini.")
  } else if (opt === "off") {
    db[m.chat].active = false
    saveDB(db)
    return m.reply("❌ *Anti-NSFW dimatikan* untuk grup ini.")
  } else if (opt === "setcaption") {
    let newCaption = text.replace(/^(setcaption|antinsfw)/i, "").trim()
    if (!newCaption) throw "Ketik: *.antinsfw setcaption <teks baru>*"
    db[m.chat].caption = newCaption
    saveDB(db)
    return m.reply("📝 Caption Anti-NSFW berhasil diperbarui!")
  } else {
    let status = db[m.chat].active ? "✅ Aktif" : "❌ Nonaktif"
    let cap = db[m.chat].caption
    return m.reply(
      `📛 *Pengaturan Anti-NSFW*\n\nStatus: ${status}\nCaption: ${cap}\n\nPerintah:\n• *.antinsfw on/off*\n• *.antinsfw setcaption <teks>*`
    )
  }
}

handler.help = ["antinsfw on/off", "antinsfw setcaption <teks>"]
handler.tags = ["group"]
handler.command = /^antinsfw$/i
handler.group = true
handler.admin = true

export default handler