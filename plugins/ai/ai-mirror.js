import uploadImage from "../lib/uploadImage.js";
import axios from "axios"


let handler = async (m, { conn, text, usedPrefix, args, command }) => {
    let capfil = `💌 *List Filter yang tersedia*
* anime_2d
* yearbook
* romance_comic
* anime_custom
* only_goth
* realistic_custom
* horror_night
* superhero_comic
* watercolor
* starry_girl
* maid_dressing
* vintage_newspaper
* cartoon_3d
* egyptian_pharaoh
* doodle
* pirate_tale
* dead_festival
* pretty_soldier
* pixelart
* dark_gothic
* school_days
* marimo_ronin
* christmas_anime
* biohazard
* random_style
* bizarre_journey
* santa_costume
* fire_fist
* 2d_anime
*Contoh:* ${usedPrefix + command} anime_2d
`
    if (!text) return m.reply(capfil)
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    if (!mime) throw `Kirim fotonya\nContoh ${usedPrefix + command}`
    if (!/image\/(jpe?g|png)/.test(mime)) throw `Tipe ${mime} tidak didukung!`;
    
conn.sendMessage(m.chat, {
    react: {
      text: '⏰',
      key: m.key,
    }
  });

    let img = await q.download();
    let imge = await uploadImage(img);
    let key = global.skizo;
    
    let response = await axios.get(`https://skizoasia.xyz/api/mirror?apikey=${global.skizo}&url=${imge}&filter=${text}`)
    const { status, generated_image_addresses, your_choice_filter } = response.data;

    if (status && generated_image_addresses && your_choice_filter) {
    let gambr = generated_image_addresses;
    let filtr = your_choice_filter;
    conn.sendFile(m.chat, generated_image_addresses, '', `*✅ Successfull From Mirror*\nFilter: ${your_choice_filter}`, m)
    } else if (status === 400) {
     let notfound = `Filter Not Found!
     
  💌 *List Filter yang tersedia*
  
* anime_2d
* yearbook
* romance_comic
* anime_custom
* only_goth
* realistic_custom
* horror_night
* superhero_comic
* watercolor
* starry_girl
* maid_dressing
* vintage_newspaper
* cartoon_3d
* egyptian_pharaoh
* doodle
* pirate_tale
* dead_festival
* pretty_soldier
* pixelart
* dark_gothic
* school_days
* marimo_ronin
* christmas_anime
* biohazard
* random_style
* bizarre_journey
* santa_costume
* fire_fist
* 2d_anime
*Contoh:* ${usedPrefix + command} anime_2d
`
     conn.reply(m.chat, notfound, m)
    } else {
    m.reply(eror)
    }
     if(!response) return m.reply(`Fitur sedang tidak aktif.`)
     if (response) {
 conn.sendMessage(m.chat, {
    react: {
      text: '✅',
      key: m.key,
    }
  });
 }
}

handler.help = ['mirror'];
handler.tags = ['ai','premium'];
handler.command = /^(mirror)$/i;
handler.premium = true

export default handler;