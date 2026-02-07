const xpperlimit = 1
let handler = async (m, { conn, command, args }) => {
	let user = global.db.data.users[m.sender]
  let count = (args[0] && number(parseInt(args[0])) ? Math.max(parseInt(args[0]), 1) : /all/i.test(args[0]) ? Math.floor(parseInt(user.money)) : 1) * 1
  if (user.atm == 0) return m.reply('Kamu Belum Memiliki ATM, Silahkan Bikin Dulu\nCaranya Ketik .craft atm')
  if (user.bank > user.fullatm) return m.reply('Uang Dibank Kamu Sudah Penuh!')
  if (count > user.fullatm - user.bank) return m.reply('Uangnmu Udah Terlalu Banyak Di Bank')
  if (global.db.data.users[m.sender].money >= count * 1) {
    global.db.data.users[m.sender].money -= count * 1
    global.db.data.users[m.sender].bank += count * 1
    let uang = user.money
    let mentionedJid = [m.sender]
    conn.reply(m.chat, `*✅@${m.sender.replace(/@.+/, '')} Menabung Uang Di Bank*\n🏧 Sebesar : _Rp.${count.toLocaleString()}_\n💸 Uangmu Di Saku : _Rp.${uang.toLocaleString()}_`, flok, {contextInfo: { mentionedJid }})
  } else conn.reply(m.chat, `Uang Kamu Tidak Mencukupi Untuk Menabung Uang Sebesar ${count},\nSilahkan cek Uangmu, Ketik *.Bank*`, flok)
}
handler.help = ['nabung']
handler.tags = ['rpg']
handler.command = /^nabung([0-9]+)|nabung|nabungall$/i
handler.register = true

export default handler

function number(x = 0) {
    x = parseInt(x)
    return !isNaN(x) && typeof x == 'number'
}