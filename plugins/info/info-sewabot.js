const { generateWAMessageFromContent, prepareWAMessageMedia, proto } = (await import('@adiwajshing/baileys')).default;

const handler = async (m, { conn }) => {
  await conn.sendMessage(m.chat, { react: { text: '🛍️', key: m.key } });

  const msg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.fromObject({
          contextInfo: {
            mentionedJid: [m.sender],
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: '120363401097268327@newsletter',
              newsletterName: `ʙᴏᴛ ᴡʜᴀᴛsᴀᴘᴘ || ${global.namebot}`,
              serverMessageId: -1
            },
            businessMessageForwardInfo: { businessOwnerJid: conn.decodeJid(conn.user.id) },
            forwardingScore: 256,
            externalAdReply: {  
              title: `© 2025 ${global.namebot}`,
              thumbnailUrl: 'https://files.catbox.moe/nylq4r.jpg',
              sourceUrl: 'https://whatsapp.com/channel/0029Vb63N4dL7UVaVlVnnu39',
              mediaType: 2,
              renderLargerThumbnail: false
            }
          },
          body: proto.Message.InteractiveMessage.Body.fromObject({
            text: `*Hello, @${m.sender.replace(/@.+/g, '')}!*\nSilahkan Lihat Produk Di Bawah!\n\n❏ Penjelasan:
- Tidak Menerima Return Jika Saldo Sudah Masuk
- User Sewa/Premium *WAJIB* Mengikuti Saluran ${global.namebot}\n`
          }),
          footer: proto.Message.InteractiveMessage.Footer.fromObject({
            text: `Powered By ${global.namebot}`
          }),
          header: proto.Message.InteractiveMessage.Header.fromObject({
            hasMediaAttachment: false
          }),
          carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
            cards: [
              {
                body: proto.Message.InteractiveMessage.Body.fromObject({
                  text: '❃ _*15 Days:*_ _Rp5.000_\n❃ _*30 Days:*_ _Rp10.000_\n❃ _*60 Days:*_ _Rp20.000_\n❃ _*Permanen:*_ _Rp30.000_\n\n*B E N E F I T S*\n\n❁ _Get Unlimited Limit_\n❁ _Get Acces All Fitur_\n❁ _Get Acces Private Massage_\n❁ _Get Profile Good_\n\nUntuk Melihat Promo Ketik *.Promopremium*\n\nUntuk Metode Pembayaran Ketik *.Payment*'
                }),
                footer: proto.Message.InteractiveMessage.Footer.fromObject({}),
                header: proto.Message.InteractiveMessage.Header.fromObject({
                  title: '`「P R E M I U M」`\n',
                  hasMediaAttachment: true,
                  ...(await prepareWAMessageMedia({ image: { url: global.thumb } }, { upload: conn.waUploadToServer }))
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                  buttons: [
                    {
                      name: "cta_url",
                      buttonParamsJson: `{"display_text":"Order Here!","url":"https://wa.me/6287872545804?text=Kak+Lann4you+Mau+Order+Premium","merchant_url":"https://wa.me/6287872545804?text=Kak+Lann4you+Mau+Order+Premium"}`
                    }
                  ]
                })
              },
              {
                body: proto.Message.InteractiveMessage.Body.fromObject({
                  text: '❃ _*7 Days:* Rp7.000 / Group_\n❃ _*30 Days:* Rp15.000 / Group_\n❃ _*60 Days:* Rp25.000 / Group_\n❃ _*Permanen:* Rp50.000 / Group_\n\n*B E N E F I T S*\n\n❁ _Feature Groups_\n❁ _Antilink_\n❁ _Welcome_\n❁ _Enable_\n❁ _Store List_\n❁ _Promote/Demote_\n❁ _HideTag_\n❁ _Dan Lain Lain_\n\nUntuk Melihat Promo Ketik *.Promosewa*\n\nUntuk Metode Pembayaran Ketik *.Payment*'
                }),
                footer: proto.Message.InteractiveMessage.Footer.fromObject({}),
                header: proto.Message.InteractiveMessage.Header.fromObject({
                  title: '`「S E W A  B O T」`\n',
                  hasMediaAttachment: true,
                  ...(await prepareWAMessageMedia({ image: { url: global.thumb } }, { upload: conn.waUploadToServer }))
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                  buttons: [
                    {
                      name: "cta_url",
                      buttonParamsJson: `{"display_text":"Order Here!","url":"https://wa.me/6287872545804?text=Kak+Lann4you+Mau+Order+Sewa+Bot","merchant_url":"https://wa.me/6287872545804?text=Kak+Lann4you+Mau+Order+Sewa+Bot"}`
                    }
                  ]
                })
              },
              {
                body: proto.Message.InteractiveMessage.Body.fromObject({
                  text: '❃ _*7 Days:* Rp10.000 / Group_\n❃ _*30 Days:* Rp20.000 / Group_\n❃ _*60 Days:* Rp30.000 / Group_\n❃ _*Permanen:* Rp60.000 / Group_\n\n*B E N E F I T S*\n\n❁ _Able To Access All Premium Features Within The Group_\n❁ _Unlimited Limit For Group Members_\n❁ _Feature Groups_\n❁ _Antilink_\n❁ _Welcome_\n❁ _Enable_\n❁ _Store List_\n❁ _Promote/Demote_\n❁ _HideTag_\n❁ _Dan Lain Lain_\n\nUntuk Melihat Promo Ketik *.Promosewa*\n\nUntuk Metode Pembayaran Ketik *.Payment*'
                }),
                footer: proto.Message.InteractiveMessage.Footer.fromObject({}),
                header: proto.Message.InteractiveMessage.Header.fromObject({
                  title: '`「S E W A  B O T VVIP」`\n',
                  hasMediaAttachment: true,
                  ...(await prepareWAMessageMedia({ image: { url: global.thumb } }, { upload: conn.waUploadToServer }))
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                  buttons: [
                    {
                      name: "cta_url",
                      buttonParamsJson: `{"display_text":"Order Here!","url":"https://wa.me/6287872545804?text=Kak+Lann4you+Mau+Order+Sewa+Bot+VVIP","merchant_url":"https://wa.me/6287872545804?text=Kak+Lann4you+Mau+Order+Sewa+Bot+VVIP"}`
                    }
                  ]
                })
              },
              {
                body: proto.Message.InteractiveMessage.Body.fromObject({
                  text: '❃ _Jasa Run Bot_ _Rp2.000_\n❃ _Jasa Rename Script Bot_ _Rp15.000_\n❃ _Jasa Fix Fitur_ _Rp20.000_\n❃ _Jasa Sell Script MD_\n_Dengan Mengetik *.script* / *.sc*_\n\nUntuk Melihat Promo BuySC Ketik *.Promosc*\n\nUntuk Metode Pembayaran Ketik *.Payment*'
                }),
                footer: proto.Message.InteractiveMessage.Footer.fromObject({}),
                header: proto.Message.InteractiveMessage.Header.fromObject({
                  title: '`「L I S T  J A S A」`\n',
                  hasMediaAttachment: true,
                  ...(await prepareWAMessageMedia({ image: { url: global.thumb } }, { upload: conn.waUploadToServer }))
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                  buttons: [
                    {
                      name: "cta_url",
                      buttonParamsJson: `{"display_text":"Order Here!","url":"https://wa.me/6287872545804?text=Kak+Lann4you+Mau+Order+Jasa","merchant_url":"https://wa.me/6287872545804?text=Kak+Lann4you+Mau+Order+Jasa"}`
                    }
                  ]
                })
              }
            ]
          })
        })
      }
    }
  }, { userJid: m.chat, quoted: m });

  await conn.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });
};

handler.help = ['sewabot', 'premium'];
handler.tags = ['main'];
handler.command = /^(sewa|sewabot|premium|prem|jasa)$/i;
handler.private = false;

export default handler;