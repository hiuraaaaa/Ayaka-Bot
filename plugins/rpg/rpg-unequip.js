let handler  = async (m, { conn, command, args, usedPrefix }) => {
    let type = (args[0] || '').toLowerCase()
    let user = global.db.data.users[m.sender]
    let tosi = user.magichats
    let satang = user.gloves
    let sesihi = user.sepatu
    let nuyy = `*Contoh :* ${usedPrefix}${command} topisihir\nUntuk Melepas Equipment`
  
  switch (type) {
     case 'topisihir':
   if (user.magichatsuse == 0) return m.reply(`Kamu Tidak Menggunakan Item ini!!`)
   if (user.magichats == 1) return m.reply(`Item ini sudah kamu lepas`)
   user.magichats += 1
   user.magichatsuse -= 1
   user.sworddamage -= 1300 * 1
   user.healt -= 300 * 1
   user.health -= 300 * 1
   user.stamina -= 100 * 1
   user.fullstamina -= 100 * 1
       m.reply(`Kamu Melepas *👒 Topi Sihir*\n💉Darah kamu berkurang *-300*\n🛡️Stamina  kamu berkurang *-100*\n💥 Damage: *-1300*`)
       break
       case 'sarungtangan':
   if (user.glovesuse == 0) return m.reply(`Kamu Tidak Menggunakan Item ini!!`)
   if (user.gloves == 1) return m.reply(`Item ini sudah kamu lepas`)
   user.gloves += 1
   user.glovesuse -= 1
   user.sworddamage -= 500 * 1
   user.healt -= 75 * 1
   user.health -= 75 * 1
   user.stamina -= 45 * 1
   user.fullstamina -= 45 * 1
       m.reply(`Kamu Melepas *🧤 Sarung Tangan*\n💉Darah kamu berkurang *-75*\n🛡️Stamina  kamu berkurang *-45*\n💥 Damage: *-500*`)
       break
       case 'sepatusihir':
   if (user.sepatuuse == 0) return m.reply(`Kamu Tidak Menggunakan Item ini!!`)
   if (user.sepatu == 1) return m.reply(`Item ini sudah kamu lepas`)
   user.sepatuuse -= 1
   user.sepatu += 1
   user.sworddamage -= 650 * 1
   user.healt -= 100 * 1
   user.health -= 100
   user.stamina -= 70 * 1
   user.fullstamina -= 70 * 1
       m.reply(`Kamu Melepas *👞 Sepatu Sihir*\n💉Darah kamu berkurang *-100*\n🛡️Stamina  kamu berkurang *-70*\n💥 Damage: *-650*`)
       break
       default:
         return m.reply(nuyy)
    
    }
}
handler.tags = ['rpg']
handler.help = ['unequip']
handler.command = /^(unequip|lepas)/i
handler.register = true

export default handler;