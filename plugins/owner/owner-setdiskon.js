let handler = async(m, { conn, text, args, isOwner }) =>{
  if (!isOwner) return m.reply('Sory Lo Bukan Lann4you😜')
   let dis = (args[0] || '').toLowerCase()
   let premnya = global.listdiskon
   if (global.diskonprem == 'false') return m.reply('aktifin diskon prem nya dulu Lann4youa')
   switch (dis) {
       case '1minggu':
       global.listdiskon = 'mingguan'
       m.reply('Sukses Memberikan Diskon Untuk Prem 1 Minggu')
       break
       case '1bulan':
       global.listdiskon = 'bulanin'
       m.reply('Sukses Memberikan Diskon Untuk Prem 1 Bulan')
       break
       case '3bulan':
       global.listdiskon = 'tigabulan'
       m.reply('Sukses Memberikan Diskon Untuk Prem 3 bulan')
       break
       case '8bulan':
       global.listdiskon = 'lapanbulan'
       m.reply('Sukses Memberikan Diskon Untuk Prem 8 Bulan')
       break
       case '1tahun':
       global.listdiskon = 'tahunin'
       m.reply('Sukses Memberikan Diskon Untuk Prem 1 Tahun')
       break
       case 'permanen':
       global.listdiskon = 'permanent'
       m.reply('Sukses Memberikan Diskon Untuk Prem permanen')
       break
       default:
       return conn.reply(m.chat, 'Prem mana yang mau di kasih diskon nuy?', m)
       }
}
handler.tags = ['owner']
handler.help = ['setdiskon']
handler.command = /^(setdiskon)/i;

export default handler;