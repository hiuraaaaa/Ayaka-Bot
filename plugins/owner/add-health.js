let handler = async (m, { conn, command, text, args }) => {
    if (!text) throw 'Format salah!\n\nTambah healt: addhealth <tag orang> <jumlah healt>\nKurangi healt: remhealth <tag orang> <jumlah healt>'
    
    // Extracting the mentioned user and the money value from the command text
    let [who, healthValue] = text.split(' ')
    if (!who) throw 'Tag orang yang akan diubah moneynya!'
    if (isNaN(healthValue)) throw 'Jumlah money harus angka!'

    // Converting moneyValue to a number
    healthValue = parseInt(healthValue)

    let user = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    let users = global.db.data.users

    // Checking if the user is in the database, if not, initialize their money to 0
    if (!users[user]) users[user] = { health: 0 }

    // Determining whether to add or remove money based on the command
    if (command === 'addhealth') {
        // Adding the specified money to the user's account
        users[user].health += healthValue
        conn.reply(m.chat, `Berhasil menambahkan ${healthValue} health untuk @${user.split('@')[0]}!`, m)
    } else if (command === 'remhealth') {
        if (healthValue > users[user].health) {
            // Set the user's money to 0 if the specified money is greater than the user's current money
            users[user].health = 0
            conn.reply(m.chat, `Berhasil mengurangi Health untuk @${user.split('@')[0]}. Health kini menjadi 0!`, m)
        } else {
            // Removing the specified money from the user's account
            users[user].health -= healthValue
            conn.reply(m.chat, `Berhasil mengurangi ${healthValue} health untuk @${user.split('@')[0]}!`, m)
        }
    }
}

handler.help = ['addhealth', 'remhealth']
handler.tags = ['owner']
handler.command = /^(add|rem)health$/i
handler.mods = true

export default handler