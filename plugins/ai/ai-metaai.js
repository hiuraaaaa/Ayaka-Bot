import fetch from 'node-fetch'

const handler = async (m, { conn, text, command }) => {
  if (!text) throw `Contoh: .${command} siapa presiden indonesia?`

  await conn.sendMessage(m.chat, { react: { text: '✨', key: m.key } })

  try {
    const res = await fetch(`https://api.siputzx.my.id/api/ai/metaai?query=${encodeURIComponent(text)}`)
    const json = await res.json()

    if (!json.status || !json.data) throw 'Gagal mendapatkan respons dari AI.'

    await m.reply(json.data)
  } catch (err) {
    console.error(err)
    await m.reply('Terjadi kesalahan saat menghubungi API.')
  }
}

handler.help = ['metaai <pertanyaan>']
handler.tags = ['ai']
handler.command = ['metaai','meta']
handler.register = true
handler.limit = true

export default handler