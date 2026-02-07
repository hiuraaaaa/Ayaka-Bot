
const { proto, generateWAMessageFromContent, prepareWAMessageMedia } = (await import('@adiwajshing/baileys')).default;

let timeout = 600000;

async function handler(m, { conn, command, usedPrefix, isOwner }) {
    //if (!isOwner) return m.reply(`Fitur ini sedang di update!`);
    conn.explore = conn.explore || {};
    conn.create = conn.create || {};
    let room = conn.explore[m.chat];
    let tour = conn.create[m.chat];

    let pemain = global.db.data.users[m.sender];
    let timie = (new Date - (pemain.lastlink * 1)) * 1;
    if (timie < 1800000) return m.reply(`*[👩🏻‍⚕️]* Beristirahatlah Sejenak Untuk Memulihkan Keadaanmu\nDan Tunggu Selama ${clockString(1800000 - timie)}`);

    if (!room) {
        let caption = `📢 Kamu Ingin Pergi *Mengexplore*, Kamu Bisa Mabar Dengan Partner\nDengan Mengexplore, Pengetahuanmu akan lebih luas!`;
        let msg = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2
                    },
                    interactiveMessage: proto.Message.InteractiveMessage.create({
                        body: proto.Message.InteractiveMessage.Body.create({
                            text: caption,
                            mentions: conn.parseMention(caption),
                        }),
                        footer: proto.Message.InteractiveMessage.Footer.create({
                            text: "*© Lann4you Official*"
                        }),
                        header: proto.Message.InteractiveMessage.Header.create({
                            title: "\t🌏 *EXPLORE* 🌏\n",
                            subtitle: "",
                            hasMediaAttachment: false
                        }),
                        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                            buttons: [
                                {
                                    name: "quick_reply",
                                    buttonParamsJson: "{\"display_text\":\"👥 Buat Room\",\"id\":\"buat room\"}"
                                },
                                {
                                    name: "quick_reply",
                                    buttonParamsJson: "{\"display_text\":\"👤 Solo\",\"id\":\"sendiri_aja\"}"
                                },
                            ],
                        })
                    })
                },
            }
        }, {})
        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id, });
        conn.create[m.chat] = {
            state: 'tunggu',
            pl: m.sender,
            waktu: setTimeout(() => {
                if (conn.create[m.chat]) conn.reply(m.chat, `Explore Dibatalkan!`, m)
                delete conn.create[m.chat]
            }, 50000),
        }
    } else {
        if (!room.players.includes(m.sender)) {
            let username = this.getName(room.p)
            let msg = generateWAMessageFromContent(m.chat, {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: {
                            deviceListMetadata: {},
                            deviceListMetadataVersion: 2
                        },
                        interactiveMessage: proto.Message.InteractiveMessage.create({
                            body: proto.Message.InteractiveMessage.Body.create({
                                text: `[⚠️] Sudah Ada Room Yang Telah Di Buat, Silahkan Join Sebelum Permainan Di Mulai`
                            }),
                            footer: proto.Message.InteractiveMessage.Footer.create({
                                text: "*© Lann4you Official*"
                            }),
                            header: proto.Message.InteractiveMessage.Header.create({
                                title: "\t🌏 *EXPLORE* 🌏\n",
                                subtitle: "",
                                hasMediaAttachment: false
                            }),
                            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                buttons: [
                                    {
                                        name: "quick_reply",
                                        buttonParamsJson: "{\"display_text\":\"♻️ Join\",\"id\":\"join explore\"}"
                                    },
                                ],
                            })
                        })
                    },
                }
            }, {})
            await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id, });
        } else if (room.players.includes(m.sender)) {
            let playerList = room.players.map((player, index) => `*${index + 1}.* @${player.replace(/@.+/, '')}`).join('\n');
            let msg = generateWAMessageFromContent(m.chat, {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: {
                            deviceListMetadata: {},
                            deviceListMetadataVersion: 2
                        },
                        interactiveMessage: proto.Message.InteractiveMessage.create({
                            body: proto.Message.InteractiveMessage.Body.create({
                                text: `*[❕] Kamu Sudah Berada Di Dalam Room*\n*Room ID:* ${room.id}\n\nTunggu Room Master Klik *Start* Untuk Memulai Permainan`
                            }),
                            footer: proto.Message.InteractiveMessage.Footer.create({
                                text: "*© Lann4you Official*"
                            }),
                            header: proto.Message.InteractiveMessage.Header.create({
                                title: "\t🌏 *EXPLORE* 🌏\n",
                                subtitle: "",
                                hasMediaAttachment: false
                            }),
                            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                buttons: [
                                    {
                                        name: "quick_reply",
                                        buttonParamsJson: "{\"display_text\":\"🚀 Start\",\"id\":\"start explore\"}"
                                    },
                                    {
                            name: "quick_reply",
                            buttonParamsJson: "{\"display_text\":\"👨🏻‍💻 Player\",\"id\":\"player\"}"
                                    },
                                ],
                            })
                        })
                    },
                }
            }, {})
            await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id, })
        }
    }
}

