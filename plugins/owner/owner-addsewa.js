import { generateWAMessageFromContent } from '@adiwajshing/baileys'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) throw `Masukin input yang bener dong, Senpai!\nContoh: *${usedPrefix + command} 30* atau *${usedPrefix + command} https://chat.whatsapp.com/xyz 30* atau *${usedPrefix + command} 123XXXXXX@g.us 30*`;

    let who;
    let jumlahHari;

    if (args[0].includes('chat.whatsapp.com') && args[1]) {
        let inviteCode = args[0].match(/chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i)?.[1];
        if (!inviteCode) throw `Link undangan ga valid, Senpai!`;
        try {
            who = await conn.groupAcceptInvite(inviteCode);
            await new Promise(r => setTimeout(r, 1000));
            jumlahHari = 86400000 * parseInt(args[1]);
            if (isNaN(args[1])) throw `Jumlah hari harus angka, Senpai!`;

            conn.reply(m.chat, `Ayaka berhasil join ke grup *${who}*, Senpai! Sekarang lanjut set sewa.`, m);
        } catch (e) {
            throw `Gagal join grup: ${e.message}`;
        }
    } else if (args[0].endsWith('@g.us') && args[1]) {
        who = args[0];
        jumlahHari = 86400000 * parseInt(args[1]);
        if (isNaN(args[1])) throw `Jumlah hari harus angka, Senpai!`;
    } else {
        if (!m.isGroup) throw `Fitur ini cuma bisa dipake di grup, Senpai!`;
        who = m.chat;
        jumlahHari = 86400000 * parseInt(args[0]);
        if (isNaN(args[0])) throw `Jumlah hari harus angka, Senpai!`;
    }

    if (!global.db.data.chats[who]) global.db.data.chats[who] = { expired: 0 };
    const now = Date.now();
    const expired = global.db.data.chats[who].expired;
    if (expired > now) global.db.data.chats[who].expired += jumlahHari;
    else global.db.data.chats[who].expired = now + jumlahHari;

    const waktuTersisa = msToDate(global.db.data.chats[who].expired - now);
    conn.reply(m.chat, `✅ Sewa berhasil ditambah ${jumlahHari / 86400000} hari untuk grup *${who}*\n⏳ Sisa waktu: *${waktuTersisa}*`, m);

    // kirim notifikasi ke grup
    try {
        let groupMeta = await conn.groupMetadata(who);
        const namaGrup = groupMeta.subject || 'Unknown Group';
        const durasi = `${jumlahHari / 86400000}D`;
        const sisaWaktu = waktuTersisa;
        const pesanSewa = `*「SEWA BOT BERHASIL」*\n\n` +
                          `*Informasi Grup:*\n` +
                          `Nama: ${namaGrup}\n` +
                          `ID: ${who}\n` +
                          `Durasi: ${durasi}\n` +
                          `Sisa Waktu: ${sisaWaktu}\n\n` +
                          `*Fasilitas Sewa:*\n` +
                          `🌟 Akses premium ke 1300+ fitur\n` +
                          `🛡️ Anti-banned proteksi\n` +
                          `⚡ Fast respon bot 24/7\n` +
                          `🚀 Sistem prioritas server\n\n` +
                          `Terima kasih telah menggunakan layanan kami.`;

        let msg = generateWAMessageFromContent(who, {
            interactiveMessage: {
                body: { text: pesanSewa },
                footer: { text: 'Bot ini aktif karena sewa grup.' },
                nativeFlowMessage: {
                    buttons: [
                        {
                            name: 'quick_reply',
                            buttonParamsJson: JSON.stringify({
                                display_text: '👋 Halo, selamat datang bot.',
                                id: '.'
                            })
                        },
                        {
                            name: 'quick_reply',
                            buttonParamsJson: JSON.stringify({
                                display_text: '👋 Haiii Bot.',
                                id: '.'
                            })
                        }
                    ]
                }
            }
        }, {});
        await conn.relayMessage(who, msg.message, { messageId: msg.key.id });
    } catch (e) {
        console.log('Gagal kirim pesan sewa:', e.message);
    }
}

handler.help = ['addsewa [idgroup|link] <hari>'];
handler.tags = ['owner'];
handler.command = /^(addsewa)$/i;
handler.rowner = true;

export default handler;

// Fitur auto keluar jika tidak disewa (pas bot masuk grup)
export async function groupsUpdate(update) {
    for (const group of update) {
        if (!group.id) continue;

        const now = Date.now();
        const chat = global.db.data.chats[group.id] || {};
        if (!chat.expired || now > chat.expired) {
            try {
                await conn.groupLeave(group.id);
                console.log(`Keluar dari grup ${group.id} karena tidak disewa.`);
            } catch (e) {
                console.error(`Gagal keluar dari ${group.id}:`, e.message);
            }
        }
    }
}

function msToDate(ms) {
    let days = Math.floor(ms / (24 * 60 * 60 * 1000));
    let daysms = ms % (24 * 60 * 60 * 1000);
    let hours = Math.floor(daysms / (60 * 60 * 1000));
    let hoursms = ms % (60 * 60 * 1000);
    let minutes = Math.floor(hoursms / (60 * 1000));
    return `${days} Hari, ${hours} Jam, ${minutes} Menit`;
}