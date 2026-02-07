//*┌───「 Ara Bot 🌷: game-bonanza.js 」*
let handler = async (m, { conn, args }) => {
global.db = global.db || {}
global.db.data = global.db.data || {}
global.db.data.users = global.db.data.users || {}
let user = global.db.data.users[m.sender] || (global.db.data.users[m.sender] = { money: 100 })
if (args.length < 2) return conn.reply(m.chat, '> *Contoh: .bonanza [bet] [spin]*', m)
let betAmount = parseInt(args[0])
let spinCount = parseInt(args[1])
if (isNaN(betAmount) || betAmount <= 0) return conn.reply(m.chat, 'Jumlah taruhan tidak valid.', m)
if (isNaN(spinCount) || spinCount <= 0 || spinCount > 15) return conn.reply(m.chat, '*Jumlah spin harus antara 1 hingga 15!*', m)
if (user.money < betAmount) return conn.reply(m.chat, '*Uang kamu tidak cukup untuk taruhan ini*', m)
user.money -= betAmount
let singleBet = betAmount / spinCount
let fruits = ['🍌', '🍎', '🍇', '🍊', '🥭']
let fruitValues = { '🍌': 4, '🍎': 3, '🍇': 2, '🍊': 1, '🥭': 0 }
let winPatterns = []
for (let fruit of fruits) winPatterns.push([fruit, fruit, fruit, fruit])
for (let fruit of fruits) winPatterns.push([fruit, fruit, fruit])
for (let fruit of fruits) for (let i = 0; i < 10; i++) winPatterns.push([fruit])
let wins = 0, losses = 0, totalWinAmount = 0, totalLossAmount = 0
let winFruits = { '🍌': 0, '🍎': 0, '🍇': 0, '🍊': 0, '🥭': 0 }
let scatterWins = 0
const generateSpinResult = () => {
let result = []
for (let i = 0; i < 4; i++) {
let row = []
for (let j = 0; j < 5; j++) {
row.push(fruits[Math.floor(Math.random() * fruits.length)])
}
result.push(row)
}
return result
}
const checkWin = (result) => {
for (let pattern of winPatterns) {
for (let row of result) {
if (row.join('').includes(pattern.join(''))) {
let fruit = pattern[0]
if (pattern.length === 4) {
scatterWins++
totalWinAmount += singleBet * fruitValues[fruit]
winFruits[fruit]++
return 'Scatter Win'
} else {
wins++
totalWinAmount += singleBet * fruitValues[fruit]
winFruits[fruit]++
return 'Win'
}
}
}
}
return 'Lose'
}
let initialMessage = await conn.reply(m.chat, `*╭──────────────*
*│ 👤user: @${m.sender.split('@')[0]}*
*│ 🎰spin: ${spinCount}*
*│ 🪙bet: ${betAmount}*
"╰──────────────"
         *❃𝗙𝗥𝗨𝗜𝗧 𝗦𝗣𝗜𝗡❃*`, m)
for (let i = 0; i < spinCount; i++) {
await new Promise(resolve => setTimeout(resolve, 1000))
let spinResult = generateSpinResult()
let spinText = spinResult.map(row => `┃ ${row.join(' │ ')} ┃`).join('\n')
let spinStatus = checkWin(spinResult)
if (spinStatus === 'Lose') {
losses++
totalLossAmount += singleBet
}
let updateMessage = `*╭──────────────*
*│ 👤user: @${m.sender.split('@')[0]}*
*│ 🎰spin: ${spinCount}*
*│ 🪙bet: ${betAmount}*
*╰──────────────*
         *❃𝗙𝗥𝗨𝗜𝗧 𝗦𝗣𝗜𝗡❃*\n${spinText}`
if (i === spinCount - 1) {
updateMessage += `\n*╭──────────────*
*│ 🏆 Total Menang: ${totalWinAmount.toFixed(2)}*
*│➞ 🍎 Apel: ${winFruits['🍎']}*
*│➞ 🍌 Pisang: ${winFruits['🍌']}*
*│➞ 🍇 Anggur: ${winFruits['🍇']}*
*│➞ 🍊 Jeruk: ${winFruits['🍊']}*
*│➞ 🥭 Mangga: ${winFruits['🥭']}*
*│ 💸 Total Kalah: ${totalLossAmount.toFixed(2)}*
*│ 🎲 Scatter: ${scatterWins}*
*╰──────────────*`
}
await conn.relayMessage(m.chat, {
protocolMessage: {
key: initialMessage.key,
type: 14,
editedMessage: { conversation: updateMessage }
}
}, {})
}
user.money += totalWinAmount
}

handler.help = ['bonanza']
handler.tags = ['game']
handler.command = /^bonanza$/i
handler.register = true
handler.premium=true

export default handler