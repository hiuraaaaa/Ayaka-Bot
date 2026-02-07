/* <[ CREDIT JANGAN DI ]>
   <[ HAPUS YA BNGST ]>
   <[ LU TINGGAL PAKE DOANG KONTOL ]>
Recode By : Dalwin Whatsapp
©WinTheBot - MD 2023

 * YT : @BG-DARWIN

Delete Credit = Gpunya Harga Diri
*/
let handler = async (m, { conn, args, participants, text, usedPrefix, command }) => {
  switch (command) {
case 'siapa': {
      let member = participants.map(u => u.id).filter(v => v !== conn.user.jid)
      let org = member[Math.floor(Math.random() * member.length)];
      conn.sendMessage(m.chat, { text: `@${org.split('@')[0]}`, mentions: [org] }, { quoted: m })
      break;
    }
  }
};
handler.tags = ['fun']
handler.help = handler.command = ['siapa',]
handler.group = true
export default handler;