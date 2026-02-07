const { generateWAMessageContent, generateWAMessageFromContent, prepareWAMessageMedia, proto } = (await import('@adiwajshing/baileys')).default;

let handler = async (m, { conn, usedPrefix, text, args, command }) => {
await m.reply(wait);
  const url = "https://files.catbox.moe/8sip1b.jpg";
  async function image(url) {
    const { imageMessage } = await generateWAMessageContent({
      image: { url }
    }, {
      upload: conn.waUploadToServer
    });
    return imageMessage;
  }

  let msg = generateWAMessageFromContent(
    m.chat,
    {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            body: {
              text: `*Contact owner dibawah ini:*`
            },
            carouselMessage: {
              cards: [
                {
                  header: proto.Message.InteractiveMessage.Header.create({
                    ...(await prepareWAMessageMedia({ image: {url:'https://files.catbox.moe/8sip1b.jpg'} }, { upload: conn.waUploadToServer })),
                    title: '',
                    gifPlayback: true,
                    subtitle: global.author,
                    hasMediaAttachment: false
                  }),
                  body: { text: `🚨 *_INI NOMOR Lann4you!!_* 🚨  
> 🛑 *Chat yang tidak pantas akan diabaikan!*  
> ❌ *DILARANG SPAM!*  
> 📞 *DILARANG TELEPON!*  

*Jaga etika ya!*` },
                  nativeFlowMessage: {
                    buttons: [
								{
									"name": "cta_url",
									"buttonParamsJson": `{"display_text":"Chat owner","url":"https://wa.me/6288705574039","merchant_url":"https://wa.me/6288705574039"}`
								},
							],
                  },
                },
              ],
              messageVersion: 1,
            },
          },
        },
      },
    },
    { quoted:m }
  );

  await conn.relayMessage(msg.key.remoteJid, msg.message, {
    messageId: msg.key.id,
  });
}

handler.help = ['own2']
handler.tags = ['main']
handler.command = /^(own2)/i
export default handler