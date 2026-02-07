import axios from 'axios';
import { generateWAMessageFromContent } from '@adiwajshing/baileys';

let handler = async(m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`Film apa yang mau kamu cari?\n*Contoh:* ${usedPrefix + command} Umar bin Khattab`)
    
    m.reply(wait)
    let nuy = await axios.get(`https://api.neoxr.eu/api/film?q=${encodeURIComponent(text)}&apikey=ipahOfc`)
    
    const { status, data } = nuy.data
    
    if (status == true && data && data.length > 0) {
    let nuuy = data
    let teks = nuuy.map(i => {
    
    return `╭────•〔 *LK21* 〕
│ *[📝] Title:* ${i.title}
│ *[🤴🏻] Direktur:* ${i.directors}
│ *[🤵🏻] Aktor:* ${i.actors}
│ *[📌] Url Film:* ${i.url}`.trim()
  }).join("\n╰┈╾─━━┉─࿂\n\n© Lann4youa-Ofc\n\n")

  let msg = await generateWAMessageFromContent(m.chat, {
                extendedTextMessage: {
                text: teks,
                contextInfo: {
                   externalAdReply :{
                   mediaUrl: '', 
                   mediaType: 1,
                   title: data[0].title,
                   body: '',
                   thumbnailUrl: 'https://telegra.ph/file/6b3952ee47cf8240ad393.png',
                   sourceUrl: '',
                   renderLargerThumbnail: true, 
                   showAdAttribution: false
                   }}}}, { quoted: m })

            await conn.relayMessage(m.chat, msg.message, {});
            
          } else {
          m.reply(`Tidak ada Hasil dari *${text}`)
        }
         if (!nuy) return m.reply(`Eror kak, hubungi owner yaa`)
     
}
handler.tags = ['search']
handler.help = ['film <judul>']
handler.command = /^(film)/i
handler.limit = true

export default handler;