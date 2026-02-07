import axios from 'axios';

async function transYt(url) {
try {
    let response = await axios.get(`https://api.anthiago.com/transkrip/get_subs?url=` + url, {
         headers: {
             'Accept': '*/*',
             'Accept-Encoding': 'gzip, deflate, br',
             'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7&',
             'Cookie': 'cf_clearance=os4IxjkWy7UqgKbzs..oeXkY6IP7pp9DqluFrgjaPHs-1720963363-1.0.1.1-2e6zVLxNKX5aaC1sVNR1x6So1w40FWK1gebhjAEUO2nHfgMx9EVdg.wwxg3T5nf.of9mJGpB7BJJ7BqHWX13yQ',
             'Origin': 'https://anthiago.com/transkrip',
             'Referer': 'https://anthiago.com/transkrip/',
             'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36'
           }
        })
        let sub = response.data.subtitles
        let text = []
        for (let i = 0; i < sub.length; i++) {
            let ipah = sub[i].f
            text.push(ipah)
         //   console.log(text)
          }
          let subtitle = text.join(' ')
          let result = {
                status: true,
                creator: 'Lann4you',
                subtitle: subtitle
              }
           return result
          // console.log(result)
     } catch(error) {
       console.log(error)
       return error
   }
}

let linkRegex = /https:\/\/youtu\.be\/watch\/[0-9A-Za-z]+/i;

let handler = async(m, { text, conn, usedPrefix, command }) => {
  if (!text) return m.reply(`Url nya mana?\n\n*Contoh:* ${usedPrefix + command} https://youtu.be/XxXxXx\n> khusus video YouTube.`)
  conn.sendMessage(m.chat, { react: { text: '📝', key: m.key }})
  
  let { subtitle } = await transYt(text);
  
  if (subtitle && subtitle.split(' ').length) {
     await conn.reply(m.chat, subtitle, m)
     conn.sendMessage(m.chat, { react: { text: '📕', key: m.key }})
     } else {
     m.reply('Error kak')
     }
}
handler.tags = ['tools']
handler.help = ['transyt <url>']
handler.command = /^(transyt)$/i
handler.limit = true;
handler.register = true;

export default handler