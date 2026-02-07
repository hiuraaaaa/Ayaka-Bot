import fs from 'fs'
import path from 'path'
const { proto, generateWAMessageFromContent } = (await import("@adiwajshing/baileys")).default;

const handler = async (m, { conn, isROwner, text }) => {
  if (!isROwner) return m.reply('❌ Hanya Owner yang bisa menggunakan perintah ini.')
  if (!text) return m.reply('📦 *Masukkan nama plugin!*\n\nContoh:\n.gp namaplugins')

  const baseDir = path.join(process.cwd(), 'plugins')

  const findPluginFile = (dir, name) => {
    const files = fs.readdirSync(dir)
    for (const file of files) {
      const fullPath = path.join(dir, file)
      const stat = fs.statSync(fullPath)

      if (stat.isDirectory()) {
        const found = findPluginFile(fullPath, name)
        if (found) return found
      } else if (file === `${name}.js`) {
        return fullPath
      }
    }
    return null
  }

  const pluginFile = findPluginFile(baseDir, text)
  if (!pluginFile) return m.reply(`🗃️ *Plugin tidak ditemukan!*\n\nPastikan nama benar.`)

  const relPath = pluginFile.replace(process.cwd(), '').replace(/^\//, '')
  await m.reply(`📂 *Membuka:*\n> ${relPath}\n\n🧩 *Plugin:* ${text}`)

  try {
    const content = fs.readFileSync(pluginFile, 'utf8')

    const buttons = [
      {
        name: "cta_copy",
        buttonParamsJson: JSON.stringify({
          display_text: "📋 Copy Kode",
          copy_code: content
        })
      }
    ]

    const caption = `📜 *Isi Plugin:* ${text}`

    const buttonMessage = generateWAMessageFromContent(
      m.chat,
      {
        viewOnceMessage: {
          message: {
            interactiveMessage: proto.Message.InteractiveMessage.create({
              body: { text: content }, 
              nativeFlowMessage: { buttons },
            }),
          },
        },
      },
      { quoted: m }
    )

    await conn.relayMessage(m.chat, buttonMessage.message, {})
  } catch (e) {
    console.error(e)
    m.reply(`❌ Gagal membaca plugin:\n${e.message}`)
  }
}

handler.help = ['getplugin', 'gp']
handler.tags = ['owner']
handler.command = /^(gp|getplugin|gplan)$/i
handler.rowner = true

export default handler