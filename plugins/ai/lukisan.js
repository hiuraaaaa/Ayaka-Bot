let handler = async (m, { text, conn, command }) => {
    if (!text) return m.reply(`Contoh:\n.${command} kota cyberpunk malam hari`);

    m.reply('🎨 Sedang membuat lukisan AI dari prompt kamu...');

    try {
        const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(text)}`;
        await conn.sendMessage(m.chat, {
            image: { url },
            caption: `🎨 Lukisan AI:\n"${text}"`
        }, { quoted: m });
    } catch (err) {
        console.error('[ERROR]', err);
        m.reply('Terjadi kesalahan saat mengambil gambar dari Pollinations.');
    }
};

handler.command = ['lukisan'];
handler.help = ['lukisan <prompt>'];
handler.tags = ['ai', 'tools'];

export default handler;