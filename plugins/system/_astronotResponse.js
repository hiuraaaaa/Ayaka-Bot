const { proto, generateWAMessageFromContent, prepareWAMessageMedia } = (await import('@adiwajshing/baileys')).default;

let handler = async(m, { conn, command, text }) => {
      conn.astro = conn.astro || {};
      conn.roket = conn.roket || {};
      let bulan = conn.astro[m.chat];
      let roket = conn.roket[m.chat];
      let user = global.db.data.users[m.sender]
      
 if (bulan) {
 if (m.sender !== bulan.peran) return;
   switch (command) {
       case 'merkurius':
       case 'mars':
       case 'venus':
       case 'akunuy':
       case 'jupiter':
       case 'ura':
       case 'neptu':
     if (user.roket === 0) return m.reply('_👨🏻‍🚀: Kamu Tidak Memiliki *🚀 Roket*, Silahkan Beli Terlebih Dahulu_\n*Ketik:* !shop buy roket')
     if (user.aerozine < 50) return m.reply('_👨🏻‍🚀: Aerozine Kamu Kurang Dari *50*, Isi Bahan Bakar Roketmu, Silahkan Beli Terlebih Dahulu_\n*Ketik:* !shop buy aerozine')
    let id = Math.floor(Math.random() * 10000000);
    let tuju = ''
        if (command == 'merkurius') {
          tuju = 'Merkurius'
          } else if (command == 'venus') {
          tuju = 'Venus'
          } else if (command == 'akunuy') {
          tuju = 'Saturnus'
          } else if (command == 'neptu') {
          tuju = 'Neptunus'
          } else if (command == 'ura') {
          tuju = 'Uranus'
          } else if (command == 'mars') {
          tuju = 'Mars'
          } else if (command == 'jupiter') {
          tuju = 'Jupiter'
          }
          
     let tujuan = `👨🏻‍🚀: Berhasil Membuat Room\n*📌 Room ID:* ${id}\n*🌔 Tujuan:* ${tuju}\n\n🕐 Menunggu Pemain Lain Untuk Bergabung Kedalam Room`;
         let msg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
        message: {
            messageContextInfo: {
                deviceListMetadata: {},
                deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
                body: proto.Message.InteractiveMessage.Body.create({
                    text: tujuan,
                }),
                footer: proto.Message.InteractiveMessage.Footer.create({
                    text: "*© Lann4you!*"
                }),
                header: proto.Message.InteractiveMessage.Header.create({
                    title: "\t✨ *EXPLORASI ANTARIKSA ✨*\n",
                    subtitle: "",
                    hasMediaAttachment: false
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                    buttons: [
                        {
                            name: "quick_reply",
                            buttonParamsJson: "{\"display_text\":\"👨🏻‍🚀 Bergabung\",\"id\":\"gabung\"}"
                        },
                        {
                            name: "quick_reply",
                            buttonParamsJson: "{\"display_text\":\"👤 Solo\",\"id\":\"sendirian_aja\"}"
                            },
                            {
                            name: "quick_reply",
                            buttonParamsJson: "{\"display_text\":\"🚫 Batalkan\",\"id\":\"batallken\"}"
                        },
                    ],
                })
            })
        },
    }
}, {})
        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id,})
        conn.roket[m.chat] = {
           master: bulan.peran,
           players: [m.sender],
           id: id,
           tujuan: tuju,
           status: 'waiting',
           del: delete conn.astro[m.chat]
         }
         roket = conn.roket[m.chat]
      }
   }
}

handler.command = /^(merkurius|ura|neptu|venus|mars|jupiter|akunuy)$/i

export default handler;