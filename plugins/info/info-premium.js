const { proto, generateWAMessageFromContent, prepareWAMessageMedia } = (await import('@adiwajshing/baileys')).default;
import uploadImage from '../lib/uploadImage.js';

let handler = async(m, { conn, text }) => {
    conn.prem = conn.prem || {};
    let pendings = conn.prem[m.chat];
    let dis = global.diskonprem;
    let kon = global.listdiskon
    let wm = 'DISKON!!'

        let nom = `Mau Beli Premium? Ayoo Cek Keuntungan Di bawah ini, Dan Ada Bonus Juga Lohh!.
        
*🎁 Keuntungan Premium*
‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎
\`Unlock Fitur:\`
* WM Sticker
* To Anime
* Mirror (efek ubah foto beragam gambar)
* Remini
* TikTok Hd
* Dan Fitur Lainnya
* Bisa Anda Cek di !menuprem

\`Bonus Limut:\`
* 1 Minggu: +3 Hari & +1,000 Limit
* 1 Bulan: +10 Hari & +5,000 Limit
* 3 Bulan: +15 Hari & +10,000 Limit
* 8 Bulan: +30 Hari & +25.000 Limit
* 1 Tahun: +45 Hari & +50,000 Limit
* Permanen: Money 100M & +100,000 Limit`;

    let sections = [{
		title: 'Premium By Rijalganzz',
		highlight_label: '', 
		rows: [{
			header: '', 
	title: "📅 1 Minggu",
	description: ": ʀᴘ 5,000",
	id: '.seminggu'
	},
	{
		header: '', 
		title: "📅 1 Bulan", 
		description: ": ʀᴘ.12,000",
		id: '.bulanin'
  },
		{
		header: '', 
		title: "📅 3 Bulan", 
		description: ": ʀᴘ.23,000",
		id: '.tigabulan'
		},
		{
		header: '', 
		title: "📅 8 Bulan",
		description: ": ʀᴘ.50,000",
		id: '.lapanbulan'
		},
		{
		header: '', 
		title: "📅 1 Tahun",
		description: ": ʀᴘ.90,000",
		id: '.tahunin'
		},
		{
		header: '', 
		title: "📅 Permanen",
		description: ": ʀᴘ.300,000",
		id: '.permanent'
	}]
}]
if (dis == 'true') {
if (kon == 'mingguan') {
sections.push({
	title: wm,
	highlight_label: 'Diskon 20%', 
	rows: [{
		header: '', 
		title: "📅 1 Minggu", 
		description: ": ʀᴘ.5,000 Menjadi ʀᴘ.3,000",
		id: '.seminggu'
		}]
	})
 } else if (kon == 'bulanin') {
sections.push({
	title: wm,
	highlight_label: 'Diskon 20%', 
	rows: [{
		header: '', 
		title: "📅 1 Bulan", 
		description: ": ʀᴘ.12,000 Menjadi ʀᴘ.10,000",
		id: '.bulanin'
		}]
	})
 } else if (kon == 'tigabulan') {
sections.push({
	title: wm,
	highlight_label: 'Diskon 30%', 
	rows: [{
		header: '', 
		title: "📅 3 Bulan", 
		description: ": ʀᴘ.23,000 Menjadi ʀᴘ.19,000",
		id: '.tigabulan'
		}]
	})
 } else if (kon == 'lapanbulan') {
sections.push({
	title: wm,
	highlight_label: 'Diskon 10%', 
	rows: [{
		header: '', 
		title: "📅 8 Bulan", 
		description: ": ʀᴘ.50,000 Menjadi ʀᴘ.40,000",
		id: '.lapanbulan'
		}]
	})
 } else if (kon == 'tahunin') {
sections.push({
	title: wm,
	highlight_label: 'Diskon 20%', 
	rows: [{
		header: '', 
		title: "📅 1 Tahun", 
		description: ": ʀᴘ.90,000 Menjadi ʀᴘ.70,000",
		id: '.tahunin'
		}]
	})
 } else if (kon == 'permanent') {
sections.push({
	title: wm,
	highlight_label: 'Diskon 25%', 
	rows: [{
		header: '', 
		title: "📅 Permanen", 
		description: ": ʀᴘ.300,000 Menjadi ʀᴘ.270,000",
		id: '.permanent'
		}]
	})
 }
}
let listMessage = {
    title: 'PAyaka List', 
    sections
};

    let options = [];

    let msg = generateWAMessageFromContent(m.chat, {
  viewOnceMessage: {
    message: {
        "messageContextInfo": {
          "deviceListMetadata": {},
          "deviceListMetadataVersion": 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: proto.Message.InteractiveMessage.Body.create({
            text: nom,
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: '*© Rijalganzz*',
          }),
          header: proto.Message.InteractiveMessage.Header.create({
            title: '\t*👑 Premium VIP*\n',
            hasMediaAttachment: false
          }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [
              {
                "name": "single_select",
                "buttonParamsJson": JSON.stringify(listMessage) 
              }
           ],
          })
        })
    }
  }
}, { quoted: m})

   await conn.relayMessage(msg.key.remoteJid, msg.message, {
  messageId: msg.key.id})
        if (dis == 'true') {
        conn.prem[m.chat] = {
            buyer: m.sender,
            room: m.chat,
            diskon: diskon(m),
            status: 'pendings',
            waktu: setTimeout(() => {
                if (conn.prem[m.chat]) conn.reply(m.chat, 'Transaksi Dibatalkan', m);
                delete conn.prem[m.chat];
            }, 500000),
        };
      } else {
      conn.prem[m.chat] = {
            buyer: m.sender,
            room: m.chat,
            status: 'pendings',
            waktu: setTimeout(() => {
                if (conn.prem[m.chat]) conn.reply(m.chat, 'Transaksi Dibatalkan', m);
                delete conn.prem[m.chat];
            }, 500000),
        };
      }
}

