const { proto, generateWAMessageFromContent } = (await import("@adiwajshing/baileys")).default;

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let who;

    if (m.isGroup) {
        if (m.mentionedJid && m.mentionedJid[0]) {
            who = m.mentionedJid[0];
        } else if (m.quoted) {
            who = m.quoted.sender;
        } else {
            who = m.sender;
            await m.reply(`Tidak ada reply pesan atau tag. Mengambil LID kamu sendiri:`);
        }
    } else {
        who = m.sender;
    }

    if (!who) {
        return m.reply(`Penggunaan salah. Reply pesan, tag seseorang, atau gunakan di private chat.`);
    }

    try {
        let lid = await getLidFromJid(who, conn);

        let caption = `*ID Target:* ${who}\n*LID Target:* ${lid}`;

        const buttons = [
            {
                name: "cta_copy",
                buttonParamsJson: JSON.stringify({
                    display_text: "🔖 Copy LID",
                    copy_code: lid,
                }),
            },
        ];

        const buttonMessage = generateWAMessageFromContent(
            m.chat,
            {
                viewOnceMessage: {
                    message: {
                        interactiveMessage: proto.Message.InteractiveMessage.create({
                            body: { text: caption },
                            nativeFlowMessage: { buttons },
                        }),
                    }
                }
            },
            { quoted: m }
        );

        await conn.relayMessage(m.chat, buttonMessage.message, {});

    } catch (e) {
        console.error(e);
        await m.reply('Terjadi kesalahan saat mencoba mendapatkan LID. Pastikan bot terhubung dan ID valid.');
    }
};

handler.help = ['getlid'];
handler.tags = ['tools'];
handler.command = /^(getlid)$/i;

export default handler;

async function getLidFromJid(id, conn) {
    if (id.endsWith('@lid')) return id;
    const res = await conn.onWhatsApp(id).catch(() => []);
    return res[0]?.lid || id;
}