import fetch from 'node-fetch'

const fkontak = {
    key: { participant: '0@s.whatsapp.net', remoteJid: '0@s.whatsapp.net', fromMe: false, id: 'Halo' },
    message: { conversation: `iPhone Quoted ✨` }
};

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return conn.reply(m.chat, `❗Gunakan Format: ${usedPrefix + command} Jam|Baterai|Pesan\nContoh: ${usedPrefix + command} 20:00|68|kamuu kok cantiii banget sii`, m, { quoted: fkontak })

  let [time, battery, ...msg] = text.split('|')
  if (!time || !battery || msg.length === 0) return conn.reply(m.chat, `❌ Format Salah. Gunakan Format: ${usedPrefix + command} Jam|Baterai|Pesan\nContoh: ${usedPrefix + command} 20:00|68|kamuu kok cantiii banget sii`, m, { quoted: fkontak })

  await conn.reply(m.chat, '⏳ Sedang membuat gambar iPhone Quoted, mohon tunggu...', m, { quoted: fkontak })

  try {
    let messageText = encodeURIComponent(msg.join('|').trim())
    let url = `https://brat.siputzx.my.id/iphone-quoted?time=${encodeURIComponent(time)}&batteryPercentage=${battery}&carrierName=INDOSAT&messageText=${messageText}&emojiStyle=apple`

    let res = await fetch(url)
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`)

    let buffer = await res.buffer()
    await conn.sendMessage(m.chat, { image: buffer, caption: `✅ Gambar IQC Berhasil Dibuat!` }, { quoted: fkontak })

  } catch (e) {
    console.error(e)
    await conn.reply(m.chat, `❌ Terjadi kesalahan: ${e.message}`, m, { quoted: fkontak })
  }
}

handler.help = ['iqc2 <jam|baterai|pesan>']
handler.tags = ['maker']
handler.command = ['iqc2']

export default handler