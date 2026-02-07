let handler = m => m

handler.before = async function (m) {

    if (m.chat.endsWith('broadcast')) return
    if (m.fromMe) return
    if (!m.isGroup) return
    
    if (m.isGroup) {
       if (m.sender === '@s.whatsapp.net') {
       let user = global.db.data.users[m.sender]
       let username = this.getName(m.sender) 
       let _timie = (new Date - (user.pc * 1)) * 1
       if (_timie < 1000000) return
    
    let halo = `Halo ${pickRandom(['Saa','Lann4you','Lann4you'])}, ${pickRandom(['Selamat datang','Apa kabar?','Udah Makan Blum?','Lagi apa kamu','Member Tercintakuu😍','Udh mandi blum?'])}👋🏻💐`

    await m.reply(halo)
    user.pc = new Date * 1
        }
     }
  }

export default handler

function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())]
}