import fetch from 'node-fetch';
import FormData from 'form-data';
import crypto from 'crypto';
import {
    fileTypeFromBuffer
} from 'file-type';
import fs from 'fs';

const fkontak = {
    key: {
        participant: '0@s.whatsapp.net',
        remoteJid: '0@s.whatsapp.net',
        fromMe: false,
        id: 'Halo'
    },
    message: {
        conversation: `Screenshot iPhone Group 📱`
    }
};

let handler = async (m, {
    conn,
    text,
    isOwner,
    isAdmin
}) => {

    let user = global.db.data.users[m.sender];
    let isPremium = user.premiumTime > new Date() * 1 || user.premium;

    if (!isAdmin && !isOwner && !isPremium) {
        return conn.sendMessage(m.chat, {
            text: `👋🏻 ʜᴀɪ @${m.sender.split('@')[0]} ғɪᴛᴜʀ *𝗦𝗦𝗚𝗖𝗜𝗣* ʜᴀɴʏᴀ ᴜɴᴛᴜᴋ ᴏᴡɴᴇʀ, ᴜsᴇʀ ᴘʀᴇᴍɪᴜᴍ, ᴅᴀɴ ᴀᴅᴍɪɴ ɢʀᴏᴜᴘ❗`,
            contextInfo: {
                mentionedJid: [m.sender],
                externalAdReply: {
                    title: '🚫 ᴀ ᴋ s ᴇ s  ᴅ ɪ ᴛ ᴏ ʟ ᴀ ᴋ',
                    body: `${global.namebot} || Lann4you` || '6288705574039',
                    thumbnail: fs.existsSync('./thumbnail.jpg') ? fs.readFileSync('./thumbnail.jpg') : null,
                    mediaType: 1,
                    renderLargerThumbnail: false
                }
            }
        }, {
            quoted: m
        });
    }

    let groupName, memberCount, ppGroup;
    const linkRegex = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i;
    const linkMatch = (text || '').match(linkRegex);

    try {
        if (linkMatch) {

            if (!isOwner && !isPremium) {
                return conn.sendMessage(m.chat, {
                    text: `👋🏻 ʜᴀɪ @${m.sender.split('@')[0]}, ʜᴀɴʏᴀ *ᴏᴡɴᴇʀ*, ᴅᴀɴ *ᴜsᴇʀ ᴘʀᴇᴍɪᴜᴍ* ʏᴀɴɢ ʙɪsᴀ ᴍᴇɴɢᴀᴍʙɪʟ *sᴄʀᴇᴇɴsʜᴏᴛ* ᴅᴀʀɪ ɢʀᴏᴜᴘ ʟᴀɪɴ ᴅᴇɴɢᴀɴ ᴍᴇɴɢɢᴜɴᴀᴋᴀɴ ʟɪɴᴋ❗`,
                    contextInfo: {
                        mentionedJid: [m.sender],
                        externalAdReply: {
                            title: '🚫 ᴀ ᴋ s ᴇ s  ᴅ ɪ ᴛ ᴏ ʟ ᴀ ᴋ',
                            body: `${global.namebot} || Lann4you` || '6288705574039',
                            thumbnail: fs.existsSync('./thumbnail.jpg') ? fs.readFileSync('./thumbnail.jpg') : null,
                            mediaType: 1,
                            renderLargerThumbnail: false
                        }
                    }
                }, {
                    quoted: m
                });
            }
            const inviteCode = linkMatch[1];
            await conn.sendMessage(m.chat, {
                text: '🗃️ Mengambil data dari link grup...'
            }, {
                quoted: fkontak
            });
            const groupInfo = await conn.groupGetInviteInfo(inviteCode).catch(() => null);
            if (!groupInfo) {
                return conn.reply(m.chat, '❌ Link tidak valid atau kadaluarsa.', m, {
                    quoted: fkontak
                });
            }
            groupName = groupInfo.subject || "Unknown Group";
            memberCount = groupInfo.size || 0;
            ppGroup = await conn.profilePictureUrl(groupInfo.id, "image").catch(() => null);

        } else {
            const metadata = await conn.groupMetadata(m.chat);
            groupName = metadata.subject || "Unknown Group";
            memberCount = metadata.participants.length || 0;
            ppGroup = await conn.profilePictureUrl(m.chat, "image").catch(() => null);
        }

        const imageUrl =
            ppGroup ||
            "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/479px-WhatsApp.svg.png";

        await conn.sendMessage(m.chat, {
            text: '⏳ Membuat Screenshot iPhone Group...'
        }, {
            quoted: fkontak
        });

        const response = await fetch("https://api.alvianuxio.eu.org/api/ssgcip", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: groupName,
                member: memberCount,
                imageUrl: imageUrl,
            }),
        });

        const result = await response.json().catch(() => null);
        if (!result || !result.data || !result.data.url)
            throw new Error("Gagal membuat gambar group info dari API.");

        const imgBuffer = await fetch(result.data.url).then((res) => res.buffer());

        const {
            ext,
            mime
        } = await fileTypeFromBuffer(imgBuffer) || {
            ext: 'png',
            mime: 'image/png'
        };
        const form = new FormData();
        const filename = `ssgcip_hd_${Date.now()}.${ext}`;
        form.append('image', imgBuffer, {
            filename,
            contentType: mime
        });
        form.append('scale', '2');

        const headers = {
            ...form.getHeaders(),
            'accept': 'application/json',
            'x-client-version': 'web',
            'x-locale': 'en'
        };

        const res = await fetch('https://api2.pixelcut.app/image/upscale/v1', {
            method: 'POST',
            headers,
            body: form
        });

        const json = await res.json();

        if (!json?.result_url || !json.result_url.startsWith('http')) {
            throw new Error('Gagal mendapatkan URL hasil HD dari API Upscale.');
        }

        const hdBuffer = await (await fetch(json.result_url)).buffer();

        await conn.sendMessage(m.chat, {
            image: hdBuffer,
            caption: "📱 *Group Profile*",
        }, {
            quoted: fkontak
        });

    } catch (err) {
        console.error(err);
        await conn.reply(m.chat, `❌ Terjadi kesalahan saat membuat screenshot group info.\n\n${err.message}`, m, {
            quoted: fkontak
        });
    }
};

handler.command = ["ssgcip", "ssgc"];
handler.tags = ["group"];
handler.help = ["ssgcip [link_grup]"];
handler.group = true;
handler.premium = false;

export default handler;