let handler = async (m, { conn }) => {
    if (new Date - global.db.data.users[m.sender].lastnguli > 86400000) {
      global.db.data.users[m.sender].limit += 10
      global.db.data.users[m.sender].money += 50000
      m.reply('*Selamat Kamu Mendapatkan :*\n_Limit +10_\n_Money +50000_')
      global.db.data.users[m.sender].lastnguli = new Date * 1
    } else m.reply('Kamu Sudah Mengklaim Upah Nguli Hari Ini')
  }
  handler.help = ['nguli']
  handler.tags = ['rpg']
  handler.command = /^(nguli)$/i
  handler.group = true
  handler.fail = null
  
  
  export default handler