import fetch from 'node-fetch'
const {
    proto,
    generateWAMessageFromContent,
    prepareWAMessageMedia
  } = (await import('@adiwajshing/baileys')).default
import { googleImage } from '@bochilteam/scraper'
var handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Contoh Daftar ${usedPrefix}${command} Lann`
    try {
const data = {
    title: "Pilih Umur",
    sections: [{
            title: `🌸 Ayaka Kamisato`,
            highlight_label: "© LannOfc! 💐", 
            rows: [{
                    title: "10",
                    description: "Tahun",
                    id: `.register ${text}.10`
                },
                {
                    title: "11",
                    description: "Tahun",
                    id: `.register ${text}.11`
                },
                {
                    title: "12",
                    description: "Tahun",
                    id: `.register ${text}.12`
                },
                {
                    title: "13",
                    description: "Tahun",
                    id: `.register ${text}.13`
                },
                {
                    title: "14",
                    description: "Tahun",
                    id: `.register ${text}.14`
                },
                {
                    title: "15",
                    description: "Tahun",
                    id: `.register ${text}.15`
                },
                {
                    title: "16",
                    description: "Tahun",
                    id: `.register ${text}.16`
                },
                {
                    title: "17",
                    description: "Tahun",
                    id: `.register ${text}.17`
                },
                {
                    title: "18",
                    description: "Tahun",
                    id: `.register ${text}.18`
                },
                {
                    title: "19",
                    description: "Tahun",
                    id: `.register ${text}.19`
                },
                {
                    title: "20",
                    description: "Tahun",
                    id: `.register ${text}.20`
                },
                {
                    title: "21",
                    description: "Tahun",
                    id: `.register ${text}.21`
                },
                {
                    title: "22",
                    description: "Tahun",
                    id: `.register ${text}.22`
                },
                {
                    title: "23",
                    description: "Tahun",
                    id: `.register ${text}.23`
                },
                {
                    title: "24",
                    description: "Tahun",
                    id: `.register ${text}.24`
                },
                {
                    title: "25",
                    description: "Tahun",
                    id: `.register ${text}.25`
                },
                {
                    title: "26",
                    description: "Tahun",
                    id: `.register ${text}.26`
                },
                {
                    title: "27",
                    description: "Tahun",
                    id: `.register ${text}.27`
                },
                {
                    title: "28",
                    description: "Tahun",
                    id: `.register ${text}.28`
                },
                {
                    title: "29",
                    description: "Tahun",
                    id: `.register ${text}.29`
                },
                {
                    title: "30",
                    description: "Tahun",
                    id: `.register ${text}.30`
                },
            ]
        }
    ]
}
let msgs = generateWAMessageFromContent(m.chat, {
  viewOnceMessage: {
    message: {
        "messageContextInfo": {
          "deviceListMetadata": {},
          "deviceListMetadataVersion": 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: proto.Message.InteractiveMessage.Body.create({
            text: `Hii Senpai *${text}* 🥳\nSekarang silahkan Pilih Umur kamu dengan cara klik tombol dibawah`
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: wm
          }),
          header: proto.Message.InteractiveMessage.Header.create({
          hasMediaAttachment: false,
          ...await prepareWAMessageMedia({ image: { url: "https://raw.githubusercontent.com/upcld/dat3/main/uploads/9452d4-1759120143737.jpg" } }, { upload: conn.waUploadToServer })
          }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [{
                "name": "single_select",
                "buttonParamsJson": JSON.stringify(data)
              }],
          })
       })
    }
  }
}, { quoted: m })

return await conn.relayMessage(m.chat, msgs.message, {})
} catch (e) {
conn.sendFile(m.chat, eror, "anu.mp3", null, m, true, {
		type: "audioMessage",
		ptt: true,
	})
}}
handler.help = ['daftar']
handler.tags = ['main']
handler.command = /^(daftar)$/i
handler.limit = false

export default handler