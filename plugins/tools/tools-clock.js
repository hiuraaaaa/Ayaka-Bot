   import fetch from 'node-fetch';
   let handler = async (m, { conn, args }) => {
     let date = new Date();

     //Opsi 1: Menggunakan toLocaleTimeString dengan opsi zona waktu (paling disarankan jika didukung)
     let waktuLokal = date.toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta' }); //Ganti Asia/Jakarta sesuai zona waktu Anda
     let tanggalLokal = date.toLocaleDateString('id-ID', { timeZone: 'Asia/Jakarta' });


     //Opsi 2: Menggunakan Intl.DateTimeFormat (Alternatif jika toLocaleTimeString tidak bekerja)
     // const formatterWaktu = new Intl.DateTimeFormat('id-ID', { hour: 'numeric', minute: 'numeric', second: 'numeric', timeZone: 'Asia/Jakarta' });
     // const formatterTanggal = new Intl.DateTimeFormat('id-ID', { year: 'numeric', month: 'numeric', day: 'numeric', timeZone: 'Asia/Jakarta' });

     // const waktuLokal = formatterWaktu.format(date);
     // const tanggalLokal = formatterTanggal.format(date);


     let clockString = `📅 Tanggal: ${tanggalLokal}
⏰ Waktu: ${waktuLokal}`;

     conn.reply(m.chat, clockString, m);
   }

   handler.help = ['kalender'];
   handler.tags = ['tools'];
   handler.command = /^(clock|kalender|waktu)$/i;

   export default handler
   
   /* JANGAN HAPUS WM INI MEK
SCRIPT BY © 𝐅𝐚𝐫𝐢𝐞𝐥
•• contacts: (6287872545804)
•• instagram: @Ayakaai__
•• group bot: https://chat.whatsapp.com/CBQiK8LWkAl2W2UWecJ0BG
*/