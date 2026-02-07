import fs from 'fs'
let handler = async (m, { conn }) => {
	let str = `
「 *Info Owner* 」

─「 • *Rijalganzz* • 」
* *Name :* _Rijalganzz Owner_
* *Umur :* _13 Tahun_
* *Tempat Tnggl :* _Sidoarjo_
* *Pekerjaan :* _Privasi._
* *Hobi :* _Rebahan_
* *Agama :* _Pasti tau lah ya_
──━━┉─࿂

\`IG: mycyll.7\`
`;
	await conn.sendMessage(m.chat, {
    text: str, 
    contextInfo: {
    externalAdReply :{
    mediaUrl: '', 
    mediaType: 1,
    title: '💍 INFO FURINA-MD',
    body: `© Creator ${global.namebot}`, 
    thumbnailUrl: 'https://raw.githubusercontent.com/RIJALGANZZZ/dat1/main/uploads/1ab18d12.jpg', 
    sourceUrl: 'https://github.com/RIJALGANZZZ',
    renderLargerThumbnail: true, 
    showAdAttribution: false
    }}}, { quoted: flok })
}
handler.help = ['powner']
handler.tags = ['info']

handler.premium = false

handler.command = /^(powner|pown)$/i;

export default handler;