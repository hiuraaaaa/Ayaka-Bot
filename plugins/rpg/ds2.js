async function handler(m, { conn, usedPrefix, command, text, args }) {
    const { generateWAMessageFromContent, proto, prepareWAMessageMedia } = (await import("@adiwajshing/baileys")).default;
    let users = global.db.data.users[m.sender];
    let type = args[0];
    let level = users.level;
    let lastFightTime = users.lastFight || 0;
    let currentTime = new Date().getTime();

    function checkCooldown() {
        return currentTime - lastFightTime < 1800000;
    }

    if (!type) {
        let availableLevels = [
            'iblis biasa\n╰╼ Level: _1-10_',
            'iblis rendah\n╰╼ Level: _11-20_',
            'iblis menengah\n╰╼ Level: _21-30_',
            'iblis tinggi\n╰╼ Level: _31-40_',
            'iblis bulan bawah\n╰╼ Level: _41-100_',
            'iblis bulan atas\n╰╼ Level: _101-250_'
        ];

        let pp = await conn.profilePictureUrl(m.sender, "image").catch((_) => "https://telegra.ph/file/8904062b17875a2ab2984.jpg");
        
        let msg = generateWAMessageFromContent(
            m.chat,
            {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: {
                            deviceListMetadata: {},
                            deviceListMetadataVersion: 2,
                        },
                        interactiveMessage: {
                            body: {
                                text: `Tingkatan iblis yang tersedia untuk kamu:\n\n${availableLevels.join('\n')}`,
                            },
                            footer: {
                                text: wm,
                            },
                            header: {
                                title: "Demon Slayer",
                                subtitle: "Pilih Tingkatan Iblis",
                                hasMediaAttachment: true,
                                ...(await prepareWAMessageMedia(
                                    {
                                        document: {
                                            url: "https://chat.whatsapp.com/CZy0SzJKnfoLib7ICMjS4e",
                                        },
                                        mimetype: "image/webp",
                                        fileName: `[ Hello ${m.name} ]`,
                                    },
                                    { upload: conn.waUploadToServer },
                                )),
                            },
                            contextInfo: {
                                forwardingScore: 2024,
                                isForwarded: true,
                                mentionedJid: [m.sender],
                                forwardedNewsletterMessageInfo: {
                                    newsletterJid: "9999999@newsletter",
                                    serverMessageId: null,
                                    newsletterName: `© ${global.namebot}`,
                                },
                            },
                            nativeFlowMessage: {
                                buttons: [
                                    {
                                        name: "single_select",
                                        buttonParamsJson: 
                                        '{"title":"Pilih Menu","sections":[{"title":"List Menu","highlight_label":"Noob","rows":[{"header":"","title":"Demon Slayer Biasa","description":"Iblis Level 1-10","id":".demonslayer2 biasa"},{"header":"","title":"Demon Slayer Rendah","description":"Iblis Level 11-20","id":".demonslayer rendah"},{"header":"","title":"Demon Slayer Menengah","description":"Iblis Level 21-30","id":".demonslayer menengah"},{"header":"","title":"Demon Slayer Tinggi","description":"Iblis Level 31-40","id":".demonslayer tinggi"},{"header":"","title":"Demon Slayer Bulan Bawah","description":"Iblis Level 41-100","id":".demonslayer bulan_bawah"},{"header":"","title":"Demon Slayer Bulan Atas","description":"Iblis Level 101-250","id":".demonslayer bulan_atas"}]}]}'
                                    },
                                ],
                            },
                        },
                    },
                },
            },
            { quoted: m },
            {},
        );

        await conn.relayMessage(msg.key.remoteJid, msg.message, {
            messageId: msg.key.id,
        });
        return;
    }

    if (users.sworddurability < 200) {
        return conn.reply(m.chat, 'Kamu belum memiliki katana untuk melawan iblis. Silakan beli atau buat katana terlebih dahulu.', m);
    }

    if (users.sworddurability < 100) {
        return conn.reply(m.chat, 'Durabilitas katana kamu kurang dari 180. Silakan perbaiki katana terlebih dahulu.', m);
    }

    function calculateRewards(min, max) {
        return {
            money: Math.floor(Math.random() * (max - min + 1)) + min,
        };
    }

    switch (type) {
        case 'biasa':
            if (users.level < 5 || users.level > 10)
                return conn.reply(m.chat, `Kamu membutuhkan *Level 1-10* untuk melawan iblis *biasa*\nLevel Kamu: *${level}*`, m);

            if (checkCooldown()) {
                let remainingTime = 1800000 - (currentTime - lastFightTime);
                return conn.reply(m.chat, `Kamu sudah lelah untuk melawan iblis *biasa*\nTunggu selama ${clockString(remainingTime)} lagi`, m);
            }

            if (users.health < 30) return m.reply('Kesehatan kamu kurang dari *30 ❤️* untuk melawan iblis *biasa*. Silahkan isi kesehatan terlebih dahulu\nKetik: *.heal*');

            // Hitung hadiah
            let { money } = calculateRewards(1000000, 2000000);
            let biasaHealthLoss = Math.floor(Math.random() * 10);

            users.eris += money;
            users.health -= biasaHealthLoss;
            users.katanadurability -= 30;
            users.lastFight = currentTime;

            let biasaResult = `Kesehatan kamu berkurang *-${biasaHealthLoss}❤️* setelah melawan iblis di Level biasa.\n\n_*Hadiah yang kamu dapatkan*_\n💰 = [ *${money}* ] Uang\n\n_*Segera pulihkan kondisimu, dan mulai melawan iblis kembali.*_`;

            setTimeout(() => {
                conn.reply(m.chat, 'Memasuki pertarungan melawan iblis biasa', m);
                setTimeout(() => {
                    conn.reply(m.chat, 'Berhasil keluar dari pertarungan melawan iblis biasa', m);
                    setTimeout(() => {
                        conn.reply(m.chat, biasaResult, m);
                    }, 3000);
                }, 1500);
            }, 10);

            break;

        case 'rendah':
            if (level < 11 || level > 20)
                return conn.reply(m.chat, `Kamu membutuhkan *Level 11-20* untuk melawan iblis *rendah*\nLevel Kamu: *${level}*`, m);

            if (checkCooldown()) {
                let remainingTime = 1800000 - (currentTime - lastFightTime);
                return conn.reply(m.chat, `Kamu sudah lelah untuk melawan iblis *rendah*\nTunggu selama ${clockString(remainingTime)} lagi`, m);
            }

            if (users.health < 50) return m.reply('Kesehatan kamu kurang dari *50 ❤️* untuk melawan iblis *rendah*. Silahkan isi kesehatan terlebih dahulu\nKetik: *.heal*');

            let { money: rendahMoney } = calculateRewards(2000000, 3000000);
            let rendahHealthLoss = Math.floor(Math.random() * 15);

            users.eris += rendahMoney;
            users.health -= rendahHealthLoss;
            users.katanadurability -= 60;
            users.lastFight = currentTime;

            let rendahResult = `Kesehatan kamu berkurang *-${rendahHealthLoss}❤️* setelah melawan iblis di Level rendah.\n\n_*Hadiah yang kamu dapatkan*_\n💰 = [ *${rendahMoney}* ] Uang\n\n_*Segera pulihkan kondisimu, dan mulai melawan iblis kembali.*_`;

            setTimeout(() => {
                conn.reply(m.chat, 'Memasuki pertarungan melawan iblis rendah', m);
                setTimeout(() => {
                    conn.reply(m.chat, 'Berhasil keluar dari pertarungan melawan iblis rendah', m);
                    setTimeout(() => {
                        conn.reply(m.chat, rendahResult, m);
                    }, 3000);
                }, 1500);
            }, 10);

            break;

        case 'menengah':
            if (level < 21 || level > 30)
                return conn.reply(m.chat, `Kamu membutuhkan *Level 21-30* untuk melawan iblis *menengah*\nLevel Kamu: *${level}*`, m);

            if (checkCooldown()) {
                let remainingTime = 1800000 - (currentTime - lastFightTime);
                return conn.reply(m.chat, `Kamu sudah lelah untuk melawan iblis *menengah*\nTunggu selama ${clockString(remainingTime)} lagi`, m);
            }

            if (users.health < 70) return m.reply('Kesehatan kamu kurang dari *70 ❤️* untuk melawan iblis *menengah*. Silahkan isi kesehatan terlebih dahulu\nKetik: *.heal*');

            let { money: menengahMoney } = calculateRewards(3000000, 4000000);
            let menengahHealthLoss = Math.floor(Math.random() * 20);

            users.eris += menengahMoney;
            users.health -= menengahHealthLoss;
            users.katanadurability -= 90;
            users.lastFight = currentTime;

            let menengahResult = `Kesehatan kamu berkurang *-${menengahHealthLoss}❤️* setelah melawan iblis di Level menengah.\n\n_*Hadiah yang kamu dapatkan*_\n💰 = [ *${menengahMoney}* ] Uang\n\n_*Segera pulihkan kondisimu, dan mulai melawan iblis kembali.*_`;

            setTimeout(() => {
                conn.reply(m.chat, 'Memasuki pertarungan melawan iblis menengah', m);
                setTimeout(() => {
                    conn.reply(m.chat, 'Berhasil keluar dari pertarungan melawan iblis menengah', m);
                    setTimeout(() => {
                        conn.reply(m.chat, menengahResult, m);
                    }, 3000);
                }, 1500);
            }, 10);

            break;

        case 'tinggi':
            if (level < 31 || level > 40)
                return conn.reply(m.chat, `Kamu membutuhkan *Level 31-40* untuk melawan iblis *tinggi*\nLevel Kamu: *${level}*`, m);

            if (checkCooldown()) {
                let remainingTime = 1800000 - (currentTime - lastFightTime);
                return conn.reply(m.chat, `Kamu sudah lelah untuk melawan iblis *tinggi*\nTunggu selama ${clockString(remainingTime)} lagi`, m);
            }

            if (users.health < 100) return m.reply('Kesehatan kamu kurang dari *100 ❤️* untuk melawan iblis *tinggi*. Silahkan isi kesehatan terlebih dahulu\nKetik: *.heal*');

            let { money: tinggiMoney } = calculateRewards(5000000, 6000000);
            let tinggiHealthLoss = Math.floor(Math.random() * 30);

            users.eris += tinggiMoney;
            users.health -= tinggiHealthLoss;
            users.katanadurability -= 120;
            users.lastFight = currentTime;

            let tinggiResult = `Kesehatan kamu berkurang *-${tinggiHealthLoss}❤️* setelah melawan iblis di Level tinggi.\n\n_*Hadiah yang kamu dapatkan*_\n💰 = [ *${tinggiMoney}* ] Uang\n\n_*Segera pulihkan kondisimu, dan mulai melawan iblis kembali.*_`;

            setTimeout(() => {
                conn.reply(m.chat, 'Memasuki pertarungan melawan iblis tinggi', m);
                setTimeout(() => {
                    conn.reply(m.chat, 'Berhasil keluar dari pertarungan melawan iblis tinggi', m);
                    setTimeout(() => {
                        conn.reply(m.chat, tinggiResult, m);
                    }, 3000);
                }, 1500);
            }, 10);

            break;

        case 'bulan_bawah':
            if (level < 41 || level > 100)
                return conn.reply(m.chat, `Kamu membutuhkan *Level 41-100* untuk melawan iblis *bulan bawah*\nLevel Kamu: *${level}*`, m);

            if (checkCooldown()) {
                let remainingTime = 1800000 - (currentTime - lastFightTime);
                return conn.reply(m.chat, `Kamu sudah lelah untuk melawan iblis *bulan bawah*\nTunggu selama ${clockString(remainingTime)} lagi`, m);
            }

            if (users.health < 150) return m.reply('Kesehatan kamu kurang dari *150 ❤️* untuk melawan iblis *bulan bawah*. Silahkan isi kesehatan terlebih dahulu\nKetik: *.heal*');

            let { money: bulanBawahMoney } = calculateRewards(10000000, 12000000);
            let bulanBawahHealthLoss = Math.floor(Math.random() * 50);

            users.eris += bulanBawahMoney;
            users.health -= bulanBawahHealthLoss;
            users.katanadurability -= 150;
            users.lastFight = currentTime;

            let bulanBawahResult = `Kesehatan kamu berkurang *-${bulanBawahHealthLoss}❤️* setelah melawan iblis di Level bulan bawah.\n\n_*Hadiah yang kamu dapatkan*_\n💰 = [ *${bulanBawahMoney}* ] Uang\n\n_*Segera pulihkan kondisimu, dan mulai melawan iblis kembali.*_`;

            setTimeout(() => {
                conn.reply(m.chat, 'Memasuki pertarungan melawan iblis bulan bawah', m);
                setTimeout(() => {
                    conn.reply(m.chat, 'Berhasil keluar dari pertarungan melawan iblis bulan bawah', m);
                    setTimeout(() => {
                        conn.reply(m.chat, bulanBawahResult, m);
                    }, 3000);
                }, 1500);
            }, 10);

            break;

        case 'bulan_atas':
            if (level < 101 || level > 250)
                return conn.reply(m.chat, `Kamu membutuhkan *Level 101-250* untuk melawan iblis *bulan atas*\nLevel Kamu: *${level}*`, m);

            if (checkCooldown()) {
                let remainingTime = 1800000 - (currentTime - lastFightTime);
                return conn.reply(m.chat, `Kamu sudah lelah untuk melawan iblis *bulan atas*\nTunggu selama ${clockString(remainingTime)} lagi`, m);
            }

            if (users.health < 200) return m.reply('Kesehatan kamu kurang dari *200 ❤️* untuk melawan iblis *bulan atas*. Silahkan isi kesehatan terlebih dahulu\nKetik: *.heal*');

            let { money: bulanAtasMoney } = calculateRewards(15000000, 20000000);
            let bulanAtasHealthLoss = Math.floor(Math.random() * 70);

            users.eris += bulanAtasMoney;
            users.health -= bulanAtasHealthLoss;
            users.katanadurability -= 200;
            users.lastFight = currentTime;

            let bulanAtasResult = `Kesehatan kamu berkurang *-${bulanAtasHealthLoss}❤️* setelah melawan iblis di Level bulan atas.\n\n_*Hadiah yang kamu dapatkan*_\n💰 = [ *${bulanAtasMoney}* ] Uang\n\n_*Segera pulihkan kondisimu, dan mulai melawan iblis kembali.*_`;

            setTimeout(() => {
                conn.reply(m.chat, 'Memasuki pertarungan melawan iblis bulan atas', m);
                setTimeout(() => {
                    conn.reply(m.chat, 'Berhasil keluar dari pertarungan melawan iblis bulan atas', m);
                    setTimeout(() => {
                        conn.reply(m.chat, bulanAtasResult, m);
                    }, 3000);
                }, 1500);
            }, 10);

            break;

        default:
            return conn.reply(m.chat, `Jenis iblis *${type}* tidak dikenali. Silakan pilih dari jenis yang tersedia.`, m);
    }
}

handler.help = ['demonslayer'];
handler.command = /^(demonslayer2)$/i;
handler.register = true;
handler.group = true;
handler.limit = 1;

function clockString(ms) {
    let m = Math.floor(ms / 60000) % 60;
    let s = Math.floor(ms / 1000) % 60;
    return `${m} *Menit* ${s} *Detik*`;
}

export default handler;