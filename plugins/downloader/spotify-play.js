const { proto, generateWAMessageFromContent, prepareWAMessageMedia } = (await import('@adiwajshing/baileys')).default;
import uploadImage from '../lib/uploadImage.js';
import axios from 'axios';

let handler = async(m, { conn, text, command, usedPrefix }) => {
try {
    if (!text) return m.reply(`Music apa yang ingin kamu cari?\n*Contoh:* ${usedPrefix + command} Mimpi Semata`)
    conn.sendMessage(m.chat, { react: { text: '👌', key: m.key }})
    
    let { data } = await spotifySearch(text)
    
    if (data && data.length > 0) {
    let { title, durasi, populer, image, rilis, artis, url_artis, preview, urls } = data[0]
    let caps = `༒ *Keterangan*
* \`Title\` : ${title}
* \`Durasi\` : ${durasi}
* \`Popular\` : ${populer}
* \`Rilis\` : ${rilis}
* \`Url Music\` : ${urls}

*Info Artis*
* *Nama:* ${artis}
* *Spotify:* ${url_artis}`

    let sections = [{
		title: '☣︎ Spotify Search',
		highlight_label: 'Lann4you!', 
		rows: [{
			header: '', 
	title: "Kontak Owner",
	description: `Lann4you! 🍁`,
	id: 'rowner'
	 }]
}]

data.forEach((izall) => {
sections.push({
    title: `${izall.title}`,
	rows: [{
		title: `Artis: ${izall.artis}`, 
		description: `Popular: ${izall.populer}`, 
		id: `rspotidl ${izall.urls}`
		}]
	})
})
let listMessage = {
   title: 'List Music', 
   sections
};

    let options = [];

    let msg = generateWAMessageFromContent(m.chat, {
  viewOnceMessage: {
    message: {
        "messageContextInfo": {
          "deviceListMetadata": {},
          "deviceListMetadataVersion": 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: proto.Message.InteractiveMessage.Body.create({
            text: caps,
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: global.namebot,
          }),
          header: proto.Message.InteractiveMessage.Header.create({
            title: '\t*Lann4you! 👸*\n',
            hasMediaAttachment: true,...(await prepareWAMessageMedia({ image: { url: 'https://files.catbox.moe/yqnwa7.png'  } }, { upload: conn.waUploadToServer }))
          }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [
              {
                "name": "single_select",
                "buttonParamsJson": JSON.stringify(listMessage) 
              }
           ],
          })
        })
    }
  }
}, { quoted: m})

   await conn.relayMessage(msg.key.remoteJid, msg.message, {
  messageId: msg.key.id})
  
      //  sendMess
    } else {
    m.reply(eror)
   }
   } catch(error) {
     m.reply(`terjadi kesalahan`)
     console.log(error)
   }
}
handler.help = ["spotifysearch <pencarian>"];
handler.tags = ["search"];
handler.command = /^(spotifysearch|spotisearch|spotify)$/i;
handler.register = true
handler.limit = true

export default handler

var client_id = 'f97b33bf590840f7ab31e7d372b1a1bf';
var client_secret = 'd700cceafc7c4de483b2ec3850f97a6a';

var authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  data: 'grant_type=client_credentials'
};

async function getAccessToken() {
  try {
    const response = await axios.post(authOptions.url, authOptions.data, { headers: authOptions.headers });
    if (response.status === 200) {
      const token = response.data.access_token;
    //  console.log('Access token:', token);
      return token;
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

async function spotifySearch(query, limit = 10, offset = 0, market = 'id') {
  const token = await getAccessToken();

  if (!token) {
    console.error('Failed to get access token');
    return;
  }

  const searchUrl = `https://api.spotify.com/v1/search?limit=${limit}&offset=${offset}&q=${query}&type=track&market=${market}`;

  try {
    const spoti = await axios.get(searchUrl, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = spoti.data;
    const item = data.tracks.items;
    const spotify = [];

    if (!item.length) {
      const result = {
        status: false,
        data: `${query} tidak ditemukan`
      };
      console.log(result);
      return result;
    }

    for (let i = 0; i < item.length; i++) {
      const album = item[i].album;
      const title = album.name;
      const artis = album.artists[0].name;
      const external = album.artists[0].external_urls;
      const url_artis = external.spotify;
      const rilis = album.release_date;
      const populer = item[i].popularity;
      const durasi = item[i].duration_ms;
      const image = album.images[1].url;
      const preview = item[i].preview_url;
      const urls = item[i].external_urls.spotify;

      spotify.push({
        title,
        artis,
        url_artis,
        rilis,
        populer: populer + '%',
        durasi: convertDuration(durasi),
        image,
        preview,
        urls
      });
    }

    const result = {
      status: true,
      creator: 'Lann4you',
      data: spotify
    };

   // console.log(result);
    return result;
  } catch (error) {
    console.error('Error:', error);
  }
}

function convertDuration(durationMs) {
  const seconds = Math.floor((durationMs / 1000) % 60);
  const minutes = Math.floor((durationMs / (1000 * 60)) % 60);
  const hours = Math.floor((durationMs / (1000 * 60 * 60)) % 24);

  let result = '';
  if (hours > 0) {
    result += hours + ' jam ';
  }
  if (minutes > 0) {
    result += minutes + ' menit ';
  }
  if (seconds > 0) {
    result += seconds + ' detik';
  }

  return result.trim();
}