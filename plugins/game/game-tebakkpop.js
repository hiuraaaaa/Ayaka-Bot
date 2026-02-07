import fetch from 'node-fetch';

const handler = async (m, { conn, usedPrefix, args }) => {
    conn.kpopGuessRooms = conn.kpopGuessRooms || {};

    if (!args[0] || args[0] === "help") {
        const message = `*❏ TEBAK GAMBAR KPOP 🎤*

• ${usedPrefix}*tebakkpop create*
(buat room dengan gambar acak)

• ${usedPrefix}*tebakkpop join*
(player join ke room)

• ${usedPrefix}*tebakkpop gambar*
(tampilkan gambar yang akan ditebak)

• ${usedPrefix}*tebakkpop tebak* <jawaban>
(player menebak siapa pada gambar)

• ${usedPrefix}*tebakkpop player*
(daftar pemain yang bergabung dan jawaban mereka)

• ${usedPrefix}*tebakkpop mulai*
(mulai permainan dan ungkap jawaban sebenarnya)

• ${usedPrefix}*tebakkpop delete* 
(hapus sesi room game)


Tebak siapa yang ada di gambar!
Minimal player yang bergabung untuk memulai game adalah 2 pemain.`;

        await conn.sendMessage(m.chat, {
            text: message,
            contextInfo: {
                externalAdReply: {
                    title: "TEBAK GAMBAR KPOP 🎤",
                    body: `© ${global.namebot} 2025`,
                    thumbnailUrl: `https://files.catbox.moe/ximekf.jpg`,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        });
        return;
    }

    try {
        switch (args[0].toLowerCase()) {
            case 'create':
                if (conn.kpopGuessRooms[m.chat]) {
                    return m.reply('Room sudah ada.\nKetik *.tebakkpop delete* untuk menghapus room yang ada.');
                }

                const response = await fetch('https://raw.githubusercontent.com/VynaaValerie/mlbb/main/Kpop-image/image-kpop.json');
                const images = await response.json();
                const randomImage = images[Math.floor(Math.random() * images.length)];
                conn.kpopGuessRooms[m.chat] = {
                    creator: m.sender,
                    players: [],
                    gameStarted: false,
                    image: randomImage
                };

                m.reply(`✅ Room berhasil dibuat\nKetik *${usedPrefix}tebakkpop gambar* untuk melihat gambar yang akan ditebak.`);

                break;

            case 'join':
                if (!conn.kpopGuessRooms[m.chat]) {
                    return m.reply('❗Belum ada room yang dibuat\nKetik *.tebakkpop create* untuk membuat room.');
                }
                if (conn.kpopGuessRooms[m.chat].players.find(p => p.id === m.sender)) {
                    return m.reply('❗Anda sudah bergabung di room.');
                }
                const playerName = m.pushName || conn.getName(m.sender);
                conn.kpopGuessRooms[m.chat].players.push({ id: m.sender, name: playerName, guess: null });

                // Membuat tombol "Ikut Join ➡️"
                const buttons = [
                    {buttonId: `${usedPrefix}tebakkpop join`, buttonText: {displayText: 'Ikut Join ➡️'}, type: 1}
                  ]
                  
                const buttonMessage = {
                    text: "✅ Anda berhasil bergabung di room.",
                    footer: 'Klik tombol dibawah untuk bergabung juga❗',
                    buttons: buttons,
                    headerType: 4
                }

                conn.sendMessage(m.chat, buttonMessage, { quoted: m })
                break;

            case 'gambar':
                if (!conn.kpopGuessRooms[m.chat]) {
                    return m.reply('⚠️ Belum ada room yang dibuat\nKetik *.tebakkpop create* untuk membuat room.');
                }
                const image = conn.kpopGuessRooms[m.chat].image;
                await conn.sendFile(m.chat, image.image, 'kpop.jpg', `┌─⊷ *TEBAK KPOP*\n🎤 Ini adalah gambar dari Kpop: \n💬 *${usedPrefix}tebakkpop tebak <jawaban>*\nUntuk Menebak Siapa Mereka.`, m);
                break;

            case 'tebak':
                if (!conn.kpopGuessRooms[m.chat]) {
                    return m.reply('❗Belum ada room yang dibuat.\nKetik *.tebakkpop create* untuk membuat room.');
                }
                if (!args[1]) {
                    return m.reply('⚠️ Harap masukkan jawaban Anda.');
                }
                const player = conn.kpopGuessRooms[m.chat].players.find(p => p.id === m.sender);
                if (!player) {
                    return m.reply('Anda belum bergabung di room\nKetik *.tebakkpop join* untuk bergabung.');
                }
                player.guess = args.slice(1).join(" ").toLowerCase();
                m.reply(`✍️🏻 Jawaban Anda "${player.guess}" telah diterima.`);
                break;

            case 'player':
                if (!conn.kpopGuessRooms[m.chat]) {
                    return m.reply('❗Belum ada room yang dibuat\nKetik *.tebakkpop create* untuk membuat room.');
                }
                const players = conn.kpopGuessRooms[m.chat].players;
                m.reply(`Pemain yang bergabung:\n\n❁ ${players.map(p => `${p.name}: ${p.guess ? p.guess : 'belum menjawab'}`).join('\n')}`);
                break;

            case 'mulai':
                if (!conn.kpopGuessRooms[m.chat]) {
                    return m.reply('❗Belum ada room yang dibuat.\nKetik *.tebakkpop create* untuk membuat room.');
                }
                if (conn.kpopGuessRooms[m.chat].players.length < 2) {
                    return m.reply('Minimal 2 pemain untuk memulai game.');
                }
                if (conn.kpopGuessRooms[m.chat].gameStarted) {
                    return m.reply('Game sudah dimulai.');
                }
                if (conn.kpopGuessRooms[m.chat].creator !== m.sender) {
                    return m.reply('❗Hanya pembuat room yang dapat memulai game.');
                }

                conn.kpopGuessRooms[m.chat].gameStarted = true;

                m.reply('Jawaban akan diungkap dalam 3 detik! 🎤');

                setTimeout(() => {
                    m.reply('3... 🎤');
                    setTimeout(() => {
                        m.reply('2... 🎤');
                        setTimeout(() => {
                            m.reply('1... 🎤');
                            setTimeout(() => {
                                const currentRoom = conn.kpopGuessRooms[m.chat];
                                const correctAnswer = currentRoom.image.answer;
                                const winners = currentRoom.players.filter(player => player.guess && player.guess === correctAnswer);

                                if (winners.length > 0) {
                                    m.reply(`Jawaban yang benar adalah "${correctAnswer}"❗\nPemenangnya adalah:\n🎉${winners.map(w => w.name).join(', ')}🎉\nSelamat! 🔥`);
                                } else {
                                    m.reply(`Tidak ada yang menebak dengan benar.\nJawaban yang benar adalah "${correctAnswer}".`);
                                }

                                delete conn.kpopGuessRooms[m.chat];
                            }, 1000);
                        }, 1000);
                    }, 1000);
                }, 2000);
                break;

            case 'delete':
                if (!conn.kpopGuessRooms[m.chat]) {
                    return m.reply('Belum ada room yang dibuat.');
                }
                if (conn.kpopGuessRooms[m.chat].creator !== m.sender) {
                    return m.reply('❗Hanya pembuat room yang dapat menghapus room.');
                }
                delete conn.kpopGuessRooms[m.chat];
                m.reply('✅ Room berhasil dihapus.');
                break;

            default:
                m.reply('Perintah tidak dikenali\nKetik *.tebakkpop help* untuk melihat daftar perintah.');
        }
    } catch (error) {
        console.error(error);
        m.reply('Terjadi kesalahan, coba lagi nanti.');
    }
};

handler.help = ['tebakkpop']
handler.tags = ['game']
handler.command = /^(tebakkpop)$/i
handler.group = true

export default handler;