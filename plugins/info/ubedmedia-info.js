const handler = async (m, { conn }) => {
  const info = `
*📰 ${global.namebot} MEDIA*

${global.namebot} Media adalah Sosial media di bot wa ${global.namebot} Bot, ini adalah fitur *Eksklusif* yang gak akan kalian temui di bot wa lainnya.

Di ${global.namebot} Media kalian bisa:
- Buat akun
- Edit profil
- Update status
- Lihat beranda dan status orang lain
- Komentar
- Like dan follow akun orang lain
- Mentions ke profil orang lain

Keren banget, kan?

*📌 CARA PAKAI:*

*1. Signup*
Ketik: *.signup nama|sandi* untuk membuat akun

*2. Login*
Ketik: *.login nama|sandi* untuk login

*3. Logout*
Ketik: *.logout* untuk logout

*4. Lupa Sandi*
Ketik: *.lupasandi*

*5. Update Status*
Ketik: *.updatestatus* untuk update status (maks. 2000 karakter)

*6. Beranda*
Ketik: *.beranda* untuk melihat status orang lain

*7. Beranda Gambar*
Ketik: *.berandaimg* untuk versi gambar

*8. Edit Profil*
Ketik: *.editprofil* untuk ubah nama, bio, dll

*9. Profil*
Ketik: *.profil* atau *.profile @tag* untuk lihat profil

*10. Like Status*
Ketik: *.like @tag*

*11. Follow*
Ketik: *.follow @user* atau *.unfollow @user*

*12. Komentar Status*
Ketik: *.komentar @user isi komentar*

*13. Lihat Komentar*
Ketik: *.komentarku*

*14. Notifikasi*
Ketik: *.notifikasi*

*15. Hapus Komentar*
Ketik: *.hapuskomentar*

*16. Status Verifikasi 🅥*
Kalian bisa dapat simbol verifikasi jika owner lagi baik hati. Tampil di profil dan beranda!

Selamat bersosial media di *${global.namebot} Media*!
`;

  m.reply(info.trim());
};

handler.help = ['Furinamedia'];
handler.tags = ['media'];
handler.command = /^Furinamedia$/i;

export default handler;