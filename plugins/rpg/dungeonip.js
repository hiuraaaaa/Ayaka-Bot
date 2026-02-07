async function handler(m, { conn, command, isOwner }) {
    conn.dungeon = conn.dungeon || {};
    conn.mabar = conn.mabar || {};
    let room = conn.dungeon[m.chat];
    let ruang = conn.mabar[m.chat];
    let mas = global.db.data.users[m.sender];
    let timing = (new Date() - (mas.lastdungeon * 1));
    if (timing < 1800000) return m.reply(`🙆🏻‍♀️ Beristirahatlah Dulu, Sehingga Kondisimu Pulih, Dan Tunggu Selama ${clockString(1800000 - timing)}`);
    
    if (!room) {
        let aku = `🧶 Kamu Ingin Ingin Bermain Dungeon?, Ayoo Mabar Agar Lebih Seru!\n\n▬▭▬▭▬▭▬▭▬▭▬▭\n`;
        m.reply(`\t⬣─〔 *🔱 DUNGEON SERVER* 〕─⬣\n\n${aku}> *\`Note:\`* Ketik *buat room* jika ingin membuat room`);
        conn.mabar[m.chat] = {
            master: m.sender,
            state: 'tunggu',
            time: setTimeout(() => {
                if (conn.mabar[m.chat]) conn.reply(m.chat, `Dungeon Dibatalkan`, m);
                delete conn.mabar[m.chat];
            }, 200000)
        };
    } else if (!room.players.includes(m.sender)) {
        let playerListh = room.players.map((player, index) => `*${index + 1}.* @${player.replace(/@.+/, '')}`).join('\n');
        let join = `🛋️ Sudah Ada Room Dungeon Yang Di Buat, Silahkan *Join* Untuk Bergabung\n`;
        m.reply(`\t●──🎐 SERVER DUNGEON 🎐──●\n\n${join}> *\`Note:\`* ketik *join dungeon* jika ingin bergabung`);
    } else if (room.players.includes(m.sender)) {
        let playerList = room.players.map((player, index) => `*${index + 1}.* @${player.replace(/@.+/, '')}`).join('\n');
        let sudah = `🎯 Kamu Sudah Berada Di Dalam Room\n*Room ID:* ${room.id}\n*Server:* ${room.nameserver}\n\n*Tag Room Master Dan Segera Memulai Permainan*\n`;
        m.reply(`\t●──🎐 SERVER DUNGEON 🎐────●\n\n${sudah}> *\`Note:\`* Ketik *play dungeon* jika ingin memulai, atau ketik *player* jika ingin melihat player`);
    }
}

function getContentType(message) {
    if (!message || typeof message !== 'object') return null;
    return Object.keys(message)[0];
}

