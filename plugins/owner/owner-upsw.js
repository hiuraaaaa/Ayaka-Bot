import { generateWAMessage, STORIES_JID } from "@adiwajshing/baileys";

const handler = async (m, { conn, args, usedPrefix, command }) => {
    const fetchParticipants = async (...jids) => {
        let results = [];
        for (const jid of jids) {
            const { participants } = await conn.groupMetadata(jid);
            const participantIds = participants.map(({ id }) => id);
            results = results.concat(participantIds);
        }
        return results;
    };

    const mstatus = async (jids, content) => {
        const msg = await generateWAMessage(STORIES_JID, content, {
            upload: conn.waUploadToServer
        });

        let statusJidList = [];
        for (const _jid of jids) {
            if (_jid.endsWith("@g.us")) {
                const groupParticipants = await fetchParticipants(_jid);
                statusJidList.push(...groupParticipants);
            } else {
                statusJidList.push(_jid);
            }
        }
        statusJidList = [...new Set(statusJidList)];

        await conn.relayMessage(msg.key.remoteJid, msg.message, {
            messageId: msg.key.id,
            statusJidList,
            additionalNodes: [{
                tag: "meta",
                attrs: {},
                content: [{
                    tag: "mentioned_users",
                    attrs: {},
                    content: jids.map((jid) => ({
                        tag: "to",
                        attrs: { jid },
                        content: undefined
                    }))
                }]
            }]
        });

        for (const jid of jids) {
            const type = jid.endsWith("@g.us") ? "groupStatusMentionMessage" : "statusMentionMessage";
            await conn.relayMessage(jid, {
                [type]: {
                    message: {
                        protocolMessage: {
                            key: msg.key,
                            type: 25
                        }
                    }
                }
            }, {
                additionalNodes: [{
                    tag: "meta",
                    attrs: { is_status_mention: "true" },
                    content: undefined
                }]
            });
        }
        return msg;
    };

    try {
        const q = m.quoted ? m.quoted : m;
        const mime = (q.msg || q).mimetype || '';
        const content = {};

        if (mime) {
            const media = await q.download();
            if (/image/.test(mime)) {
                content.image = media;
            } else if (/video/.test(mime)) {
                content.video = media;
            } else if (/audio/.test(mime)) {
                content.audio = media;
            } else {
                throw new Error("Jenis file tidak didukung!");
            }
            if (q.text) content.caption = q.text;
        } else if (args.length > 0) {
            content.text = args.join(" ");
        } else {
            throw new Error(`Reply media atau masukkan Text\nContoh:\n${usedPrefix + command} halo guys`);
        }

        const sentMessage = await mstatus([m.chat], content);
        m.reply(`✅ *Status berhasil dikirim!*\n\`\`\`${JSON.stringify(sentMessage, null, 2)}\`\`\``);
    } catch (error) {
        m.reply(`*Error:* \n\`\`\`${error.message}\`\`\``);
    }
};

handler.command = ['upsw'];
handler.tags = ['owner'];
handler.help = ['upsw'];
handler.owner = true;
handler.group = true;

export default handler;