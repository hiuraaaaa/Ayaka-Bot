import {
    generateWAMessageFromContent
} from "@adiwajshing/baileys";
import axios from 'axios';
import * as cheerio from 'cheerio';

async function drakorSearch(query) {
    let url = 'https://drakorpedia.me/api/search?query='
    
    let headers = {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36"
      }

    try {
       let response = await axios.get(url + query, { headers })
       let data = response.data.data
       let drakor = [];
       for (let i = 0; i < data.length; i++) {
           let title = data[i].title
           let slug = data[i].slug
           let poster = data[i].poster
           let date = new Date(data[i].released_at);
           let formattedDate = date.toISOString().slice(0, 10);

           // data[i].released_at = formattedDate;
              drakor.push({
                  title: title,
                  thumb: "https://drakorpedia.me" + poster,
                  rilis: formattedDate,
                  upload: data[i].updated_at,
                  url: "https://drakorpedia.me/title/" + slug
                  })
         }
        let result = {
           status: true,
           creator: 'Lann4you',
           data: drakor
            }
        // console.log(result.data)
         return result
      } catch(error) {
      console.log(error)
      return error
     }
   return
}

let handler = async(m, { text, conn, usedPrefix, command }) => {
  if (!text) return m.reply(`Drakor apa yang kamu cari?\n*Contoh:* ${usedPrefix + command} My love`)
  conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key }})
 // m.reply('Sedang Mencari Drakor Yang Kamu Mau')

  let { data } = await drakorSearch(text)
  if (data && data.length > 0) {
  let nuy = data
  let teks = nuy.map(i => {
  
  return `*〔 ${i.title} 〕*
*Rilis:* 
* ${i.rilis}
*New Episode:* 
* ${i.upload}
*Link Nonton:* 
* ${i.url}`.trim();
}).join('\n\n✤╾─────────────╼✤\n\n')
     
     let msg = await generateWAMessageFromContent(m.chat, {
                extendedTextMessage: {
                text: teks,
                contextInfo: {
                   mentionedJid: [m.sender],
                   externalAdReply :{
                   mediaUrl: '', 
                   mediaType: 1,
                   title: data[0].title,
                   body: '',
                   thumbnailUrl: 'https://telegra.ph/file/d7fbce996f821966c4c1f.png',
                   sourceUrl: '',
                   renderLargerThumbnail: true, 
                   showAdAttribution: false
                   }}}}, { quoted: flok })

            await conn.relayMessage(m.chat, msg.message, {});
       } else if (!data.length) {
            m.reply('Tidak ada hasil dari pencarian: ' + text)
            } else {
         m.reply(eror)
     }
}
handler.tags = ['search']
handler.help = ['drakor <judul>']
handler.command = /^(drakor)/i
handler.limit = true

export default handler