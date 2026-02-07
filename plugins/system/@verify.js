import { createHash } from 'crypto'

let handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender]

  if (user.registered)
    return m.reply('⚠️ Kamu udah pernah daftar nih!\nKalau mau daftar ulang, ketik *.unreg* ya 😏')

  if (!user.verifyStep) {
    user.verifyStep = 'waitingAge'
    return m.reply(
      `💌 Haii ${m.pushName || 'teman baru'}!~\nSebelum kita lanjut, umurmu berapa nih?\n\nKetik angka aja ya, contoh *20* ✨`,
      null,
      { quoted: m } 
    )
  }

  if (user.verifyStep === 'waitingAge') {
    if (!m.text) return
    if (isNaN(m.text)) return m.reply('😅 Itu bukan angka deh...\nCoba ketik umur kamu pakai angka aja, contoh: *20*')

    const age = parseInt(m.text)
    if (age < 5 || age > 100)
      return m.reply('😶 Serius nih umurnya segitu?\nKetik angka antara *5–100* aja ya.')

    user.age = age
    user.registered = true
    user.verifyStep = null

    const sn = createHash('md5').update(m.sender).digest('hex')
    const p = `🎉 *Verifikasi Berhasil!* 🎉\n\n📛 Nama: *${m.pushName || 'User'}*\n🎂 Umur: *${age} tahun*\n🔑 SN: *${sn}*\n\nSekarang ketik *menu* buat lanjut main bareng bot! 😎`

    const arr = [
      { text: `*[ V ]*\n\n${p}`, timeout: 100 },
      { text: `*[ V E ]*\n\n${p}`, timeout: 100 },
      { text: `*[ V E R ]*\n\n${p}`, timeout: 100 },
      { text: `*[ V E R I ]*\n\n${p}`, timeout: 100 },
      { text: `*[ V E R I F ]*\n\n${p}`, timeout: 100 },
      { text: `*[ V E R I F Y ]*\n\n${p}`, timeout: 100 },
      { text: `*[ V E R I F Y   S ]*\n\n${p}`, timeout: 100 },
      { text: `*[ V E R I F Y   S U ]*\n\n${p}`, timeout: 100 },
      { text: `*[ V E R I F Y   S U C ]*\n\n${p}`, timeout: 100 },
      { text: `*[ V E R I F Y   S U C C ]*\n\n${p}`, timeout: 100 },
      { text: `*[ V E R I F Y   S U C C E ]*\n\n${p}`, timeout: 100 },
      { text: `*[ V E R I F Y   S U C C E S ]*\n\n${p}`, timeout: 100 },
      { text: `*[ V E R I F Y   S U C C E S S ]*\n\n${p}`, timeout: 100 },
    ]

    const lll = await m.reply('🕐 Tunggu bentar ya, lagi ngecek umur kamu...', null, { quoted: m })

    for (let i = 0; i < arr.length; i++) {
      await new Promise(resolve => setTimeout(resolve, arr[i].timeout))
      await conn.relayMessage(m.chat, {
        protocolMessage: {
          key: lll.key,
          type: 14,
          editedMessage: { conversation: arr[i].text },
        },
      }, {})
    }
  }
}

handler.before = async (m, { conn }) => {
  let user = global.db.data.users[m.sender]
  if (!user) return
  if (user.verifyStep === 'waitingAge' && /^\d+$/.test(m.text)) {
    const age = parseInt(m.text)
    if (age >= 5 && age <= 100) {
      user.age = age
      user.registered = true
      user.verifyStep = null

      const sn = createHash('md5').update(m.sender).digest('hex')
      const p = `🎉 *Verifikasi Berhasil!* 🎉\n\n📛 Nama: *${m.pushName || 'User'}*\n🎂 Umur: *${age} tahun*\n🔑 SN: *${sn}*\n\nSekarang ketik *.menu* buat lanjut main bareng bot! 😎`

      const arr = [
        { text: `*[ V ]*\n\n${p}`, timeout: 100 },
        { text: `*[ V E ]*\n\n${p}`, timeout: 100 },
        { text: `*[ V E R ]*\n\n${p}`, timeout: 100 },
        { text: `*[ V E R I ]*\n\n${p}`, timeout: 100 },
        { text: `*[ V E R I F ]*\n\n${p}`, timeout: 100 },
        { text: `*[ V E R I F Y ]*\n\n${p}`, timeout: 100 },
        { text: `*[ V E R I F Y   S ]*\n\n${p}`, timeout: 100 },
        { text: `*[ V E R I F Y   S U ]*\n\n${p}`, timeout: 100 },
        { text: `*[ V E R I F Y   S U C ]*\n\n${p}`, timeout: 100 },
        { text: `*[ V E R I F Y   S U C C ]*\n\n${p}`, timeout: 100 },
        { text: `*[ V E R I F Y   S U C C E ]*\n\n${p}`, timeout: 100 },
        { text: `*[ V E R I F Y   S U C C E S ]*\n\n${p}`, timeout: 100 },
        { text: `*[ V E R I F Y   S U C C E S S ]*\n\n${p}`, timeout: 100 },
      ]

      const lll = await m.reply('🕐 Lagi ngecek umur kamu...', null, { quoted: m })
      for (let i = 0; i < arr.length; i++) {
        await new Promise(resolve => setTimeout(resolve, arr[i].timeout))
        await conn.relayMessage(m.chat, {
          protocolMessage: {
            key: lll.key,
            type: 14,
            editedMessage: { conversation: arr[i].text },
          },
        }, {})
      }
    }
  }
}

handler.help = ['@verify']
handler.tags = ['main']
handler.customPrefix = /^(@verify)$/i
handler.command = new RegExp

export default handler