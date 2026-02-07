let handler = async (m, { conn }) => {
  try {
    if (!global.db) global.db = { data: { users: {} } }
    if (!global.db.data) global.db.data = { users: {} }
    if (!global.db.data.users) global.db.data.users = {}

    // Buat user jika belum ada
    if (!global.db.data.users[m.sender]) {
      global.db.data.users[m.sender] = {}
    }

    let user = global.db.data.users[m.sender]

    // Ambil data, fallback ke 0 jika undefined ATAU bukan angka
    const safeNum = v => Number(v) >= 0 ? Number(v) : 0

    const kardus  = safeNum(user.kardus  ?? user.karung  ?? user.cardboard)
    const kaleng  = safeNum(user.kaleng  ?? user.can     ?? user.kln)
    const botol   = safeNum(user.botol   ?? user.bottle  ?? user.btl)
    const plastik = safeNum(user.plastik ?? user.pelastik ?? user.pls)

    let teks = `✨ *Inventory Sampah Kamu* ✨

👤 @${m.sender.replace(/@.+/, '')}

📦 Kardus: ${kardus}
🗑️ Kaleng: ${kaleng}
🍼 Botol: ${botol}
🥡 Plastik: ${plastik}

♻️ Terus kumpulkan sampah & tukarkan hadiah!
`

    await conn.sendMessage(
      m.chat,
      {
        image: { url: 'https://c.termai.cc/a89/kNIgN.jpg' },
        caption: teks,
        contextInfo: { mentionedJid: [m.sender] }
      },
      { quoted: m }
    )

  } catch (e) {
    console.error('ERROR FITUR SAMPAH:', e)
    conn.sendMessage(m.chat, { text: 'Terjadi error, cek console bot.' }, { quoted: m })
  }
}

handler.help = ['sampah']
handler.tags = ['rpg']
handler.command = /^sampah$/i

export default handler