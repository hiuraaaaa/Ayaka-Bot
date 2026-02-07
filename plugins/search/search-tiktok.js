import axios from 'axios'
import * as cheerio from 'cheerio'

async function ttSearch(query) {
   let response = await axios('https://tikwm.com/api/feed/search', {
         method: 'POST',
         data: {
               keywords: query,
               count: 12,
               cursor: 0,
               web: 1,
               hd: 1
         },
         headers: {
               "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
               "Cookie": "current_langange=en;",
               "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36"
         }
    })
    let date = response.data.data
    let video = date.videos
    if (video.length === 0) {
    reject('Tidak Ada Video Yang Di Temukan!')
    } else {
    let all = Math.floor(Math.random() * video.length);
    let a = {
        status: true,
        creator: 'Lann4you-Ofc',
        result: {
              video_id: video[all].video_id,
              region: video[all].region,
              title: video[all].title,
              author: video[all].author.unique_id,
              nickname: video[all].author.nickname,
              profile: 'https://tikwm.com' + video[all].author.avatar,
              cover: 'https://tikwm.com' + video[all].cover,
              play: 'https://tikwm.com' + video[all].play,
              wm_play: 'https://tikwm.com' + video[all].wmplay,
              music: 'https://tikwm.com' + video[all].music,
              music_info: {
                  id: video[all].music_info.id,
                  title: video[all].music_info.title,
                  play_music: video[all].music_info.play
             }
          }
        }
        return a;
      }
    return;
}

let handler = async(m, { text, conn, usedPrefix, command }) => {
   if (!text) return m.reply(`nyari video apa kak?\n*Contoh:* ${usedPrefix + command} Trend Tiktok`)
   m.reply(wait)
   
   let response = await ttSearch(text)
   let { result } = response;
   
   if (result) {
   let { video_id, region, title, author, nickname, play, music } = result;
   let caption = `*𝄞 T I K T O K*
   
    ✧ *ID:* ${video_id}
    ✧ *REGION:* ${region}
    ✧ *CAPTION:* ${title}
    ✧ *AUTHOR:* ${author}
    ✧ *USERNAME:* ${nickname}`
    await conn.sendFile(m.chat, play, 'saa-ofc.mp4', caption, m)
    conn.sendFile(m.chat, music, 'saa-ofc.mp3', '', m, null, { mimetype: 'audio/mp4' });
    } else {
    m.reply(eror)
    }
}
handler.command = /^(tiktoksearch2|ttse?(arch2))$/i

export default handler