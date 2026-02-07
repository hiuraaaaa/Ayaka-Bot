let handler = async (m, { conn, command, text, args }) => {
    if (!text) throw 'Format salah!\n\nTambah cash: addcash <tag orang> <jumlah cash>\nKurangi cash: remcash <tag orang> <jumlah cash>'
    
    let [who, cashValue] = text.split(' ')
    if (!who) throw 'Tag orang yang akan diubah moneynya!'
    if (isNaN(cashValue)) throw 'Jumlah cash harus angka!'

    cashValue = parseInt(cashValue)

    let user = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    let users = global.db.data.users

    if (!users[user]) users[user] = { cash: 0 }

    if (command === 'addcash') {
        
        users[user].cash += cashValue
        conn.reply(m.chat, `Berhasil menambahkan ${cashValue} cash untuk @${user.split('@')[0]}!`, m)
    } else if (command === 'remcash') {
        if (cashValue > users[user].cash) {
            
            users[user].cash = 0
            conn.reply(m.chat, `Berhasil mengurangi cash untuk @${user.split('@')[0]}. cash kini menjadi 0!`, m)
        } else {
         
            users[user].cash -= cashValue
            conn.reply(m.chat, `Berhasil mengurangi ${cashValue} cash untuk @${user.split('@')[0]}!`, m)
        }
    }
}

handler.help = ['addcash', 'remcash']
handler.tags = ['owner']
handler.command = /^(add|rem)cash$/i
handler.rowner = true

export default handler