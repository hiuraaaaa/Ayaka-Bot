import axios from 'axios';
import * as cheerio from 'cheerio';

async function otakuDesu(query) {
try {
  let response = await axios.get(`https://otakudesu.cloud/?s=${query}&post_type=anime`)
  let html = response.data
 // console.log(html)
  let $ = await cheerio.load(html)
  let h2 = $('h2')
  let a = h2.find('a')//.attr('href')
  let otaku = [];
  a.each((index, element) => {
     let url = $(element).attr('title')
     let title = $(element).text()
        otaku.push({
            url,
            title
           })
        })
  let getInfo = await axios.get(otaku[0].url)
  let htmlInfo = getInfo.data
  let _$ = await cheerio.load(htmlInfo)
  let dive = _$('div')
  let img = dive.find('.attachment-post-thumbnail')
  let foto = img.attr('src')
  let p = _$('p')
  let span = p.find('span')
  let desu = [];
 span.each((index, element) => {
    let nuy = _$(element).text().trim()
    let info = nuy.split(' ')
    let infos = info.slice(1).join(' ')
       desu.push({
            infos
            })
         })
//     console.log(desu)
  let li = _$('li')
  let _span = li.find('span')
  let black = _span.find('a')
  let urls = []
  black.each((i, element) =>{
     if (i < 4) {
       let url = _$(element).attr('href')
       let eps = _$(element).text()
         urls.push({
              url,
              eps
              })
            }
         })
  let uploads = []
  let _li = _$('li')
  let __span = _li.find('span[class="zeebr"]')
  __span.each((i, element) => {
     if (i < 4) {
       let upload = _$(element).text()
         uploads.push({
               upload
             })
           }
        })
//       console.log(uploads)
  let desk = _$('div[class="sinopc"]').text()
   // console.log(div)
       let result = {
           status: true,
           creator: 'Lann4you',
           foto: foto,
           info: {
               judul: desu[0].infos,
               japanes: desu[1].infos,
               skor: desu[2].infos,
               produser: desu[3].infos,
               tipe: desu[4].infos,
               status: desu[5].infos,
               totalEps: desu[6].infos.split(' ').slice(1).join(' '),
               durasi: desu[7].infos,
               tanggalRilis: desu[8].infos.split(' ').slice(1).join(' '),
               studio: desu[9].infos,
               genre: desu[10].infos,
               deskripsi: desk
               },
           episode: [
              {
               url: urls[0].url,
               eps: urls[0].eps,
               rilis: uploads[0].upload,
               },
               {
               url: urls[1].url,
               eps: urls[1].eps,
               rilis: uploads[1].upload,
               },
               {
               url: urls[2].url,
               eps: urls[2].eps,
               rilis: uploads[2].upload,
               },
               {
               url: urls[3].url,
               eps: urls[3].eps,
               rilis: uploads[3].upload,
               }
            ]
          }
          console.log(result)
          return result;
      } catch(error) {
      console.log(error)
      return error
     }
   return;
}

async function otakuInfo(links) {
try {
   let getInfo = await axios.get(links)
  let htmlInfo = getInfo.data
  let _$ = await cheerio.load(htmlInfo)
  let dive = _$('div')
  let img = dive.find('.attachment-post-thumbnail')
  let foto = img.attr('src')
  let p = _$('p')
  let span = p.find('span')
  let desu = [];
 span.each((index, element) => {
    let nuy = _$(element).text().trim()
    let info = nuy.split(' ')
    let infos = info.slice(1).join(' ')
       desu.push({
            infos
            })
         })
//     console.log(desu)
  let li = _$('li')
  let _span = li.find('span')
  let black = _span.find('a')
  let urls = []
  black.each((i, element) =>{
     if (i < 4) {
       let url = _$(element).attr('href')
       let eps = _$(element).text()
         urls.push({
              url,
              eps
              })
            }
         })
  let uploads = []
  let _li = _$('li')
  let __span = _li.find('span[class="zeebr"]')
  __span.each((i, element) => {
     if (i < 4) {
       let upload = _$(element).text()
         uploads.push({
               upload
             })
           }
        })
//       console.log(uploads)
  let desk = _$('div[class="sinopc"]').text()
   // console.log(div)
       let result = {
           status: true,
           creator: 'Lann4you',
           foto: foto,
           info: {
               judul: desu[0].infos,
               japanes: desu[1].infos,
               skor: desu[2].infos,
               produser: desu[3].infos,
               tipe: desu[4].infos,
               status: desu[5].infos,
               totalEps: desu[6].infos.split(' ').slice(1).join(' '),
               durasi: desu[7].infos,
               tanggalRilis: desu[8].infos.split(' ').slice(1).join(' '),
               studio: desu[9].infos,
               genre: desu[10].infos,
               deskripsi: desk
               },
           episode: [
              {
               url: urls[0].url,
               eps: urls[0].eps,
               rilis: uploads[0].upload,
               },
               {
               url: urls[1].url,
               eps: urls[1].eps,
               rilis: uploads[1].upload,
               },
               {
               url: urls[2].url,
               eps: urls[2].eps,
               rilis: uploads[2].upload,
               },
               {
               url: urls[3].url,
               eps: urls[3].eps,
               rilis: uploads[3].upload,
               }
            ]
          }
          console.log(result)
          return result;
      } catch(error) {
      console.log(error)
      return error
     }
   return;
}

