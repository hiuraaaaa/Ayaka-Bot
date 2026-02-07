let handler = async(m, { text, conn, usedPrefix, command }) => {
  let cap = `*[ Text To Image ]*

✦─────────────────────✦

*Tutorial Penggunaan*
* Kamu bisa membuat gambar dengan text, gambar tidak di haruskan menggunakan bahasa inggris, cara menggunakan fitur nya, kamu harus membuat prompt, apa itu prompt?, prompt adalah sebuah perintah atau text yang akan menjadi gambar
* *Contoh Prompt B Inggris:* 1girl black hijab black robe
* *Contoh Prompt B Indonesia:* 1 wanita, hijab hitam, gamis hitam
* Jika hasilnya ingin terlihat seperti nyata dan realistis, kamu bisa tambahkan Text ini di belakang prompt *( Super Realistic Super Smooth 8K HD 4K Sharps )*
* *Contoh agar menjadi realistis:* 1girl black hijab black robe realistic HD 4K Super Realistic Smooth Sharps
* Kamu juga bisa menggunakan selain bahasa Inggris, (tidak di haruskan menggunakan bahasa inggris) tapi saya sarankan menggunakan bahasa inggris agar kualitas gambarnya terlihat realistis, Kamu bisa coba menggunakan prompt/text yang saya contohkan

*Terimakasih.*`
  m.reply(cap)
}
handler.command = /^(tutortxt2img)$/i
handler.tags = ['ai']
handler.help = ['tutortxt2img']

export default handler