// Sisanya kode tetap sama

function getContentType(message) {
  if (!message) return null;
  if (message.buttonsResponseMessage) return 'buttonsResponseMessage';
  if (message.templateButtonReplyMessage) return 'templateButtonReplyMessage';
  if (message.viewOnceMessage) return 'viewOnceMessage';
  return null;
}

function clockString(ms) {
    let m = isNaN(ms) ? '60' : Math.floor(ms / 60000) % 60;
    let s = isNaN(ms) ? '60' : Math.floor(ms / 1000) % 60;
    return [m, ' Menit ', s, ' Detik'].map(v => v.toString().padStart(2, 0)).join('');
}

handler.before = async function(m) {
    if (!m || !m.message) return;
    this.explore = this.explore || {};
    this.create = this.create || {};
    let room = this.explore[m.chat];
    let tour = Object.values(this.create).find(tour => tour.state && [tour.pl].includes(m.sender));
const contentType = getContentType(m.message);
  if (contentType === 'templateButtonReplyMessage') {
    let selectedButton = m.message.templateButtonReplyMessage.selectedId;
    
    if (room) {
        if (selectedButton === 'join explore' && !room.players.includes(m.sender)) {
            if (room.players.length < 10) {
                let pJoin = global.db.data.users[m.sender];
                let time = (new Date - (pJoin.lastlink * 1)) * 1;
                if (time < 1800000) return m.reply(`*[👩🏻‍⚕️]* Kamu Blum Bisa Join Room\nBeristirahatlah Sejenak Selama ${clockString(1800000 - time)}`);

                room.players.push(m.sender);
                let playerList = room.players.map((player, index) => `*${index + 1}.* @${player.replace(/@.+/, '')}`).join('\n');
                let msg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
        message: {
            messageContextInfo: {
                deviceListMetadata: {},
                deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
                body: proto.Message.InteractiveMessage.Body.create({
                    text: `[✅] Berhasil Join Kedalam Room\n*Room ID:* ${room.id}\n🕓 Menunggu Room Master Klik *Start* Untuk Memulai Permainan`,
                }),
                footer: proto.Message.InteractiveMessage.Footer.create({
                    text: "*© Lann4you Official*"
                }),
                header: proto.Message.InteractiveMessage.Header.create({
                    title: "\t🌏 *EXPLORE* 🌏\n",
                    subtitle: "",
                    hasMediaAttachment: false
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                    buttons: [
                        {
                            name: "quick_reply",
                            buttonParamsJson: "{\"display_text\":\"🚀 Start\",\"id\":\"start explore\"}"
                        },
                        {
                            name: "quick_reply",
                            buttonParamsJson: "{\"display_text\":\"👨🏻‍💻 Player\",\"id\":\"player\"}"
                        },
                    ],
                })
            })
        },
    }
}, {})
        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id,})
            } else {
                await conn.reply(m.chat, `[❗] Room Telah Penuh, Sepertinya Kamu Terlambat, Maksimal 10 Pemain Yang Join`, m);
            }
        } else if (selectedButton === 'join explore' && room.players.includes(m.sender)) {
        if (m.sender === room.p) {
        let msg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
        message: {
            messageContextInfo: {
                deviceListMetadata: {},
                deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
                body: proto.Message.InteractiveMessage.Body.create({
                    text: "[❕] Kamu Adalah Room Master, Silahkan Start Untuk Memulai permainan Ini!"
                }),
                footer: proto.Message.InteractiveMessage.Footer.create({
                    text: "*© Lann4you Official*"
                }),
                header: proto.Message.InteractiveMessage.Header.create({
                    title: "\t🌏 *EXPLORE* 🌏\n",
                    subtitle: "",
                    hasMediaAttachment: false
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                    buttons: [
                        {
                            name: "quick_reply",
                            buttonParamsJson: "{\"display_text\":\"🚀 Start\",\"id\":\"start explore\"}"
                        },
                        {
                            name: "quick_reply",
                            buttonParamsJson: "{\"display_text\":\"👨🏻‍💻 Player\",\"id\":\"player\"}"
                         },
                    ],
                })
            })
        },
    }
}, {})
        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id, })
         } else {
         let playerList = this.explore[m.chat].players.map((player, index) => `*${index + 1}.* @${player.replace(/@.+/, '')}`).join('\n');
        let msg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
        message: {
            messageContextInfo: {
                deviceListMetadata: {},
                deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
                body: proto.Message.InteractiveMessage.Body.create({
                    text: `*[❕] Kamu Sudah Berada Di Dalam Room*\n\n*Room ID:* ${room.id}\n\nTunggu *Room Master* Memulai Permainan`,
                }),
                footer: proto.Message.InteractiveMessage.Footer.create({
                    text: "*© Lann4you Official*"
                }),
                header: proto.Message.InteractiveMessage.Header.create({
                    title: "\t🌏 *EXPLORE* 🌏\n",
                    subtitle: "",
                    hasMediaAttachment: false
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                    buttons: [
                        {
                            name: "quick_reply",
                            buttonParamsJson: "{\"display_text\":\"🚀 Start\",\"id\":\"start explore\"}"
                        },
                        {
                            name: "quick_reply",
                            buttonParamsJson: "{\"display_text\":\"👨🏻‍💻 Player\",\"id\":\"player\"}"
                        },
                    ],
                })
            })
        },
    }
}, {})
        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id,})
     }
  } else if (room && selectedButton === 'start explore' && m.sender === room.p) {
            await startExplore(m, room);
        } else if (selectedButton === 'sendiri_aja' && room && m.sender === room.p) {
        if (!room || room.p === m.sender) {
        if (room.players.length >= 2) {
        let msg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
        message: {
            messageContextInfo: {
                deviceListMetadata: {},
                deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
                body: proto.Message.InteractiveMessage.Body.create({
                    text: "[❗] Sudah Ada Pemain Yang Bergabung Kedalam Room, Tidak Bisa Bermain Sendiri, Silahkan Start Permainan Ini!",
                }),
                footer: proto.Message.InteractiveMessage.Footer.create({
                    text: "*© Lann4you Official*"
                }),
                header: proto.Message.InteractiveMessage.Header.create({
                    title: "\t🌏 *EXPLORE* 🌏\n",
                    subtitle: "",
                    hasMediaAttachment: false
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                    buttons: [
                        {
                            name: "quick_reply",
                            buttonParamsJson: "{\"display_text\":\"🚀 Start\",\"id\":\"start explore\"}"
                        },
                        {
                            name: "quick_reply",
                            buttonParamsJson: "{\"display_text\":\"👨🏻‍💻 Player\",\"id\":\"player\"}"
                         },
                    ],
                })
            })
        },
    }
}, {})
        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id, })
         }
            // If no room exists or the current sender is the owner of the room
            await handleSoloExplore(m);
            delete conn.explore[m.chat]
        }
      } else if (room && selectedButton === 'batall' && m.sender === room.p) {
       if (this.explore[m.chat].players.length >= 2) {
       let msg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
        message: {
            messageContextInfo: {
                deviceListMetadata: {},
                deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
                body: proto.Message.InteractiveMessage.Body.create({
                    text: "[❗] Gagal Membatalkan Permainan, Karna Sudah Ada Pemain Yang Bergabung Kedalam Room, Silahkan *Start* Untuk Memulai Permainanan"
                }),
                footer: proto.Message.InteractiveMessage.Footer.create({
                    text: "*© Lann4you Official*"
                }),
                header: proto.Message.InteractiveMessage.Header.create({
                    title: "\t🌏 *EXPLORE* 🌏\n",
                    subtitle: "",
                    hasMediaAttachment: false
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                    buttons: [
                        {
                            name: "quick_reply",
                            buttonParamsJson: "{\"display_text\":\"🚀 Start\",\"id\":\"start explore\"}"
                        },
                        {
                            name: "quick_reply",
                            buttonParamsJson: "{\"display_text\":\"👨🏻‍💻 Player\",\"id\":\"player\"}"
                        },
                    ],
                })
            })
        },
    }
}, {})
        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id, })
        }
        m.reply(`Sukses Membatalkan Permainan`)
       delete conn.explore[m.chat]
       } else if (selectedButton === 'player' && room.players.includes(m.sender)) {
         let playerList = this.explore[m.chat].players.map((player, index) => `*${index + 1}.* @${player.replace(/@.+/, '')}`).join('\n');
         await conn.reply(m.chat, `[🌏]\n👨🏻‍💻 Player:\n${playerList}\n▬▭▬▭▬▭▬▭`, m, { contextInfo : { mentionedJid: this.explore[m.chat].players }})
        }
    } else if (selectedButton === 'buat room' && tour && tour.state == 'tunggu' && m.sender === tour.pl) {
        let alokasi = pickRandom(['Hutan Terlarang', 'Gua Tersembunyi', 'Desa Misterius', 'Kota Terlantar', 'Danau Sembunyi', 'Pegunungan Misteri', 'Pulau Terlupakan', 'Labirin Tersembunyi', 'Kota Terkubur', 'Istana Terlupakan']);
        let blokasi = pickRandom(['Labirin Tersembunyi', 'Hutan Terlarang', 'Pulau Terlupakan', 'Desa Misterius', 'Kota Terkubur', 'Danau Sembunyi', 'Pegunungan Misteri', 'Istana Terlupakan', 'Gua Tersembunyi', 'Kota Terlantar']);
        let clokasi = pickRandom(['Kota Terkubur', 'Hutan Terlarang', 'Labirin Tersembunyi', 'Istana Terlupakan', 'Pulau Terlupakan', 'Gua Tersembunyi', 'Pegunungan Misteri', 'Danau Sembunyi', 'Desa Misterius', 'Kota Terlantar']);
        
        this.explore[m.chat] = {
            id: Math.floor(Math.random() * 10000000).toString(),
            p: m.sender,
            players: [m.sender],
            alok: alokasi,
            blok: blokasi,
            clok: clokasi,
            hapus: delete conn.create[m.chat],
            status: 'waiting',
        };
        let playerList = this.explore[m.chat].players.map((player, index) => `*${index + 1}.* @${player.replace(/@.+/, '')}`).join('\n');
        let msg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
        message: {
            messageContextInfo: {
                deviceListMetadata: {},
                deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
                body: proto.Message.InteractiveMessage.Body.create({
                    text: `*[💡]* Sukses Membuat Room\n*Room ID:* ${this.explore[m.chat].id}\nMenunggu Pemain Lain Untuk Join Kedalam Room\nJika Tidak Asa Yang Join, Kamu Bisa Memilih Sendiri Atau Batal`
                }),
                footer: proto.Message.InteractiveMessage.Footer.create({
                    text: "*© Lann4you Official*"
                }),
                header: proto.Message.InteractiveMessage.Header.create({
                    title: "\t🌏 *EXPLORE* 🌏\n",
                    subtitle: "",
                    hasMediaAttachment: false
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                    buttons: [
                        {
                            name: "quick_reply",
                            buttonParamsJson: "{\"display_text\":\"♻️ Join\",\"id\":\"join explore\"}"
                        },
                        {
                            name: "quick_reply",
                            buttonParamsJson: "{\"display_text\":\"👤 Solo\",\"id\":\"sendiri_aja\"}"
                            },
                            {
                            name: "quick_reply",
                            buttonParamsJson: "{\"display_text\":\"👨🏻‍💻 Player\",\"id\":\"player\"}"
                            },
                            {
                            name: "quick_reply",
                            buttonParamsJson: "{\"display_text\":\"🚫 Batalkan\",\"id\":\"batall\"}"
                        },
                    ],
                })
            })
        },
    }
}, {})
        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id,})
        setTimeout(() => {
            if (!room.players) conn.reply(m.chat, `🔰Tidak Ada Yang Bergabung Kedalam Room, Silahkan Ketik *Solo* Untuk Bermain Sendiri!`, m)
            }, 20000)
    } else if (tour && tour.state == 'tunggu' && m.sender === tour.pl && selectedButton === 'sendiri_aja') {
            await handleSoloExplore(m);
    }
  }
}
async function handleSoloExplore(m) {
    delete conn.explore[m.chat];
    let alokasi = pickRandom(['Hutan Terlarang', 'Gua Tersembunyi', 'Desa Misterius', 'Kota Terlantar', 'Danau Sembunyi', 'Pegunungan Misteri', 'Pulau Terlupakan', 'Labirin Tersembunyi', 'Kota Terkubur', 'Istana Terlupakan']);
    let blokasi = pickRandom(['Labirin Tersembunyi', 'Hutan Terlarang', 'Pulau Terlupakan', 'Desa Misterius', 'Kota Terkubur', 'Danau Sembunyi', 'Pegunungan Misteri', 'Istana Terlupakan', 'Gua Tersembunyi', 'Kota Terlantar']);
    let clokasi = pickRandom(['Kota Terkubur', 'Hutan Terlarang', 'Labirin Tersembunyi', 'Istana Terlupakan', 'Pulau Terlupakan', 'Gua Tersembunyi', 'Pegunungan Misteri', 'Danau Sembunyi', 'Desa Misterius', 'Kota Terlantar']);
    
    let room = {
        id: Math.floor(Math.random() * 10000000).toString(),
        p: m.sender,
        players: [m.sender],
        alok: alokasi,
        blok: blokasi,
        clok: clokasi,
    };
    let solow = global.db.data.users[room.players]
    solow.lastlink = new Date() * 1

    let startMsg = `*🌏 Menuju Tempat Explore*\n\n👨🏻‍💻 Player:\n@${room.p.replace(/@.+/, '')} *Mode Solo*\nLokasi:\n* ${room.alok}\n* ${room.blok}\n* ${room.clok}\n\n*🛫 Tunggu Beberapa Saat!!.*`;
    await conn.reply(m.chat, startMsg, m, { contextInfo: { mentionedJid: [room.p] } });

    setTimeout(async () => {
        let resultsMsg = `*🏅 Kamu Sudah Kembali*\n\n👨🏻‍💻 Player:\n@${room.p.replace(/@.+/, '')}\n*🌏 Lokasi Explore:*\n* ${room.alok} ✓\n* ${room.blok} ✓\n* ${room.clok} ✓\n\n*Hasil Yang Di Dapat:*\n`;

        let money = Math.floor(Math.random() * 10000000);
        let uncom = Math.floor(Math.random() * 20);
        let dm = Math.floor(Math.random() * 10);
        let exp = Math.floor(Math.random() * 50000);

        let user = global.db.data.users[room.p];
        user.money += money;
        user.uncommon += uncom;
        user.diamond += dm;
        user.exp += exp;
        user.lastlink = new Date * 1;

        resultsMsg += `\n❈──────────────❈\n💵 *Money:* +Rp.${money.toLocaleString()}\n🧪 *Exp:* +${exp.toLocaleString()}\n💎 *Diamond:* +${dm}\n📦 *Uncommon:* +${uncom}`;

        await conn.reply(m.chat, resultsMsg, m, { contextInfo: { mentionedJid: [room.p] } });

        // Menghapus room setelah permainan selesai
    }, 10000);

    setTimeout(async () => {
        let solo = room.p;
        let soloMsg = `*[👩🏻‍⚕️] Hei User*\n@${solo.replace(/@.+/, '')}\nYuu Kita Explore Lagi Tempat Yang Menarik, Jangan Lupa Mabar Sama Partner Yaa, Agar Hasilnya Lebih Besar😉`;
        await conn.reply(m.chat, soloMsg, m, { contextInfo: { mentionedJid: [room.p] } });
    }, 1800000);
    delete conn.create[m.chat]
}

