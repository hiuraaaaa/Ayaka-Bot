const { proto, generateWAMessageFromContent, prepareWAMessageMedia } = (await import('@adiwajshing/baileys')).default;

async function handler(m, { conn, text, command, usedPrefix, }) {
    conn.astro = conn.astro || {};
    conn.roket = conn.roket || {};
    let roket = conn.roket[m.chat]
    let bulan = conn.astro[m.chat];
    let user = global.db.data.users[m.sender];
    let timing = (new Date - (user.lastroket * 1)) * 1
    if (timing < 1800000) return m.reply(`👨🏻‍🚀: Untuk saat ini, kamu blum bisa pergi ke Antariksa, tunggu selama ${clockString(1800000 - timing)}`)
    if (!roket) {
    let aku = `👨🏻‍🚀: Mengexplorasi luar angkasa, untuk mencari tahu tentang luar angkasa dan seisi galaxy, kamu ingin pergi ke luar angkasa? Yuu Buat Room Dulu`
    let msg = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2
                    },
                    interactiveMessage: proto.Message.InteractiveMessage.create({
                        body: proto.Message.InteractiveMessage.Body.create({
                            text: aku,
                            mentions: conn.parseMention(aku),
                        }),
                        footer: proto.Message.InteractiveMessage.Footer.create({
                            text: "*© Lann4you Official*"
                        }),
                        header: proto.Message.InteractiveMessage.Header.create({
                            title: "\t⬣─〔 *🚀 Explorasi Antariksa* 〕─⬣\n",
                            subtitle: "",
                            hasMediaAttachment: false
                        }),
                        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                            buttons: [
                                {
                                    name: "quick_reply",
                                    buttonParamsJson: "{\"display_text\":\"👥 Buat Room\",\"id\":\"room_buat\"}"
                                },
                            ],
                        })
                    })
                },
            }
        }, {});
        
        if (!msg || !msg.message) return conn.reply(m.chat, 'Gagal mengirim pesan (konten tidak valid)', m);
       await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
       
       conn.astro[m.chat] = {
           peran: m.sender,
           status: 'wait',
           waktu: setTimeout(() => {
           if (conn.astro[m.chat]) m.reply(`Mengexplor luar angkasa telah di batalkan`)
           delete conn.astro[m.chat]
           }, 500000)
        }
    } else {
    if (!roket.players.includes(m.sender)) {
        let playerListh = roket.players.map((player, index) => `*${index + 1}.* @${player.replace(/@.+/, '')}`).join('\n');
        let join = `👨🏻‍🚀: Sudah ada yang menunggu nih, yuu bergabung bersama mereka`
        let msg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
        message: {
            messageContextInfo: {
                deviceListMetadata: {},
                deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
                body: proto.Message.InteractiveMessage.Body.create({
                    text: join,
                }),
                footer: proto.Message.InteractiveMessage.Footer.create({
                    text: "*© Lann4you Official*"
                }),
                header: proto.Message.InteractiveMessage.Header.create({
                    title: "\t⬣─〔 *🚀 Explorasi Antariksa* 〕─⬣\n",
                    subtitle: "",
                    hasMediaAttachment: false
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                    buttons: [
                        {
                            name: "quick_reply",
                            buttonParamsJson: "{\"display_text\":\"👨🏻‍🚀 Bergabung\",\"id\":\"gabung\"}"
                        },
                    ],
                })
            })
        },
    }
}, {})   
        if (!msg || !msg.message) return conn.reply(m.chat, 'Gagal mengirim pesan (konten tidak valid)', m);
        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id, })
        } else if (roket.players.includes(m.sender)) {
        let playerList = roket.players.map((player, index) => `*${index + 1}.* @${player.replace(/@.+/, '')}`).join('\n');
        let sudah = `👨🏻‍🚀: Kamu Sedang Menunggu Keberangkatan\n*Room ID:* ${roket.id}\n* Tujuan: ${roket.tujuan}\n\n*Tag Room Master Dan Segera Memulai Permainan*`
        let msg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
        message: {
            messageContextInfo: {
                deviceListMetadata: {},
                deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
                body: proto.Message.InteractiveMessage.Body.create({
                    text: sudah,
                }),
                footer: proto.Message.InteractiveMessage.Footer.create({
                    text: "*© Lann4you Official*"
                }),
                header: proto.Message.InteractiveMessage.Header.create({
                    title: "\t⬣─〔 *🚀 Explorasi Antariksa* 〕─⬣\n",
                    subtitle: "",
                    hasMediaAttachment: false
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                    buttons: [
                        {
                            name: "quick_reply",
                            buttonParamsJson: "{\"display_text\":\"🚀 Start\",\"id\":\"roketStart\"}"
                        },
                        {
                            name: "quick_reply",
                            buttonParamsJson: "{\"display_text\":\"👨🏻‍🚀 Player\",\"id\":\"players_nya\"}"
                        },
                    ],
                })
            })
        },
    }
}, {})
        if (!msg || !msg.message) return conn.reply(m.chat, 'Gagal mengirim pesan (konten tidak valid)', m);
        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id, })
     }
  }
}