handler.all = async function (m) {
    this.dungeon = this.dungeon || {};
    this.mabar = this.mabar || {};
    let room = this.dungeon[m.chat];
    let ruang = Object.values(this.mabar).find(ruang => ruang.state && [ruang.master].includes(m.sender));
    const contentType = getContentType(m.message);
    if (!contentType) return;


    let selectedButton = m.text.trim();
    if (room) {
        if (selectedButton === 'join dungeon' && !room.players.includes(m.sender)) {
            if (room.players.length < 15) {
                let pjoin = global.db.data.users[m.sender];
                let cdplayer = (new Date() - (pjoin.lastdungeon * 1));
                if (cdplayer < room.cdserver) return m.reply(`👒 Kamu Blum Bisa Join Room, Tunggu Selama ${clockString(room.cdserver - cdplayer)}`);
                if (pjoin.armor < room.armorserver) return m.reply(`🧥 Armor Kamu Belum Cukup Kuat Untuk Bermain Bersama Mereka, Kamu Membutuhkan Armor *${room.armor}*, Tingkatkan Armormu!`);
                if (pjoin.sword < room.swordserver) return m.reply(`🗡️ Swordmu Tidak Akan Mempan Melawan Monster Di Server Ini, Kamu Membutuhkan  Sword *${room.sword}*, Tingkatkan Swordmu!`);
                if (pjoin.armordurability < room.adura) return m.reply(`🛡️ Armor Kamu Sekarat Nih, Repair Yuu\n*Durability:* ${pjoin.armordurability}`);
                if (pjoin.sworddurability < room.sdura) return m.reply(`🗡️ Wahh Swordmu Mau Hancur, Repair Yuu\n*Durability:* ${pjoin.sworddurability}`);
                if (pjoin.healt < room.healtserver) return m.reply(`❤️ Darahmu Kurang Dari *${room.healtserver}*\n*Darah:* ${pjoin.healt}`);
                
                room.players.push(m.sender);
                let playerList = room.players.map((player, index) => `*${index + 1}.* @${player.replace(/@.+/, '')}`).join('\n');
                let berhasil = `✅ Berhasil Join Kedalam Room\n*Room ID:* ${room.id}\n*Server:* ${room.nameserver}\nTunggu Room Master Untuk Memulai Permainan`;
                m.reply(`\t●🏹 *JOINING SERVER* 🏹●\n\n${berhasil}`);
            } else {
                await conn.reply(m.chat, `♻️ Wahh Roomnya Penuh Nih, Tunggu Permainan Selanjutnya Yaa`, m);
            }
        } else if (selectedButton === 'join dungeon' && room.players.includes(m.sender)) {
            let sudah = `🎯 Kamu Sudah Berada Di Dalam Room\n*Room ID:* ${room.id}\n*Server:* ${room.nameserver}\n\n*Tag Room Master Dan Segera Memulai Permainan*`;
            m.reply(`\t●──🎐 SERVER DUNGEON 🎐──●\n\n${sudah}`);
        } else if (selectedButton === 'play dungeon' && m.sender === room.p) {
            if (room.players.length <= 1) {
                let belum = `[❕] Minimal 1 Pemain Yang Join Ke Dalam Room`;
                m.reply(`\t●────🎐 SERVER DUNGEON 🎐────●\n\n${belum}> *\`Note:\`* Ketik *dewekan* jika mau bermain solo`);
            } else if (room.nameserver == 'easy') {
                await easyDungeon(m, room);
            } else if (room.nameserver == 'medium') {
                await mediumDungeon(m, room);
            } else if (room.nameserver == 'hard') {
                await hardDungeon(m, room);
            } else if (room.nameserver == 'extreme') {
                await extremeDungeon(m, room);
            } else if (room.nameserver == 'impossible') {
                await impossibleDungeon(m, room);
            }
        } else if (selectedButton === 'dewekan' && m.sender === room.p) {
            if (room.players.length >= 2) {
                let sudah = `[❗] Sudah Ada Pemain Yang Bergabung Kedalam Room, Tidak Bisa Bermain Sendiri, Silahkan Mulai Permainan`;
                m.reply(`\t●──🎐 SERVER DUNGEON 🎐──●\n\n${sudah}> *\`Note:\`* Ketik *play dungeon* jika mau memulai`);
            } else if (room.nameserver == 'easy') {
                await easyDungeon(m, room);
            } else if (room.nameserver == 'medium') {
                await mediumDungeon(m, room);
            } else if (room.nameserver == 'hard') {
                await hardDungeon(m, room);
            } else if (room.nameserver == 'extreme') {
                await extremeDungeon(m, room);
            } else if (room.nameserver == 'impossible') {
                await impossibleDungeon(m, room);
            }
        } else if (selectedButton === 'batall' && m.sender === room.p) {
            if (room.players.length >= 2) return conn.reply(m.chat, `[❗] Gagal Membatalkan Permainan, Karna Sudah Ada Pemain Yang Bergabung Kedalam Room, Silahkan *Start* Untuk Memulai Permainan`, m);
            let batalMsg = `Sukses Membatalkan Permainan`;
            await conn.reply(m.chat, batalMsg, m, { contextInfo: { mentionedJid: [room.p] } });
            delete conn.dungeon[m.chat];
        } else if (selectedButton === 'player' && room.players.includes(m.sender)) {
            let playerList = this.dungeon[m.chat].players.map((player, index) => `*${index + 1}.* @${player.replace(/@.+/, '')}`).join('\n');
            await conn.reply(m.chat, `[🗡️] *Dungeon Players*\n👨🏻‍💻 Player:\n* ${playerList}\n▬▭▬▭▬▭▬▭`, m, { contextInfo: { mentionedJid: this.dungeon[m.chat].players } });
        }
    } else if (selectedButton === 'buat room' && ruang && ruang.state == 'tunggu' && m.sender === ruang.master) {
        let pilihServer = `*⚠️ Pilih Sever Terlebih dahulu*\n\`➵ Pilihlah Sesuai Level EquipmentMu\``;
        m.reply(`\t●──🎗️ *DUNGEON SERVER* 🎗️──●\n\n${pilihServer}\n- 💥 𝐄𝐚𝐬𝐲\n- 👻 𝐌𝐞𝐝𝐢𝐮𝐦\n- 👿 𝐇𝐚𝐫𝐝\n- 💀 𝐄𝐱𝐭𝐫𝐞𝐦𝐞\n- ☠️ 𝐈𝐦𝐩𝐨𝐬𝐬𝐢𝐛𝐥𝐞\n\n> *\`Note:\`* Ketik *.easy, .medium, .hard, .extreme, .impossible* Jika ingin memulai (sertakan . disetiap awail kesulitan)`);
        ruang.state = 'pilihserver';
    } else if (ruang && m.sender === ruang.master && selectedButton === 'batall') {
        let batalMsg = `Sukses Membatalkan Permainan`;
        await conn.reply(m.chat, batalMsg, m);
        delete conn.mabar[m.chat];
    }
};

