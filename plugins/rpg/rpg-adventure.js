import fetch from 'node-fetch';

const cooldown = 600000 // 10 menit
let handler = async (m, { usedPrefix }) => {
    let user = global.db.data.users[m.sender]
    let mentionedJid = [m.sender]
    const more = String.fromCharCode(8206)
    const readMore = more.repeat(4001)

    let now = new Date().getTime()
    let remainingTime = cooldown - (now - user.lastadventure)

    if (user.healt < 80) {
        return m.reply(`Kesehatan Kamu Kurang Dari 80% Tidak Bisa Berpetualang. Gunakan ${usedPrefix}heal jika kamu memiliki potion, atau beli dengan ${usedPrefix}buy potion 1.`)
    }

    if (remainingTime > 0) {
        setTimeout(() => {
            m.reply(`Kamu bisa berpetualang lagi sekarang, gunakan ${usedPrefix}adventure untuk memulai.`)
        }, remainingTime)
        return m.reply(`Kamu sudah berpetualang, tunggu *🕐${new Date(remainingTime).toISOString().substr(11, 8)}* lagi.`)
    }

    // Hadiah yang didapat saat adventure
    let rewards = calculateRewards()
    let rewardText = `*[ Selesai Adventure ]*\n\n@${m.sender.replace(/@.+/, '')}\n\nAnda membawa pulang:`
    for (let item in rewards) {
        if (rewards[item]) {
            if (item === 'money') {
                user.money = (user.money || 0) + rewards[item]
                rewardText += `\n💰 *Money:* ${rewards[item]}`
            } else {
                user[item] = (user[item] || 0) + rewards[item]
                rewardText += `\n${getEmojiForReward(item)} *${capitalizeFirstLetter(item)}:* ${rewards[item]}`
            }
        }
    }

    // Cek apakah kesehatan berkurang atau tidak
    const healtLost = getRandomValue(20, 100)
    if (healtLost > 100 || healtLost < 20) {
        rewardText += `\n\nHealth kamu tidak berkurang setelah berpetualang.`
    } else {
        user.healt -= healtLost
        rewardText += `\n\nHealth kamu berkurang sebanyak ${healtLost}.`
    }

    conn.reply(m.chat, rewardText.trim(), flok, {contextInfo: { mentionedJid }})
    user.lastadventure = now
}

handler.help = ['adventure']
handler.tags = ['rpg']
handler.command = /^(adventure|adv|adven|(ber)?petualang(ang)?)$/i
handler.register = true
handler.cooldown = cooldown
handler.group = true

export default handler

// Fungsi untuk menghitung hadiah adventure
function calculateRewards() {
    return {
        money: getRandomValue(500000, 1000000), // Ganti 'eris' menjadi 'money' di sini
        exp: getRandomValue(100, 500),
        potion: getRandomValue(0, 2),
        common: getRandomValue(1, 5),
        uncommon: getRandomValue(1, 3),
        mythic: getRandomValue(0, 2),
        legendary: getRandomValue(0, 1),
    }
}

// Fungsi untuk mendapatkan nilai random
function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

// Fungsi untuk mendapatkan emoji berdasarkan reward
function getEmojiForReward(item) {
    switch (item) {
        case 'exp': return '⭐'
        case 'potion': return '🍷'
        case 'common': return '⚔️'
        case 'uncommon': return '🛡️'
        case 'mythic': return '🔥'
        case 'legendary': return '🏆'
        default: return ''
    }
}

// Fungsi untuk kapitalisasi kata pertama
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}