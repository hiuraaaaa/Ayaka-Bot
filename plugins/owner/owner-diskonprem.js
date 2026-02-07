let handler = async(m, { text, conn, args, isOwner }) => {
 
   if (!isOwner) return m.reply('Lo bukan owner, Gak bisa ngasih diskon 😜')
   let diskon = (args[0] || '').toLowerCase()
   
   switch (diskon) {
      case 'true':
      if (global.diskonprem == 'true') return m.reply('Udh Diskon Saa')
        global.diskonprem = 'true'
        m.reply('Sukses Mendiskonkan Harga Premium')
        break
        case 'false':
        if (global.diskonprem == 'false') return m.reply('Gak Ada Harga Premium Yang Diskon Saa')
        global.diskonprem = 'false'
        m.reply('Sukses Menghapus Harga Diskon Premium')
        break
        default:
          return m.reply('Mau True Apa False Diskonnya Saa?')
    }
}

handler.tags = ['owner']
handler.help = ['diskonprem']
handler.command = /^(diskonprem)/i;

export default handler;