handler.tags = ['rpg'];
handler.help = ['dungeon'];
handler.command = /^(dungeonip)$/i;
handler.group = true;
handler.owner = false;

async function easyDungeon(m, room) {
    room.players.forEach(player => {
    let allUser = global.db.data.users[player]
    allUser.lastdungeon = new Date() * 1
    })
    let startMsg = `*⚔️ DUNGEON PLAYING*\n\n🤵🏻Players:\n`;
    room.players.forEach((player, index) => {
        startMsg += `*${index + 1}.* @${player.replace(/@.+/, '')}\n`;
    });
    startMsg += `\nRoom ID: ${room.id}\n*Server:* ${room.nameserver}\n\n*🛩️ Tunggu Beberapa Saat!!.*`;
    await conn.reply(m.chat, startMsg, m, { contextInfo: { mentionedJid: room.players } });

    delete conn.dungeon[m.chat];
    setTimeout(async () => {
        let resultsMsg = `*📢 Kalian Telah Kembali*\n\n👨🏻‍💻 Player:\n`;
        room.players.forEach((player, index) => {
            resultsMsg += `*${index + 1}.* @${player.replace(/@.+/, '')}\n`;
        });
        resultsMsg += `\nRoom ID: ${room.id}\n*🎉 Kalian Berhasil Membunuh Monster*\n😈 Monster Name: ${room.monster}\n\n*⚔️ Hasil Dungeon:*\n`;

        room.players.forEach(player => {
        let user = global.db.data.users[player];
            let boxs = Math.floor(Math.random() * 30);
            let uncom = Math.floor(Math.random() * 24);
            let potion = Math.floor(Math.random() * 40);
            let string = Math.floor(Math.random() * 48);
            let money = Math.floor(Math.random() * 4000000);
            let exp = Math.floor(Math.random() * 70000);
            let adura = Math.floor(Math.random() * room.adura);
            let sdura = Math.floor(Math.random() * room.sdura);
            let healt = Math.floor(Math.random() * room.healtserver);
            let damage = Math.floor(Math.random() * user.sworddamage);

            
            user.money += money;
            user.boxs += boxs;
            user.string += string;
            user.potion += potion;
            user.uncommon += uncom;
            user.exp += exp;
            user.armordurability -= adura;
            user.sworddurability -= sdura;
            user.healt -= healt;
            user.resultdamage += damage * 10;
           // user.lastdungeon = new Date * 1;

            resultsMsg += `\n[✠]▬▭▬▭▬▭▬▭▬▭[✠]\n👤 @${player.replace(/@.+/, '')}\n💵 *Money:* +Rp.${money.toLocaleString()}\n🧪 *Exp:* +${exp.toLocaleString()}\n📦 *Boxs:* ${boxs}\n🕸️ *String:* ${string}\n🥤 *Potion:* ${potion}\n📦 *Uncommon:* +${uncom}\n💥 *Damage Di Berikan:* ${damage.toLocaleString()}\n\n*❤️ Healt:* -${healt}\n*🧥 Durability Armor:* -${adura}\n*🗡️ Durability Sword:* -${sdura}`;
        });

        await conn.reply(m.chat, resultsMsg, m, { contextInfo: { mentionedJid: room.players } });

        // Menghapus room setelah permainan selesai
    }, 10000);

    setTimeout(async () => {
        let playerListt = room.players.map((player, index) => `*${index + 1}.* @${player.replace(/@.+/, '')}`).join('\n');
        await conn.reply(m.chat, `*[⚔️] Hai User*\n${playerListt}\nAyo Kita Kalahkan Monster Dan Dapatkan Hadiah!`, m, { contextInfo: { mentionedJid: room.players } });
    }, 1800000);
}

