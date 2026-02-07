import fetch from 'node-fetch';
import { generateWAMessageFromContent } from '@adiwajshing/baileys'

let maxAttempts = 10;
let timeout = 180000;

let handler = async (m, { conn, usedPrefix, command, text }) => {
    conn.tebakangka = conn.tebakangka || {};
    let id = m.chat;
    let earnedExp = Math.floor(Math.random() * 4000) + 1100;

    // Daftar link gambar
    const imageLinks = [
        'https://files.catbox.moe/w4t06z.jpg',
        'https://files.catbox.moe/b245ee.jpg',
        'https://files.catbox.moe/h6ux02.jpg',
        'https://files.catbox.moe/dmm6wn.jpg',
        'https://files.catbox.moe/ielp9p.jpg'
    ];

    try {
        if (command === 'tebakangka') {
            if (id in conn.tebakangka) {
                conn.reply(m.chat, '⚠️ Masih ada permainan yang belum selesai!', conn.tebakangka[id][0]);
                return;
            }

            let randomNumber = Math.floor(Math.random() * 100) + 1;

            // Pilih gambar secara acak
            const randomIndex = Math.floor(Math.random() * imageLinks.length);
            const imageUrl = imageLinks[randomIndex];

            let caption = `┌─⊷ *${command.toUpperCase()}*
🎮 Saya sudah memikirkan sebuah angka antara *1 - 100*.
Coba tebak angkanya!

🎯 Kesempatan Menebak: *${maxAttempts} X*
🕑 Timeout: *${(timeout / 1000).toFixed(2)} detik*
💬 Ketik *.Angka* Untuk Menebak
📝 Contoh:  \`.20\`
💬 Ketik *${usedPrefix}menyerah* Untuk Menyerah
🎁 Hadiah: *${earnedExp} ✨XP*
`.trim();

			// Kirim gambar dengan caption
			let message = await conn.sendMessage(m.chat, { image: { url: imageUrl }, caption: caption }, { quoted: m });

            conn.tebakangka[id] = [
                message, // Simpan pesan yang berisi gambar
                randomNumber,
                0,
                earnedExp,
                setTimeout(() => {
                    if (conn.tebakangka[id]) {
                        const buttons = [
                            {buttonId: '.tebakangka', buttonText: {displayText: 'Main Lagi 🔄'}, type: 1}
                        ];
                        const buttonMessage = {
                            text: `🚩 *Waktu habis❗*\nAngka yang benar adalah *${randomNumber}*`,
                            footer: 'Klik tombol dibawah untuk bermain lagi!',
                            buttons: buttons,
                            headerType: 1
                        };
                        conn.sendMessage(m.chat, buttonMessage, {quoted: conn.tebakangka[id][0]});
                        delete conn.tebakangka[id];
                    }
                }, timeout)
            ];
            return;
        }

        if (command === 'menyerah') {
            if (!(id in conn.tebakangka)) {
                conn.reply(m.chat, '⚠️ Tidak ada permainan tebak angka yang aktif.', m);
                return;
            }

            let [msg, num, attempts,savedExp, timeoutID] = conn.tebakangka[id];
            clearTimeout(timeoutID);

            const buttons = [
                {buttonId: '.tebakangka', buttonText: {displayText: 'Main Lagi 🔄'}, type: 1}
            ];
            const buttonMessage = {
                text: `😔 *Kamu menyerah❗*\nAngka yang benar adalah *${num}*`,
                footer: 'Klik tombol dibawah untuk bermain lagi!',
                buttons: buttons,
                headerType: 1
            };

            await conn.sendMessage(m.chat, buttonMessage, { quoted: msg });

            delete conn.tebakangka[id];
            return;
        }

        if (/^\d+$/.test(command)) {
            if (!(id in conn.tebakangka)) return;

            let guess = parseInt(command);

            let [message, correctNumber, attempts, savedExp, timeoutId] = conn.tebakangka[id];
            attempts++;
            conn.tebakangka[id][2] = attempts;
            let remainingAttempts = maxAttempts - attempts;

            if (guess === correctNumber) {


                const buttons = [
                    {buttonId: '.tebakangka', buttonText: {displayText: 'Main Lagi 🔄'}, type: 1}
                ]
                const buttonMessage = {
                    text: `*🎉Selamat Kamu Berhasil Menebak Angkanya🎉*\nAngka Yang Benar Yaitu *${correctNumber}*\n🎁 Hadiah:  *${savedExp} ✨XP*`,
                    footer: 'Klik tombol dibawah untuk bermain lagi!',
                    buttons: buttons,
                    headerType: 1
                }

                await conn.sendMessage(m.chat, buttonMessage, { quoted: message })

                clearTimeout(timeoutId);
                delete conn.tebakangka[id];
            } else if (attempts >= maxAttempts) {
                const buttons = [
                    {buttonId: '.tebakangka', buttonText: {displayText: 'Main Lagi 🔄'}, type: 1}
                ];
                const buttonMessage = {
                    text: `Kamu sudah menggunakan semua kesempatan❗\nAngka yang benar adalah *${correctNumber}*`,
                    footer: 'Klik tombol dibawah untuk bermain lagi!',
                    buttons: buttons,
                    headerType: 1
                };
                await conn.sendMessage(m.chat, buttonMessage, { quoted: message });
                clearTimeout(timeoutId);
                delete conn.tebakangka[id];
            } else {
                let hint = Math.abs(guess - correctNumber) <= 2 ? '*Dikit lagi!* 🎯' : guess > correctNumber ? '*Kejauhan!* 📉' : '*Terlalu rendah!* 📈';
                conn.reply(m.chat, `${hint}\nSisa Kesempatan: *${remainingAttempts}*`, message);
            }
            return;
        }


    } catch (e) {
        console.error("Error in tebakangka plugin:", e);
        conn.reply(m.chat, '⚠️ Terjadi kesalahan, coba lagi nanti.\n' + e, m);
    }
};

handler.help = ['tebakangka'];
handler.tags = ['game'];
handler.command = /^(tebakangka|menyerah|\d+)$/i;

export default handler;