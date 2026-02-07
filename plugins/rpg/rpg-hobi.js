const { generateWAMessageFromContent } = (await import("@adiwajshing/baileys")).default;

let handler = async (m, { conn }) => {
    let oya = `Pilih Hobi Kamu\nJika tidak ada hobi kamu di daftar list, tinggal masukkan manual, ketik:\n*.editprofile hobi hobikamu✨*`;

    let hobiList = [
        ["🎮", "Gaming"], ["⚽", "Sepak Bola"], ["🏀", "Basket"], ["🏐", "Voli"],
        ["🏸", "Badminton"], ["🏓", "Tenis Meja"], ["🎼", "Musik"], ["🎤", "Menyanyi"],
        ["🎧", "Mendengarkan Musik"], ["🎸", "Main Gitar"], ["🥁", "Main Drum"], ["🎹", "Main Piano"],
        ["✍️", "Menulis"], ["📚", "Membaca"], ["🖼️", "Melukis"], ["✏️", "Menggambar"],
        ["📷", "Fotografi"], ["🎬", "Menonton Film"], ["🎭", "Teater"], ["⛺", "Camping"],
        ["🏕️", "Mendaki"], ["🚴‍♂️", "Bersepeda"], ["🏊‍♂️", "Berenang"], ["🧗", "Panjat Tebing"],
        ["🏋️‍♂️", "Gym"], ["🏃‍♂️", "Jogging"], ["🧘‍♀️", "Yoga"], ["🕹️", "Main Game Konsol"],
        ["💻", "Coding"], ["🌐", "Browsing"], ["🍳", "Memasak"], ["🍰", "Baking"],
        ["☕", "Ngopi"], ["🛍️", "Belanja"], ["🧵", "Menjahit"], ["🪡", "Menyulam"],
        ["🎲", "Board Game"], ["♟️", "Catur"], ["✂️", "DIY / Kerajinan"], ["⛳", "Golf"],
        ["🎯", "Dart"], ["🪁", "Main Layangan"], ["🎮", "Streaming"], ["📝", "Journaling"],
        ["🚗", "Modifikasi Mobil"], ["🏍️", "Modifikasi Motor"], ["🐶", "Merawat Hewan"],
        ["🧩", "Puzzle"], ["🃏", "Kartu"], ["🛹", "Skateboard"]
    ];

    let rows = hobiList.map(([emoji, name]) => ({
        header: "",
        title: `${emoji} ${name}`,
        description: "Pilih hobi ini✨",
        id: `.editprofile hobi ${name}`
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
                            subtitle: "Pilih Hobi✨",
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
                                    title: "Pilih Hobi Kamu✨",
                                    sections: [{
                                        title: "Daftar Hobi✨",
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

handler.help = ["hobi"];
handler.tags = ["rpg"];
handler.command = /^hobi$/i;

export default handler;