async function mediumDungeon(m, room) {
    room.players.forEach(player => {
    let allUser = global.db.data.users[player]
    allUser.lastdungeon = new Date() * 1
    })
    let startMsg = `*⚔️ DUNGEON PLAYING*\n\n🤵🏻Players:\n`;
    room.players.forEach((player, index) => {
        startMsg += `*${index + 1}.* @${player.replace(/@.+/, '')}\n`;
    });
    startMsg += `\nRoom ID: ${room.id}\n*Server:* ${room.nameserver}\n\n*🛩️ Tunggu Beberapa Saat!!.*`;
    await conn.reply(m.chat, startMsg, m, { contextInfo: { mentionedJid: room.players } });

    delete conn.dungeon[m.chat];
    setTimeout(async () => {
        let resultsMsg = `*📢 Kalian Telah Kembali*\n\n👨🏻‍💻 Player:\n`;
        room.players.forEach((player, index) => {
            resultsMsg += `*${index + 1}.* @${player.replace(/@.+/, '')}\n`;
        });
        resultsMsg += `\nRoom ID: ${room.id}\n*🎉 Kalian Berhasil Membunuh Monster*\n😈 Monster Name: ${room.monster}\n\n*🎁 Hasil Yang Di Dapat:*\n`;

        room.players.forEach(player => {
        let user = global.db.data.users[player];
            let boxs = Math.floor(Math.random() * 30 * 2);
            let uncom = Math.floor(Math.random() * 24);
            let potion = Math.floor(Math.random() * 40 * 2);
            let string = Math.floor(Math.random() * 48 * 2);
            let iron = Math.floor(Math.random() * 30);
            let money = Math.floor(Math.random() * 300000 * 3);
            let exp = Math.floor(Math.random() * 70000 * 2);
            let adura = Math.floor(Math.random() * room.adura);
            let sdura = Math.floor(Math.random() * room.sdura);
            let healt = Math.floor(Math.random() * room.healtserver);
            let damage = Math.floor(Math.random() * user.sworddamage * 13);

            
            user.money += money;
            user.boxs += boxs;
            user.string += string;
            user.potion += potion;
            user.uncommon += uncom;
            user.exp += exp;
            user.iron += iron;
            user.armordurability -= adura;
            user.sworddurability -= sdura;
            user.healt -= healt;
            user.resultdamage += damage;
           // user.lastdungeon = new Date * 1;

            resultsMsg += `\n❈──────────────❈\n👤 @${player.replace(/@.+/, '')}\n💵 *Money:* +Rp.${money.toLocaleString()}\n🧪 *Exp:* +${exp.toLocaleString()}\n📦 *Boxs:* ${boxs}\n🕸️ *String:* ${string}\n🥤 *Potion:* ${potion}\n📦 *Uncommon:* +${uncom}\n⚙️ *Iron:* ${iron}\n💥 *Damage Di Berikan:* ${damage.toLocaleString()}\n\n*❤️ Healt:* -${healt}\n*🧥 Durability Armor:* -${adura}\n*🗡️ Durability Sword:* -${sdura}`;
        });

        await conn.reply(m.chat, resultsMsg, m, { contextInfo: { mentionedJid: room.players } });

        // Menghapus room setelah permainan selesai
    }, 10000);

    setTimeout(async () => {
        let playerListt = room.players.map((player, index) => `*${index + 1}.* @${player.replace(/@.+/, '')}`).join('\n');
        await conn.reply(m.chat, `*[⚔️] Hai User*\n${playerListt}\nAyo Kita Kalahkan Monster Dan Dapatkan Hadiah!`, m, { contextInfo: { mentionedJid: room.players } });
    }, 1800000);
}

