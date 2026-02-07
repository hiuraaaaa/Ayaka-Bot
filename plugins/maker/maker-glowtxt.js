import fetch from 'node-fetch'

let handler = async (m, { text, conn, usedPrefix, command }) => {
  if (!text) throw `Contoh: ${usedPrefix + command} UbedBot`

  // Tambahan efek default
  const url = `https://fastrestapis.fasturl.cloud/maker/glowtxt?text=${encodeURIComponent(text)}&style=sweetheart&glow=1&animation=pulse`

  await conn.sendMessage(m.chat, { react: { text: '✨', key: m.key } })

  try {
    const res = await fetch(url)
    if (!res.ok) throw 'Gagal mengambil gambar.'

    const mime = res.headers.get('content-type')
    const buffer = await res.buffer()

    // Kirim sebagai dokumen jika WhatsApp menolak gambar animasi langsung
    conn.sendMessage(m.chat, {
      document: buffer,
      mimetype: mime,
      fileName: `glowtxt.${mime.includes('gif') ? 'gif' : 'png'}`
    }, { quoted: m })
  } catch (err) {
    console.error(err)
    throw 'Gagal mengambil hasil dari API. Pastikan servernya sedang aktif.'
  }
}

handler.help = ['glowtxt <teks>']
handler.tags = ['maker']
handler.command = /^glowtxt$/i

export default handler