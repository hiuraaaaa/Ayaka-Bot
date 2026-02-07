let handler = async (m, { conn }) => {
    if (!m.quoted) throw '❌ Reply ke pesan View Once!';
    
    // Pastikan pesan adalah View Once
    if (!m.quoted.viewOnce) throw '❌ Reply ke pesan View Once!';
    
    let mediaInfo = m.quoted;
    let mtype = mediaInfo.mtype; // imageMessage, videoMessage, dll.
    let caption = mediaInfo.text || 'No caption';

    await m.reply('🔄 Memproses media...'); // Beri info ke pengguna

    try {
        // Coba unduh media langsung dari pesan
        let buffer = await mediaInfo.download();
        await conn.sendMessage(m.chat, { 
            [mtype.replace(/Message/, '')]: buffer, 
            caption 
        }, { quoted: m });

        await m.reply('✅ Media berhasil dikirim ulang.');
    } catch (e) {
        console.error('Gagal mengunduh media, mencoba dari URL...', e);

        // Jika gagal, gunakan URL sebagai fallback
        if (!mediaInfo.url) throw '⛔ Media tidak dapat dikirim ulang karena URL tidak ditemukan.';

        await conn.sendMessage(m.chat, { 
            [mtype.replace(/Message/, '')]: { url: mediaInfo.url }, 
            mimetype: mediaInfo.mimetype || 'image/jpeg',
            caption,
            jpegThumbnail: mediaInfo.jpegThumbnail 
                ? Buffer.from(mediaInfo.jpegThumbnail, 'base64') 
                : undefined
        }, { quoted: m });

        await m.reply('✅ Media dikirim ulang menggunakan URL.');
    }
};

handler.help = ['readviewonce'];
handler.tags = ['tools'];
handler.command = /^(retrieve|rvo|readviewonce)$/i;

export default handler;