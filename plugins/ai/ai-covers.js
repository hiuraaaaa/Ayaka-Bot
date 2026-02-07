import fs from 'fs';
import axios from 'axios';


let handler = async (m, { conn, usedPrefix, text, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (m.quoted ? m.quoted : m.msg).mimetype || ''
    if(!text) return m.reply("Harap sertakan model, contoh: .covers Ayakamiko")
    if (!/audio|audio/.test(mime)) throw `reply auduonya dengan command *${usedPrefix + command} model*\ncontoh: .covers ${usedPrefix + command} Anies`
    let media = await q.download?.()
    if (!media) throw 'Can\'t download media'
    let { key } = await conn.sendMessage(m.chat, { text: "Wait...."})
axios.post(`${api.xterm.url}/api/audioProcessing/voice-covers?model=${text}&key=${api.xterm.key}`, media, {
    headers: {
        'Content-Type': 'application/octet-stream'
    },
    responseType: 'stream'//Stream mode
})
.then(response => {
    response.data.on('data', async chunk => {
        const eventString = chunk.toString();
        const eventData = eventString.match(/data: (.+)/);
        
        if (eventData) {
            const data = JSON.parse(eventData[1]);
            switch (data.status){
               case 'searching':
               case 'separating':
               case 'starting':
               case 'processing':
               case 'mixing':
                 conn.sendMessage(m.chat, { text: data.status, edit: key })
               break
               case 'success':
                 await conn.sendMessage(m.chat, { audio: { url:data.result }, mimetype: "audio/mpeg" }, { quoted: m });
                 response.data.destroy(); 
               break
               case 'failed':
                 m.replt('Failed❗️:' + data);
                 response.data.destroy();
               break
            }
        }
    });
})
.catch(error => {
    m.reply('Error:' + error.response ? error.response.data : error.message);
});

}
handler.help = ['covers <model>']
handler.tags = ['ai','premium']
handler.command = /^(covers|cover|coverai)$/i
handler.limit = 70
handler.premium = true
export default handler