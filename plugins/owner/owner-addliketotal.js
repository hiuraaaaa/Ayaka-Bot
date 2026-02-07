let handler = async (m, { conn, command, text, args }) => {

    if (!text) throw 'Format salah!\n\nTambah liketotal: addliketotal <tag orang> <jumlah liketotal>\nKurangi liketotal: removeliketotal <tag orang> <jumlah liketotal>'

    

    // Extracting the mentioned user and the liketotal value from the command text

    let [who, likeValue] = text.split(' ')

    if (!who) throw 'Tag orang yang akan diubah liketotalnya!'

    if (isNaN(likeValue)) throw 'Jumlah liketotal harus angka!'

    // Converting likeValue to a number

    likeValue = parseInt(likeValue)

    let user = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender

    let users = global.db.data.users

    // Checking if the user is in the database, if not, initialize their liketotal to 0

    if (!users[user]) users[user] = { liketotal: 0 }

    // Determining whether to add or remove liketotal based on the command

    if (command === 'addliketotal') {

        // Adding the specified liketotal to the user's account

        users[user].liketotal += likeValue

        conn.reply(m.chat, `Berhasil menambahkan ${likeValue} liketotal untuk @${user.split('@')[0]}!`, m)

    } else if (command === 'removeliketotal') {

        if (likeValue > users[user].liketotal) {

            // Set the user's liketotal to 0 if the specified liketotal is greater than the user's current liketotal

            users[user].liketotal = 0

            conn.reply(m.chat, `Berhasil mengurangi liketotal untuk @${user.split('@')[0]}. liketotal kini menjadi 0!`, m)

        } else {

            // Removing the specified liketotal from the user's account

            users[user].liketotal -= likeValue

            conn.reply(m.chat, `Berhasil mengurangi ${likeValue} liketotal untuk @${user.split('@')[0]}!`, m)

        }

    }

}

handler.help = ['addliketotal', 'remliketotal']

handler.tags = ['owner']

handler.command = /^(add|rem)liketotal$/i

handler.rowner = true

export default handler