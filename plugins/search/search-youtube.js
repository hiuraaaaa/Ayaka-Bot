import yts from "yt-search"
const {
    proto,
    generateWAMessageFromContent,
    prepareWAMessageMedia
  } = (await import('@adiwajshing/baileys')).default
  
let handler = async (m, {
    conn,
    text
}) => {
    if (!text) return m.reply('Example : .yts faded') 
    await conn.sendMessage(m.chat, { react: { text: '🔎', key: m.key } });

    let ytsSearch = await yts(text);
    const results = ytsSearch.all.slice(0, 7); 

    if (results.length === 0) return m.reply("❌ Tidak ditemukan hasil pencarian.");

    let slides = [];
    for (let video of results) {
        let { title, url, timestamp, ago, views, author, image } = video;
        
        let media = await prepareWAMessageMedia({ image: { url: image } }, { upload: conn.waUploadToServer });
        
        slides.push({
            header: proto.Message.InteractiveMessage.Header.fromObject({
                title: `🎬 ${title}`,
                hasMediaAttachment: true,
                ...media
            }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                buttons: [
                    {
                        name: "cta_copy",
                        buttonParamsJson: `{
                            "display_text": "🔗 Link Video",
                            "copy_code": "${url}"
                        }`
                    },
                    {
                        name: "cta_copy",
                        buttonParamsJson: `{
                            "display_text": "🎵 Audio",
                            "copy_code": ".ytmp3 ${url}"
                        }`
                    },
                    {
                        name: "cta_copy",
                        buttonParamsJson: `{
                            "display_text": "🎥 Video",
                            "copy_code": ".ytmp4 ${url}"
                        }`
                    }
                ]
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
                text: `📅 Rilis: ${ago} | 👀 Views: ${views} | 🎤 ${author.name || "Unknown"}`
            })
        });
    }

    // Kirim sebagai carousel slide
    const msg = await generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
            message: {
                messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
                interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                    body: proto.Message.InteractiveMessage.Body.fromObject({
                        text: `🔎 Hasil pencarian YouTube untuk *"${text}"*`
                    }),
                    carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                        cards: slides
                    })
                })
            }
        }
    }, { quoted: m });

    conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
}
handler.help = ["search"].map(v => "yts" + v + " <pencarian>")
handler.tags = ["search"]
handler.command = /^y(outubesearch|ts(earch)?)$/i
export default handler