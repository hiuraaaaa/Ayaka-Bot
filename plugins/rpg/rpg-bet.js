const { generateWAMessageFromContent, prepareWAMessageMedia } = (await import("@adiwajshing/baileys")).default;

const confirm = {}; // Untuk menyimpan status taruhan sementara

async function showTaruhanMenu(conn, m) {
    let pp = await conn.profilePictureUrl(m.sender, "image").catch(() => "https://files.catbox.moe/4tizh9.jpg");
    let oya = `Pilih Jumlah Uang yang Ingin Kamu Taruhkan`;

    let taruhanList = [
        ["10000", "10.000 IDR"], ["20000", "20.000 IDR"], ["50000", "50.000 IDR"],
        ["100000", "100.000 IDR"], ["200000", "200.000 IDR"], ["500000", "500.000 IDR"],
        ["all", "Semua Saldo"]
    ];

    let rows = taruhanList.map(([value, label]) => ({
        header: "",
        title: label,
        description: "Klik untuk mulai bertaruh",
        id: `.judi ${value}`
    }));

    let media = await prepareWAMessageMedia({
        document: {
            url: "https://chat.whatsapp.com/EfPjvlM7WIkBTfE5C2mNG1"
        },
        mimetype: "image/webp",
        fileName: `[ Hello ${m.pushName || 'Player'} ]`,
        pageCount: 2024,
        jpegThumbnail: await conn.resize(pp, 400, 400),
        fileLength: 2024000
    }, { upload: conn.waUploadToServer });

    let msg = generateWAMessageFromContent(
        m.chat,
        {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2
                    },
                    interactiveMessage: {
                        body: { text: oya },
                        footer: { text: "© Ubed Bot 2025 - Game Judi" },
                        header: {
                            title: "",
                            subtitle: "Menu Judi Bot",
                            hasMediaAttachment: true,
                            ...media
                        },
                        contextInfo: {
                            forwardingScore: 2025,
                            isForwarded: true,
                            mentionedJid: [m.sender],
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: "9999999@newsletter",
                                serverMessageId: null,
                                newsletterName: "Judi Game UbedBot"
                            },
                            externalAdReply: {
                                showAdAttribution: true,
                                title: "Game Judi by Ubed Bot",
                                mediaType: 1,
                                sourceUrl: "",
                                thumbnailUrl: "https://files.catbox.moe/4tizh9.jpg",
                                renderLargerThumbnail: true
                            }
                        },
                        nativeFlowMessage: {
                            buttons: [{
                                name: "single_select",
                                buttonParamsJson: JSON.stringify({
                                    title: "Pilih Jumlah Taruhan",
                                    sections: [{
                                        title: "Daftar Taruhan",
                                        highlight_label: "Judi Game",
                                        rows
                                    }]
                                })
                            }]
                        }
                    }
                }
            }
        },
        { quoted: m }
    );

    return conn.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });
}

let handler = async (m, { conn, args }) => {
    if (!args[0]) return await showTaruhanMenu(conn, m);

    if (m.sender in confirm) throw 'Kamu Masih Melakukan Judi, Tunggu Sampai Selesai!!';

    try {
        let user = global.db.data.users[m.sender];
        let count = (args[0] && number(parseInt(args[0]))) ? Math.max(parseInt(args[0]), 1) :
            /all/i.test(args[0]) ? Math.floor(user.money) : 1;

        if (user.money < count) return m.reply('Uang Kamu Tidak Cukup!!');

        confirm[m.sender] = {
            sender: m.sender,
            count,
            timeout: setTimeout(() => {
                m.reply('Waktu Berakhir');
                delete confirm[m.sender];
            }, 60000)
        };

        let txt = `Apakah Kamu Yakin Mau Melakukan Judi?\n\n*Taruhan:* ${count.toLocaleString()} IDR\nWaktu 60 Detik\nBalas *Iya* Jika Mau, Balas *Tidak* Untuk Membatalkan`;

        return conn.sendMessage(m.chat, {
            text: txt,
            footer: 'Pikir dulu matang-matang baru gas:',
            buttons: [
                { buttonId: 'iya', buttonText: { displayText: 'Iya' }, type: 1 },
                { buttonId: 'tidak', buttonText: { displayText: 'Tidak' }, type: 1 },
            ],
            headerType: 1,
            viewOnce: true
        }, { quoted: m });

    } catch (e) {
        console.error(e);
        if (m.sender in confirm) {
            clearTimeout(confirm[m.sender].timeout);
            delete confirm[m.sender];
            m.reply('Terjadi kesalahan, judi dibatalkan.');
        }
    }
};

handler.before = async m => {
    if (!(m.sender in confirm)) return;
    if (m.isBaileys) return;

    let { timeout, count } = confirm[m.sender];
    let user = global.db.data.users[m.sender];
    let moneyDulu = user.money;

    let txt = (m.msg?.selectedDisplayText || m.text || '').toLowerCase();

    try {
        if (/^(iya|yes|ya)$/i.test(txt)) {
            let Bot = Math.ceil(Math.random() * 91);
            let Kamu = Math.floor(Math.random() * 71);
            let status = 'Kalah';

            if (Bot < Kamu) {
                user.money += count;
                status = 'Menang';
            } else if (Bot > Kamu) {
                user.money -= count;
            } else {
                status = 'Seri';
                user.money += Math.floor(count / 1.5);
            }

            m.reply(`
*Bot:*   ${Bot}
*Kamu:* ${Kamu}

Kamu *${status}*, ${status === 'Menang' ? `Mendapatkan Uang *+${count * 2}*` :
                status === 'Kalah' ? `Kehilangan Uang *-${count}*` :
                    `Mendapatkan Uang *+${Math.floor(count / 1.5)}*`}
`.trim());

        } else if (/^(tidak|no)$/i.test(txt)) {
            m.reply('Judi dibatalkan.');
        } else return;

    } catch (e) {
        console.error(e);
        if (moneyDulu > user.money) user.money = moneyDulu;
        m.reply('Terjadi error saat memproses judi.');
    } finally {
        clearTimeout(timeout);
        delete confirm[m.sender];
    }

    return !0;
};

handler.help = ['judi']
handler.tags = ['rpg']
handler.command = /^(judi|bet)$/i

export default handler;

function number(x = 0) {
    x = parseInt(x);
    return !isNaN(x) && typeof x === 'number';
}