import uploadImage from '../lib/uploadImage.js'
import axios from 'axios'
import FormData from 'form-data'
import * as cheerio from 'cheerio'

async function removeBg(image) {
try {
    let img = await axios.get(image, { responseType: 'arraybuffer' })
    
    let form = new FormData()
        form.append('files', Buffer.from(img.data), 'file.jpg')
   
   let response = await axios('https://download1.imageonline.co/ajax_upload_file.php', {
           method: 'POST',
           data: form,
           headers: {
     ...form.getHeaders(),
       'Accept': '*/*',
       'Accept-Encoding': 'gzip, deflate, br',
       'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
       'Connection': 'keep-alive',
       'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryeDmJtIZLMKA22xR4',
      // 'Host': 'download1.imageonline.co',
       'Origin': 'https://imageonline.co',
       'Referer': 'https://imageonline.co/',
       'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36'
      }
           })
      let data = response.data
      let files = data.files[0]
      let name = files.name
      let oname = files.old_name
      let option = files.extension
      
      let rembg = await axios('https://download1.imageonline.co/pngmaker.php', {
             method: 'POST',
             data: {
                name: name,
                originalname: oname,
                option3: option,
                option4 : '1'
             },
             headers: {
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                'Connection': 'keep-alive',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Origin': 'https://imageonline.co',
                'Referer': 'https://imageonline.co/',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36'
              }
          })
        let html = rembg.data
        let $ = await cheerio.load(html)
        let e = $('img')
        let images = e.attr('src')
        let result = {
             status: true,
             creator: 'Lann4you',
             image: images
           }
        console.log(result)
        return result
     } catch(error) {
       console.log(error)
       return error
   }
}

function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())]
}

let handler = async (m, { conn, text, command, usedPrefix }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    if (!mime) return m.reply(`Fotonya Mana?\n\n*Tutorial:* Kirim foto yang anda ingin hapus background nya, lalu berikan caption/pesan *${usedPrefix + command}*`);
    if (!/image\/(jpe?g|png)/.test(mime)) m.reply(`Tipe ${mime} tidak didukung!`);
    conn.sendMessage(m.chat, { react: { text: '✂️', key: m.key }})
    let img = await q.download();
    let url = await uploadImage(img);
        
    let { image } = await removeBg(url)
    if (image) {
    await conn.sendFile(m.chat, image, '', '*✓ Success*', m);
    conn.sendMessage(m.chat, { react: { text: '✅', key: m.key }})
    } else {
       m.reply(eror)
     }
}
handler.tags = ['tools'];
handler.help = ['removebg','rembg'];
handler.command = /^(rembg|removebg)/i;
handler.limit = true
handler.register = true

export default handler;