import uploadImage from '../lib/uploadImage.js';
import uploadFile from '../lib/uploadFile.js';

let handler = async (m, { conn, args, text }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    let isMedia = /image|video|audio|sticker/.test(mime);

    if (!args[0]) throw 'Masukkan ID channel atau URL yang valid!\n\nContoh:\n.upch 120363199602506586@newsletter\n.upch https://whatsapp.com/channel/0029VakezCJDp2Q68C61RH2C';
    let recipient = args[0].trim();

    let channelId;
    if (recipient.startsWith('https://whatsapp.com/channel/')) {
        try {
            const inviteCode = recipient.split('/').pop();
            if (!inviteCode || inviteCode.length < 20) throw 'Kode invite di URL gak valid!';
            const metadata = await conn.newsletterMetadata('invite', inviteCode, 'GUEST');
            channelId = metadata.id;
            if (!channelId || !channelId.includes('@newsletter')) throw 'Gagal dapetin ID channel dari URL!';
        } catch (err) {
            console.error(err);
            return m.reply(`Gagal proses URL: ${err.message || err}. Pastikan URL bener ya, Senpai!`);
        }
    } else {
        channelId = recipient;
        if (!channelId.includes('@')) throw 'Format ID channel gak valid!';
    }

    let caption = text.replace(recipient, '').trim() || (q.text ? q.text.trim() : '');
    let messageOptions = caption ? { text: caption } : {};

    if (isMedia) {
        m.reply('Sedang memproses media, sabar ya, Senpai...');
        try {
            let media = await q.download();
            if (!media) throw 'Media gak bisa diunduh, coba lagi ya, Senpai!';

            let url;
            if (/image/.test(mime) && mime !== 'image/webp') {
                url = await uploadImage(media);
                messageOptions = {
                    image: { url },
                    caption: caption || '',
                    contextInfo: {
                        mentionedJid: [m.sender],
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: channelId,
                            newsletterName: "Lann4you",
                            serverMessageId: 143
                        }
                    }
                };
            } else if (/video/.test(mime)) {
                url = await uploadFile(media);
                messageOptions = {
                    video: { url },
                    caption: caption || '',
                    mimetype: 'video/mp4',
                    contextInfo: {
                        mentionedJid: [m.sender],
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: channelId,
                            newsletterName: "Lann4you",
                            serverMessageId: 143
                        }
                    }
                };
            } else if (/audio/.test(mime)) {
                url = await uploadFile(media);
                messageOptions = {
                    audio: { url },
                    mimetype: 'audio/mpeg',
                    ptt: true,
                    contextInfo: {
                        mentionedJid: [m.sender],
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: channelId,
                            newsletterName: "Lann4you",
                            serverMessageId: 143
                        }
                    }
                };
            } else if (mime === 'image/webp') {
                url = await uploadImage(media);
                messageOptions = {
                    sticker: { url },
                    contextInfo: {
                        mentionedJid: [m.sender],
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: channelId,
                            newsletterName: "Lann4you",
                            serverMessageId: 143
                        }
                    }
                };
            } else {
                throw 'Tipe media gak didukung nih, Senpai!';
            }

            if (!url) throw 'Gagal dapetin URL media, coba lagi ya!';
        } catch (err) {
            console.error(err);
            return m.reply(`Gagal upload media: ${err.message || err}. Jangan panik, Senpai, kita coba lagi nanti!`);
        }
    }

    if (!isMedia && q.text) {
        messageOptions = {
            text: q.text,
            contextInfo: {
                externalAdReply: {
                    title: "Lann4you",
                    body: "",
                    thumbnailUrl: "https://files.catbox.moe/seefvk.jpg",
                    sourceUrl: q.text,
                    mediaType: 1,
                    renderLargerThumbnail: false
                }
            }
        };
    }

    try {
        await conn.sendMessage(channelId, messageOptions);
        m.reply('Pesan berhasil dikirim ke channel! Keren banget, Senpai!');
    } catch (err) {
        console.error(err);
        return m.reply(`Gagal kirim pesan: ${err.message || err}. Sabar ya, Senpai, codingan error itu biasa, kita fix bareng!`);
    }
};

handler.help = ['upch'];
handler.tags = ['owner'];
handler.command = /^(upch)$/i;
handler.owner = true;

export default handler;