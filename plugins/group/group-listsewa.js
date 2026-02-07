let handler = async (m, { conn }) => {
    let txt = '';
    let i = 1;
    let mentions = [];

    for (let [jid, chat] of Object.entries(conn.chats).filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isChats)) {
        if (global.db.data.chats[jid] && global.db.data.chats[jid].expired > 0) {
            let expiredTimestamp = global.db.data.chats[jid].expired;
            let now = Date.now();
            let remainingTime = expiredTimestamp - now;

            let timeLeft = msToTime(remainingTime);
            let timeText = `${timeLeft.days} hari, ${timeLeft.hours} jam, ${timeLeft.minutes} menit`;

            let metadata = await conn.groupMetadata(jid).catch(() => null);
            if (!metadata) continue;

            let adminList = metadata.participants.filter(p => p.admin);
            let adminTags = adminList.map(p => {
                mentions.push(p.id);
                return `@${p.id.split('@')[0]}`;
            }).join(', ');

            txt += `${i++}. 🏷️ *Nama Grup:* ${metadata.subject}\n`;
            txt += `   🆔 *ID:* ${jid}\n`;
            txt += `   👥 *Total Member:* ${metadata.participants.length}\n`;
            txt += `   ⏳ *Waktu Tersisa:* ${timeText}\n`;
            txt += `   🛡️ *Admin:* ${adminTags || 'Tidak ditemukan'}\n\n`;
        }
    }

    if (txt === '') {
        txt = '⚠️ Tidak ada grup dengan sewa aktif.';
    }

    m.reply(`📋 *Daftar Grup dengan Sewa Aktif:*\n\n${txt.trim()}`, null, { mentions });
};

function msToTime(ms) {
    let days = Math.floor(ms / (24 * 60 * 60 * 1000));
    let hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    let minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
    return { days, hours, minutes };
}

handler.help = ['listsewa'];
handler.tags = ['owner'];
handler.command = /^(listsewa)$/i;
handler.owner = true;

export default handler;