import fetch from 'node-fetch'

const fkontak = {
    key: { participant: '0@s.whatsapp.net', remoteJid: '0@s.whatsapp.net', fromMe: false, id: 'Halo' },
    message: { conversation: `iPhone Quoted 📱` }
};

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return conn.reply(m.chat, `❗Gunakan Format: ${usedPrefix + command} Pesan\nContoh: ${usedPrefix + command} kamuu kok cantiii banget sii`, m, { quoted: fkontak })

  let battery = conn.user.battery?.value ?? 80

  let time = new Date().toLocaleString('en-GB', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
  let messageText = text.trim()

  await conn.reply(m.chat, '⏳ Sedang membuat gambar iPhone Quoted, mohon tunggu...', m, { quoted: fkontak })

  try {
    let url = `https://brat.siputzx.my.id/iphone-quoted?time=${encodeURIComponent(time)}&batteryPercentage=${battery}&carrierName=INDOSAT&messageText=${encodeURIComponent(messageText)}&emojiStyle=apple`

    let res = await fetch(url)
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`)

    let buffer = await res.buffer()
    await conn.sendMessage(m.chat, { image: buffer, caption: `✅ Gambar IQC Berhasil Dibuat!` }, { quoted: fkontak })

  } catch (e) {
    console.error(e)
    await conn.reply(m.chat, `❌ Terjadi kesalahan: ${e.message}`, m, { quoted: fkontak })
  }
}

handler.help = ['iqc <pesan>']
handler.tags = ['maker']
handler.command = ['iqc']

export default handler