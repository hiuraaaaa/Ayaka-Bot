import axios from 'axios'

const storyCache = {}

const styleList = ['ghibli', 'pixel', 'claymation', 'cream cartoon', 'childrens simple sketch', 'sketch style', 'cartoon sticker', 'phone micro scene', 'miniature world', 'cartoon 2.5D', 'retro 90s', 'retro comic']

async function generatePictureBook({ prompt, style, aspect_ratio, chapter, has_audio }) {
  const res = await axios.post('https://storyviewer.ai/api/v1/picture-book/generate-v2', {
    description: prompt, style, aspect_ratio, chapter, has_audio
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Origin': 'https://storyviewer.ai',
      'Referer': 'https://storyviewer.ai/ai-story-generator',
      'User-Agent': 'Mozilla/5.0 (Android) Chrome Mobile Safari',
      'Accept': '*/*'
    },
    responseType: 'text'
  })

  const lines = res.data.trim().split('\n').reverse()
  const lastLine = lines.find(line => line.includes('"book_key"'))
  const jsonMatch = lastLine?.match(/data:\s*(\{.*\})/)
  const parsed = jsonMatch ? JSON.parse(jsonMatch[1]) : null
  const bookKey = parsed?.book_key
  if (!bookKey) throw 'Gagal mendapatkan book_key.'
  return bookKey
}

async function getBookDetail(bookKey) {
  const res = await axios.get(`https://storyviewer.ai/api/v1/picture-book/share?book_key=${bookKey}`, {
    headers: {
      'Referer': `https://storyviewer.ai/ai-story-generator?id=${bookKey}`,
      'User-Agent': 'Mozilla/5.0 (Android) Chrome Mobile Safari',
      'Accept': 'application/json'
    }
  })
  const data = res.data?.data
  if (!data || !data.book_title || !data.items) throw 'Data buku tidak lengkap.'
  return {
    book_key: bookKey,
    title: data.book_title,
    style: data.style,
    summary: data.summary,
    totalChapters: data.total_chapter_number,
    coverImage: data.cover_address,
    audioCover: data.audio_address,
    chapters: data.items.map(chap => ({
      number: chap.chapter_number,
      key: chap.chapter_key,
      image: chap.illustration_address,
      audio: chap.audio_address,
      text: chap.content
    }))
  }
}

let handler = async (m, { conn, args }) => {
  let id = m.sender
  const action = args[0]?.toLowerCase()

  if (!args[0]) {
    return m.reply(`Penggunaan perintah *storyai*:

.storyai <chapter> <style> <prompt>

*Contoh:* .storyai 3 ghibli kisah si kancil dan buaya

• Maksimal chapter: 6

• Pilihan style:
${styleList.map((v, i) => `${i + 1}. ${v}`).join('\n')}`)
  }

  if (action === 'next' || action === 'all') {
    if (!storyCache[id]) return m.reply('Belum ada cerita yang aktif.')
    let story = storyCache[id]
    if (action === 'all') {
      for (let ch of story.chapters) {
        await conn.sendMessage(m.chat, {
          image: { url: ch.image },
          caption: `📖 *Chapter ${ch.number}*\n\n${ch.text}`
        }, { quoted: m })
        if (ch.audio) await conn.sendFile(m.chat, ch.audio, '', '', m)
      }
      delete storyCache[id]
      return
    } else {
      story.index++
      if (story.index >= story.chapters.length) {
        delete storyCache[id]
        return m.reply('Semua chapter telah selesai dikirim.')
      }
      let ch = story.chapters[story.index]
      await conn.sendMessage(m.chat, {
        image: { url: ch.image },
        caption: `📖 *Chapter ${ch.number}*\n\n${ch.text}`,
        footer: '📚 Lanjut baca atau kirim semua?',
        buttons: [
          { buttonId: '.storyai all', buttonText: { displayText: '📖 Semua Chapter' }, type: 1 },
          { buttonId: '.storyai next', buttonText: { displayText: '⏭️ Next' }, type: 1 }
        ],
        headerType: 4
      }, { quoted: m })
      if (ch.audio) await conn.sendFile(m.chat, ch.audio, '', '', m)
      return
    }
  }

  let chapter = parseInt(args[0])
  let style = args[1]?.toLowerCase()
  let prompt = args.slice(2).join(" ")

  if (!chapter || isNaN(chapter) || chapter > 6) return m.reply('Chapter harus berupa angka dan maksimal 6.')
  if (!styleList.includes(style)) return m.reply(`Style tidak valid. Gunakan salah satu dari:\n${styleList.map((v, i) => `${i + 1}. ${v}`).join('\n')}`)
  if (!prompt) return m.reply('Masukkan cerita misalnya:\n.storyai 3 ghibli kisah si kancil dan buaya')

  try {
    await conn.sendMessage(m.chat, { react: { text: '🕑', key: m.key } })
    let bookKey = await generatePictureBook({ prompt, style, aspect_ratio: '1:1', chapter, has_audio: true })
    let detail = await getBookDetail(bookKey)
    storyCache[id] = {
      title: detail.title,
      style: detail.style,
      coverImage: detail.coverImage,
      chapters: detail.chapters,
      index: 0
    }
    let ch = detail.chapters[0]
    await conn.sendMessage(m.chat, { react: { text: '', key: m.key } })
    await conn.sendMessage(m.chat, {
      image: { url: ch.image },
      caption: `📖 *Chapter ${ch.number}*\n\n${ch.text}`,
      footer: '📚 Lanjut baca atau kirim semua?',
      buttons: [
        { buttonId: '.storyai all', buttonText: { displayText: '📖 Semua Chapter' }, type: 1 },
        { buttonId: '.storyai next', buttonText: { displayText: '⏭️ Next' }, type: 1 }
      ],
      headerType: 4
    }, { quoted: m })
    if (ch.audio) await conn.sendFile(m.chat, ch.audio, '', '', m)
  } catch (e) {
    await conn.sendMessage(m.chat, { react: { text: '', key: m.key } })
    m.reply('Gagal generate cerita. ' + e.message || e)
  }
}

handler.command = ['storyai', 'generatestoryai', 'aistory']
handler.tags = ['ai', 'internet']
handler.help = ['storyai <chapter> <style> <prompt>', 'storyai next', 'storyai all']
handler.limit = true;
handler.register = true;

export default handler