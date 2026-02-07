let handler = async (m, { conn, command, usedPrefix }) => {
    const user = global.db.data.users[m.sender];
    const tag = '@' + m.sender.split('@')[0];
    const fkontak = {
        key: {
            participant: '0@s.whatsapp.net',
            remoteJid: "0@s.whatsapp.net",
            fromMe: false,
            id: "Halo",
        },
        message: {
            conversation: `Akun YT ${global.namebot || 'Bot'} 🪾`
        }
    };

    // Helper untuk format angka
    const formatNumber = (number) => {
        if (number >= 1000000) {
            return (number / 1000000).toFixed(1) + 'Jt';
        } else if (number >= 1000) {
            return (number / 1000).toFixed(1) + 'K';
        } else {
            return number;
        }
    };

    if (!user.youtube_account) {
        return conn.sendMessage(m.chat, {
            text: `Kamu belum punya akun YouTube.\nBuat dulu dengan: *${usedPrefix}ytcreate*`,
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: fkontak });
    }

    // Pastikan struktur data tidak error (tanpa ??=)
    if (!user.youtubeTools) {
        user.youtubeTools = {
            camera: 0,
            microphone: 0,
            editingSoftware: 0,
            internetSpeed: 0
        };
    }

    if (!user.streaming) {
        user.streaming = {
            active: false,
            title: '',
            currentViewers: 0,
            currentLikes: 0,
            startTime: 0
        };
    }

    const formattedSubscribers = formatNumber(user.subscribers || 0);
    const formattedTotalViewers = formatNumber(user.viewers || 0);
    const formattedTotalLike = formatNumber(user.like || 0);
    const formattedYTMoney = formatNumber(user.youtubeMoney || 0);

    const silverButton = user.playButton >= 1 ? '✅' : '❎';
    const goldButton = user.playButton >= 2 ? '✅' : '❎';
    const diamondButton = user.playButton >= 3 ? '✅' : '❎';

    let streamingStatus = (user.streaming && user.streaming.active) ?
        `🔴 *Sedang Live:* ${user.streaming.title}\n  Penonton: ${formatNumber(user.streaming.currentViewers)}\n  Suka: ${formatNumber(user.streaming.currentLikes)}\n  Durasi: ${Math.floor((Date.now() - user.streaming.startTime) / (1000 * 60))} menit` :
        '🟢 *Tidak Sedang Live*';

    let toolsInfo = `
*🎥 Alat YouTube:*
  📷 Kamera: Level ${user.youtubeTools.camera}
  🎙️ Mikrofon: Level ${user.youtubeTools.microphone}
  💻 Software Editing: Level ${user.youtubeTools.editingSoftware}
  🌐 Kecepatan Internet: Level ${user.youtubeTools.internetSpeed}
`;

    let accountInfo = `
*Akun YouTube ${tag}*

🧑🏻‍💻 *Channel:* ${user.youtube_account}
👥 *Subscribers:* ${formattedSubscribers}
🪬 *Total Viewers:* ${formattedTotalViewers}
👍🏻 *Total Like:* ${formattedTotalLike}
💰 *YT Money:* ${formattedYTMoney}

*📦 Play Button:*
⬜ Silver PlayButton: ${silverButton}
🟧 Gold PlayButton: ${goldButton}
💎 Diamond PlayButton: ${diamondButton}

${streamingStatus}
${toolsInfo}
`;

    return conn.sendMessage(m.chat, {
        text: accountInfo.trim(),
        contextInfo: { mentionedJid: [m.sender] }
    }, { quoted: fkontak });
};

handler.help = ['ytakun'];
handler.tags = ['game'];
handler.command = /^(ytakun|youtuberakun|youtuber akun|yt akun|ytprofile|ytprofil)$/i;
handler.register = true;

export default handler;