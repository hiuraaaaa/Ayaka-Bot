import fs from 'fs'

let handler = async (m, { conn }) => {
let loadd = [


 ]

let { key } = await conn.sendMessage(m.chat, {text: '_Loading_'})//Pengalih isu

for (let i = 0; i < loadd.length; i++) {
await conn.sendMessage(m.chat, {text: loadd[i], edit: key })}
	let pfft = `*🛒 Sell Script Bot ${global.namebot}*

\`🧾Features On Bot\`
*Features Ai*
* Ai GPT
* Ai Openai
* AI Character
* Ai Gemini (Support Image)
* Ai Mirror (Filter Image)
* Ai ToAnime
* (Using Scraper)
* DLL
*Features Download*
* Instagram
* TikTok
* TikTok (HD)
* Facebook
* Facebook (HD)
* Pinterest (DL Video)
* YT Download (Mp3/Mp4) Using Scraper
* (Full Scraper)
* DLL
*Features Game*
* TebakKata
* TebakBom
* TebakAnime
* TebakGame
* TebakLirik
* TebakLagu
* SiapakahAku?
* Family100
* YouTuber
* DLL
*RPG New Features*
* You Can Playing With Friends
* Dungeon Server Room
* Astronot Server Room
* Explore Server Room
* DLL
*Spesial Features*
* TopUp Cash Bot (Auto Payment)
* Premium Bot (AutoPayment)
* Payment Via Bot
* DLL


\`🧾 Info Script\`
*Script Baileys*
* Type Plugins
* Module ESM (@adiwajshing/baileys)
* Support All Button


\`🏷️ PAyaka List\`
* PAyaka *Rp.75,000*
* Garansi 15 Days
* Free ApiKey
* No Update!!

* PAyaka *Rp.110,000*
* Garansi 2 Bulan
* Free ApiKey
* Free Update

\`You can try it here:\`
*Minat? Chat Owner*
* WhatsApp Owner: +${global.nomorwa}
`;
conn.sendMessage(m.chat, {
      text: pfft,
      contextInfo: {
      externalAdReply: {
      title: `© ${global.namebot}`,
      body: global.author,
      thumbnailUrl: global.thumbmenu,
      sourceUrl: `https://chat.whatsapp.com/II8ht213Kkm6IFhqPcJYji`,
      mediaType: 1,
      renderLargerThumbnail: true
      }}})
}
handler.help = ['sc']
handler.tags = ['info']
handler.command = /^(sc|script)$/i;
handler.register = true
handler.private = false
export default handler;