handler.tags = ['rpg']
handler.command = ['astronot']
handler.command = /^(astronot)/i
handler.group = true

function getContentType(message) {
    if (!message) return null;
    if (message.buttonsResponseMessage) return 'buttonsResponseMessage';
    if (message.templateButtonReplyMessage) return 'templateButtonReplyMessage';
    if (message.viewOnceMessage) return 'viewOnceMessage';
    return null;
}

handler.before = async function(m) {
    if (!m || !m.message) return;
    this.astro = this.astro || {};
    this.roket = this.roket || {};
    let bulan = Object.values(this.astro).find(bulan => bulan.status && [bulan.peran].includes(m.sender));
    let roket = this.roket[m.chat]
    const contentType = getContentType(m.message);
   
   if (contentType === 'templateButtonReplyMessage') {
   let selectedButton = m.message.templateButtonReplyMessage.selectedId;
   if (roket) {
       if (selectedButton === 'gabung' && !roket.players.includes(m.sender)) {
       let uJoin = global.db.data.users[m.sender];
       let timing = (new Date - (uJoin.lastroket* 1)) * 1
    if (timing < 1800000) return m.reply(`👨🏻‍🚀: Untuk saat ini, kamu blum bisa bergaung Bersama Mereka, tunggu selama ${clockString(1800000 - timing)}`)
       if (uJoin.roket < 1) return m.reply('*👨🏻‍🚀: Kamu Tidak Memiliki Roket, Silahkan Beli Terlebih Dahulu*\nKetik: !shop buy roket')
       if (uJoin.aerozine < 50) return m.reply('*👨🏻‍🚀: Aerozine Kamu Kurang Dari *50*, Silahkan Isi Bahan Bakar Roketmu, Silahkan Beli Terlebih Dahulu*\nKetik: !shop buy aerozine')
       let rooms = `*👨🏻‍🚀: Sukses Bergabung kedalam room*\n* 📌 Room ID: ${roket.id}\n* 🚀 Tujuan: ${roket.tujuan}\n\n\`🕐 Silahkan Tunggu pemain lain jika ingin bermain bersama\``
       
       roket.players.push(m.sender);
       let msg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
        message: {
            messageContextInfo: {
                deviceListMetadata: {},
                deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
                body: proto.Message.InteractiveMessage.Body.create({
                    text: rooms,
                }),
                footer: proto.Message.InteractiveMessage.Footer.create({
                    text: "*© Lann4you Official*"
                }),
                header: proto.Message.InteractiveMessage.Header.create({
                    title: "\t⬣─〔 *🚀 Explorasi Antariksa* 〕─⬣\n",
                    subtitle: "",
                    hasMediaAttachment: false
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                    buttons: [
                        {
                            name: "quick_reply",
                            buttonParamsJson: "{\"display_text\":\"🚀 Start\",\"id\":\"roketStart\"}"
                        },
                        {
                            name: "quick_reply",
                            buttonParamsJson: "{\"display_text\":\"👨🏻‍🚀 Player\",\"id\":\"players_nya\"}"
                        },
                    ],
                })
            })
        },
    }
}, {}) 
        if (!msg || !msg.message) return conn.reply(m.chat, 'Gagal mengirim pesan (konten tidak valid)', m);
        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id, })
     } else if (selectedButton === 'gabung' && roket.players.includes(m.sender)) {
        let playerList = roket.players.map((player, index) => `*${index + 1}.* @${player.replace(/@.+/, '')}`).join('\n');
        let sudah = `👨🏻‍🚀: Kamu Sedang Menunggu Keberangkatan\n*Room ID:* ${roket.id}\n* Tujuan: ${roket.tujuan}\n\n*Tag Room Master Dan Segera Memulai Permainan*`
        let msg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
        message: {
            messageContextInfo: {
                deviceListMetadata: {},
                deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
                body: proto.Message.InteractiveMessage.Body.create({
                    text: sudah,
                }),
                footer: proto.Message.InteractiveMessage.Footer.create({
                    text: "*© Lann4you Official*"
                }),
                header: proto.Message.InteractiveMessage.Header.create({
                    title: "\t⬣─〔 *🚀 Explorasi Antariksa* 〕─⬣\n",
                    subtitle: "",
                    hasMediaAttachment: false
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                    buttons: [
                        {
                            name: "quick_reply",
                            buttonParamsJson: "{\"display_text\":\"🚀 Start\",\"id\":\"roketStart\"}"
                        },
                        {
                            name: "quick_reply",
                            buttonParamsJson: "{\"display_text\":\"👨🏻‍🚀 Player\",\"id\":\"players_nya\"}"
                        },
                    ],
                })
            })
        },
    }
}, {})  
        if (!msg || !msg.message) return conn.reply(m.chat, 'Gagal mengirim pesan (konten tidak valid)', m);
        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id, })
     } else if (selectedButton === 'roketStart' && m.sender === roket.master) {
      if (roket.players.length <= 1) {
       let belum = `👨🏻‍🚀: Minimal 1 Pemain Yang Bergabung Ke Dalam Room`
        let msg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
        message: {
            messageContextInfo: {
                deviceListMetadata: {},
                deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
                body: proto.Message.InteractiveMessage.Body.create({
                    text: belum,
                }),
                footer: proto.Message.InteractiveMessage.Footer.create({
                    text: "*© Lann4you Official*"
                }),
                header: proto.Message.InteractiveMessage.Header.create({
                    title: "\t⬣─〔 *🚀 Explorasi Antariksa* 〕─⬣\n",
                    subtitle: "",
                    hasMediaAttachment: false
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                    buttons: [
                        {
                            name: "quick_reply",
                            buttonParamsJson: "{\"display_text\":\"👤 Solo\",\"id\":\"sendirian_aja\"}"
                        },
                    ],
                })
            })
        },
    }
}, {})   
        if (!msg || !msg.message) return conn.reply(m.chat, 'Gagal mengirim pesan (konten tidak valid)', m);
        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id, })
        } else if (roket.tujuan) {
          eksplorasiAntariksa(m, roket)
         }
      } else if (selectedButton === 'sendirian_aja' && m.sender === roket.master) {
      if (roket.players.length >= 2) {
      let sudah = `👨🏻‍🚀: Sudah Ada Pemain Yang Bergabung Kedalam Room, Tidak Bisa Bermain Sendiri, Silahkan Mulai Permainan`
        let msg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
        message: {
            messageContextInfo: {
                deviceListMetadata: {},
                deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
                body: proto.Message.InteractiveMessage.Body.create({
                    text: sudah,
                }),
                footer: proto.Message.InteractiveMessage.Footer.create({
                    text: "*© Lann4you Official*"
                }),
                header: proto.Message.InteractiveMessage.Header.create({
                    title: "\t⬣─〔 *🚀 Explorasi Antariksa* 〕─⬣\n",
                    subtitle: "",
                    hasMediaAttachment: false
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                    buttons: [
                        {
                            name: "quick_reply",
                            buttonParamsJson: "{\"display_text\":\"🚀 Start\",\"id\":\"roketStart\"}"
                        },
                        {
                            name: "quick_reply",
                            buttonParamsJson: "{\"display_text\":\"👨🏻‍🚀 Player\",\"id\":\"players_nya\"}"
                        },
                    ],
                })
            })
        },
    }
}, {})
        if (!msg || !msg.message) return conn.reply(m.chat, 'Gagal mengirim pesan (konten tidak valid)', m);
        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id, })
      } else if (roket.tujuan) {
          eksplorasiAntariksa(m, roket)
      }
    } else if (selectedButton === 'batallken' && m.sender === roket.master) {
    if (roket.players.length >= 2) return conn.reply(m.chat, `👨🏻‍🚀: Tidak Bisa Membatalkan Permainan, Karna Sudah Ada Pemain Yang Bergabung Kedalam roket, Silahkan *Start* Permainan`, m)
       let batalMsg = `Sukses Membatalkan Permainan`
       await conn.reply(m.chat, batalMsg, m, { contextInfo: { mentionedJid: [roket.master] } });
       delete conn.roket[m.chat]
       } else if (selectedButton === 'players_nya' && roket.players.includes(m.sender)) {
         let playerList = this.roket[m.chat].players.map((player, index) => `*${index + 1}.* @${player.replace(/@.+/, '')}`).join('\n');
         await conn.reply(m.chat, `*[🚀] Astronot*\n👨🏻‍🚀 Player:\n${playerList}\n▬▭▬▭▬▭▬▭`, m, { contextInfo : { mentionedJid: this.roket[m.chat].players }})
        }
  } else if (bulan && selectedButton === 'room_buat' && m.sender === bulan.peran && bulan.status == 'wait') {
       let pilihServer = `\`👨🏻‍🚀: Pilih Tujuanmu di bawah ini\``;
     let sections = [{
		title: wm, 
		highlight_label: '', 
		rows: [{
			header: '', 
	title: "🌔 Merkurius",
	description: ": ᴍᴇɴᴊᴇʟᴀᴊᴀʜɪ ᴍᴇʀᴋᴜʀɪᴜs",
	id: '.Merkurius'
	},
	{
		header: '', 
		title: "🌔 Uranus", 
		description: ": ᴍᴇɴᴊᴇʟᴀᴊᴀʜɪ ᴜʀᴀɴᴜs",
		id: '.ura'
		},
		{
		header: '', 
		title: "🌔 Mars", 
		description: ": ᴍᴇɴᴊᴇʟᴀᴊᴀʜɪ ᴍᴀʀs",
		id: '.Mars'
		},
		{
		header: '', 
		title: "🌔 Neptunus",
		description: ": ᴍᴇɴᴊᴇʟᴀᴊᴀʜɪ ɴᴇᴘᴛᴜɴᴜs",
		id: '.neptu'
		},
		{
		header: '', 
		title: "🌔 Jupiter",
		description: ": ᴍᴇɴᴊᴇʟᴀᴊᴀʜɪ ᴊᴜᴘɪᴛᴇʀ",
		id: '.Jupiter'
		},
		{
		header: '', 
		title: "🌔 Saturnus",
		description: ": ᴍᴇɴᴊᴇʟᴀᴊᴀʜɪ sᴀᴛᴜʀɴᴜs",
		id: '.akunuy'
		},
		{
		header: '', 
		title: "🌔 Venus",
		description: ": ᴍᴇɴᴊᴇʟᴀᴊᴀʜɪ ᴠᴇɴᴜs",
		id: '.Venus'
	}]
}]

let listMessage = {
    title: 'Tujuan', 
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
            text: pilihServer,
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: '*© Lann4you Official*',
          }),
          header: proto.Message.InteractiveMessage.Header.create({
            title: "\t⬣─〔 *🚀 Explorasi Antariksa* 〕─⬣\n",
            hasMediaAttachment: false
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

if (!msg || !msg.message) return conn.reply(m.chat, 'Gagal mengirim pesan (konten tidak valid)', m);
await conn.relayMessage(msg.key.remoteJid, msg.message, {
  messageId: msg.key.id})
  bulan.status = 'tujuan'
      }
   }
}

