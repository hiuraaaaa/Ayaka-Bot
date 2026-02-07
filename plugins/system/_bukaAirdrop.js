let handler = async (m, { conn, text, command }) => {
  conn.airdrop = conn.airdrop || {}

  const chatId = m.chat
  const airdrop = conn.airdrop[chatId]
  const users = global.db.data.users[m.sender]

  const fkontak = {
    key: {
      participants: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
      fromMe: false,
      id: "Halo"
    },
    message: {
      contactMessage: {
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
      }
    },
    participant: "0@s.whatsapp.net"
  }

  if (!airdrop) return

  const msg = airdrop.msg

  if (airdrop.users.includes(m.sender))
    return m.reply('❕Kamu sudah mengambil hadiah ini, tunggu *🎁 AirDrop* berikutnya!')

  if (airdrop.users.length >= 10)
    return m.reply('*Yahh, kamu kehabisan AirDrop-nya :/*')

  let quotedText = ''
  if (m.quoted) {
    const q = m.quoted
    const qmsg = q.message || q.msg || {}

    if (typeof q.text === 'string') quotedText = q.text
    else if (qmsg.conversation) quotedText = qmsg.conversation
    else if (qmsg.extendedTextMessage?.text) quotedText = qmsg.extendedTextMessage.text
    else if (qmsg.templateMessage?.hydratedTemplate?.hydratedContentText)
      quotedText = qmsg.templateMessage.hydratedTemplate.hydratedContentText
    else if (qmsg.interactiveMessage?.body?.text)
      quotedText = qmsg.interactiveMessage.body.text
    else if (qmsg.viewOnceMessage?.message?.extendedTextMessage?.text)
      quotedText = qmsg.viewOnceMessage.message.extendedTextMessage.text
  }

  const isReplyValid =
    m.quoted &&
    m.quoted.fromMe &&
    /Ketik.*buka|AirDrop turun/i.test(quotedText)

  if (!isReplyValid) {
    return conn.sendMessage(
      m.chat,
      {
        text: `⚠️ Balas pesan *AirDrop* dengan mengetik *.buka* untuk membukanya.`,
        mentions: [m.sender]
      },
      { quoted: msg }
    )
  }

  const money = Math.floor(Math.random() * 30000000)
  const exp = Math.floor(Math.random() * 130000)
  const dm = Math.floor(Math.random() * 40)
  const boxs = Math.floor(Math.random() * 60)

  const cap = `*[ 🎁🎉 Kamu Telah Membuka AirDrop ]*

\`AirDrop-ID:\` ${airdrop.id}

*Hadiah AirDrop:*
* 💵 *Money:* ${money.toLocaleString()}
* 🧪 *Exp:* ${exp.toLocaleString()}
* 💎 *Diamond:* ${dm}
* 📦 *Boxs:* ${boxs}

\`Setiap user hadiahnya berbeda-beda\``

  users.money += money
  users.exp += exp
  users.diamond += dm
  users.boxs += boxs
  users.rock = (users.rock || 0) + 1
  airdrop.users.push(m.sender)

  await conn.sendMessage(
    m.chat,
    {
      text: cap,
      contextInfo: {
        mentionedJid: [m.sender],
        externalAdReply: {
          showAdAttribution: false,
          title: `[🎉🎀 Open AirDrop]`,
          body: '',
          thumbnailUrl: 'https://telegra.ph/file/2481af9d807753ed42fd8.jpg',
          sourceUrl: '',
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    },
    { quoted: fkontak }
  )

  if (airdrop.users.length >= 10) {
    try {
      await conn.sendMessage(chatId, {
        delete: {
          remoteJid: chatId,
          fromMe: true,
          id: msg.key.id,
          participant: msg.key.participant
        }
      })
    } catch (e) {
      console.log('❌ Gagal hapus pesan AirDrop:', e)
    }

    await conn.reply(
      m.chat,
      '*🎁 AirDrop* telah habis, maksimum 10 player yang mendapatkannya.',
      fkontak
    )
    delete conn.airdrop[chatId]
  }
}

handler.command = /^(buka)$/i
export default handler