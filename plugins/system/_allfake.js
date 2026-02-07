import fs from 'fs'
import moment from 'moment-timezone'

let handler = m => m
handler.all = async function (m) {
    let name = await conn.getName(m.sender) 
    let pp = 'https://telegra.ph/file/98a83fcdfdbea8be6d6b7.jpg'
    
    try {
        pp = await this.profilePictureUrl(m.sender, 'image')
    } catch (e) {}
    
    const ucapan = getUcapan()
    const thumb = getThumbnailByTime()
    
    global.adReply = {
  contextInfo: {
      mentionedJid: [m.sender],
      forwardingScore: 1,
      isForwarded: true,
      
      forwardedNewsletterMessageInfo: {
          newsletterName: 'Saluler Id 🌍',
          newsletterJid: '120363419084530852@newsletter',
          },
      externalAdReply: {
      showAdAttribution: false,
      title: `AYAKA BY SALULER.ID 🌍`,
      body: ucapan,
      thumbnailUrl: thumb,
      sourceUrl: 'https://whatsapp.com/channel/0029Vb6ZBu9C1Fu6APA9JN0f',
    }
  }
}
    global.fdocs = {
        key: { participant: '0@s.whatsapp.net' },
        message: {
            documentMessage: {
                title: '🔥Ayaka Bot Premium', 
                jpegThumbnail: fs.readFileSync('./thumbnail.jpg')
            }
        }
    }
}

export default handler

function getUcapan() {
    const time = moment.tz('Asia/Jakarta').format('HH')
    if (time >= 4 && time < 10) return "Selamat pagi sayang🌄"
    if (time >= 10 && time < 15) return "Selamat siang sayang☀️"
    if (time >= 15 && time < 18) return "Selamat sore sayang🌅"
    return "Selamat malam sayang🌙"
}

function getThumbnailByTime() {
  const time = moment.tz('Asia/Jakarta').format('HH')
  if (time >= 4 && time < 10) return 'https://c.termai.cc/a97/DyFtN.jpg' // pagi
  if (time >= 10 && time < 15) return 'https://c.termai.cc/a97/DyFtN.jpg' // siang
  if (time >= 15 && time < 18) return 'https://c.termai.cc/a97/DyFtN.jpg' // sore
  return 'https://c.termai.cc/a97/DyFtN.jpg' // malam
}