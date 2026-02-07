import axios from 'axios'
import * as cheerio from 'cheerio'

async function twitDown(url) {
try {
     let res = await axios('https://twitsave.com/info?url=' + encodeURIComponent(url), {
             method: 'GET',
             headers: {
               'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
               'Accept-Encoding': 'gzip, deflate, br',
               'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
               'Cookie': 'XSRF-TOKEN=eyJpdiI6IkdVUG1tbDI3a3BDUDJmRzQrL3V2WHc9PSIsInZhbHVlIjoiL0VkV05kb1VOZE1UQTk4Tm9VKytHclJZUGhEYVpXTUdpSmlyYzdlT2hrUnNVeG9BZmpWb0QyeWd2RHlaSlBBUDB0dHBUek9KaklhZExCUGpHMERVUDY1TXFJT0xBOE5ybEVMVzdxQ0ladG5rTzV5ZWswZ1BRZUd4WmNyUnFqL3UiLCJtYWMiOiI4NjhmZTFkYmRjNWE2NzEwZmZjNzEwMWMzMDNlZGU1MmNiODBlNjU2OTNkMTliOGFlOTliOGY1YjNlZjEwNjhkIiwidGFnIjoiIn0%3D; twitsave_session=eyJpdiI6IjN6bTVTRG0zSTdxZ2pRWHhiOGcwd1E9PSIsInZhbHVlIjoiR3dOcURldGkrZU52WHVYQ2xXZlFZUTduWGR5ZXF5L243M3FjbGpiUWRSWVhzbXhWVFFCa0o1VWtwa2pteDgyUTJsVkYxMVZnZFdSNk9wYXRHQ3Uwa1JoS1haV2ZqT0FtWVlHVEY1OXFFZFNOS3RLNVhFMWVRV1RVOTFGcmYwOWEiLCJtYWMiOiIxZWEzZGZiN2I3ZGUxZWU0NmFhNDk5NzEwM2ZlM2E0YjY1ZTIyMDAzNGQ3ZDMzMzRhOGZlYTI3NmEzMWFmNjQ4IiwidGFnIjoiIn0%3D',
               'Referer': 'https://twitsave.com/info?url',
               'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
             }
         })
     let $ = await cheerio.load(res.data)
     let a = $('a[target]')
     let font = []
     a.each((i, e) => {
     if (i < 2) {
        let info = $(e).text()
        let url = $(e).attr('href')
        font.push({ info, url })
         }
     })
   //  let author = font[0].info
     let url_author = font[0].url
     let split = url_author.split('')
     let author = split.slice(20).join('')
     let up = font[1].info
     let title = $('p[class="m-2"]').text()
     let vids = $('video[class]')
     let mp4 = vids.attr('src')
     let result = {
           status: true,
           creator: 'Lann4you',
           data: {
             title: title,
             username: '@' + author,
             url_author: url_author,
             upload: up,
             video: mp4
         }
     }
     console.log(result)
     return result
     } catch(error) {
       console.log(error)
       return error
     }
}

let handler = async(m, { args, text, conn, usedPrefix, command }) => {
  if (!text) return m.reply(`Urlnya Mana?\n\n*Contoh:* ${usedPrefix + command} https://x.com/Xxxxxxx\n> Khusus Video!`)
  
  conn.sendMessage(m.chat, { react: { text: '🦜', key: m.key }})
  let res = await twitDown(text)
  let { title, username, url_author, upload, video } = res.data
  
  if (video && title) {
     await conn.sendFile(m.chat, video, '', `\`<\\> T W I T T E R <\\>\`\n\n*- Title:* ${title}\n*- Upload:* ${upload}\n*- Username:* ${username}\n*- Url Author:* ${url_author}`, m, 0, {
      mimetype: "video/mp4",
      fileName: `saa.mp4`
    });
    conn.sendMessage(m.chat, { react: { text: '✅', key: m.key }})
  } else {
    console.log('eror kak, hub owner')
   }
}
handler.tags = ['downloader']
handler.help = ['twit','twitter','x']
handler.command = /^(twit|twitter|x)$/i
handler.register = true
handler.limit = true

export default handler