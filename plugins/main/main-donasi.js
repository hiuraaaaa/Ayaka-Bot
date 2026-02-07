const { generateWAMessageFromContent, prepareWAMessageMedia, proto } = (await import('@adiwajshing/baileys')).default;

const handler = async (m, { conn }) => {
  await conn.sendMessage(m.chat, { react: { text: '⏱️', key: m.key } });

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
              newsletterJid: '120363401097268327@newsletterr',
              newsletterName: `${global.namebot} ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${global.author}`,
              serverMessageId: -1
            },
            businessMessageForwardInfo: { businessOwnerJid: conn.decodeJid(conn.user.id) },
            forwardingScore: 256,
            externalAdReply: {
              title: 'Donasi',
              thumbnailUrl: `${global.thumb}`,
              sourceUrl: `https://wa.me/${global.nomorown}`,
              mediaType: 2,
              renderLargerThumbnail: false
            }
          },
          body: proto.Message.InteractiveMessage.Body.fromObject({
            text: `*Halo, @${m.sender.replace(/@.+/, '')}!*\nBerikut metode pembayaran yang tersedia.`
          }),
          footer: proto.Message.InteractiveMessage.Footer.fromObject({
            text: `Powered by ${global.author}`
          }),
          header: proto.Message.InteractiveMessage.Header.fromObject({
            hasMediaAttachment: false
          }),
          carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
            cards: [
              {
                body: proto.Message.InteractiveMessage.Body.fromObject({
                  text: `╭─「 • *ᴇ-ᴡᴀʟʟᴇᴛ* • 」
│ • *ᴅᴀɴᴀ* ${global.pdana}
╰─────

𝘩𝘢𝘳𝘢𝘱 𝘤𝘦𝘬 𝘶𝘭𝘢𝘯𝘨 𝘯𝘰𝘮𝘰𝘳 𝘴𝘦𝘣𝘦𝘭𝘶𝘮 𝘵𝘳𝘢𝘯𝘴𝘧𝘦𝘳, 𝘴𝘢𝘭𝘢𝘩 𝘵𝘳𝘢𝘯𝘴𝘧𝘦𝘳 𝘢𝘥𝘮𝘪𝘯 𝘵𝘪𝘥𝘢𝘬 𝘣𝘦𝘳𝘵𝘢𝘯𝘨𝘨𝘶𝘯𝘨 𝘫𝘢𝘸𝘢𝘣.`
                }),
                footer: proto.Message.InteractiveMessage.Footer.fromObject({}),
                header: proto.Message.InteractiveMessage.Header.fromObject({
                  title: '`❖ ᴅ ᴀ ɴ ᴀ`',
                  hasMediaAttachment: true,
                  ...(await prepareWAMessageMedia({ image: { url: `${global.pqris}` } }, { upload: conn.waUploadToServer }))
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                  buttons: [
                    {
                      name: "cta_copy",
                      buttonParamsJson: JSON.stringify({
                        display_text: "Salin Nomor DANA",
                        id: global.pdana || '-',
                        copy_code: global.pdana || '-'
                      })
                    }
                  ]
                })
              },
              {
                body: proto.Message.InteractiveMessage.Body.fromObject({
                  text: `╭─「 • *ᴇ-ᴡᴀʟʟᴇᴛ* • 」
│ • *sᴇᴀʙᴀɴᴋ* ${global.pseabank}
╰─────

𝘩𝘢𝘳𝘢𝘱 𝘤𝘦𝘬 𝘶𝘭𝘢𝘯𝘨 𝘯𝘰𝘮𝘰𝘳 𝘴𝘦𝘣𝘦𝘭𝘶𝘮 𝘵𝘳𝘢𝘯𝘴𝘧𝘦𝘳, 𝘴𝘢𝘭𝘢𝘩 𝘵𝘳𝘢𝘯𝘴𝘧𝘦𝘳 𝘢𝘥𝘮𝘪𝘯 𝘵𝘪𝘥𝘢𝘬 𝘣𝘦𝘳𝘵𝘢𝘯𝘨𝘨𝘶𝘯𝘨 𝘫𝘢𝘸𝘢𝘣.`
                }),
                footer: proto.Message.InteractiveMessage.Footer.fromObject({}),
                header: proto.Message.InteractiveMessage.Header.fromObject({
                  title: '`❖ s ᴇ ᴀ ʙ ᴀ ɴ ᴋ`',
                  hasMediaAttachment: true,
                  ...(await prepareWAMessageMedia({ image: { url: `${global.pqris}` } }, { upload: conn.waUploadToServer }))
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                  buttons: [
                    {
                      name: "cta_copy",
                      buttonParamsJson: JSON.stringify({
                        display_text: "Salin Nomor SEABANK",
                        id: global.pseabank || '-',
                        copy_code: global.pseabank || '-'
                      })
                    }
                  ]
                })
              },
              {
                body: proto.Message.InteractiveMessage.Body.fromObject({
                  text: `╭─「 • *ᴇ-ᴡᴀʟʟᴇᴛ* • 」
│ • *ɢᴏᴘᴀʏ* ${global.pgopay}
╰─────

𝘩𝘢𝘳𝘢𝘱 𝘤𝘦𝘬 𝘶𝘭𝘢𝘯𝘨 𝘯𝘰𝘮𝘰𝘳 𝘴𝘦𝘣𝘦𝘭𝘶𝘮 𝘵𝘳𝘢𝘯𝘴𝘧𝘦𝘳, 𝘴𝘢𝘭𝘢𝘩 𝘵𝘳𝘢𝘯𝘴𝘧𝘦𝘳 𝘢𝘥𝘮𝘪𝘯 𝘵𝘪𝘥𝘢𝘬 𝘣𝘦𝘳𝘵𝘢𝘯𝘨𝘨𝘶𝘯𝘨 𝘫𝘢𝘸𝘢𝘣.`
                }),
                footer: proto.Message.InteractiveMessage.Footer.fromObject({}),
                header: proto.Message.InteractiveMessage.Header.fromObject({
                  title: '`❖ ɢ ᴏ ᴘ ᴀ ʏ`',
                  hasMediaAttachment: true,
                  ...(await prepareWAMessageMedia({ image: { url: `${global.pqris}` } }, { upload: conn.waUploadToServer }))
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                  buttons: [
                    {
                      name: "cta_copy",
                      buttonParamsJson: JSON.stringify({
                        display_text: "Salin Nomor GOPAY",
                        id: global.pgopay || '-',
                        copy_code: global.pgopay || '-'
                      })
                    }
                  ]
                })
              },
              {
                body: proto.Message.InteractiveMessage.Body.fromObject({
                  text: `╭─「 • *ᴇ-ᴡᴀʟʟᴇᴛ* • 」
│ • *sʜᴏᴘᴇᴇ ᴘᴀʏ* ${global.psppay}
╰─────

𝘩𝘢𝘳𝘢𝘱 𝘤𝘦𝘬 𝘶𝘭𝘢𝘯𝘨 𝘯𝘰𝘮𝘰𝘳 𝘴𝘦𝘣𝘦𝘭𝘶𝘮 𝘵𝘳𝘢𝘯𝘴𝘧𝘦𝘳, 𝘴𝘢𝘭𝘢𝘩 𝘵𝘳𝘢𝘯𝘴𝘧𝘦𝘳 𝘢𝘥𝘮𝘪𝘯 𝘵𝘪𝘥𝘢𝘬 𝘣𝘦𝘳𝘵𝘢𝘯𝘨𝘨𝘶𝘯𝘨 𝘫𝘢𝘸𝘢𝘣.`
                }),
                footer: proto.Message.InteractiveMessage.Footer.fromObject({}),
                header: proto.Message.InteractiveMessage.Header.fromObject({
                  title: '`❖ s ʜ ᴏ ᴘ ᴇ ᴇ  ᴘ ᴀ ʏ`',
                  hasMediaAttachment: true,
                  ...(await prepareWAMessageMedia({ image: { url: `${global.pqris}` } }, { upload: conn.waUploadToServer }))
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                  buttons: [
                    {
                      name: "cta_copy",
                      buttonParamsJson: JSON.stringify({
                        display_text: "Salin Nomor SHOPEE PAY",
                        id: global.psppay || '-',
                        copy_code: global.psppay || '-'
                      })
                    }
                  ]
                })
              },
              {
                body: proto.Message.InteractiveMessage.Body.fromObject({
                  text: '> Klik tombol atau scan QR di atas untuk pembayaran QRIS.'
                }),
                footer: proto.Message.InteractiveMessage.Footer.fromObject({}),
                header: proto.Message.InteractiveMessage.Header.fromObject({
                  title: '`❖ ǫ ʀ ɪ s`',
                  hasMediaAttachment: true,
                  ...(await prepareWAMessageMedia({ image: { url: `${global.pqris}` } }, { upload: conn.waUploadToServer }))
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                  buttons: [
                    {
                      name: "cta_url",
                      buttonParamsJson: JSON.stringify({
                        display_text: "Scan QRIS",
                        url: `${global.pqris}`,
                        merchant_url: `${global.pqris}`
                      })
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

handler.help = ['donate', 'donasi'];
handler.tags = ['info'];
handler.command = /^(donate|donasi)$/i;

export default handler;