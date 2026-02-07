import fs from 'fs'

let handler = async (m, { conn }) => {
let loadd = [
' 𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑑𝑎𝑡𝑎...',
'▒▒▒▒▒▒▒▒▒▒ 0%',
'█▒▒▒▒▒▒▒▒▒ 10%',
'███▒▒▒▒▒▒▒ 30%',
'████▒▒▒▒▒▒ 40%',
'█████▒▒▒▒▒ 50%',
'███████▒▒▒ 70%',
'█████████▒ 90%',
'██████████ 100%',
'Ｓｕｃｃｅｓｓ...'
 ]

let { key } = await conn.sendMessage(m.chat, {text: '_Loading_'})//Pengalih isu

for (let i = 0; i < loadd.length; i++) {
await conn.sendMessage(m.chat, {text: loadd[i], edit: key })}
	let pfft = `
ubah di bawah!!!
`;
 conn.sendMessage(m.chat, {
      video: { url: "https://c.termai.cc/a56/3dmPC.mp4"},
      gifPlayback: true,
      caption: 'CastoAyaka - Ai Adalah Bot WhatsApp yang dibuatkan oleh Lann4you!, Ayaka diciptakan untuk membantu user, Kegunaan Bot ini adalah untuk Main Rpg, Main Games, Ada Fitur Ai, Download Music + Video, Download Tiktok, Youtube, Ig No Wm, Download Apk, Dll, Nah, Saya Sekarang Open *SewaBot* Harga nya bisa ketik .sewa',
      contextInfo: {
      externalAdReply: {
      title: `© ${global.namebot}`,
      body: global.author,
      thumbnailUrl: global.thumbmenu,
      sourceUrl: `https://chat.whatsapp.com/GqjzpmAPVrNHrebZ6ktRr1`,
      mediaType: 1,
      renderLargerThumbnail: true
      }}})
              let vn = "./vn/galau2.mp3"
      
	conn.sendFile(m.chat, vn, "menu.mp3", null, m, true, {
		type: "audioMessage",
		ptt: true,
	});
}
handler.command = /^(about)$/i;

export default handler;