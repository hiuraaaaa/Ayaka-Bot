let handler = async (m, { conn, text, participants }) => {
  if (!m.isGroup) throw 'Hanya bisa digunakan di grup.'
  if (!text || isNaN(text)) throw `Masukkan jumlah hari!\nContoh: .addpremall 7`
  
  let jumlahHari = 86400000 * Number(text)
  let now = new Date() * 1
  let count = 0
  
  for (let user of participants) {
    let id = user.id
    if (!db.data.users[id]) continue 
    let dataUser = db.data.users[id]
    if (now < dataUser.premiumTime) dataUser.premiumTime += jumlahHari
    else dataUser.premiumTime = now + jumlahHari
    dataUser.premium = true
    count++
  }

  m.reply(`Berhasil memberi premium ke ${count} anggota grup selama ${text} hari.`)
}

handler.help = ['addpremall <hari>']
handler.tags = ['owner']
handler.command = ['addpremall']

handler.group = true
handler.rowner = true

export default handler