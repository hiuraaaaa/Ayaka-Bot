const userStates = {};

const monsters = [
    { name: 'Goblin', healt: 500, attack: 100, rewardMultiplier: 1 },
    { name: 'Troll', healt: 800, attack: 150, rewardMultiplier: 1.5 },
    { name: 'Dragon', healt: 1441, attack: 228, rewardMultiplier: 2 },
    { name: 'Demon', healt: 2000, attack: 300, rewardMultiplier: 2.5 },
    { name: 'Hydra', healt: 2500, attack: 400, rewardMultiplier: 3 },
    { name: 'Dewa', healt: 10000, attack: 499, rewardMultiplier: 1 },
    { name: 'Titan', healt: 12000, attack: 499, rewardMultiplier: 3.5 },
    { name: 'Behemoth', healt: 15000, attack: 499, rewardMultiplier: 4 },
    { name: 'Leviathan', healt: 20000, attack: 499, rewardMultiplier: 5 }
];

const probabilities = [0.35, 0.25, 0.15, 0.08, 0.05, 0.03, 0.05, 0.02, 0.02];
const probabilitiesHighAttack = [0.1, 0.1, 0.3, 0.2, 0.15, 0.05, 0.05, 0.03, 0.02]; // Adjusted probabilities for high attack users

const cooldownAttack = 2 * 60 * 1000; // 2 minutes in milliseconds
const cooldown = 30 * 60 * 1000; // 30 minutes in milliseconds

function getRandomMonster(probabilities) {
    let rand = Math.random();
    let sum = 0;
    for (let i = 0; i < monsters.length; i++) {
        sum += probabilities[i];
        if (rand < sum) return monsters[i];
    }
    return monsters[0]; // Default to the easiest monster if something goes wrong
}