let linkRegex = /https:\/\/otakudesu\.cloud\/anime\/[0-9A-Za-z]+/i;

let handler = async(m, { text, conn, usedPrefix, command }) => {
  try {
    switch (command) {
      case 'otaku':
        if (!text) return m.reply(`Anime Apa Yang Ingin Kamu Cari?\n*Contoh:* ${usedPrefix + command} Bocchi The Rock`)
        conn.sendMessage(m.chat, { react: { text: "🏷️", key: m.key }})
        let response = await otakuDesu(text)
        let info = response.info
        let episode = response.episode
        if (info && episode && episode.length > 0) {
          let { judul, japanes, skor, produser, tipe, status, totalEps, durasi, tanggalRilis, studio, genre, deskripsi } = info;
          if (deskripsi.split('').length < 1) deskripsi = 'Nothing.'
          let cap = `\`ぶ 𝖮𝗍𝖺𝗄𝗎 𝖣𝖾𝗌𝗎\`
           
*〔 𝖠𝗇𝗂𝗆𝖾 𝖨𝗇𝖿𝗈 〕*
* *𝖩𝗎𝖽𝗎𝗅:* ${judul}
* *𝖩𝖺𝗉𝖺𝗇𝖾𝗌:* ${japanes}
* *𝖲𝗄𝗈𝗋:* ${skor}
* *𝖯𝗋𝗈𝖽𝗎𝗌𝖾𝗋:* ${produser}
* *𝖳𝗒𝗉𝖾:* ${tipe}
* *𝖲𝗍𝖺𝗍𝗎𝗌:* ${status}
* *𝖳𝗈𝗍𝖺𝗅 𝖤𝗉𝗂𝗌𝗈𝖽𝖾:* ${totalEps}
* *𝖣𝗎𝗋𝖺𝗌𝗂:* ${durasi}
* *𝖳𝖺𝗇𝗀𝗀𝖺𝗅 𝖱𝗂𝗅𝗂𝗌:* ${tanggalRilis}
* *𝖲𝗍𝗎𝖽𝗂𝗈:* ${studio}
* *𝖦𝖾𝗇𝗋𝖾:* ${genre}

\`𝖭𝖾𝗐 𝖤𝗉𝗂𝗌𝗈𝖽𝖾\`
*〔 ${episode[0].eps} 〕*
* *𝖴𝗋𝗅:*  ${episode[0].url}
* *𝖱𝗂𝗅𝗂𝗌:* ${episode[0].rilis}

*〔 ${episode[1].eps} 〕*
* *𝖴𝗋𝗅:*  ${episode[1].url}
* *𝖱𝗂𝗅𝗂𝗌:* ${episode[1].rilis}

*〔 ${episode[2].eps} 〕*
* *𝖴𝗋𝗅:*  ${episode[2].url}
* *𝖱𝗂𝗅𝗂𝗌:* ${episode[2].rilis}

*〔 ${episode[3].eps} 〕*
* *𝖴𝗋𝗅:*  ${episode[3].url}
* *𝖱𝗂𝗅𝗂𝗌:* ${episode[3].rilis}

*〔 𝖣𝖾𝗌𝗄𝗋𝗂𝗉𝗌𝗂 〕*
_${deskripsi}_`

          await conn.sendFile(m.chat, response.foto, '', cap, flok, { contextInfo: { mentionedJid: [m.sender] }})
        } else if (!episode[0].url) {
          m.reply(`Anime ${text} tidak di temukan!`)
        } else {
          m.reply(eror)
        }
        break
      case 'otakuinfo':
        if (!text) return m.reply(`Url Otakunya mana?\n*Contoh:* ${usedPrefix + command} https://otakudesu.cloud/anime/xxxxxx`)
        let urlOtaku = linkRegex.test(text)
        if (!urlOtaku) return m.reply(`Hanya Support Url Dari OtakuDesu\n*Contoh Url:* https://otakudesu.cloud/anime/xxxxxx`)
        conn.sendMessage(m.chat, { react: { text: "📌", key: m.key }})
        
        let res = await otakuInfo(text)
        let inpo = res.info
        let episot = res.episode
        if (inpo && episot && episot.length > 0) {
          let { judul, japanes, skor, produser, tipe, status, totalEps, durasi, tanggalRilis, studio, genre, deskripsi } = inpo;
          if (deskripsi.split('').length < 1) deskripsi = 'Nothing.'
          let cap2 = `\`ぶ 𝖮𝗍𝖺𝗄𝗎 𝖣𝖾𝗌𝗎\`
           
*〔 𝖠𝗇𝗂𝗆𝖾 𝖨𝗇𝖿𝗈 〕*
* *𝖩𝗎𝖽𝗎𝗅:* ${judul}
* *𝖩𝖺𝗉𝖺𝗇𝖾𝗌:* ${japanes}
* *𝖲𝗄𝗈𝗋:* ${skor}
* *𝖯𝗋𝗈𝖽𝗎𝗌𝖾𝗋:* ${produser}
* *𝖳𝗒𝗉𝖾:* ${tipe}
* *𝖲𝗍𝖺𝗍𝗎𝗌:* ${status}
* *𝖳𝗈𝗍𝖺𝗅 𝖤𝗉𝗂𝗌𝗈𝖽𝖾:* ${totalEps}
* *𝖣𝗎𝗋𝖺𝗌𝗂:* ${durasi}
* *𝖳𝖺𝗇𝗀𝗀𝖺𝗅 𝖱𝗂𝗅𝗂𝗌:* ${tanggalRilis}
* *𝖲𝗍𝗎𝖽𝗂𝗈:* ${studio}
* *𝖦𝖾𝗇𝗋𝖾:* ${genre}

\`𝖭𝖾𝗐 𝖤𝗉𝗂𝗌𝗈𝖽𝖾\`
*〔 ${episot[0].eps} 〕*
* *𝖴𝗋𝗅:*  ${episot[0].url}
* *𝖱𝗂𝗅𝗂𝗌:* ${episot[0].rilis}

*〔 ${episot[1].eps} 〕*
* *𝖴𝗋𝗅:*  ${episot[1].url}
* *𝖱𝗂𝗅𝗂𝗌:* ${episot[1].rilis}

*〔 ${episot[2].eps} 〕*
* *𝖴𝗋𝗅:*  ${episot[2].url}
* *𝖱𝗂𝗅𝗂𝗌:* ${episot[2].rilis}

*〔 ${episot[3].eps} 〕*
* *𝖴𝗋𝗅:*  ${episot[3].url}
* *𝖱𝗂𝗅𝗂𝗌:* ${episot[3].rilis}

*〔 𝖣𝖾𝗌𝗄𝗋𝗂𝗉𝗌𝗂 〕*
_${deskripsi}_`

          await conn.sendFile(m.chat, res.foto, '', cap2, flok, { contextInfo: { mentionedJid: [m.sender] }})
        } else if (!episot[0].url) {
          m.reply(`Anime ${text} tidak di temukan!`)
        } else {
          m.reply(eror)
        }
        break
      default:
        return
    }
  } catch (error) {
    m.reply('Terjadi kesalahan nih kak')
    conn.reply('6288705574039@s.whatsapp.net', 'fitur Otaku Error Saa!', m)
    console.log(error)
  }
}
handler.tags = ['search']
handler.help = ['otaku <anime>', 'otakuinfo <url>']
handler.command = /^(otaku|otakuinfo)$/i
handler.limit = true

export default handler