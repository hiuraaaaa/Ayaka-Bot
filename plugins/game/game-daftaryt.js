import axios from 'axios';
let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i

let handler = async (m, { isOwner, conn, text, args}) => {
  let user = global.db.data.users[m.sender]
  if (user.subscriber > 0) m.reply(`❎ kamu sudah memiliki akun YouTube`)
    if (!text) return m.reply(`Mau buat akun YouTube dengan nama apa?\nContoh: .createyt Nur Kholifah`)
    if (text.split('').length > 20) return m.reply('Maksimal 20 Karakter')
       user.nameyt = text.trim()
       user.subscriber += 2
       let ytname = user.nameyt
       let subs = user.subscriber
    m.reply(`*✅ Sukses membuat akun YouTube*\nNama YT: ${ytname}\nSubscriber: ${subs}`)
}
handler.tags = ['rpg','game']
handler.help = ['createyt']
handler.command = /^(createyt|buatyt)/i;
handler.register = true;

export default handler;