const { generateWAMessageFromContent } = (await import("@adiwajshing/baileys")).default;

let handler = async (m, { conn }) => {
    let oya = `Pilih Jenis Kelamin Kamu✨`;

    let jenisKelaminList = [
        ["♂️", "Laki-laki"], ["♀️", "Perempuan"], ["⚧", "Non-Biner"], ["🤖", "Robot"], ["👤", "Tidak Diketahui"]
    ];

    let rows = jenisKelaminList.map(([emoji, name]) => ({
        header: "",
        title: `${emoji} ${name}`,
        description: "Pilih jenis kelamin ini✨",
        id: `.editprofile jk ${name}`
    }));

    let msg = generateWAMessageFromContent(
        m.chat,
        {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2
                    },
                    interactiveMessage: {
                        body: { text: oya },
                        footer: { text: `© ${global.namebot} 2025` },
                        header: {
                            title: "",
                            subtitle: "Pilih Jenis Kelamin✨",
                            hasMediaAttachment: false
                        },
                        contextInfo: {
                            forwardingScore: 2024,
                            isForwarded: true,
                            mentionedJid: [m.sender],
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: "120363419084530852@newsletter",
                                serverMessageId: null,
                                newsletterName: `© ${global.namebot} 2025`
                            }
                        },
                        nativeFlowMessage: {
                            buttons: [{
                                name: "single_select",
                                buttonParamsJson: JSON.stringify({
                                    title: "Pilih Jenis Kelamin Kamu",
                                    sections: [{
                                        title: "Daftar Jenis Kelamin",
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

    await conn.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });
};

handler.help = ["jenis_kelamin"];
handler.tags = ["rpg"];
handler.command = /^jk$/i;

export default handler;