const { generateWAMessageFromContent } = (await import("@adiwajshing/baileys")).default;

let handler = async (m, { conn }) => {
    let oya = `Pilih Negara Kamu✨`;

    let negaraList = [
        ["🇮🇩", "Indonesia"], ["🇺🇸", "Amerika Serikat"], ["🇬🇧", "Inggris"], ["🇫🇷", "Prancis"],
        ["🇩🇪", "Jerman"], ["🇯🇵", "Jepang"], ["🇰🇷", "Korea Selatan"], ["🇨🇳", "China"],
        ["🇮🇳", "India"], ["🇷🇺", "Rusia"], ["🇸🇬", "Singapura"], ["🇲🇾", "Malaysia"],
        ["🇧🇷", "Brasil"], ["🇸🇦", "Arab Saudi"], ["🇹🇷", "Turki"], ["🇦🇺", "Australia"],
        ["🇨🇦", "Kanada"], ["🇲🇽", "Meksiko"], ["🇦🇷", "Argentina"], ["🇪🇸", "Spanyol"],
        ["🇮🇹", "Italia"], ["🇵🇰", "Pakistan"], ["🇧🇩", "Bangladesh"], ["🇳🇬", "Nigeria"],
        ["🇿🇦", "Afrika Selatan"], ["🇵🇭", "Filipina"], ["🇻🇳", "Vietnam"], ["🇹🇭", "Thailand"],
        ["🇵🇱", "Polandia"], ["🇺🇦", "Ukraina"], ["🇸🇪", "Swedia"], ["🇳🇴", "Norwegia"],
        ["🇩🇰", "Denmark"], ["🇫🇮", "Finlandia"], ["🇮🇷", "Iran"], ["🇮🇶", "Irak"],
        ["🇦🇪", "Uni Emirat Arab"], ["🇮🇱", "Israel"], ["🇳🇱", "Belanda"], ["🇨🇭", "Swiss"],
        ["🇧🇪", "Belgia"], ["🇦🇹", "Austria"], ["🇨🇿", "Ceko"], ["🇵🇹", "Portugal"],
        ["🇬🇷", "Yunani"], ["🇭🇺", "Hungaria"], ["🇷🇴", "Rumania"], ["🇲🇦", "Maroko"],
        ["🇩🇿", "Aljazair"], ["🇹🇳", "Tunisia"], ["🇪🇬", "Mesir"]
    ];

    let rows = negaraList.map(([flag, name]) => ({
        header: "",
        title: `${flag} ${name}`,
        description: "Pilih negara ini✨",
        id: `.editprofile negara ${name}`
    }));

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
                            subtitle: "Pilih Negara✨",
                            hasMediaAttachment: false
                        },
                        nativeFlowMessage: {
                            buttons: [{
                                name: "single_select",
                                buttonParamsJson: JSON.stringify({
                                    title: "Pilih Negara Kamu✨",
                                    sections: [{
                                        title: "List Negara✨",
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

handler.help = ["negara"];
handler.tags = ["rpg"];
handler.command = /^negara$/i;

export default handler;