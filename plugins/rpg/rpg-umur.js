const { generateWAMessageFromContent } = (await import("@adiwajshing/baileys")).default;

let handler = async (m, { conn }) => {
    let oya = `Pilih Umur Kamu`;

    let rows = Array.from({ length: 18 }, (_, i) => {
        let umur = i + 13;
        return {
            header: "",
            title: `${umur}`,
            description: "Tahun",
            id: `.editprofile umur ${umur}`
        };
    });

    let msg = generateWAMessageFromContent(
        m.chat,
        {
            viewOnceMessage: {
                message: {
                    interactiveMessage: {
                        body: { text: oya },
                        footer: { text: `© ${global.namebot} 2025` },
                        header: {
                            title: "",
                            subtitle: "Pilih Umur✨",
                            hasMediaAttachment: false
                        },
                        nativeFlowMessage: {
                            buttons: [{
                                name: "single_select",
                                buttonParamsJson: JSON.stringify({
                                    title: "Pilih Umur Kamu🎊",
                                    sections: [{
                                        title: "List Umur",
                                        highlight_label: "RPG",
                                        rows
                                    }]
                                })
                            }]
                        }
                    }
                }
            }
        },
        { quoted: m }
    );

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
};

handler.help = ["umur"];
handler.tags = ["rpg"];
handler.command = /^pilihumur$/i;

export default handler;