import moment from 'moment-timezone';
import { promises as fs } from 'fs';
import cron from 'node-cron';

const groupTimePath = './src/grouptime.json';

let handler = async (m, { conn, args, usedPrefix, command, groupMetadata }) => {
    let groupId = m.chat;

    async function readGroupTimeData() {
        try {
            const data = await fs.readFile(groupTimePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            await fs.writeFile(groupTimePath, '{}', 'utf8');
            return {};
        }
    }

    async function writeGroupTimeData(data) {
        await fs.writeFile(groupTimePath, JSON.stringify(data, null, 2), 'utf8');
    }

    let groupTimeData = await readGroupTimeData();

    if (args[0] === 'hapus') {
        if (!groupTimeData[groupId]) throw 'Tidak ada pengaturan Auto Group untuk grup ini.';
        delete groupTimeData[groupId];
        await writeGroupTimeData(groupTimeData);
        m.reply('Pengaturan Auto Group berhasil dihapus untuk grup ini 🚫.');
        return;
    }

    if (args[0] === 'cek') {
        if (!groupTimeData[groupId]) {
            m.reply(`Pengaturan Auto Group tidak aktif untuk grup ini 🚫. Silakan atur dengan perintah ${usedPrefix + command} <jam_tutup>|<jam_buka>`);
        } else {
            const { closeAt, openAt } = groupTimeData[groupId];
            m.reply(`Pengaturan Auto Group aktif untuk grup ini! 🚀\n- ⏰ Waktu Tutup: ${closeAt}\n- 🕖 Waktu Buka: ${openAt}`);
        }
        return;
    }

    if (!args[0]) throw `Penggunaan:\n${usedPrefix + command} 22:00|06:00\n\nFormat: JAM_TUTUP|JAM_BUKA (Format 24 jam)\nContoh: ${usedPrefix + command} 22:00|06:00\n\nUntuk menghapus: ${usedPrefix + command} hapus\n\nUntuk cek status: ${usedPrefix + command} cek 📝`;

    let [closeAt, openAt] = args[0].split('|');
    if (!closeAt || !openAt) throw `Format salah! 🚫\nPenggunaan: ${usedPrefix + command} JAM_TUTUP|JAM_BUKA`;

    if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(closeAt) || !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(openAt)) {
        throw `Format jam salah! 🕰️ Gunakan format 24 jam (HH:mm).\nContoh: 22:00|06:00`;
    }

    groupTimeData[groupId] = {
        closeAt,
        openAt,
        lastAction: null
    };
    await writeGroupTimeData(groupTimeData);

    m.reply(`Pengaturan otomatis grup berhasil! 🎉\n- ⏰ Tutup: ${closeAt}\n- 🕖 Buka: ${openAt}`);
};

handler.help = ['autogroup <jam_tutup|jam_buka>', 'autogroup hapus', 'autogroup cek'];
handler.tags = ['group', 'owner'];
handler.command = /^autogroup$/i;
handler.owner = true;
handler.group = true;

export default handler;

cron.schedule('* * * * *', async () => {
    const groupTimeData = await (async () => {
        try {
            const data = await fs.readFile(groupTimePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            return {};
        }
    })();

    for (const groupId in groupTimeData) {
        if (groupTimeData.hasOwnProperty(groupId)) {
            const { closeAt, openAt, lastAction } = groupTimeData[groupId];
            const now = moment().tz('Asia/Jakarta');
            const currentTime = now.format('HH:mm');

            try {
                if (currentTime === closeAt && lastAction !== 'close') {
                    await conn.groupSettingUpdate(groupId, 'announcement');
                    await conn.sendMessage(groupId, { text: 'Grup telah ditutup sementara 🚫. Sampai jumpa di jam berikutnya! 👋' });
                    groupTimeData[groupId].lastAction = 'close';
                    await fs.writeFile(groupTimePath, JSON.stringify(groupTimeData, null, 2), 'utf8');
                } else if (currentTime === openAt && lastAction !== 'open') {
                    await conn.groupSettingUpdate(groupId, 'not_announcement');
                    await conn.sendMessage(groupId, { text: 'Grup telah dibuka kembali! 🚀 Selamat berdiskusi dan berinteraksi 😄' });
                    groupTimeData[groupId].lastAction = 'open';
                    await fs.writeFile(groupTimePath, JSON.stringify(groupTimeData, null, 2), 'utf8');
                }
            } catch (error) {
                console.error(`Error saat mengubah setelan grup ${groupId}:`, error);
            }
        }
    }
})