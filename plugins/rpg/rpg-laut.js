import { randomInt } from 'crypto';

const cooldownTime = 25 * 60 * 1000; 
let isExplorationInProgress = {}; 
let attackTimeout = {}; 

let handler = async (m, { conn }) => {
    global.db = global.db || {};
    global.db.data = global.db.data || {};
    global.db.data.users = global.db.data.users || {};

    let user = global.db.data.users[m.sender] = global.db.data.users[m.sender] || {};
    let lastExplorer = user.lastExplorer || 0;

    if (isExplorationInProgress[m.sender]) {
        return m.reply('🌊 Kamu belum selesai menjelajahi lautan. Tunggu hingga hasil eksplorasi dikirim!');
    }

    if (Date.now() - lastExplorer < cooldownTime) {
        let remaining = Math.floor((cooldownTime - (Date.now() - lastExplorer)) / 60000);
        return m.reply(`⏳ Tunggu ${remaining} menit sebelum perjalanan berikutnya.`);
    }

    if (user.aerozine < 20) {
        return m.reply('💧 Kamu butuh minimal 20 Aerozine untuk memulai perjalanan.\n🛒 Beli terlebih dahulu dengan cara *.shop buy aerozine 20*');
    }

    m.reply('🌊 Perjalanan kamu dimulai! Menyelam ke dalam lautan!');
    isExplorationInProgress[m.sender] = true;

    setTimeout(async () => {
        let chance = Math.random(); 
        if (chance <= 0.45) {
            m.reply('⛔ Kamu menemukan makhluk laut yang berbahaya!\nSegera ketik "serang" dalam 1 menit atau kamu akan diserang!');
            attackTimeout[m.sender] = setTimeout(() => {
                m.reply('💥 Kamu diserang oleh makhluk laut! Hadiahmu dikurangi sebagai penalti.');
                calculateReward(user, m, conn, true); 
                delete isExplorationInProgress[m.sender];
            }, 60000); 
        } else {
            calculateReward(user, m, conn, false);
            delete isExplorationInProgress[m.sender]; 
        }
    }, 3000);

    if (m.text.toLowerCase() === "serang") {
        if (attackTimeout[m.sender]) {
            clearTimeout(attackTimeout[m.sender]);
            attackTimeout[m.sender] = null;
            m.reply('⚔️ Seranganmu berhasil! Kamu mengalahkan makhluk laut!');
            calculateReward(user, m, conn, false);
            delete isExplorationInProgress[m.sender]; 
        } else {
            m.reply('⚠️ Tidak ada makhluk laut yang perlu diserang.');
        }
    }
};

function calculateReward(user, m, conn, crashed) {
    let islands = [
        'Pulau Komodo', 'Karang Tiga', 'Pulau Weh', 'Pulau Bali', 'Pulau Sumba', 'Pulau Halmahera', 'Kepulauan Seribu',
        'Pulau Ternate', 'Pulau Bintan', 'Pulau Madura', 'Pulau Natuna', 'Pulau Nias', 'Pulau Bangka', 'Pulau Belitung',
        'Pulau Derawan', 'Pulau Sumbawa', 'Pulau Belitung', 'Pulau Anambas', 'Pulau Moyo', 'Pulau Gili', 'Pulau Rote'
    ];
    let exploredIslands = islands.sort(() => 0.5 - Math.random()).slice(0, 3);

    let randomMoney = randomInt(100000, 2000000); 
    let randomExp = randomInt(1000, 100000); 
    let randomPotion = randomInt(5, 15); 
    let randomCoal = randomInt(10, 300); 
    let randomIron = randomInt(10, 150); 
    let randomAerozine = randomInt(1, 20); 

    if (crashed) {
        randomMoney = 100000; 
        randomPotion = 1;
        randomCoal = 1;
        randomIron = 1;
    }

    user.money = (user.money || 0) + randomMoney;
    user.exp = (user.exp || 0) + randomExp;
    user.potion = (user.potion || 0) + randomPotion;
    user.coal = (user.coal || 0) + randomCoal;
    user.iron = (user.iron || 0) + randomIron;
    user.aerozine = (user.aerozine || 0) - randomAerozine;

    let resultMessage = `
🌊 @${m.sender.split('@')[0]} telah menjelajahi lautan:

🌴 Pulau yang dieksplorasi:
- ${exploredIslands.join('\n- ')}

🛍 Hasil eksplorasi:
- Money:   Rp.${randomMoney.toLocaleString()}
- Exp:   ${randomExp.toLocaleString()}
- Potion:   ${randomPotion}
- Coal:   ${randomCoal}
- Iron:   ${randomIron}

💧 Aerozine yang digunakan:   ${randomAerozine}
    `.trim();

    conn.reply(m.chat, resultMessage, m);
    user.lastExplorer = Date.now(); 
    setTimeout(() => {
        conn.reply(m.chat, `✨ Ayo @${m.sender.split('@')[0]} menjelajahi lautan lagi!`, m);
    }, 1500000); 
}

handler.help = ['laut'];
handler.tags = ['rpg'];
handler.command = /^(laut)$/i;
handler.limit = 5;
handler.register = true;
handler.group = true;

export default handler;