async function hardDungeon(m, room) {
    room.players.forEach(player => {
    let allUser = global.db.data.users[player]
    allUser.lastdungeon = new Date() * 1
    })
    let startMsg = `*⚔️ DUNGEON PLAYING*\n\n🤵🏻Players:\n`;
    room.players.forEach((player, index) => {
        startMsg += `*${index + 1}.* @${player.replace(/@.+/, '')}\n`;
    });
    startMsg += `\nRoom ID: ${room.id}\n*Server:* ${room.nameserver}\n\n*🛩️ Tunggu Beberapa Saat!!.*`;
    await conn.reply(m.chat, startMsg, m, { contextInfo: { mentionedJid: room.players } });

    delete conn.dungeon[m.chat];
    setTimeout(async () => {
        let resultsMsg = `*📢 Kalian Telah Kembali*\n\n👨🏻‍💻 Player:\n`;
        room.players.forEach((player, index) => {
            resultsMsg += `*${index + 1}.* @${player.replace(/@.+/, '')}\n`;
        });
        resultsMsg += `\nRoom ID: ${room.id}\n*🎉 Kalian Berhasil Membunuh Monster*\n😈 Monster Name: ${room.monster}\n\n*⚔️ Hasil Dungeon:*\n`;

        room.players.forEach(player => {
        let user = global.db.data.users[player];
            let boxs = Math.floor(Math.random() * 30 * 3);
            let uncom = Math.floor(Math.random() * 24 * 3);
            let potion = Math.floor(Math.random() * 40 * 3);
            let string = Math.floor(Math.random() * 48);
            let iron = Math.floor(Math.random() * 30 * 2);
            let emas = Math.floor(Math.random() * 30);
            let money = Math.floor(Math.random() * 5000000 * 4);
            let exp = Math.floor(Math.random() * 70000 * 3);
            let adura = Math.floor(Math.random() * room.adura);
            let sdura = Math.floor(Math.random() * room.sdura);
            let pet = Math.floor(Math.random() * 23);
            let healt = Math.floor(Math.random() * room.healtserver);
            let damage = Math.floor(Math.random() * user.sworddamage * 16);

            
            user.money += money;
            user.boxs += boxs;
            user.string += string;
            user.potion += potion;
            user.uncommon += uncom;
            user.exp += exp;
            user.iron += iron;
            user.armordurability -= adura;
            user.sworddurability -= sdura;
            user.pet += pet;
            user.healt -= healt;
            user.emas += emas;
            user.resultdamage += damage;
           // user.lastdungeon = new Date * 1;

            resultsMsg += `\n[✠]▬▭▬▭▬▭▬▭▬▭[✠]\n👤 @${player.replace(/@.+/, '')}\n💵 *Money:* +Rp.${money.toLocaleString()}\n🧪 *Exp:* +${exp.toLocaleString()}\n📦 *Boxs:* ${boxs}\n🕸️ *String:* ${string}\n🥤 *Potion:* ${potion}\n📦 *Uncommon:* +${uncom}\n⚙️ *Iron:* ${iron}\n🪙 *Emas:* ${emas}\n📦 *Pets:* ${pet}\n💥 *Damage Di Berikan:* ${damage.toLocaleString()}\n\n*❤️ Healt:* -${healt}\n*🧥 Durability Armor:* -${adura}\n*🗡️ Durability Sword:* -${sdura}`;
        });

        await conn.reply(m.chat, resultsMsg, m, { contextInfo: { mentionedJid: room.players } });

        // Menghapus room setelah permainan selesai
    }, 10000);

    setTimeout(async () => {
        let playerListt = room.players.map((player, index) => `*${index + 1}.* @${player.replace(/@.+/, '')}`).join('\n');
        await conn.reply(m.chat, `*[⚔️] Hai User*\n${playerListt}\nAyo Kita Kalahkan Monster Dan Dapatkan Hadiah!`, m, { contextInfo: { mentionedJid: room.players } });
    }, 1800000);
}

