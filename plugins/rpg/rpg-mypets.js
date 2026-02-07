let handler = async(m, { command, conn }) => {
    let { kucing, kuda, naga, kyubi, centaur, rubah, phonix, griffin, serigala, makananpet } = global.db.data.users[m.sender]
    let { healtkucing, healtkuda, healtnaga, healtkyubi, healtcentaur, healtrubah, healtphonix, healtgriffin, healtserigala } = global.db.data.users[m.sender]
    let { healthkucing, healthkuda, healthnaga, healthkyubi, healthcentaur, healthrubah, healthphonix, healthgriffin, healthserigala } = global.db.data.users[m.sender]
    
    let cap = `*〔 P E T  C O N D I T I O N 〕*
    
*[👤] Pemilik:*
* @${m.sender.replace(/@.+/, '')}

*[🐈] Kucing:*
* *Level:* ${kucing == 0 ? 'Tidak Punya' : '' || kucing == 1 ? '1 / Max 5' : '' || kucing == 2 ? '2 / Max 5' : '' || kucing == 3 ? '3 / Max 5' : '' || kucing == 4 ? '4 / Max 5' : '' || kucing == 5 ? 'Level Max' : ''}
* *Healt:* ${healtkucing.toLocaleString()} / ${healthkucing.toLocaleString()}

*[🐎] Kuda:*
* *Level:* ${kuda == 0 ? 'Tidak Punya' : '' || kuda == 1 ? '1 / Max 10' : '' || kuda == 2 ? '2 / Max 10' : '' || kuda == 3 ? '3 / Max 10' : '' || kuda == 4 ? '4 / Max 10' : '' || kuda == 5 ? '5 / Max 10' : '' || kuda == 6 ? '6 / Max 10' : '' || kuda == 7 ? '7 / Max 10' : '' || kuda == 8 ? '8 / Max 10' : '' || kuda == 9 ? '9 / Max 10' : '' || kuda == 10 ? 'Level Max' : ''}
* *Healt:* ${healtkuda.toLocaleString()} / ${healthkuda.toLocaleString()}

*[🐉] Naga:*
* *Level:* ${naga == 0 ? 'Tidak Punya' : '' || naga == 1 ? '1 / Max 20' : '' || naga == 2 ? '2 / Max 20' : '' || naga == 3 ? '3 / Max 20' : '' || naga == 4 ? '4 / Max 20' : '' || naga == 5 ? 'Level 5 / Max Level 20' : '' || naga == 6 ? '6 / Max 20' : '' || naga == 7 ? '7 / Max 20' : '' || naga == 8 ? '8 / Max 20' : '' || naga == 9 ? '9 / Max 20' : '' || naga == 10 ? '10 / Max 20' : '' || naga == 11 ? '11 / Max 20' : '' || naga == 12 ? '12 / Max 20' : '' || naga == 13 ? '13 / Max 20' : '' || naga == 14 ? '14 / Max 20' : '' || naga == 15 ? 'Level 15 / Max Level 20' : '' || naga == 16 ? '16 / Max 20' : '' || naga == 17 ? '17 / Max 20' : '' || naga == 18 ? '18 / Max 20' : '' || naga == 19 ? '19 / Max 20' : '' || naga == 20 ? 'Level Max' : ''}
* *Healt:* ${healtnaga.toLocaleString()} / ${healthnaga.toLocaleString()}

*[🦊] Kyubi:*
* *Level:* ${kyubi == 0 ? 'Tidak Punya' : '' || kyubi == 1 ? '1 / Max 20' : '' || kyubi == 2 ? '2 / Max 20' : '' || kyubi == 3 ? '3 / Max 20' : '' || kyubi == 4 ? '4 / Max 20' : '' || kyubi == 5 ? 'Level 5 / Max Level 20' : '' || kyubi == 6 ? '6 / Max 20' : '' || kyubi == 7 ? '7 / Max 20' : '' || kyubi == 8 ? '8 / Max 20' : '' || kyubi == 9 ? '9 / Max 20' : '' || kyubi == 10 ? '10 / Max 20' : '' || kyubi == 11 ? '11 / Max 20' : '' || kyubi == 12 ? '12 / Max 20' : '' || kyubi == 13 ? '13 / Max 20' : '' || kyubi == 14 ? '14 / Max 20' : '' || kyubi == 15 ? 'Level 15 / Max Level 20' : '' || kyubi == 16 ? '16 / Max 20' : '' || kyubi == 17 ? '17 / Max 20' : '' || kyubi == 18 ? '18 / Max 20' : '' || kyubi == 19 ? '19 / Max 20' : '' || kyubi == 20 ? 'Level Max' : ''}
* *Healt:* ${healtkyubi.toLocaleString()} / ${healthkyubi.toLocaleString()}

*[🦖] Centaur:*
* *Level:* ${centaur == 0 ? 'Tidak Punya' : '' || centaur == 1 ? '1 / Max 20' : '' || centaur == 2 ? '2 / Max 20' : '' || centaur == 3 ? '3 / Max 20' : '' || centaur == 4 ? '4 / Max 20' : '' || centaur == 5 ? 'Level 5 / Max Level 20' : '' || centaur == 6 ? '6 / Max 20' : '' || centaur == 7 ? '7 / Max 20' : '' || centaur == 8 ? '8 / Max 20' : '' || centaur == 9 ? '9 / Max 20' : '' || centaur == 10 ? '10 / Max 20' : '' || centaur == 11 ? '11 / Max 20' : '' || centaur == 12 ? '12 / Max 20' : '' || centaur == 13 ? '13 / Max 20' : '' || centaur == 14 ? '14 / Max 20' : '' || centaur == 15 ? 'Level 15 / Max Level 20' : '' || centaur == 16 ? '16 / Max 20' : '' || centaur == 17 ? '17 / Max 20' : '' || centaur == 18 ? '18 / Max 20' : '' || centaur == 19 ? '19 / Max 20' : '' || centaur == 20 ? 'Level Max' : ''}
* *Healt:* ${healtcentaur.toLocaleString()} / ${healthcentaur.toLocaleString()}

*[🦊] Rubah:*
* *Level:* ${rubah == 0 ? 'Tidak Punya' : '' || rubah == 1 ? '1 / Max 10' : '' || rubah == 2 ? '2 / Max 10' : '' || rubah == 3 ? '3 / Max 10' : '' || rubah == 4 ? '4 / Max 10' : '' || rubah == 5 ? '5 / Max 10' : '' || rubah == 6 ? '6 / Max 10' : '' || rubah == 7 ? '7 / Max 10' : '' || rubah == 8 ? '8 / Max 10' : '' || rubah == 9 ? '9 / Max 10' : '' || rubah == 10 ? 'Level Max' : ''}
* *Healt:* ${healtrubah.toLocaleString()} / ${healthrubah.toLocaleString()}

*[🕊️] Phonix:*
* *Level:* ${phonix == 0 ? 'Tidak Punya' : '' || phonix == 1 ? '1 / Max 15' : '' || phonix == 2 ? '2 / Max 15' : '' || phonix == 3 ? '3 / Max 15' : '' || phonix == 4 ? '4 / Max 15' : '' || phonix == 5 ? '5 / Max 15' : '' || phonix == 6 ? '6 / Max 15' : '' || phonix == 7 ? '7 / Max 15' : '' || phonix == 8 ? '8 / Max 15' : '' || phonix == 9 ? '9 / Max 15' : '' || phonix == 10 ? '10 / Max 15' : '' || phonix == 11 ? '11 / Max 15' : '' || phonix == 12 ? '12 / Max 15' : '' || phonix == 13 ? '13 / Max 15' : '' || phonix == 14 ? '14 / Max 15' : '' || phonix == 15 ? 'Level Max' : ''}
* *Healt:* ${healtphonix.toLocaleString()} / ${healthphonix.toLocaleString()}

*[🦅] Griffin:*
* *Level:* ${griffin == 0 ? 'Tidak Punya' : '' || griffin == 1 ? '1 / Max 15' : '' || griffin == 2 ? '2 / Max 15' : '' || griffin == 3 ? '3 / Max 15' : '' || griffin == 4 ? '4 / Max 15' : '' || griffin == 5 ? '5 / Max 15' : '' || griffin == 6 ? '6 / Max 15' : '' || griffin == 7 ? '7 / Max 15' : '' || griffin == 8 ? '8 / Max 15' : '' || griffin == 9 ? '9 / Max 15' : '' || griffin == 10 ? '10 / Max 15' : '' || griffin == 11 ? '11 / Max 15' : '' || griffin == 12 ? '12 / Max 15' : '' || griffin == 13 ? '13 / Max 15' : '' || griffin == 14 ? '14 / Max 15' : '' || griffin == 15 ? 'Level Max' : ''}
* *Healt:* ${healtgriffin.toLocaleString()} / ${healthgriffin.toLocaleString()}

*[🐺] Serigala:*
* *Level:* ${serigala == 0 ? 'Tidak Punya' : '' || serigala == 1 ? '1 / Max 15' : '' || serigala == 2 ? '2 / Max 15' : '' || serigala == 3 ? '3 / Max 15' : '' || serigala == 4 ? '4 / Max 15' : '' || serigala == 5 ? '5 / Max 15' : '' || serigala == 6 ? '6 / Max 15' : '' || serigala == 7 ? '7 / Max 15' : '' || serigala == 8 ? '8 / Max 15' : '' || serigala == 9 ? '9 / Max 15' : '' || serigala == 10 ? '10 / Max 15' : '' || serigala == 11 ? '11 / Max 15' : '' || serigala == 12 ? '12 / Max 15' : '' || serigala == 13 ? '13 / Max 15' : '' || serigala == 14 ? '14 / Max 15' : '' || serigala == 15 ? 'Level Max' : ''}
* *Healt:* ${healtserigala.toLocaleString()} / ${healthserigala.toLocaleString()}

*[🍬] Makanan Pet:*
* *Makanan:* ${makananpet.toLocaleString()}
`.trim()

conn.sendMessage(m.chat, {
    text: cap, 
    contextInfo: {
    mentionedJid: [m.sender],
    externalAdReply :{
    mediaUrl: '', 
    mediaType: 1,
    title: 'M y. P e t s',
    body: '', 
    thumbnailUrl: 'https://telegra.ph/file/d6249aa40851107832c9f.png', 
    sourceUrl: 'https://www.instagram.com/mycyll.7',
    renderLargerThumbnail: true, 
    showAdAttribution: false
    }}}, { quoted: flok})
}

handler.tags = ['rpg']
handler.help = ['pets','mypets']
handler.command = /^(mypets|pets)$/i

export default handler