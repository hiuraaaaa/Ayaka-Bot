import { promises as fs } from 'fs';

const antiNewsletterPath = './src/antinewsletter.json';

async function readAntiNewsletterData() {
    try {
        const data = await fs.readFile(antiNewsletterPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        await fs.writeFile(antiNewsletterPath, '{}', 'utf8');
        return {};
    }
}

async function writeAntiNewsletterData(data) {
    await fs.writeFile(antiNewsletterPath, JSON.stringify(data, null, 2), 'utf8');
}

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let groupId = m.chat;

    if (!m.isGroup) throw 'Perintah ini hanya bisa digunakan di grup! 🚫';

    const groupMetadata = await conn.groupMetadata(groupId);
    const isAdmin = groupMetadata.participants.find(p => p.id === m.sender)?.admin;
    if (!isAdmin) throw 'Kamu harus jadi admin grup untuk menggunakan perintah ini! 🔒';

    const botId = conn.user.id.split(':')[0] + '@s.whatsapp.net';
    const isBotAdmin = groupMetadata.participants.find(p => p.id === botId)?.admin;
    if (!isBotAdmin) throw 'Bot harus jadi admin grup untuk menjalankan fitur ini! 🤖';

    let antiNewsletterData = await readAntiNewsletterData();

    if (args[0] === 'cek') {
        const isActive = antiNewsletterData[groupId]?.active || false;
        m.reply(`Fitur AntiNewsletter ${isActive ? 'aktif 🚀' : 'tidak aktif 🚫'} untuk grup ini.\nGunakan "${usedPrefix + command} on" untuk mengaktifkan atau "${usedPrefix + command} off" untuk menonaktifkan.`);
        return;
    }

    if (args[0] === 'on') {
        antiNewsletterData[groupId] = { active: true };
        await writeAntiNewsletterData(antiNewsletterData);
        m.reply('Fitur AntiNewsletter berhasil diaktifkan! 🎉 Pesan dari newsletter (termasuk gambar) akan otomatis dihapus.');
        return;
    }

    if (args[0] === 'off') {
        if (!antiNewsletterData[groupId]?.active) throw 'Fitur AntiNewsletter belum diaktifkan di grup ini! 🚫';
        delete antiNewsletterData[groupId];
        await writeAntiNewsletterData(antiNewsletterData);
        m.reply('Fitur AntiNewsletter berhasil dinonaktifkan! 🛑');
        return;
    }

    throw `Penggunaan:\n${usedPrefix + command} on - Aktifkan fitur\n${usedPrefix + command} off - Nonaktifkan fitur\n${usedPrefix + command} cek - Cek status fitur 📝`;
};

handler.before = async (m, { conn }) => {
    if (!m.isGroup) return;
    if (m.fromMe) return;

    const hasNewsletter =
        m.message?.extendedTextMessage?.contextInfo?.forwardedNewsletterMessageInfo ||
        m.message?.imageMessage?.contextInfo?.forwardedNewsletterMessageInfo;
    if (!hasNewsletter) return;

    const groupId = m.chat;
    const antiNewsletterData = await readAntiNewsletterData();

    if (!antiNewsletterData[groupId]?.active) return;

    const groupMetadata = await conn.groupMetadata(groupId);
    const botId = conn.user.id.split(':')[0] + '@s.whatsapp.net';
    const isBotAdmin = groupMetadata.participants.find(p => p.id === botId)?.admin;
    if (!isBotAdmin) return;

    try {
        await conn.sendMessage(groupId, {
            delete: {
                remoteJid: m.key.remoteJid,
                fromMe: false,
                id: m.key.id,
                participant: m.key.participant || m.sender
            }
        });
        await conn.sendMessage(groupId, { text: `Pesan dari newsletter ${m.message.imageMessage ? '(gambar)' : ''} telah dihapus otomatis! 🚫` });
    } catch (error) {
        console.error(`Error menghapus pesan newsletter di grup ${groupId}:`, error);
        await conn.sendMessage(groupId, { text: 'Gagal menghapus pesan newsletter. Pastikan bot punya izin admin! 😓' });
    }
};

handler.help = ['antinewsletter on', 'antinewsletter off', 'antinewsletter cek'];
handler.tags = ['group'];
handler.command = /^antinewsletter$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;