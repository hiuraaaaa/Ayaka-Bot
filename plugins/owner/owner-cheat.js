let handler = async (m, { conn }) => {
    let user = global.db.data.users[m.sender]
        conn.reply(m.chat, `*Succes Cheat !*`, m)
        global.db.data.users[m.sender].money = 999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999
        global.db.data.users[m.sender].cash = 999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999
        global.db.data.users[m.sender].limit = 999999999999999999999999999999999999
        global.db.data.users[m.sender].exp = 999999999999
}
handler.help = ['cheat']
handler.tag = ['owner']
handler.command = /^(cheat)$/i
handler.owner = true
handler.mods = false

export default handler;