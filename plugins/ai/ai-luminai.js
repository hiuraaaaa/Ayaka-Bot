import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {
  try {
    if (!text) return m.reply ('Example: .luminai halo');

    const res = await fetch(`https://Lann4youoffc.biz.id/api/ai/luminai?text=${encodeURIComponent(text)}`)
    const json = await res.json()

    const reply = json.result || 'Maaf, aku tidak bisa menjawab.'

    await conn.sendMessage(m.chat, { text: reply }, { quoted: m })

  } catch (e) {
    console.error('Rest Api Tidak Merespon, Sensei:(', e)
    await conn.sendMessage(m.chat, { text: 'Terjadi kesalahan.' }, { quoted: m })
  }
}
handler.tags = ['ai'];
handler.help = ['luminai'];
handler.command = ['luminai'];
handler.register = true;

export default handler;