const { proto, generateWAMessageFromContent } = (await import('@adiwajshing/baileys')).default;

const handler = async (m, { text, conn }) => {
    try {
        if (!text) return m.reply("Harap masukkan link channel WhatsApp!");
        
        const regex = /https?:\/\/(www\.)?whatsapp\.com\/channel\/([a-zA-Z0-9-_]+)/;
        const match = text.match(regex);

        if (!match) return m.reply("Link channel WhatsApp tidak valid!");

        let channelId = match[2]; 
        let res = await conn.newsletterMetadata("invite", channelId);

        if (!res || !res.id) return m.reply("Gagal mengambil data channel. Periksa kembali link!");

        let teks = `🌟 *Detail Channel WhatsApp* 🌟\n\n`
            + `📌 *ID:* ${res.id}\n`
            + `📢 *Nama:* ${res.name}\n`
            + `👥 *Total Pengikut:* ${res.subscribers.toLocaleString()}\n`
            + `📌 *Status:* ${res.state}\n`
            + `✅ *Verified:* ${res.verification === "VERIFIED" ? "✔ Terverifikasi" : "❌ Tidak Terverifikasi"}\n`;

        let buttonMessage = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    interactiveMessage: proto.Message.InteractiveMessage.create({
                        body: { text: teks },
                        nativeFlowMessage: {
                            buttons: [
                                {
                                    name: "cta_copy",
                                    buttonParamsJson: JSON.stringify({
                                        display_text: "Copy Channel ID",
                                        copy_code: res.id
                                    })
                                }
                            ]
                        }
                    })
                }
            }
        }, { quoted: m });

        await conn.relayMessage(m.chat, buttonMessage.message, {});

    } catch (error) {
        console.error(error);
        return m.reply("Terjadi kesalahan saat mengambil data channel. Coba lagi nanti.");
    }
};

handler.help = handler.command = ["idch2"];
handler.tags = ["owner"];
handler.rowner = true;

export default handler;