function getRandomReward(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clockString(ms) {
    if (ms < 0) return '0 *Hari* 0 *Jam* 0 *Menit* 0 *Detik*';
    let d = Math.floor(ms / 86400000);
    let h = Math.floor(ms / 3600000) % 24;
    let m = Math.floor(ms / 60000) % 60;
    let s = Math.floor(ms / 1000) % 60;
    return [d, ' *Hari* ', h, ' *Jam* ', m, ' *Menit* ', s, ' *Detik* '].map(v => v.toString().padStart(2, 0)).join('');
}

let handler = async (m) => {
    let command = m.text.split(' ')[0].toLowerCase();
    let user = m.sender;
    let chatId = m.chat;

    if (!userStates[user]) {
        userStates[user] = {
            inBattle: false,
            monster: null,
            userHealt: null,
            lastAttack: 0,
            totalDamageReceived: 0,
            cooldownTimeout: null
        };
    }

    let currentTime = Date.now();
    let userData = global.db.data.users[user];

    if (!userData) {
        conn.reply(chatId, `@${user.replace(/@.+/, '')}, tidak ditemukan data pengguna.`, flok);
        return;
    }

    if (!userData.lastClosed) {
        userData.lastClosed = 0; // Initialize lastClosed if not present
    }

    if (command === '.monster') {
        if (currentTime - userData.lastClosed < cooldown) {
            let remainingTime = cooldown - (currentTime - userData.lastClosed);
            remainingTime = remainingTime < 0 ? 0 : remainingTime;
            conn.reply(chatId, `@${user.replace(/@.+/, '')}, Kamu sedang kelelahan. Istirahat sejenak\n${clockString(remainingTime)}.`, flok);

            setTimeout(() => {
                conn.reply(chatId, `@${user.replace(/@.+/, '')}, Ayo kalahkan monster lagi! Ketik .monster`, flok);
            }, remainingTime);
            return;
        }

        if (userStates[user].inBattle) {
            conn.reply(chatId, `Kamu @${user.replace(/@.+/, '')}, sudah dalam pertempuran! Ketik .attack untuk terus melawan monster itu.`, flok);
            return;
        }

        startBattle(user, userData, chatId, conn, flok);

    } else if (command === '.attack') {
        if (!userStates[user].inBattle) {
            conn.reply(chatId, `Kamu @${user.replace(/@.+/, '')}, tidak sedang berperang! Ketik .monster untuk memulai pertempuran baru.`, flok);
            return;
        }

        if (currentTime - userStates[user].lastAttack < cooldownAttack) {
            let remainingTime = cooldownAttack - (currentTime - userStates[user].lastAttack);
            remainingTime = remainingTime < 0 ? 0 : remainingTime;
            conn.reply(chatId, `@${user.replace(/@.+/, '')}, Tunggu sebentar lagi\n${clockString(remainingTime)} untuk serangan berikutnya.`, flok);
            return;
        }

        performAttack(user, userData, chatId, conn, flok);
    }
};

function startBattle(user, userData, chatId, conn, flok) {
    const monster = userData.attack >= 500 ? getRandomMonster(probabilitiesHighAttack) : getRandomMonster(probabilities);
    userStates[user].monster = {
        name: monster.name,
        healt: monster.healt,
        attack: monster.attack,
        rewardMultiplier: monster.rewardMultiplier
    };
    userStates[user].inBattle = true;

    userStates[user].userHealt = userData.healt || 0;
    userStates[user].totalDamageReceived = 0;

    conn.reply(chatId, `*—[ Monster Battle ]—*\n\n🧟‍♂️ *Monster Appeared!*\n\n📊 *Monster Stats:*\n- Name: ${monster.name}\n- Health: ${monster.healt}\n- Attack: ${monster.attack}\n\n⚔️ *@${user.replace(/@.+/, '')}, Stats:*\n- Health: ${userStates[user].userHealt}\n- Attack: ${userData.attack || 0}\n\nKetik *.attack* untuk mulai menyerang monster!`, flok);
}

function performAttack(user, userData, chatId, conn, flok) {
    let monster = userStates[user].monster;
    let currentTime = Date.now();

    const updatedUserHealt = userData.healt || 0;
    const updatedUserAttack = userData.attack || 0;

    if (userStates[user].userHealt !== updatedUserHealt) {
        userStates[user].userHealt = updatedUserHealt;
    }

    if (updatedUserAttack === 0) {
        conn.reply(chatId, `@${user.replace(/@.+/, '')}, Kekuatan kamu adalah 0. Silakan latihan terlebih dahulu, dengan cara .training.`, flok);
        userStates[user].inBattle = false;
        return;
    }

    if (userStates[user].userHealt <= 0) {
        conn.reply(chatId, `@${user.replace(/@.+/, '')}, Darah kamu telah habis. Silakan sembuhkan diri Anda dengan perintah .heal.`, flok);
        userStates[user].inBattle = false;
        return;
    }

    let damageToMonster = updatedUserAttack;
    let damageToUser = getRandomReward(monster.attack - 20, monster.attack + 20);

    monster.healt -= damageToMonster;
    userStates[user].userHealt -= damageToUser;
    userStates[user].totalDamageReceived += damageToUser;
    userStates[user].lastAttack = currentTime;

    userData.healt = userStates[user].userHealt;

    let battleMessage = `Hasil bertarung, @${user.replace(/@.+/, '')}\n\n💥 kamu Memberikan ${damageToMonster} damage ke monster!\n💔 Monster Memberikan ${damageToUser} damage ke kamu!\n\n📊 *Current Stats:*\n- Your Health: ${userStates[user].userHealt}\n- Monster Health: ${monster.healt}`;

    let rewardMoney = 0;
    let rewardExp = 0;

    if (userStates[user].userHealt <= 0) {
        userStates[user].inBattle = false;
        battleMessage += `\n\n💀 Anda telah dikalahkan oleh monster!`;
        userData.damage = (userData.damage || 0) + userStates[user].totalDamageReceived;
    } else if (monster.healt <= 0) {
        userStates[user].inBattle = false;
        userData.lastClosed = currentTime; // Set cooldown start time here
        rewardMoney = getRandomReward(15000, 3000000) * monster.rewardMultiplier;
        rewardExp = getRandomReward(50, 10000) * monster.rewardMultiplier;
        battleMessage += `\n\n🏆 Anda telah mengalahkan monster!\n\n*💰 Money Earned: Rp. ${rewardMoney}*\n*✨ Experience Earned: ${rewardExp}*`;
        userData.damage = (userData.damage || 0) + userStates[user].totalDamageReceived;

        // Update user data
        userData.money = (userData.money || 0) + rewardMoney;
        userData.exp = (userData.exp || 0) + rewardExp;
    } else {
        rewardMoney = getRandomReward(1000, 500000);
        rewardExp = getRandomReward(5, 20);
        battleMessage += `\n\nPertarungan berlanjut! Ketik .attack lagi dalam 2 menit untuk melanjutkan pertarungan.\n\nKamu bisa mengisi darah mu atau berlatih di training untuk serangan monster berikutnya\n- .heal\n- .training`;

        // Set timeout to notify user they can attack again after cooldownAttack
        if (userStates[user].cooldownTimeout) {
            clearTimeout(userStates[user].cooldownTimeout);
        }

        userStates[user].cooldownTimeout = setTimeout(() => {
            conn.reply(chatId, `@${user.replace(/@.+/, '')}, Sekarang kamu dapat menyerang monster lagi! Ketik .attack untuk melanjutkan.`, flok);
        }, cooldownAttack);

        // Set timeout to end battle if user does not respond
        if (userStates[user].attackTimeout) {
            clearTimeout(userStates[user].attackTimeout);
        }

        userStates[user].attackTimeout = setTimeout(() => {
            conn.reply(chatId, `@${user.replace(/@.+/, '')}, Sepertinya kamu lupa menyerang monster! Pertempuran telah dihentikan karena tidak adanya respon.`, flok);
            userStates[user].inBattle = false;
        }, 4 * 60 * 1000); // Timeout set to 4 minutes
    }

    global.db.data.users[user].money = userData.money;
    global.db.data.users[user].exp = userData.exp;

    // Clear all timeouts if the battle ends
    if (!userStates[user].inBattle) {
        if (userStates[user].cooldownTimeout) {
            clearTimeout(userStates[user].cooldownTimeout);
            userStates[user].cooldownTimeout = null;
        }
        if (userStates[user].attackTimeout) {
            clearTimeout(userStates[user].attackTimeout);
            userStates[user].attackTimeout = null;
        }
    }

    conn.reply(chatId, battleMessage, flok);
}
handler.help = ['monster'];
handler.tags = ['rpg'];
handler.command = /^(monster|attack)$/i;
handler.group = true;
handler.register = true;

export default handler;