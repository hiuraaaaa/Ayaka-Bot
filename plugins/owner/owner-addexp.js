let handler = async (m, { conn, command, text, args }) => {
    if (!text) throw 'Format salah!\n\nTambah exp: addexp <tag orang> <jumlah exp>\nKurangi exp: remexp <tag orang> <jumlah money>'
    
    // Extracting the mentioned user and the money value from the command text
    let [who, expValue] = text.split(' ')
    if (!who) throw 'Tag orang yang akan diubah expnya!'
    if (isNaN(expValue)) throw 'Jumlah exp harus angka!'

    // Converting moneyValue to a number
    expValue = parseInt(expValue)

    let user = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    let users = global.db.data.users

    // Checking if the user is in the database, if not, initialize their money to 0
    if (!users[user]) users[user] = { exp: 0 }

    // Determining whether to add or remove money based on the command
    if (command === 'addexp') {
        // Adding the specified money to the user's account
        users[user].exp += expValue
        conn.reply(m.chat, `Berhasil menambahkan ${expValue} exp untuk @${user.split('@')[0]}!`, m)
    } else if (command === 'remexp') {
        if (expValue > users[user].exp) {
            // Set the user's money to 0 if the specified money is greater than the user's current money
            users[user].exp = 0
            conn.reply(m.chat, `Berhasil mengurangi exp untuk @${user.split('@')[0]}. Exp kini menjadi 0!`, m)
        } else {
            // Removing the specified money from the user's account
            users[user].exp -= expValue
            conn.reply(m.chat, `Berhasil mengurangi ${expValue} exp untuk @${user.split('@')[0]}!`, m)
        }
    }
}

handler.help = ['addexp', 'remexp']
handler.tags = ['owner']
handler.command = /^(add|rem)exp$/i
handler.rowner = true

export default handler