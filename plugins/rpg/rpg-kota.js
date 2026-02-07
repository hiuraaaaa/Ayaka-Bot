const { generateWAMessageFromContent } = (await import("@adiwajshing/baileys")).default;

let handler = async (m, { conn }) => {
    let oya = `Pilih Kota Kamu\n\nJika tidak ada kotamu, kamu bisa masukkan kota manual dengan mengetik:\n*.editprofile kota namakota✨*`;

    let kotaList = [
        ["Kuala Kapuas"], ["Jakarta"], ["Surabaya"], ["Bandung"], ["Yogyakarta"], ["Medan"],
        ["Palembang"], ["Makassar"], ["Balikpapan"], ["Samarinda"], ["Pontianak"], ["Banjarmasin"],
        ["Jayapura"], ["Manado"], ["Kupang"], ["Padang"], ["Pekanbaru"], ["Batam"], ["Semarang"],
        ["Cirebon"], ["Tasikmalaya"], ["Denpasar"], ["Mataram"], ["Ambon"], ["Ternate"]
    ];

    let rows = kotaList.map(([name]) => ({
        header: "",
        title: name,
        description: "Pilih kota ini🎊",
        id: `.editprofile kota ${name}`
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
                            subtitle: "Pilih Kota✨",
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
                                    title: "Pilih Kota Kamu🎊",
                                    sections: [{
                                        title: "List Kota",
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

handler.help = ["kota"];
handler.tags = ["rpg"];
handler.command = /^kota$/i;

export default handler;