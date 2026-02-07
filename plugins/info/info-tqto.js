import fs from 'fs'

let handler = async (m, { conn }) => {
	let tqto = `بسم الله الرحمن الرحيم
	
*Makasih..☘️*
_Kepada semuanya, yang telah mengajarkan dan membimbing saya sedikit demi sedikit, sehingga saya bisa melampaui semua kebingungan dan ke-awaman saya terhadap semua tentang ini, meskipun saya blum tau blum paham betul dengan semuanya, tapi, saya gak akan nyerah, dan makasii udah support saya sampai titik dan detik ini.._

© Rijalganzz!
`;
	await conn.sendMessage(m.chat, {
    text: tqto, 
    contextInfo: {
    externalAdReply :{
    mediaUrl: 'https://github.com/RIJALGANZZZ', 
    mediaType: 1,
    title: 'Thanks too all ☘️',
    body: '© Rijalganzz!', 
    thumbnailUrl: 'https://raw.githubusercontent.com/RIJALGANZZZ/dat1/main/uploads/1ab18d12.jpg', 
    sourceUrl: 'https://github.com/RIJALGANZZZ',
    renderLargerThumbnail: true, 
    showAdAttribution: false
    }}}, {quoted: flok})
}
handler.help = ['tqto']
handler.tags = ['info']
handler.command = /^(tqto)$/i;

export default handler;