async function extremeDungeon(m, room) {
    room.players.forEach(player => {
    let allUser = global.db.data.users[player]
    allUser.lastdungeon = new Date() * 1
    })
    let startMsg = `*⚔️ DUNGEON PLAYING*\n\n🤵🏻Players:\n`;
    room.players.forEach((player, index) => {
        startMsg += `*${index + 1}.* @${player.replace(/@.+/, '')}\n`;
    });
    startMsg += `\nRoom ID: ${room.id}\n*Server:* ${room.nameserver}\n\n*🛩️ Tunggu Beberapa Saat!!.*`;
    await conn.reply(m.chat, startMsg, m, { contextInfo: { mentionedJid: room.players } });

    delete conn.dungeon[m.chat];
    setTimeout(async () => {
        let resultsMsg = `*📢 Kalian Telah Kembali*\n\n👨🏻‍💻 Player:\n`;
        room.players.forEach((player, index) => {
            resultsMsg += `*${index + 1}.* @${player.replace(/@.+/, '')}\n`;
        });
        resultsMsg += `\nRoom ID: ${room.id}\n*🎉 Kalian Berhasil Membunuh Monster*\n😈 Monster Name: ${room.monster}\n\n*⚔️ Hasil Dungeon:*\n`;

        room.players.forEach(player => {
        let user = global.db.data.users[player];
            let boxs = Math.floor(Math.random() * 30 * 8);
            let mythic = Math.floor(Math.random() * 30);
            let legendary = Math.floor(Math.random() * 25);
            let diamond = Math.floor(Math.random() * 83);
            let uncom = Math.floor(Math.random() * 24 * 8);
            let potion = Math.floor(Math.random() * 40 * 7);
            let string = Math.floor(Math.random() * 48 * 9);
            let iron = Math.floor(Math.random() * 30 * 4);
            let emas = Math.floor(Math.random() * 30 * 2);
            let money = Math.floor(Math.random() * 50000000 * 2)
            let exp = Math.floor(Math.random() * 200000 * 6);
            let adura = Math.floor(Math.random() * room.adura);
            let pet = Math.floor(Math.random() * 48 * 2);
            let sdura = Math.floor(Math.random() * room.sdura);
            let healt = Math.floor(Math.random() * room.healtserver);
            let damage = Math.floor(Math.random() * user.sworddamage * 30);

            
            user.money += money;
            user.boxs += boxs;
            user.string += string;
            user.potion += potion;
            user.uncommon += uncom;
            user.exp += exp;
            user.iron += iron;
            user.emas += emas;
            user.mythic += mythic;
            user.legendary += legendary;
            user.diamond += diamond;
            user.armordurability -= adura;
            user.sworddurability -= sdura;
            user.healt -= healt;
            user.pet += pet;
            user.resultdamage += damage;
            // user.lastdungeon = new Date * 1;

            resultsMsg += `\n[✠]▬▭▬▭▬▭▬▭▬▭[✠]\n👤 @${player.replace(/@.+/, '')}\n💵 *Money:* +Rp.${money.toLocaleString()}\n🧪 *Exp:* +${exp.toLocaleString()}\n📦 *Boxs:* ${boxs}\n🕸️ *String:* ${string}\n🥤 *Potion:* ${potion}\n📦 *Uncommon:* +${uncom}\n⚙️ *Iron:* ${iron}\n🪙 *Emas:* ${emas}\n💍 *Mythic:* ${mythic}\n💎 *Legendary:* ${legendary}\n💎 *Diamond:* ${diamond}\n📦 *Pets:* ${pet}\n💥 *Damage Di Berikan:* ${damage.toLocaleString()}\n\n*❤️ Healt:* -${healt}\n*🧥 Durability Armor:* -${adura}\n*🗡️ Durability Sword:* -${sdura}`;
        });

        await conn.reply(m.chat, resultsMsg, m, { contextInfo: { mentionedJid: room.players } });

        // Menghapus room setelah permainan selesai
    }, 10000);

    setTimeout(async () => {
        let playerListt = room.players.map((player, index) => `*${index + 1}.* @${player.replace(/@.+/, '')}`).join('\n');
        await conn.reply(m.chat, `*[⚔️] Hai User*\n${playerListt}\nAyo Kita Kalahkan Monster Dan Dapatkan Hadiah!`, m, { contextInfo: { mentionedJid: room.players } });
    }, 1800000);
}

