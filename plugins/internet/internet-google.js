import { generateWAMessageFromContent } from "@adiwajshing/baileys";
import axios from 'axios';

async function google(query) {
try {
     let res = await axios.get(`https://www.googleapis.com/customsearch/v1?key=AIzaSyB6HpEVkEvrexlhUFiwZii9R7dCqVEkBjk&cx=a3a45013127e34795&q=${query}`)
     if (res.data.items) {
     let items = res.data.items
     let results = []
     for (let i = 0; i < items.length; i++) {
         let title = items[i].title
         let link = items[i].link
         let snippet = items[i].snippet
         results.push({ title, link, snippet })
         }
      let result = {
            status: true,
            creator: 'Lann4you',
            data: results
          }
         console.log(result)
         return result
        } else {
         let noResult = {
               status: false,
               creator: 'Lann4you',
               data: `Page Not found :/`
            }
        console.log(noResult)
        return noResult
         }
     } catch (error) {
       console.log(error)
       return error
    }
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`Apa yang ingin kamu cari?\n*Contoh:* ${usedPrefix + command} chatGPT`);
        conn.sendMessage(m.chat, { react: { text: '📬', key: m.key }})
        let res = await google(text)
        let { status, data } = res

        if (status == true && data && data.length > 0) {
            let nuuy = data;
            let teks = nuuy.map(nuy => {
                return `* *Title:* ${nuy.title}
* *Desk:* ${nuy.snippet}
* *Url:* ${nuy.link}
`.trim();
            }).join("\n\n✦───────────✦\n\n");
            
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
                   thumbnailUrl: 'https://telegra.ph/file/dfe9e72596e4b5a3f0ac1.jpg',
                   sourceUrl: data[0].link,
                   renderLargerThumbnail: true, 
                   showAdAttribution: false
                   }}}}, { quoted: flok })

            await conn.relayMessage(m.chat, msg.message, {});
        } else if (status == false && data) {
          m.reply(data)
     }
}

handler.help = ["google <pencarian>"];
handler.tags = ["internet"];
handler.command = /^(google|gugel|googlee)$/i;

export default handler;