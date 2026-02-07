const {
    proto,
    generateWAMessageFromContent,
    prepareWAMessageMedia
  } = (await import('@adiwajshing/baileys')).default
async function broadcastMessage(conn, m) {
    const groups = Object.entries(conn.chats).filter(([jid, chat]) => 
        jid.endsWith('@g.us') && chat.isChats && !chat.metadata?.read_only && !chat.metadata?.announce
    ).map(([jid]) => jid);

    await conn.reply(m.chat, `_Sending broadcast message to ${groups.length} groups_`, m);

    for (const id of groups) {
        const msg = generateWAMessageFromContent(id, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2
                    },
                    interactiveMessage: proto.Message.InteractiveMessage.create({
                        body: proto.Message.InteractiveMessage.Body.create({
                            text: m.text
                        }),
                        footer: proto.Message.InteractiveMessage.Footer.create({
                            text: ""
                        }),
                        header: proto.Message.InteractiveMessage.Header.create({
                            title: "",
                            subtitle: "BROADCAST",
                            hasMediaAttachment: false
                        }),
                        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                            buttons: [
                                {
                                    name: "cta_url",
                                    buttonParamsJson: JSON.stringify({
                                        display_text: "Owner 📞",
                                        url: "https://wa.me/16802909855",
                                        merchant_url: "https://wa.me/16802909855"
                                    })
                                },
                                {
                                    name: "cta_url",
                                    buttonParamsJson: JSON.stringify({
                                        display_text: "Share Code Ch🌐",
                                        url: "https://whatsapp.com/channel/0029VakezCJDp2Q68C61RH2C",
                                        merchant_url: "www.google.com"
                                    })
                                }
                            ]
                        })
                    })
                }
            }
        }, { quoted: m });

        await conn.relayMessage(msg.key.remoteJid, msg.message, {
            messageId: msg.key.id
        });
    }

    await conn.reply(m.chat, '_Successfully sent broadcast message to all groups!_', m);
}

const handler = async (m, { conn }) => {
    await broadcastMessage(conn, m);
};

handler.command = ['bcgcbutton', 'bcgcb'];
handler.tags = ['owner'];
handler.help = ['bcgcbutton <text>', 'bcgcb <text>'];
handler.owner = true;

export default handler;