async function impossibleDungeon(m, room) {
    room.players.forEach(player => {
    let allUser = global.db.data.users[player]
    allUser.lastdungeon = new Date() * 1
    })
    let startMsg = `*⚔️ DUNGEON PLAYING*\n\n🤵🏻Players:\n`;
    room.players.forEach((player, index) => {
        startMsg += `*${index + 1}.* @${player.replace(/@.+/, '')}\n`;
    });
    startMsg += `\nRoom ID: ${room.id}\n*Server:* ${room.nameserver}\n\n*🛩️ Tunggu Beberapa Saat!!.*`;
    await conn.reply(m.chat, startMsg, m, { contextInfo: { mentionedJid: room.players } });

    delete conn.dungeon[m.chat];
    setTimeout(async () => {
        let resultsMsg = `*📢 Kalian Telah Kembali*\n\n👨🏻‍💻 Player:\n`;
        room.players.forEach((player, index) => {
            resultsMsg += `*${index + 1}.* @${player.replace(/@.+/, '')}\n`;
        });
        resultsMsg += `\nRoom ID: ${room.id}\n*🎉 Kalian Berhasil Membunuh Monster*\n😈 Monster Name: ${room.monster}\n\n*⚔️ Hasil Dungeon:*\n`;

        room.players.forEach(player => {
        let user = global.db.data.users[player];
            let boxs = Math.floor(Math.random() * 300);
            let mythic = Math.floor(Math.random() * 100);
            let legendary = Math.floor(Math.random() * 300);
            let diamond = Math.floor(Math.random() * 120);
            let uncom = Math.floor(Math.random() * 239);
            let potion = Math.floor(Math.random() * 50);
            let string = Math.floor(Math.random() * 120);
            let iron = Math.floor(Math.random() * 130);
            let emas = Math.floor(Math.random() * 100);
            let money = Math.floor(Math.random() * 80000000 * 2);
            let exp = Math.floor(Math.random() * 350000)
            let adura = Math.floor(Math.random() * room.adura);
            let sdura = Math.floor(Math.random() * room.sdura);
            let healt = Math.floor(Math.random() * room.healtserver);
            let pet = Math.floor(Math.random() * 63 * 6);
            let damage = Math.floor(Math.random() * user.sworddamage * 40);

            
            user.money += money;
            user.boxs += boxs;
            user.string += string ;
            user.potion += potion;
            user.uncommon += uncom;
            user.exp += exp;
            user.iron += iron;
            user.emas += emas;
            user.mythic += mythic;
            user.legendary += legendary;
            user.diamond += diamond;
            user.armordurability -= adura;
            user.sworddurability -= sdura;
            user.healt -= healt;
            user.resultdamage += damage;
            user.pet += pet;
           // user.lastdungeon = new Date * 1;

            resultsMsg += `\n[✠]▬▭▬▭▬▭▬▭▬▭[✠]\n👤 @${player.replace(/@.+/, '')}\n💵 *Money:* +Rp.${money.toLocaleString()}\n🧪 *Exp:* +${exp.toLocaleString()}\n📦 *Boxs:* ${boxs}\n🕸️ *String:* ${string}\n🥤 *Potion:* ${potion}\n📦 *Uncommon:* +${uncom}\n⚙️ *Iron:* ${iron}\n🪙 *Emas:* ${emas}\n💍 *Mythic:* ${mythic}\n💎 *Legendary:* ${legendary}\n💎 *Diamond:* ${diamond}\n📦 *Pets:* ${pet}\n💥 *Damage Di Berikan:* ${damage.toLocaleString()}\n\n*❤️ Healt:* -${healt}\n*🧥 Durability Armor:* -${adura}\n*🗡️ Durability Sword:* -${sdura}`;
        });

        await conn.reply(m.chat, resultsMsg, m, { contextInfo: { mentionedJid: room.players } });

        // Menghapus room setelah permainan selesai
    }, 10000);

    setTimeout(async () => {
        let playerListt = room.players.map((player, index) => `*${index + 1}.* @${player.replace(/@.+/, '')}`).join('\n');
        await conn.reply(m.chat, `*[⚔️] Hai User*\n${playerListt}\nAyo Kita Kalahkan Monster Dan Dapatkan Hadiah!`, m, { contextInfo: { mentionedJid: room.players } });
    }, 1800000);
}

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}
function clockString(ms) {
  let h = isNaN(ms) ? '60' : Math.floor(ms / 3600000) % 60
  let m = isNaN(ms) ? '60' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '60' : Math.floor(ms / 1000) % 60
  return [h, m, s,].map(v => v.toString().padStart(2, 0) ).join(':')
}

export default handler;