import fs from 'fs'
import path from 'path'

const _fs = fs.promises

let handler = async (m, { args }) => {
  if (!m.quoted) throw `❌ Balas pesan yang ingin disimpan!\n\nContoh: *.sp3 data/info.txt*`

  if (!args[0]) throw `❌ Path tujuan tidak boleh kosong!\nContoh: *.sp3 data/simpan.js*`

  const quoted = m.quoted
  const filePath = path.resolve(args[0])

  try {
    let content

    if (typeof quoted.download === 'function') {
      // Jika media, download sebagai buffer
      content = await quoted.download()
      if (!content) throw '❌ Gagal mendownload media.'
    } else if (quoted.text) {
      // Jika teks, ambil teksnya
      content = quoted.text
    } else {
      throw '❌ Tidak dapat menyimpan: pesan tidak memiliki media atau teks.'
    }

    await _fs.mkdir(path.dirname(filePath), { recursive: true })

    // Deteksi apakah konten buffer atau string
    if (Buffer.isBuffer(content)) {
      await _fs.writeFile(filePath, content)
    } else {
      await _fs.writeFile(filePath, content, 'utf-8')
    }

    m.reply(`✅ Berhasil menyimpan ke:\n*${filePath}*`)
  } catch (e) {
    console.error(e)
    throw `❌ Gagal menyimpan file: ${e.message || e}`
  }
}

handler.help = ['sp3 <path/namafile>']
handler.tags = ['owner']
handler.command = /^sp3$/i
handler.rowner = true

export default handler