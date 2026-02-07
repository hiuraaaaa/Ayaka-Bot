import axios from 'axios';
let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i

let handler = async (m, { isOwner, conn, text, args}) => {
  let user = global.db.data.users[m.sender]
    let _timie = (new Date - (user.lastcn * 1)) * 1
       if (_timie < 86400000) return m.reply(`Tunggu Selama ${clockString(86400000 - _timie)}, agar bisa mengganti nama`)
   //    if (!args[0]) return m.reply(`mau ganti nama apa?`)
   //    if (args[0].length > 100) return m.reply(`maksimal 100 karakter`)
       let namal = user.name
    if (!text) return m.reply(`Mau ganti nama apa?`)
  //  let [_, name, splitter] = text.match(Reg);
    if (text.split(' ').length > 20) return m.reply('Nama Maksimal 30 Karakter')
       user.name = text.trim()
       user.lastcn = new Date * 1
       let sterr = user.name
    m.reply(`*✅ Sukses mengganti nama*\n\n~${namal}~  Menjadi  *${sterr}*`)
}
handler.tags = ['main']
handler.help = ['changename']
handler.command = /^(changename|cn|gantinama)/i;
handler.register = true;

export default handler;

function clockString(ms) {
  let h = isNaN(ms) ? '60' : Math.floor(ms / 3600000) % 60
  let m = isNaN(ms) ? '60' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '60' : Math.floor(ms / 1000) % 60
  return [h, m, s,].map(v => v.toString().padStart(2, 0) ).join(':')
}