async function eksplorasiAntariksa(m, roket) {
roket.players.forEach(player => {
  let allUser = db.data.users[player]
  allUser.lastroket = new Date() * 1
})
let startMsg = `*👨🏻‍🚀: Kalian Akan Meluncur Ke Antariksa*\n\n👨🏻‍🚀 Players :\n`;
    roket.players.forEach((player, index) => {
        startMsg += `*${index + 1}.* @${player.replace(/@.+/, '')}\n`;
    });
    startMsg += `\n*📌Room ID:* ${roket.id}\n*🌔 Tujuan:* ${roket.tujuan}\n\n*🚀 Tunggu Beberapa Saat!!.*`;
    await conn.reply(m.chat, startMsg, m, { contextInfo: { mentionedJid: roket.players } });
    delete conn.roket[m.chat];
    
    setTimeout(async () => {
        let resultsMsg = `*👨🏻‍🚀: Kalian Telah Kembali*\n\n👨🏻‍🚀 Player:\n`;
        roket.players.forEach((player, index) => {
            resultsMsg += `*${index + 1}.* @${player.replace(/@.+/, '')}\n`;
        });
        resultsMsg += `\n*📌 Room ID:* ${roket.id}\n*🌔 Tujuan: ${roket.tujuan}*\n\n*🎁 Reward:*\n`;

        roket.players.forEach(player => {
        let user = global.db.data.users[player];
            let emas = Math.floor(Math.random() * 30);
            let money = Math.floor(Math.random() * 20000000);
            let exp = Math.floor(Math.random() * 50000);

            user.aerozine -= 50;
            user.money += money;
            user.exp += exp;
           // user.lastroket = new Date * 1;
            user.totalb += 1;

            resultsMsg += `\n[✠]▬▭▬▭▬▭▬▭▬▭[✠]\n👤 @${player.replace(/@.+/, '')}\n💵 *Money:* +Rp.${money.toLocaleString()}\n🧪 *Exp:* +${exp.toLocaleString()}\n*🛢️ Aerozine:* -50\n*👨🏻‍🚀 Pengalaman:* +1`;
        });

        await conn.reply(m.chat, resultsMsg, m, { contextInfo: { mentionedJid: roket.players } });
    }, 10000);

    setTimeout(async () => {
        let playerListt = roket.players.map((player, index) => `*${index + 1}.* @${player.replace(/@.+/, '')}`).join('\n');
        await conn.reply(m.chat, `*👨🏻‍🚀: Hai User*\n${playerListt}\nAyo Saatnya Kita Ekplorasi Antariksa Lagi!!`, m, { contextInfo: { mentionedJid: roket.players } });
    }, 1800000);
}

export default handler;



function clockString(ms) {
  let h = isNaN(ms) ? '60' : Math.floor(ms / 3600000) % 60
  let m = isNaN(ms) ? '60' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '60' : Math.floor(ms / 1000) % 60
  return [h, m, s,].map(v => v.toString().padStart(2, 0) ).join(':')
}