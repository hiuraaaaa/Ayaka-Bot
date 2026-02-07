let handler = async (m, { conn, command, text, args }) => {
    if (!text) throw 'Format salah!\n\nTambah subscriber: addsubscriber <tag orang> <jumlah subscriber>\nKurangi subscriber: removesubscriber <tag orang> <jumlah subscriber>'
    
    // Extracting the mentioned user and the subscriber value from the command text
    let [who, subsValue] = text.split(' ')
    if (!who) throw 'Tag orang yang akan diubah subscribernya!'
    if (isNaN(subsValue)) throw 'Jumlah subscriber harus angka!'

    // Converting subsValue to a number
    subsValue = parseInt(subsValue)

    let user = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    let users = global.db.data.users

    // Checking if the user is in the database, if not, initialize their subscriber to 0
    if (!users[user]) users[user] = { subscriber: 0 }

    // Determining whether to add or remove subscriber based on the command
    if (command === 'addsubscriber') {
        // Adding the specified subscriber to the user's account
        users[user].subscriber += subsValue
        conn.reply(m.chat, `Berhasil menambahkan ${subsValue} subscriber untuk @${user.split('@')[0]}!`, m)
    } else if (command === 'removesubscriber') {
        if (subsValue > users[user].subscriber) {
            // Set the user's subscriber to 0 if the specified subscriber is greater than the user's current subscriber
            users[user].subscriber = 0
            conn.reply(m.chat, `Berhasil mengurangi subscriber untuk @${user.split('@')[0]}. subscriber kini menjadi 0!`, m)
        } else {
            // Removing the specified subscriber from the user's account
            users[user].subscriber -= subsValue
            conn.reply(m.chat, `Berhasil mengurangi ${subsValue} subscriber untuk @${user.split('@')[0]}!`, m)
        }
    }
}

handler.help = ['addsubscriber', 'remsubscriber']
handler.tags = ['owner']
handler.command = /^(add|rem)subscriber$/i
handler.rowner = true

export default handler