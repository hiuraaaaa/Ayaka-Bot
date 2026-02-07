import fetch from 'node-fetch';
import { FormData, Blob } from 'formdata-node';
import { fileTypeFromBuffer } from 'file-type';
import Jimp from "jimp";
import uploadImage from '../lib/uploadImage.js'
import axios from 'axios'
import fs from "fs"

async function ToZombi(imageBuffer) {
    try {
        const { ext, mime } = await fileTypeFromBuffer(imageBuffer) || {};
        if (!ext || !mime) {
            return null;
        }
        let form = new FormData();
        const blob = new Blob([imageBuffer.toArrayBuffer()], { type: mime });
        form.append('image', blob, 'image.' + ext);

        const response = await fetch("https://deepgrave-image-processor-no7pxf7mmq-uc.a.run.app/transform_in_place", {
            method: 'POST',
            body: form,
        });

        if (!response.ok) {
            throw new Error("Request failed with status code " + response.status);
        }

        const base64Data = await response.text();
        
        // Convert base64 to image buffer and return it
        return Buffer.from(base64Data, 'base64');
    } catch (error) {
        return null;
    }
}


let handler = async (m, { conn, usedPrefix, text, args,command }) => {
    let mime_ = `Kirim/Reply Gambar Dengan Caption ${usedPrefix + command}`
    
	let q = m.quoted ? m.quoted : m;
	  let mime = (q.msg || q).mimetype || ''
	  if (!mime) throw mime_
	let media = await q.download()
	
    let url = await uploadImage(media)
    
    const react = {react: {text: "⏳", key: m.key}}
    
    async function reload () {
	conn.sendMessage(m.chat, react)
		}
    const reactdone = {react: {text: "✔️", key: m.key}}
    
    async function done () {
	conn.sendMessage(m.chat, reactdone)
		}
		
	switch (command) {
case 'aifilter': case 'filteranime':

if (!/image\/(jpe?g|png)/.test(mime)) throw `Mime ${mime} tidak support`;

reload()
let cap = '*Result from* : ' + usedPrefix + command
animeFilter(media).then(res => {
const buff = Buffer.from(res[0].split(",")[1], "base64")
conn.sendMessage(m.chat, { image: buff , caption: cap}, {quoted: m})
}).catch(e => {
m.reply('error')
})

done()

break 
case 'jadizombie': case 'makezombie':
if (!/image\/(jpe?g|png)/.test(mime)) throw `Mime ${mime} tidak support`;

reload()
let cep = '*Result from* : ' + usedPrefix + command
const result = await ToZombi(media);
    
    if (!result) {
        throw 'Terjadi kesalahan saat mengonversi gambar ke zombie.';
    }
    
    
    return conn.sendMessage(m.chat, {
        image: result,
        caption: cep,
        mentions: [m.sender]
    }, {
        quoted: m
    })
done()

break 
};
}
handler.tags = ["ai","premium"];
handler.limit = true;
handler.register = true
handler.premium = true

handler.command = handler.help = ["makezombie","jadizombie"];

export default handler;

 async function animeFilter(image) {
  return new Promise(async (resolve, reject) => {
    axios("https://akhaliq-animeganv2.hf.space/api/queue/push/", {
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36"
      },
      data: {
        "fn_index": 0,
        "data": [
          "data:image/jpeg;base64," + image.toString('base64'),
          "version 2 (🔺 robustness,🔻 stylization)"
        ],
        "action": "predict",
        "session_hash": "38qambhlxa8"
      },
      method: "POST"
    }).then(a => {
      let id = a.data.hash;
      axios("https://akhaliq-animeganv2.hf.space/api/queue/status/", {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36"
        },
        data: {
          "hash": id
        },
        method: "POST"
      }).then(tes => {
        resolve(tes.data.data.data);
      });
    });
  });
};