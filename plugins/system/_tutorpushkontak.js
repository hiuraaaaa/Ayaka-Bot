import fs from 'fs'

let handler = async (m, { conn }) => {
const fkontak = {
	"key": {
        "participant": '0@s.whatsapp.net',
            "remoteJid": "status@broadcast",
		    "fromMe": false,
		    "id": "Halo"
                        },
       "message": {
                    "locationMessage": {
                    "name": '🌸 Ayaka',
                    "jpegThumbnail": ''
                          }
                        }
                      }
	let str = `
*Panduan Fitur Pushkontak*
_\`PUSH KONTAK BY SAA\`_

• .listgc
untuk melihat semua list group join dan melihat informasi group beserta semua id group 

• .svkontakv2
fitur ini otomatis menyimpan nomor WhatsApp member di group yg di tentukan menggunakan id group

• .pushidgc
fitur ini otomatis mengirimkan pesan ke group dengan id group yg di tentukan dan bisa mengatur delay mengirim pesan agar menghindari spam

• .pushdelay
fitur ini otomatis mengirim kan pesan ke semua member group dan bisa mengatur delay mengirim pesan

• pushkontak
fitur ini otomatis mengirimkan pesan di group yg di tentukan sama seperti *pushdelay* tapi fitur ini tidak bisa mengatur delay mengirim pesan

• .svkontak
fitur ini otomatis menyimpan nomor WhatsApp member di group yg kamu mau tanpa id group jadi anda bisa mencari group terbuka untuk menyimpan kontak

• .pushidgc 
fitur ini otomatis mengirim pesan ke group yg di tentukan menggunakan id group tanpa mengatur delay pesan

• .cekid
Fitur untuk mengetahui id group yg terbuka
      
© Ayaka`
 conn.sendMessage(m.chat, {
    text: str. trim(), 
    contextInfo: {
    externalAdReply :{
    mediaUrl: '', 
    mediaType: 1,
    title: '© Ayaka 🤖',
    body: 'Lann4you!👸', 
    thumbnailUrl: thumbmenu, 
    sourceUrl: myweb,
    renderLargerThumbnail: true, 
    }}}, {quoted: flok})
}

handler.help = ['tutorpush'];
handler.tags = ['pushkontak'];
handler.command = /^(tutorpush|panduan|help)$/i;

export default handler;