const { proto, generateWAMessageFromContent } = (await import("@adiwajshing/baileys")).default;

let handler = async (m, { conn, usedPrefix, command, isOwner, isGroup, args }) => {
    m.reply(wait);

    const replyWithAd = async (text) => {
        await conn.sendMessage(m.chat, {
            text,
            contextInfo: {
                externalAdReply: {
                    title: `${global.namebot}`,
                    body: ``,
                    thumbnailUrl: `${global.thumbmenu}`,
                    sourceUrl: `https://nekopoi.care`,
                    mediaType: 1,
                },
            },
        });
    };

    let groupList = await conn.groupFetchAllParticipating();
    let groups = Object.values(groupList);

    if (groups.length === 0) {
        return m.reply('Bot tidak tergabung dalam grup mana pun.');
    }

    if (!args[0]) {
        let msgList = groups.map((group, index) => `${index + 1}. ${group.subject}`);

        const sections = [{
            title: "📌 Daftar Grup",
            rows: groups.map((group, index) => ({
                title: `💬 ${group.subject}`,
                description: "📝 Klik untuk keluar dari grup ini",
                id: `${usedPrefix + command} ${index + 1}`
            }))
        }];

        const listMessage = {
            title: "🛍️ Daftar Grup Tersimpan",
            sections
        };

        const caption = 'Pilih grup yang ingin kamu keluarkan bot:';

        const msg = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    interactiveMessage: proto.Message.InteractiveMessage.create({
                        body: proto.Message.InteractiveMessage.Body.create({ text: caption }),
                        header: proto.Message.InteractiveMessage.Header.create({
                            title: "",
                            hasMediaAttachment: false,
                        }),
                        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                            buttons: [{
                                name: "single_select",
                                buttonParamsJson: JSON.stringify(listMessage)
                            }]
                        })
                    })
                }
            }
        }, {
            quoted: m,
            contextInfo: {
                mentionedJid: [m.sender]
            }
        });

        return conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
    }

    let groupIndex = parseInt(args[0]) - 1;
    if (isNaN(groupIndex) || groupIndex < 0 || groupIndex >= groups.length) {
        return replyWithAd('Nomor grup tidak valid.');
    }

    let selectedGroup = groups[groupIndex].id;
    await conn.groupLeave(selectedGroup);
    replyWithAd(`Berhasil keluar dari grup: ${groups[groupIndex].subject}`);
};

handler.help = ['outgc'];
handler.tags = ['owner'];
handler.command = ['outgc'];
handler.rowner = true;

export default handler;