import { createCanvas, loadImage } from 'canvas';
import fetch from 'node-fetch';
import FormData from 'form-data';
import { fileTypeFromBuffer } from 'file-type';

const { generateWAMessageFromContent, prepareWAMessageMedia, proto } = (await import('@adiwajshing/baileys')).default;

/**
 * Mengunggah buffer gambar ke Zenzxz Uploader
 * @param {Buffer} buffer Buffer gambar
 * @returns {Promise<string>} URL gambar yang diunggah
 */
async function uploadToZenzxz(buffer) {
    const { ext } = await fileTypeFromBuffer(buffer) || { ext: 'png' };
    const filename = `upload-${Date.now()}.${ext}`;
    const form = new FormData();
    form.append('file', buffer, filename);

    const res = await fetch('https://uploader.zenzxz.dpdns.org/upload', { 
        method: 'POST', 
        body: form 
    });
    
    if (!res.ok) throw new Error(`Zenzxz Gagal: ${res.statusText}`);
    
    const html = await res.text();
    const match = html.match(/href="(https?:\/\/uploader\.zenzxz\.dpdns\.org\/uploads\/[^"]+)"/);
    
    if (!match) throw new Error('Zenzxz Gagal: Tidak dapat menemukan URL');
    
    return match[1];
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`Contoh: ${usedPrefix + command} ${global.author}`);
    
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    try {
        const nickname = text.trim();
        const images = [
            'https://www.fuku-cloud.my.id/upload/2270_1755567680240.jpeg',
            'https://www.fuku-cloud.my.id/upload/8316_1755571031099.jpeg',
            'https://www.fuku-cloud.my.id/upload/4996_1755574342175.jpeg',
            'https://www.fuku-cloud.my.id/upload/3367_1755574517037.jpeg',
            'https://www.fuku-cloud.my.id/upload/4745_1755574612938.jpeg',
            'https://www.fuku-cloud.my.id/upload/5609_1755574717210.jpeg',
            'https://www.fuku-cloud.my.id/upload/272_1755574832037.jpeg'
        ];
        
        let cards = []; 
        for (let i = 0; i < images.length; i++) {
            const bg = await loadImage(images[i]);
            const canvas = createCanvas(bg.width, bg.height);
            const ctx = canvas.getContext('2d');
            
            // Menggambar background
            ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
            
            // Menambahkan teks nickname
            ctx.font = `16px Arial`;
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            const textX = canvas.width / 2;
            const textY = canvas.height - 249;
            ctx.fillText(nickname, textX, textY);
            
            const buffer = canvas.toBuffer('image/png');
            
            const imageUrl = await uploadToZenzxz(buffer);

            const media = await prepareWAMessageMedia(
                { image: { url: imageUrl } },
                { upload: conn.waUploadToServer }
            );

            // Membuat satu kartu untuk carousel
            cards.push({
                header: proto.Message.InteractiveMessage.Header.fromObject({
                    title: `Lobby Free Fire Gambar [${i + 1}]`,
                    hasMediaAttachment: true,
                    ...media
                }),
                body: proto.Message.InteractiveMessage.Body.fromObject({
                    text: `Nickname: ${nickname}\nUpload via Zenzxz`
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                    buttons: [
                        {
                            name: "cta_copy",
                            buttonParamsJson: JSON.stringify({
                                display_text: "📋 Salin URL",
                                copy_code: imageUrl
                            })
                        }
                    ]
                })
            });
        }

        if (cards.length === 0) {
            throw new Error("❌ Gagal memproses semua gambar.");
        }

        // Membuat pesan carousel interaktif dari semua kartu
        const msg = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2
                    },
                    interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                        body: proto.Message.InteractiveMessage.Body.create({
                            text: `✅ *Lobby Free Fire Berhasil Dibuat*\n*Nickname:* ${nickname}\n\nGeser untuk melihat semua gambar.`
                        }),
                        footer: proto.Message.InteractiveMessage.Footer.create({
                            text: `© Lobby Free Fire Maker By ${global.namebot}`
                        }),
                        carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                            cards: cards
                        })
                    })
                }
            }
        }, { userJid: m.chat, quoted: m });

        // Mengirim pesan
        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.error(e);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        m.reply('Error: ' + e.message);
    } 
}

handler.command = ['lobyff'];
handler.tags = ['maker'];
handler.help = ['lobyff <teks>'];
handler.limit = true;

export default handler;