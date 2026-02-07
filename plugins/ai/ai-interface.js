import axios from 'axios'
const { proto, generateWAMessageFromContent } = (await import('@adiwajshing/baileys')).default

const defaultPrompt = 'Kamu adalah asisten AI bergaya tsundere. Kamu menjawab dengan nada dingin, agak jutek, tapi sebenarnya peduli dan suka membantu. Jawabanmu tetap singkat, informatif, namun menunjukkan kepribadian tsundere yang khas.'

const availableModels = [
  'gpt-4.1-nano',
  'gpt-4.1-mini',
  'gpt-4.1',
  'gpt-4o-mini',
  'gpt-4o',
  'o3',
  'o4-mini',
  'llama-3.3',
  'deepseek-r1',
  'deepseek-v3',
  'claude-3.7',
  'gemini-2.0',
  'grok-3-mini',
  'qwen-qwq-32b'
]

async function chatai(question, model = 'gpt-4.1-mini', system_prompt = defaultPrompt) {
  const headers = {
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0',
    'Referer': 'https://ai-interface.Lann4youofc.my.id/'
  }

  const body = { question, model, system_prompt }

  const { data } = await axios.post(
    'https://ai-interface.Lann4youofc.my.id/api/chat',
    body,
    { headers, timeout: 20000 }
  )

  return data
}

let handler = async (m, { conn, text, command }) => {
  switch (command) {
    case 'aiinterface': {
      if (!text) {
        return await conn.sendMessage(m.chat, {
          text: `👋 *AI Chat Interface*\n\n📌 Cara pakai:\n.aiinterface <pertanyaan>\n\nContoh:\n.aiinterface Apa itu AI?\n\n📦 Lalu pilih model AI dari daftar tombol.`
        }, { quoted: m })
      }

      const sections = [{
        title: "🧠 Pilih Model AI yang Kamu Mau",
        rows: availableModels.map(name => ({
          title: `✨ ${name}`,
          description: "Klik untuk gunakan model ini",
          id: `.chatmodel ${name}|||${text}`
        }))
      }]

      const listMessage = {
        title: "🌐 AI Interface Model Pilihan",
        sections
      }

      const caption = `💬 *Pertanyaan:* "${text}"\n\nPilih salah satu model di bawah ini buat dapet jawaban... b-bukan karena aku peduli ya! 😳`

      const msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
          message: {
            interactiveMessage: proto.Message.InteractiveMessage.create({
              body: proto.Message.InteractiveMessage.Body.create({ text: caption }),
              header: proto.Message.InteractiveMessage.Header.create({ title: "🌟 AI Chat Interface\n", hasMediaAttachment: false }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                buttons: [{
                  name: "single_select",
                  buttonParamsJson: JSON.stringify(listMessage)
                }]
              })
            })
          }
        }
      }, {
        quoted: m,
        contextInfo: { mentionedJid: [m.sender] }
      })

      return conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
    }

    case 'chatmodel': {
      if (!text.includes('|||')) {
        return conn.sendMessage(m.chat, {
          text: `❌ Format salah. Harus pakai .chatmodel <model>|||<pertanyaan>.`
        }, { quoted: m })
      }

      const [model, ...qParts] = text.split('|||')
      const question = qParts.join('|||').trim()
      const modelName = model.trim()

      if (!availableModels.includes(modelName)) {
        return conn.sendMessage(m.chat, {
          text: `❌ Model *${modelName}* tidak ditemukan.\n\n🧠 Model yang tersedia:\n${availableModels.join(', ')}`
        }, { quoted: m })
      }

      await conn.sendMessage(m.chat, { react: { text: '💢', key: m.key } })

      try {
        const result = await chatai(question, modelName)
        const response = result?.response || '❌ Dia nggak jawab... dasar menyebalkan!'
        return conn.sendMessage(m.chat, {
          text: `🌸 *Model ${modelName} bilang:*\n\n${response}`
        }, { quoted: m })
      } catch (e) {
        return conn.sendMessage(m.chat, {
          text: `❌ Gagal menjawab:\n${e.message}`
        }, { quoted: m })
      }
    }
  }
}

handler.help = ['aiinterface <teks>']
handler.tags = ['ai']
handler.command = ['aiinterface', 'chatmodel']
handler.limit = 5
handler.register = true

export default handler