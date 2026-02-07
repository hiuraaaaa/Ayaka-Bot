let handler = async (m) => m;

let linkRegex = /https?:\/\/\S+/i;

handler.before = async function (m, { user, isBotAdmin, isAdmin, conn }) {
    if ((m.isBaileys && m.fromMe) || m.fromMe || !m.isGroup) return true; // Biarkan pesan ini dilewati

    let chat = global.db.data.chats[m.chat];
    let isLink = linkRegex.test(m.text); // Cek apakah pesan mengandung URL

    if (chat.antiLinkAll && isLink) {
        // Pesan mengandung URL dan antiLink diaktifkan
        await m.reply(`*「 ANTI LINK 」*\n\nDeteksi URL dalam pesan kamu, ${await conn.getName(m.sender)}!\n\nMaaf, pesanmu akan dihapus.`);

        if (isAdmin) {
            return m.reply('*Maaf, kamu admin. hehe..*');
        }

        if (!isBotAdmin) {
            return m.reply('*Bot tidak memiliki izin untuk menghapus pesan.*');
        }

        // Hapus pesan jika bot adalah admin di grup
        await conn.sendMessage(m.chat, { delete: m.key });
        return true; // Penghentian eksekusi lebih lanjut
    }

    return false; // Biarkan pesan ini dilewati
};

export default handler;