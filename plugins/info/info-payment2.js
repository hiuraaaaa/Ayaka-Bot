let handler  = async (m, { conn, isOwner}) => {
 const { generateWAMessageFromContent, proto, prepareWAMessageMedia } = (await import("@adiwajshing/baileys")).default
let msgs = generateWAMessageFromContent(m.chat, {
  viewOnceMessage: {
    message: {
        "messageContextInfo": {
          "deviceListMetadata": {},
          "deviceListMetadataVersion": 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: proto.Message.InteractiveMessage.Body.create({
            text: `\`P E M B A Y A R A N\`

Silahkan Copy Di Bawah ><`,
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: "© Ayaka || LannOfc!",
          }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [
                  {
                    "name": "cta_copy",
                    "buttonParamsJson": `{\"display_text\":\"Dana\",\"id\":\"123456789\",\"copy_code\":\"085825143528\"}`
                  }
           ],
          })
        })
    }
  }
}, {})

return await conn.relayMessage(m.key.remoteJid, msgs.message, {
  messageId: m.key.id
})
}

handler.command = ["payment2","pay2"];
handler.tags = ["info"];
handler.help = ['payment']

export default handler