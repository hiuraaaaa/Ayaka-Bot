const isToxic = /wa.me|anjing|anjg|ajg|anj|lonte|lont|kontol|kont|kntl|memek|mmk|memk|memk|yatim|yatm|ytm|puki|pukimak|puqimak|asu|asw|bajingan|tempek|ngentod|ngntd|penis|peler|pepek|tolol|goblok|gblk|anjim|entod|entd|ngewe/i;

let handler = m => m;

handler.before = async function (m, { conn, user, isBotAdmin, isAdmin }) {
    if (m.isBaileys && m.fromMe) return true; // Pesan dari bot
    if (!m.isGroup) return true; // Pesan dari luar grup

    let chatId = m.chat;
    let groupData = global.db.data.chats[chatId];
    let name = conn.getName(m.sender);
    const isAntiToxic = isToxic.exec(m.text); // Mengecek kata kasar di seluruh pesan

    // Periksa apakah pengirim adalah admin
    if (isAdmin) return true; // Jika pengirim adalah admin, tidak melakukan apa-apa

    if (groupData.antiToxic && isAntiToxic) {
        // Kirim pesan peringatan
        m.reply(`*Terdeteksi* ${name} telah mengirim kata-kata tidak sopan: "${isAntiToxic[0]}"!`);

        // Periksa apakah bot admin
        if (!isBotAdmin) {
            return await m.reply('*_Bot tidak menjadi admin, Bagaimana saya bisa menghapus pesanmu_*');
        }

        // Hapus pesan
        await conn.sendMessage(m.chat, { delete: m.key });
        return true;
    }

    return false;
}

export default handler;