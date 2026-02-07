let handler = async (m, { conn, text, command, usedPrefix }) => {
    if (!text)
        return m.reply(`*🔧 Cara Penggunaan:* ${usedPrefix + command} nama_bot\n*📝 Contoh Penggunaan:*\n${usedPrefix + command} ${global.namebot}`);
    try {
        await conn.updateProfileName(text);
        m.reply(`✔️ *Berhasil mengubah nama ${global.namebot} menjadi ${text}*`);
    } catch (e) {
        console.error(e);
        m.reply(
            `⚠️*Gagal mengubah nama ${global.namebot}. Pastikan koneksi stabil dan nama tidak terlalu panjang.*`
        );
    }
};

handler.help = ["setnamebot"];
handler.tags = ["owner"];
handler.command = /^set(name(bot)?)$/i;
handler.owner = true;

export default handler;
