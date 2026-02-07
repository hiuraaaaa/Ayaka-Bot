import fetch from 'node-fetch'
const {
    proto,
    generateWAMessageFromContent,
    prepareWAMessageMedia
  } = (await import('@adiwajshing/baileys')).default
import { googleImage } from '@bochilteam/scraper'
var handler = async (m, { conn, usedPrefix, command }) => {
    if (!command) throw `menu`
    try {
const data = {
    title: "Pilih Menu",
    sections: [{
                title: `🌸 ${global.namebot}`,
                rows: [{ title: "Lihat semua menu", description: "Klik untuk melihat semua menu yang tersedia", id: '.allmenu' }]
            },
            {
                title: "",
                rows: [{ title: "List menu V2", description: "Klik untuk melihat List Menu V2", id: '.listmenuv2' }]
            },
            {
                title: "",
                rows: [{ title: "Hubungi owner bot", description: "Klik untuk nomor owner", id: '.owner' }]
            },
            {
                title: "",
                rows: [{ title: "Tentang kami", description: "Klik untuk mengetahui lebih lanjut tentang kami", id: '.about' }]
            },
            {
                title: "",
                rows: [{ title: "Harga Sewa", description: "Klik untuk melihat harga sewa CastoAyaka - Ai", id: '.sewa' }]
            },
            {
                title: "",
                rows: [{ title: "Peraturan", description: "Klik untuk melihat peraturan kami", id: '.rules' }]
            },
            {
                title: "🗃️ Fitur Tersedia",
                rows: [{ title: "Menu Download", description: "Klik untuk melihat menu download", id: '.menudownloader' }]
            },
            {
                title: "",
                rows: [{ title: "Menu Fun", description: "Klik untuk melihat menu fun", id: '.menufun' }]
            },
            {
                title: "",
                rows: [{ title: "Menu Group", description: "Klik untuk melihat menu group", id: '.menugc' }]
            },
            {
                title: "",
                rows: [{ title: "Menu Info", description: "Klik untuk melihat menu info", id: '.menuinfo' }]
            },
            {
                title: "",
                rows: [{ title: "Ceramah Menu", description: "Masyaallah Tadz", id: '.menuceramah' }]
            },
            {
                title: "",
                rows: [{ title: "Menu Game", description: "Klik untuk melihat menu game", id: '.menugame' }]
            },
            {
                title: "",
                rows: [{ title: "Menu Internet", description: "Klik untuk melihat menu internet", id: '.menuinternet' }]
            },
            {
                title: "",
                rows: [{ title: "Menu Main", description: "Klik untuk melihat menu main", id: '.menumain' }]
            },
            {
                title: "",
                rows: [{ title: "Menu AI", description: "Klik untuk melihat menu Ai", id: '.menuai' }]
            },
            {
                title: "",
                rows: [{ title: "Menu Asupan", description: "Klik untuk melihat menu Asupan", id: '.menuasupan' }]
            },
                        {
                title: "",
                rows: [{ title: "Menu Anime", description: "Klik untuk melihat menu Anime", id: '.menuanime' }]
            },
            {
                title: "",
                rows: [{ title: "Menu Maker", description: "Klik untuk melihat menu maker", id: '.menumaker' }]
            },
            {
                title: "",
                rows: [{ title: "Menu Owner", description: "Menu Khusus Rijalganzz Owner", id: '.menuowner' }]
            },
            {
                title: "",
                rows: [{ title: "Menu Premium", description: "Klik untuk melihat menu premium", id: '.menupremium' }]
            },
            {
                title: "",
                rows: [{ title: "Menu Panel", description: "Klik untuk melihat menu panel", id: '.menupanel' }]
            },
            {
                title: "",
                rows: [{ title: "Menu HaveFun", description: "Klik untuk melihat menu havefun", id: '.menuhavefun' }]
            },
            {
                title: "",
                rows: [{ title: "Menu Search", description: "Klik untuk melihat menu Search", id: '.menusearch' }]
            },
            {
                title: "",
                rows: [{ title: "Menu Random", description: "Klik untuk melihat menu random", id: '.menurandom' }]
            },
            {
                title: "",
                rows: [{ title: "Menu Quotes", description: "Klik untuk melihat menu audio", id: '.menuaudio' }]
            },
            {
                title: "",
                rows: [{ title: "Menu RPG", description: "Klik untuk melihat menu RPG", id: '.menurpg' }]
            },
            {
                title: "",
                rows: [{ title: "Menu Stiker", description: "Klik untuk melihat menu stiker", id: '.menustiker' }]
            },
            {
                title: "",
                rows: [{ title: "Menu Tools", description: "Klik untuk melihat menu tools", id: '.menutools' }]
            }
        ]
    };
let msgs = generateWAMessageFromContent(m.chat, {
  viewOnceMessage: {
    message: {
        "messageContextInfo": {
          "deviceListMetadata": {},
          "deviceListMetadataVersion": 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: proto.Message.InteractiveMessage.Body.create({
            text: `◤───「 \`INFO\` 」──✦
> ֎〔 *Nama Bot:* ${global.namebot}
> ֎〔 *Type:* Plugins ESM
> ֎〔 *Library:* [ Baileys-MD ]
> ֎〔 *Prefix:* [ . ]
◣─────────────✦

◤───「 \`OWNER\` 」──✦
> ֎〔 *Owner:* Rijalganzz Owner! 👸
◣─────────────✦

*_Hai, Saya ${global.namebot}, yang di dirikan oleh Rijalganzz Owner!, untuk membantu kesibukan dan kebutuhan anda_*🍂`
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: wm
          }),
          header: proto.Message.InteractiveMessage.Header.create({
          hasMediaAttachment: false,
          ...await prepareWAMessageMedia({ image: { url: `${global.namebot}` } }, { upload: conn.waUploadToServer })
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
handler.help = ['listmenu']
handler.tags = ['main']
handler.command = /^(menulist|listmenu)$/i
handler.limit = false
handler.register = true

export default handler