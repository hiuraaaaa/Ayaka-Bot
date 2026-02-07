import {
    proto,
    generateWAMessageFromContent,
    prepareWAMessageMedia
} from "@adiwajshing/baileys";
import yts from 'yt-search';

const handler = async (m, {
    conn,
    command,
    text,
    usedPrefix
}) => {
    if (!text) {
        throw `Contoh: ${usedPrefix + command} NDX AKA`;
    }
    m.reply(global.wait);
    try {
        const results = await yts(text);
        const video = results.all[0];
        if (!video) {
            throw 'Video tidak ditemukan, coba cari dengan kata kunci lain.';
        }

        const {
            title,
            thumbnail,
            timestamp,
            views,
            ago,
            url
        } = video;

        const teks = `*🏷️ Judul:* ${title}\n*⏳ Durasi:* ${timestamp}\n*👁️ Views:* ${views}\n*📅 Upload:* ${ago}\n*🔗 Link:* ${url}\n`;

        // [MODIFIKASI] Memastikan semua button ID sesuai dengan command yang ada
        const buttons = [{
            name: "quick_reply",
            buttonParamsJson: JSON.stringify({
                display_text: "🎥 Video (.mp4)",
                id: `.ytmp4v2 ${url}`
            })
        }, {
            name: "quick_reply",
            buttonParamsJson: JSON.stringify({
                display_text: "🎵 Audio (.mp3)",
                id: `.ytaudiov2 ${url}`
            })
        }, {
            name: "quick_reply",
            // [FIX] Mengubah ID dari .ytaudio-v2 menjadi .ytmp3doc agar sesuai dengan file command
            buttonParamsJson: JSON.stringify({
                display_text: "📁 Audio Document (.mp3)",
                id: `.ytmp3doc ${url}`
            })
        }];

        const msg = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2
                    },
                    interactiveMessage: proto.Message.InteractiveMessage.create({
                        body: proto.Message.InteractiveMessage.Body.create({
                            text: teks
                        }),
                        footer: proto.Message.InteractiveMessage.Footer.create({
                            text: `© ${global.namebot}`
                        }),
                        header: proto.Message.InteractiveMessage.Header.create({
                            title: "▶️ Y O U T U B E  P L A Y",
                            hasMediaAttachment: true,
                            ...(await prepareWAMessageMedia({
                                image: {
                                    url: thumbnail
                                }
                            }, {
                                upload: conn.waUploadToServer
                            }))
                        }),
                        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                            buttons: buttons
                        })
                    })
                }
            }
        }, {
            quoted: m
        });

        await conn.relayMessage(m.chat, msg.message, {
            messageId: msg.key.id
        });

    } catch (e) {
        console.error(e);
        m.reply(`Terjadi kesalahan: ${e.message}`);
    }
};

handler.help = ["play"];
handler.tags = ["downloader"];
handler.command = /^(play2|music2|song2)$/i;
handler.limit = true;

export default handler;