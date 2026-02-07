import axios from 'axios'

const models = {
  'ChatGPT-4o': 'chatgpt-4o',
  'ChatGPT-4o Mini': 'chatgpt-4o-mini',
  'Claude 3 Opus': 'claude-3-opus',
  'Claude 3.5 Sonnet': 'claude-3-sonnet',
  'Llama 3': 'llama-3',
  'Llama 3.1 (Pro)': 'llama-3-pro',
  'Perplexity AI': 'perplexity-ai',
  'Mistral Large': 'mistral-large',
  'Gemini 1.5 Pro': 'gemini-1.5-pro'
}

async function askAI(prompt, modelKey) {
  const model = models[modelKey]
  if (!model) return `Model "${modelKey}" tidak tersedia.`

  try {
    const { data } = await axios.post('https://whatsthebigdata.com/api/ask-ai/', {
      message: prompt,
      model,
      history: []
    }, {
      headers: {
        'content-type': 'application/json',
        'origin': 'https://whatsthebigdata.com',
        'referer': 'https://whatsthebigdata.com/ai-chat/',
        'user-agent': 'Mozilla/5.0'
      }
    })

    if (data?.text)
      return `*Model:* ${modelKey}\n\n*Prompt:* ${prompt}\n\n*Jawaban:*\n${data.text}`

    return '❌ Gagal menerima jawaban.'
  } catch (e) {
    return `❌ Error: ${e.response?.status === 400 ? 'Prompt dilarang oleh model.' : e.message}`
  }
}

let handler = async (m, { conn, args, text, command }) => {

  if (text.includes('||')) {
    let [modelKey, prompt] = text.split('||').map(v => v.trim())
    if (!models[modelKey]) return m.reply(`❌ Model "${modelKey}" tidak dikenali.`)

    await conn.sendMessage(m.chat, { react: { text: '💻', key: m.key } })
    let res = await askAI(prompt, modelKey)
    return m.reply(res)
  }

  if (!text) return m.reply(`Kirim prompt ke AI-nya.\n\nContoh:\n.askai cara jadi orang kaya`)

  const modelList = Object.keys(models)

  return await conn.sendMessage(m.chat, {
    text: `Pilih model AI untuk menjawab:\n\n*${text}*`,
    footer: 'Tekan tombol di bawah untuk memilih model AI',
    buttons: modelList.map(name => ({
      buttonId: `.askai ${name} || ${text}`,
      buttonText: { displayText: name },
      type: 1
    })),
    headerType: 1
  }, { quoted: m })
}

handler.command = /^askai$/i
handler.tags = ['ai']
handler.help = ['askai <prompt>']
export default handler