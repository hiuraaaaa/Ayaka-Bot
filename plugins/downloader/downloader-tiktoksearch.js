import fetch from 'node-fetch';

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) {
        return m.reply(`Masukan Judul untuk pencarian!\n\nContoh:\n${usedPrefix + command} Dance Loli Bmw`);
    }

    let keywords = encodeURIComponent(args.join(' '));
    let apiUrl = `https://api.siputzx.my.id/api/s/tiktok?query=${keywords}`;
    await conn.sendMessage(m.chat, { react: { text: '🎀', key: m.key } });

    try {
        let response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Network response was not ok');
        let data = await response.json();

        if (!data.status || data.data.length === 0) {
            return m.reply('Tidak ada hasil yang ditemukan. ❌');
        }

        let randomIndex = Math.floor(Math.random() * data.data.length);
        let result = data.data[randomIndex];
        let { duration, play, music, music_info, play_count, digg_count, comment_count, share_count, author } = result;
        let caption = `👤 Nickname: ${author.nickname}
🆔 Unique ID: ${author.unique_id}
⏱ Durasi: ${duration} detik
🎬 Plays: ${play_count}
👍 Suka: ${digg_count}
💬 Komentar: ${comment_count}
📤 Bagikan: ${share_count}
🎵 Musik: ${music_info.title} oleh ${music_info.author}`.trim();

        await conn.sendFile(m.chat, play, 'video.mp4', caption, m);
        await conn.sendFile(m.chat, music, 'audio.mp3', '', m, { asDocument: false, ptt: true });
        await conn.sendMessage(m.chat, { react: { text: null, key: m.key } });
    } catch (error) {
        console.error(error);
        await conn.sendMessage(m.chat, { react: { text: null, key: m.key } });
        m.reply('Terjadi kesalahan saat mengambil data. ❌');
    }
}

handler.help = ['tiktoksearch'];
handler.tags = ['downloader'];
handler.command = /^(tiktoksearch|ttsearch|tiktokcari)$/i;
handler.limit = true;
handler.register = true;

export default handler;