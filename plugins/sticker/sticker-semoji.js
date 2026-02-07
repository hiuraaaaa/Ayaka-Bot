import { Sticker, StickerTypes } from 'wa-sticker-formatter'
var handler = async (m, { conn, args }) => {
  if (!args[0]) throw 'Harap sertakan emoji! Contoh: .semoji 😎'

  try {
    let emoji = args[0]
    let codePoints = [...emoji].map(char => char.codePointAt(0).toString(16)).join('-')
    let url = `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/${codePoints}.png`
    let name = await conn.getName(m.sender)

    const sticker = new Sticker(url, {
      pack: 'Miyako',
      author: name,
      type: StickerTypes.DEFAULT
    })

    const buffer = await sticker.toBuffer()
    await conn.sendFile(m.chat, buffer, 'emoji.webp', '', m)
  } catch (e) {
    throw `Gagal membuat stiker emoji: ${e}`
  }
}

handler.help = ['semoji <emoji>']
handler.tags = ['sticker']
handler.command = /^(emoji|smoji|semoji)$/i
export default handler