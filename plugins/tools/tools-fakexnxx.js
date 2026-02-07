/*

# Fitur : Maker XNXX
# Type : Plugins ESM
# Created by : https://whatsapp.com/channel/0029VbBYwRiF1YlVvnE3rv3G
# Api : https://tools-api.aetherzx.xyz/api/xnxxmaker?pp=<url>&title=<text>&apikey=vyzen

   ⚠️ _Note_ ⚠️
jangan hapus wm ini banggg

*/

import fetch from 'node-fetch';

const handler = async (m, { conn, args, participants, text }) => {
    if (!text.includes('|')) {
        return conn.sendMessage(m.chat, { 
            text: `Usage: .xnxx <@user/nomor_whatsapp> | <judul>\nContoh: .xnxx 6281234567890 | Judul Gambar` 
        }, { quoted: m });
    }

    let [target, title] = text.split('|').map(v => v.trim());
    let mentionedJid, number;

    if (target.startsWith('@')) {
        mentionedJid = m.mentionedJid?.[0];
        if (!mentionedJid) {
            return conn.sendMessage(m.chat, {
                text: `Tag salah satu pengguna!\n\nContoh:\n.xnxx @user | Lari ada wibu`
            }, { quoted: m });
        }
    } else {
        number = target.replace(/[^0-9]/g, '') + '@s.whatsapp.net';  // Validasi dan format nomor WA
        try {
            const userInfo = await conn.onWhatsApp(number);
            if (userInfo && userInfo.length > 0) {
                mentionedJid = userInfo[0].jid;
            } else {
                return conn.sendMessage(m.chat, {
                    text: `Nomor WhatsApp tidak terdaftar atau tidak valid.`
                }, { quoted: m });
            }
        } catch (error) {
             return conn.sendMessage(m.chat, {
                    text: `Nomor WhatsApp tidak terdaftar atau tidak valid.`
                }, { quoted: m });
        }
    }


    let ppUrl;
    try {
        ppUrl = await conn.profilePictureUrl(mentionedJid, 'image');
    } catch {
        ppUrl = 'https://i.ibb.co/1s8T3sY/48f7ce63c7aa.jpg'; 
    }

    let proses = await conn.sendMessage(m.chat, { text: "🌀 Sedang membuat gambar XNXX. . ." }, { quoted: m });

    let apiUrl = `${global.APIs.aetherz}/api/xnxxmaker?pp=${encodeURIComponent(ppUrl)}&title=${encodeURIComponent(title)}&apikey=${global.aetherz}`;

    try {
        let res = await fetch(apiUrl);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        let buffer = await res.arrayBuffer();

        await conn.sendMessage(m.chat, { 
            image: Buffer.from(buffer), 
            caption: `✅ Berhasil membuat gambar XNXX dari PP @${mentionedJid.split('@')[0]} dengan judul: *${title}*`,
            mentions: [mentionedJid]
        }, { quoted: m });

    } catch (e) {
        await conn.sendMessage(m.chat, { 
            text: `❌ Error\nLogs error : ${e.message}` 
        }, { quoted: m });
    }
};

handler.help = ['xnxx <@user/nomor_whatsapp> | <judul>'];
handler.tags = ['maker', 'premium'];
handler.command = ['xnxx'];
handler.premium = true;

export default handler;