handler.command = /^(prem|premium)/i;
handler.private = false
handler.register = true

function getContentType(message) {
    if (!message || typeof message !== 'object') return null;
    if (message.buttonsResponseMessage) return 'buttonsResponseMessage';
    if (message.templateButtonReplyMessage) return 'templateButtonReplyMessage';
    if (message.viewOnceMessage) return 'viewOnceMessage';
    return null;
}

handler.all = async function (m) {
    this.loading = this.loading || {};
    this.prem = this.prem || {};
    let nuy = '18254873441@s.whatsapp.net';
    let wait = this.loading[nuy];
    let pendings = Object.values(this.prem).find(pendings => pendings.status && pendings.room && pendings.buyer === m.sender);
    const contentType = getContentType(m.message);

    if (contentType === 'templateButtonReplyMessage') {
        let selectedButton = m.message.templateButtonReplyMessage.selectedId;
       if (wait) {
       if (wait && wait.status == 'pending') {
        if (selectedButton === 'sukses') {
        let nuy = '18254873441@s.whatsapp.net';
            let sukses;
            if (wait.nominal === 5000) {
                sukses = `✅ *Transaksi Berhasil!*\n\n\`Pembelian\`\n* 👑 Premium: 1 Minggu\n* 🛒 Harga: Rp.5,000\n* 🎁 Bonus: 1,000 Limit\n* 📅 Bonus Hari: 3 Hari\n* 🛍️ Status: Suksess ✓\n\`Premium Otomatis Masuk\`\n\n*💬 Pesan Owner:*\n_Makasih Sudah Berbelanja Di Toko Lann4you Melalui Bot Kami ❤️`;
            } else if (wait.nominal === 12000) {
                sukses = `✅ *Transaksi Berhasil!*\n\n\`Pembelian\`\n* 👑 Premium: 1 Bulan\n* 🛒 Harga: Rp.12,000\n* 🎁 Bonus: 5,000 Limit\n* 📅 Bonus Hari: 10 Hari\n* 🛍️ Status: Suksess ✓\n\`Premium Otomatis Masuk\`\n\n*💬 Pesan Owner:*\nMakasih Sudah Berbelanja Di Toko Lann4you Melalui Bot Kami ❤️`;
            } else if (wait.nominal === 23000) {
                sukses = `✅ *Transaksi Berhasil!*\n\n\`Pembelian\`\n* 👑 Premium: 3 Bulan\n* 🛒 Harga: Rp.23,000\n* 🎁 Bonus: 10,000 Limit\n* 📅 Bonus Hari: 15 Hari\n* 🛍️ Status: Suksess ✓\n\`Premium Otomatis Masuk\`\n\n*💬 Pesan Owner:*\nMakasih Sudah Berbelanja Di Toko Lann4you Melalui Bot Kami ❤️`;
            } else if (wait.nominal === 50000) {
                sukses = `✅ *Transaksi Berhasil!*\n\n\`Pembelian\`\n* 👑 Premium: 8 Bulan\n* 🛒 Harga: Rp.50,000\n* 🎁 Bonus: 25,000 Limit\n* 📅 Bonus Hari: 30 Hari\n* 🛍️ Status: Suksess ✓\n\`Premium Otomatis Masuk\`\n\n*💬 Pesan Owner:*\nMakasih Sudah Berbelanja Di Toko Lann4you Melalui Bot Kami ❤️`;
            } else if (wait.nominal === 90000) {
                sukses = `✅ *Transaksi Berhasil!*\n\n\`Pembelian\`\n* 👑 Premium: 1 Tahun\n* 🛒 Harga: Rp.90,000\n* 🎁 Bonus: 50,000 Limit\n* 📅 Bonus Hari: 45 Hari\n* 🛍️ Status: Suksess ✓\n\`Premium Otomatis Masuk\`\n\n*💬 Pesan Owner:*\nMakasih Sudah Berbelanja Di Toko Lann4you Melalui Bot Kami ❤️`;
            } else if (wait.nominal === 300000) {
                sukses = `✅ *Transaksi Berhasil!*\n\n\`Pembelian\`\n* 👑 Premium: Permanen\n* 🛒 Harga: Rp.300,000\n* 🎁 Bonus: 100,000 Limit\n* 📅 Bonus Hari: ∞\n* 🛍️ Status: Suksess ✓\n\`Premium Otomatis Masuk\`\n\n*💬 Pesan Owner:*\nMakasih Sudah Berbelanja Di Toko Lann4you Melalui Bot Kami ❤️`;
            }
            m.reply(`✅ *Transaksi Sukses*`)
            await conn.reply(wait.room, sukses, m);
            let buyer = global.db.data.users[wait.buyer];
            let jumlahHari = 86400000 * wait.prem
            let now = new Date() * 1
            if (now < buyer.premiumTime) buyer.premiumTime += jumlahHari
            else buyer.premiumTime = now + jumlahHari 
            buyer.premium = true
            buyer.limit += wait.lim
            delete conn.loading[nuy];
        } else if (selectedButton === 'tidak') {
            let nuy = '18254873441@s.whatsapp.net';
            let tidak = `[❌] *Transaksi Gagal!*\n\n\`Pembelian:\`\n* 👑 Premium: ${wait.prem < 999999999999 ? + wait.prem + ' Days' : 'Permanen'}\n* 🛒 Harga: ${wait.nominal.toLocaleString()}\n* 🛍️ Status: Gagal X\n\n*💬 Pesan Owner:*\n*Maaf Transaksi Anda Kami Tolak, Di Karenakan Tidak Sesuai.*`;
            m.reply(`❌ *Transaksi Gagal*`)
            await conn.reply(wait.room, tidak, m);
            delete conn.loading[nuy];
        }
    }
   } else if (pendings) {
            pendings.status = 'pending';
            if (selectedButton === 'qris') {
            m.reply(`*Mohon Tunggu.*`)
            await conn.sendFile(m.chat, 'https://telegra.ph/file/34257e96de4baa33189f6.jpg', 'nuy.jpg', `*Scan QR Ini*\n\nJika Sudah Transfer, Kirim Dahulu Bukti Transfer nya, Lalu Reply Fotonya Dan Ketik *Transaksi*`, m);
        } else if (selectedButton === 'contoh') {
         m.reply(`*Mohon Tunggu*`)
         await conn.sendFile(m.chat, 'https://telegra.ph/file/f01bdcdf8394d1cb101e6.jpg', 'contoh.jpg', `*Contoh Mengirim Bukti Transfer*`, m)
            }
       }
    } else if (pendings && m.sender === pendings.buyer && pendings.status == 'pending' && /^(transaksi)/i.test(m.text)) {
            let q = m.quoted ? m.quoted : m
            let mime = (q.message || q).mimetype || ''
            if (!mime) return m.reply(`Kirim Dahulu Bukti Transaksinya, Lalu Reply Fotonya Dan Ketik *Transaksi*`);

            let img = await q.download();
            let image = await uploadImage(img);
            let nuy = '18254873441@s.whatsapp.net'
            this.loading[nuy] = {
                status: 'pending',
                buyer: pendings.buyer,
                room: pendings.room,
                nominal: pendings.nominal,
                prem: pendings.prem,
                lim: pendings.lim,
            };
            wait = this.loading[nuy]
            let d = new Date(new Date + 3600000)
            let locale = 'id'
            let time = d.toLocaleTimeString(locale, { timeZone: 'Asia/Jakarta' })
            time = time.replace(/[.]/g, ':')
            if (wait.prem == 999999999999) {
            wait.prem = 'Permanen'
            }
            await conn.reply(m.chat, `[❕] *Transaksi Di pendings*\n* 🏷️ Premium: ${wait.prem < 999999999999 ? + wait.prem + ' Days' : 'Permanen'}\n* 🛒 Harga: Rp.${pendings.nominal.toLocaleString()}\n* 🕓 Status: PENDING\n\`Tunggu Respon Dari Owner, Jika Owner Tidak Merespon, Anda Bisa Chat Owner\``, m);
            let nuyy = `Hai Rijalganzz👋🏻❤️\nAda Transaksi Premium Yang Pending Nihh, Yuu Konfirmasi\n\n\`Pembelian:\`\n* 👑 Premium: ${wait.prem < 999999999999 ? + wait.prem + ' Days' : 'Permanen'}\n* 🛒 Harga: Rp.${wait.nominal.toLocaleString()}\n* 🕓 Status: PENDING\n\n\`Waktu Transaksi\`\n* ⏰ Pada Jam: ${time}`;
            let msg = generateWAMessageFromContent(m.chat, {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: {
                            deviceListMetadata: {},
                            deviceListMetadataVersion: 2
                        },
                        interactiveMessage: proto.Message.InteractiveMessage.create({
                            body: proto.Message.InteractiveMessage.Body.create({
                                text: nuyy,
                            }),
                            footer: proto.Message.InteractiveMessage.Footer.create({
                                text: "© Rijalganzz"
                            }),
                            header: proto.Message.InteractiveMessage.Header.create({
                                title: '\t*🛍️ TRANSAKSI PENDING*\n',
                                subtitle: "",
                                hasMediaAttachment: true,
                                ...(await prepareWAMessageMedia({ image: { url: image } }, { upload: conn.waUploadToServer }))
                            }),
                            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                buttons: [
                                    {
                                        name: "quick_reply",
                                        buttonParamsJson: "{\"display_text\":\"✅ Terima Transaksi\",\"id\":\"sukses\"}"
                                    },
                                    {
                                        name: "quick_reply",
                                        buttonParamsJson: "{\"display_text\":\"❌ Tolak Transaksi\",\"id\":\"tidak\"}"
                                    },
                                ],
                            })
                        })
                    },
                }
            }, {});
            await conn.relayMessage(nuy, msg.message, { messageId: msg.key.id });
            delete conn.prem[m.chat];
    }
}

export default handler;

 
function diskon(m) {
    if (global.diskonprem == 'true') {
        return '✓'
    } 
}