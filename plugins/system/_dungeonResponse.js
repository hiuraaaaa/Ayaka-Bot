const { proto, generateWAMessageFromContent, generateWAMessage, prepareWAMessageMedia } = (await import('@adiwajshing/baileys')).default;

let handler = async(m, { conn, text, command }) => {
   let ruang = conn.mabar[m.chat]
   conn.dungeon = conn.dungeon || {}
   let room = conn.dungeon[m.chat]
   
   if (ruang && ruang.state == 'pilihserver') {
     if (command === 'easy' && m.sender === ruang.master) {
         let play = global.db.data.users[ruang.master]
         if (play.healt < 190) return m.reply(`❕Darah Kamu Kurang Dari *❤️ 190*`)
         if (play.armor < 1) return m.reply(`🧥 Kamu Tidak Memiliki Armor!`)
         if (play.sword < 1) return m.reply(`🗡️ Kamu Tidak Memiliki Sword!`)
         if (play.armordurability < 90) return m.reply(`🛡️🧥 Durability Armor Kamu Kurang Dari *90*`)
         if (play.sworddurability < 90) return m.reply(`🛡️🗡️ Durability Sword Kamu Kurang Dari *90*`)
         let monsterLevel1 = pickRandom(['Goblin', 'Giant Rat', 'Skeleton', 'Zombie', 'Slime', 'Bat', 'Kobold', 'Giant Spider', 'Wolf', 'Bandit']);
         conn.dungeon[m.chat] = {
             id: Math.floor(Math.random() * 100000000).toString(),
             p: m.sender,
             players: [m.sender],
             nameserver: 'easy',
             armor: 'Leather Armor',
             seord: 'Rusty Sword',
             cdserver: 1800000,
             armorserver: 1,
             swordserver: 1,
             adura: 50,
             sdura: 50,
             monster: monsterLevel1,
             healtserver: 190,
             hapus: delete conn.mabar[m.chat],
             status: 'wait',
         };
         room = conn.dungeon[m.chat];
         let playerList = room.players.map((player, index) => `*${index + 1}.* @${player.replace(/@.+/, '')}`).join('\n');
         let buatRoom = `🔱 Berhasil Membuat Room\n*Room ID:* ${room.id}\n*Server:* Easy\n\n♻️ Menunggu Pemain Lain Untuk Join Kedalam Room`;
         let msg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
        message: {
            messageContextInfo: {
                deviceListMetadata: {},
                deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
                body: proto.Message.InteractiveMessage.Body.create({
                    text: buatRoom,
                }),
                footer: proto.Message.InteractiveMessage.Footer.create({
                    text: "*© Lann4you!*"
                }),
                header: proto.Message.InteractiveMessage.Header.create({
                    title: "\t🏅 *DUNGEON ROOM* 🏅\n",
                    subtitle: "",
                    hasMediaAttachment: false
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                    buttons: [
                        {
                            name: "quick_reply",
                            buttonParamsJson: "{\"display_text\":\"♻️ Join\",\"id\":\"join dungeon\"}"
                        },
                        {
                            name: "quick_reply",
                            buttonParamsJson: "{\"display_text\":\"👤 Solo\",\"id\":\"dewekan\"}"
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
     } else if (command === 'medium' && m.sender === ruang.master) {
         let play = global.db.data.users[ruang.master]
         if (play.armor < 3) return m.reply(`🧥 Kamu Memerlukan Armor Tingkat *Studded Leather Armor*, Agar Bisa Bermain Di Server Ini!`)
         if (play.sword < 4) return m.reply(`🗡️ Kamu Memerlukan Sword Tingkat *Bronze Sword*, Agar Bisa Bermain Di Server Ini!`)
         if (play.armordurability < 350) return m.reply(`🛡️🧥 Durability Armor Kamu Kurang Dari *350*`)
         if (play.sworddurability < 650) return m.reply(`🛡️🗡️ Durability Sword Kamu Kurang Dari *650*`)
         if (play.healt < 450) return m.reply(`❕Darah Kamu Kurang Dari *❤️ 490*`)
         let monsterLevel2 = pickRandom(['Orc', 'Hobgoblin', 'Wraith', 'Ghoul', 'Giant Centipede', 'Dire Wolf', 'Bugbear', 'Shadow', 'Otyugh', 'Harpy']);
         conn.dungeon[m.chat] = {
             id: Math.floor(Math.random() * 100000000).toString(),
             p: m.sender,
             players: [m.sender],
             nameserver: 'medium',
             armor: 'Studded Leather Armor',
             sword: 'Bronze Sword',
             cdserver: 1800000,
             armorserver: 3,
             swordserver: 4,
             adura: 350,
             sdura: 650,
             monster: monsterLevel2,
             healtserver: 450,
             hapus: delete conn.mabar[m.chat],
             status: 'wait',
         };
         room = conn.dungeon[m.chat];
         let playerList = room.players.map((player, index) => `*${index + 1}.* @${player.replace(/@.+/, '')}`).join('\n');
         let buatRoom = `🔱 Berhasil Membuat Room\n*Room ID:* ${room.id}\n*Server:* Medium\n\n♻️ Menunggu Pemain Lain Untuk Join Kedalam Room`;
         let msg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
        message: {
            messageContextInfo: {
                deviceListMetadata: {},
                deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
                body: proto.Message.InteractiveMessage.Body.create({
                    text: buatRoom,
                }),
                footer: proto.Message.InteractiveMessage.Footer.create({
                    text: "*© Lann4you!*"
                }),
                header: proto.Message.InteractiveMessage.Header.create({
                    title: "\t🏅 *DUNGEON ROOM* 🏅\n",
                    subtitle: "",
                    hasMediaAttachment: false
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                    buttons: [
                        {
                            name: "quick_reply",
                            buttonParamsJson: "{\"display_text\":\"♻️ Join\",\"id\":\"join dungeon\"}"
                        },
                        {
                            name: "quick_reply",
                            buttonParamsJson: "{\"display_text\":\"👤 Solo\",\"id\":\"dewekan\"}"
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
     } else if (command === 'hard' && m.sender === ruang.master) {
         let play = global.db.data.users[ruang.master]
         if (play.armor < 7) return m.reply(`🧥 Kamu Memerlukan Armor Tingkat *Half Plate Armor*, Agar Bisa Bermain Di Server Ini!`)
         if (play.sword < 8) return m.reply(`🗡️ Kamu Memerlukan Sword Tingkat *LongSword*, Agar Bisa Bermain Di Server Ini!`)
         if (play.armordurability < 2150) return m.reply(`🛡️🧥 Durability Armor Kamu Kurang Dari *2150*`)
         if (play.sworddurability < 2850) return m.reply(`🛡️🗡️ Durability Sword Kamu Kurang Dari *2850*`)
         if (play.healt < 2250) return m.reply(`❕Darah Kamu Kurang Dari *❤️ 2250*`)
         let monsterLevel3 = pickRandom(['Troll', 'Manticore', 'Wyvern', 'Wight', 'Ettin', 'Basilisk', 'Minotaur', 'Succubus', 'Chimera', 'Banshee']);
         conn.dungeon[m.chat] = {
             id: Math.floor(Math.random() * 100000000).toString(),
             p: m.sender,
             players: [m.sender],
             nameserver: 'hard',
             armor: 'Half Plate Armor',
             sword: 'Dwarven Sword',
             cdserver: 1800000,
             armorserver: 7,
             swordserver: 8,
             adura: 2150,
             sdura: 2850,
             monster: monsterLevel3,
             healtserver: 2250,
             hapus: delete conn.mabar[m.chat],
             status: 'wait',
         };
         room = conn.dungeon[m.chat];
         let playerList = room.players.map((player, index) => `*${index + 1}.* @${player.replace(/@.+/, '')}`).join('\n');
         let buatRoom = `🔱 Berhasil Membuat Room\n*Room ID:* ${room.id}\n*Server:* Hard\n\n♻️ Menunggu Pemain Lain Untuk Join Kedalam Room`;
         let msg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
        message: {
            messageContextInfo: {
                deviceListMetadata: {},
                deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
                body: proto.Message.InteractiveMessage.Body.create({
                    text: buatRoom,
                }),
                footer: proto.Message.InteractiveMessage.Footer.create({
                    text: "*© Lann4you!*"
                }),
                header: proto.Message.InteractiveMessage.Header.create({
                    title: "\t🏅 *DUNGEON ROOM* 🏅\n",
                    subtitle: "",
                    hasMediaAttachment: false
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                    buttons: [
                        {
                            name: "quick_reply",
                            buttonParamsJson: "{\"display_text\":\"♻️ Join\",\"id\":\"join dungeon\"}"
                        },
                        {
                            name: "quick_reply",
                            buttonParamsJson: "{\"display_text\":\"👤 Solo\",\"id\":\"dewekan\"}"
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
     } else if (command === 'extreme' && m.sender === ruang.master) {
     let play = global.db.data.users[ruang.master]
         if (play.armor < 15) return m.reply(`🧥 Kamu Memerlukan Armor Tingkat *Ethereal Armor*, Agar Bisa Bermain Di Server Ini!`)
         if (play.sword < 17) return m.reply(`🗡️ Kamu Memerlukan Sword Tingkat *Lightbringer*, Agar Bisa Bermain Di Server Ini!`)
         if (play.armordurability < 10550) return m.reply(`🛡️🧥 Durability Armor Kamu Kurang Dari *10550*`)
         if (play.sworddurability < 13650) return m.reply(`🛡️🗡️ Durability Sword Kamu Kurang Dari *13650*`)
         if (play.healt < 10650) return m.reply(`❕Darah Kamu Kurang Dari *❤️ 10650*`)
         let monsterLevel4 = pickRandom(['Lich', 'Hydra', 'Beholder', 'Fire Giant', 'Frost Giant', 'Black Dragon', 'Mind Flayer', 'Vampire', 'Stone Golem', 'Medusa']);
         conn.dungeon[m.chat] = {
             id: Math.floor(Math.random() * 100000000).toString(),
             p: m.sender,
             players: [m.sender],
             nameserver: 'extreme',
             armor: 'Ethereal Armor',
             sword: 'Lightbringer',
             cdserver: 1800000,
             armorserver: 15,
             swordserver: 17,
             adura: 10550,
             sdura: 13650,
             monster: monsterLevel4,
             healtserver: 10650,
             hapus: delete conn.mabar[m.chat],
             status: 'wait',
         };
         room = conn.dungeon[m.chat];
         let playerList = room.players.map((player, index) => `*${index + 1}.* @${player.replace(/@.+/, '')}`).join('\n');
         let buatRoom = `🔱 Berhasil Membuat Room\n*Room ID:* ${room.id}\n*Server:* Extreme\n\n♻️ Menunggu Pemain Lain Untuk Join Kedalam Room`;
         let msg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
        message: {
            messageContextInfo: {
                deviceListMetadata: {},
                deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
                body: proto.Message.InteractiveMessage.Body.create({
                    text: buatRoom,
                }),
                footer: proto.Message.InteractiveMessage.Footer.create({
                    text: "*© Lann4you!*"
                }),
                header: proto.Message.InteractiveMessage.Header.create({
                    title: "\t🏅 *DUNGEON ROOM* 🏅\n",
                    subtitle: "",
                    hasMediaAttachment: false
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                    buttons: [
                        {
                            name: "quick_reply",
                            buttonParamsJson: "{\"display_text\":\"♻️ Join\",\"id\":\"join dungeon\"}"
                        },
                        {
                            name: "quick_reply",
                            buttonParamsJson: "{\"display_text\":\"👤 Solo\",\"id\":\"dewekan\"}"
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
     } else if (command === 'impossible' && m.sender === ruang.master) {
         let play = global.db.data.users[ruang.master]
         if (play.armor < 20) return m.reply(`🧥 Kamu Memerlukan Armor Tingkat *Godslayer Armor*, Agar Bisa Bermain Di Server Ini!`)
         if (play.sword < 25) return m.reply(`🗡️ Kamu Memerlukan Sword Tingkat *Legendary Sword*, Agar Bisa Bermain Di Server Ini!`)
         if (play.armordurability < 19050) return m.reply(`🛡️🧥 Durability Armor Kamu Kurang Dari *19050*`)
         if (play.sworddurability < 30050) return m.reply(`🛡️🗡️ Durability Sword Kamu Kurang Dari *30050*`)
         if (play.healt < 19150) return m.reply(`❕Darah Kamu Kurang Dari *❤️ 19150*`)
         let monsterLevel5 = pickRandom(['Ancient Red Dragon', 'Demogorgon', 'Tarrasque', 'Balor', 'Kraken', 'Pit Fiend', 'Ancient Gold Dragon', 'Lich King', 'Elder Brain', 'Great Wyrm']);
         conn.dungeon[m.chat] = {
             id: Math.floor(Math.random() * 100000000).toString(),
             p: m.sender,
             players: [m.sender],
             nameserver: 'impossible',
             armor: 'GodSlayer Armor',
             sword: 'Legendary Sword',
             cdserver: 1800000,
             armorserver: 20,
             swordserver: 25,
             adura: 19050,
             sdura: 30050,
             monster: monsterLevel5,
             healtserver: 19150,
             hapus: delete conn.mabar[m.chat],
             status: 'wait',
         };
         room = conn.dungeon[m.chat];
         let playerList = room.players.map((player, index) => `*${index + 1}.* @${player.replace(/@.+/, '')}`).join('\n');
         let buatRoom = `🔱 Berhasil Membuat Room\n*Room ID:* ${room.id}\n*Server:* Impossible\n\n♻️ Menunggu Pemain Lain Untuk Join Kedalam Room`;
         let msg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
        message: {
            messageContextInfo: {
                deviceListMetadata: {},
                deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
                body: proto.Message.InteractiveMessage.Body.create({
                    text: buatRoom,
                }),
                footer: proto.Message.InteractiveMessage.Footer.create({
                    text: "*© Lann4you!*"
                }),
                header: proto.Message.InteractiveMessage.Header.create({
                    title: "\t🏅 *DUNGEON ROOM* 🏅\n",
                    subtitle: "",
                    hasMediaAttachment: false
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                    buttons: [
                        {
                            name: "quick_reply",
                            buttonParamsJson: "{\"display_text\":\"♻️ Join\",\"id\":\"join dungeon\"}"
                        },
                        {
                            name: "quick_reply",
                            buttonParamsJson: "{\"display_text\":\"👤 Solo\",\"id\":\"dewekan\"}"
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
     }
   }
}

handler.command = /^(easy|medium|hard|extreme|impossible)/i

export default handler 


function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}