async function startExplore(m, room) {
  room.players.forEach(ipahh => {
    let all = global.db.data.users[ipahh]
    all.lastlink = new Date() * 1
    })
    delete conn.explore[m.chat];
    let startMsg = `*🌏 Menuju Tempat Explore*\n\n👨🏻‍💻 Player:\n`;
    room.players.forEach((player, index) => {
        startMsg += `*${index + 1}.* @${player.replace(/@.+/, '')}\n`;
    });
    startMsg += `\nRoom ID: ${room.id}\nLokasi:\n* ${room.alok}\n* ${room.blok}\n* ${room.clok}\n\n*🛫 Tunggu Beberapa Saat!!.*`;
    await conn.reply(m.chat, startMsg, m, { contextInfo: { mentionedJid: room.players } });

    setTimeout(async () => {
        let resultsMsg = `*🏅 Kalian Sudah Kembali*\n\n👨🏻‍💻 Player:\n`;
        room.players.forEach((player, index) => {
            resultsMsg += `*${index + 1}.* @${player.replace(/@.+/, '')}\n`;
        });
        resultsMsg += `\nRoom ID: ${room.id}\n*🌏 Lokasi Explore:*\n* ${room.alok} ✓\n* ${room.blok} ✓\n* ${room.clok} ✓\n\n*💰 Hasil Yang Di Dapat:*\n`;

        room.players.forEach(player => {
            let money = Math.floor(Math.random() * 5000000);
            let uncom = Math.floor(Math.random() * 20);
            let dm = Math.floor(Math.random() * 10);
            let exp = Math.floor(Math.random() * 40000);

            let user = global.db.data.users[player];
            user.money += money;
            user.uncommon += uncom;
            user.diamond += dm;
            user.exp += exp;
        //    user.lastlink = new Date * 1;

            resultsMsg += `\n❈──────────────❈\n👤 @${player.replace(/@.+/, '')}\n💵 *Money:* +Rp.${money.toLocaleString()}\n🧪 *Exp:* +${exp.toLocaleString()}\n💎 *Diamond:* +${dm}\n📦 *Uncommon:* +${uncom}`;
        });

        await conn.reply(m.chat, resultsMsg, m, { contextInfo: { mentionedJid: room.players } });

        // Menghapus room setelah permainan selesai
       // delete conn.explore[m.chat];
    }, 10000);

    setTimeout(async () => {
        let playerListt = room.players.map((player, index) => `*${index + 1}.* @${player.replace(/@.+/, '')}`).join('\n');
        await conn.reply(m.chat, `*[👩🏻‍⚕️] Hai User*\n${playerListt}\nYuu Waktunya Kita Explore Lagi Tempat Yang Bagus😉`, m, { contextInfo: { mentionedJid: room.players } });
    }, 1800000);
}

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}

handler.tags = ['rpg'];
handler.help = ['explore'];
handler.command = /^(explore)$/i;
handler.group = true;
handler.register = true;

export default handler;