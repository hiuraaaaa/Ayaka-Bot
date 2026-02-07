let money = 1000000
let cash = 1

let handler = async (m, { text, args, conn }) => {
   
    let user = global.db.data.users[m.sender]
    let duit = user.money
    let count = (args[0] && number(parseInt(args[0])) ? Math.max(parseInt(args[0]), 1) : /all/i.test(args[0]) ? Math.floor(parseInt(user.money)) : 1) * 1
    let stnuy = `_*MONEY TO CASH 💵*_
    
Contoh: .tocash <nominal>
_Uangmu:_ Rp.${duit.toLocaleString()}
💵 1 Cash = Rp.1,000,000 money`
   if (!args[0]) return conn.reply(m.chat, stnuy, m)
   if (user.money >= money * 1) {
   if (user.money < money * count) return conn.reply(m.chat, `Maaf Money anda kurang untuk menukarkan ${cash * count} cash, dengan ${money * count} money`, flok)
       user.cash += cash * count
       user.money -= money * count
       conn.reply(m.chat, `✅ Sukses menukar _Rp.${money * count}_ Ke _${cash * count}_ cash`, flok)
       } else return conn.reply(m.chat, `Maaf Money anda kurang untuk menukarkan ${cash * count} cash, dengan ${money * count} money`, flok)
}
handler.tags = ['rpg','main']
handler.help = ['tocash <nominal>']
handler.command = /^(tocash|jadicash)/i
handler.register = true
handler.group = false

export default handler;

function number(x = 0) {
    x = parseInt(x)
    return !isNaN(x) && typeof x == 'number'
}