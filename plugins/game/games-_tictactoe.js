
import { format } from 'util'
import { generateWAMessageFromContent } from '@adiwajshing/baileys'

let debugMode = !1
let winScore = 200
let playScore = 99

function getOriginalJid(lidJid, participants) {
 if (!lidJid) return lidJid;
 if (!lidJid.endsWith('@lid')) return lidJid;
 if (!participants || participants.length === 0) return lidJid;
 
 const participant = participants.find(p => p.id === lidJid);
 if (participant && participant.jid) {
 return participant.jid;
 } 
 return lidJid;
}

export async function before(m) {
 let ok
 let isWin = !1
 let isTie = !1
 let isSurrender = !1
 this.game = this.game ? this.game : {}
 let room = Object.values(this.game).find(room => room.id && room.game && room.state && room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(m.sender) && room.state == 'PLAYING')
 
 if (room) {
 const fkontak = {
 key: { participant: '0@s.whatsapp.net', remoteJid: '0@s.whatsapp.net', fromMe: false, id: 'Halo' },
 message: { conversation: `Tic Tac Toe ✖️⭕` }
 };

 let participants = room.participants || [];

 if (!/^([1-9]|(me)?nyerah|surr?ender)$/i.test(m.text))
 return !0
 isSurrender = !/^[1-9]$/.test(m.text)
 if (m.sender !== room.game.currentTurn) {
 if (!isSurrender)
 return !0
 }
 if (debugMode)
 m.reply('[DEBUG]\n' + require('util').format({
 isSurrender,
 text: m.text
 }))
 if (!isSurrender && 1 > (ok = room.game.turn(m.sender === room.game.playerO, parseInt(m.text) - 1))) {
 m.reply({
 '-3': '🚩 Game telah berakhir', '-2': '❗Invalid',
 '-1': '❗Posisi Invalid', 0: '❗Posisi Invalid',
 }[ok])
 return !0
 }
 if (m.sender === room.game.winner)
 isWin = true
 else if (room.game.board === 511)
 isTie = true
 let arr = room.game.render().map(v => {
 return {
 X: '❌', O: '⭕', 1: '1️⃣', 2: '2️⃣', 3: '3️⃣',
 4: '4️⃣', 5: '5️⃣', 6: '6️⃣', 7: '7️⃣', 8: '8️⃣', 9: '9️⃣',
 }[v]
 })
 if (isSurrender) {
 room.game._currentTurn = m.sender === room.game.playerX
 isWin = true
 }
  let winner = isSurrender ? room.game.currentTurn : room.game.winner
 let realWinner = getOriginalJid(winner, participants);
 let realPlayerX = getOriginalJid(room.game.playerX, participants);
 let realPlayerO = getOriginalJid(room.game.playerO, participants);
 let realCurrentTurn = getOriginalJid(room.game.currentTurn, participants);

 let board = `${arr.slice(0, 3).join('')}\n${arr.slice(3, 6).join('')}\n${arr.slice(6).join('')}`;
 let status = isWin ? `@${realWinner.split('@')[0]} 🎉𝗠𝗘𝗡𝗔𝗡𝗚!🎉\n*🎁 Hadiah:* ➕ ${winScore} ✨XP` : isTie ? `🤝𝗦𝗘𝗥𝗜!🤝\n*🎁 Hadiah:* ➕ ${playScore} ✨XP` : `*🔄 Giliran:* ${['❌', '⭕'][1 * room.game._currentTurn]} @${realCurrentTurn.split('@')[0]}`;


 let plainTextStr = `
${board}
${status}
*❌:* @${realPlayerX.split('@')[0]}
*⭕:* @${realPlayerO.split('@')[0]}
*🆔 Room ID:* ${room.id}
`.trim()

 let users = global.db.data.users
 if ((room.game._currentTurn ^ isSurrender ? room.x : room.o) !== m.chat)
 room[room.game._currentTurn ^ isSurrender ? 'x' : 'o'] = m.chat

 if (isTie || isWin) {
 const finalButtons = [
 { buttonId: '.ttt', buttonText: { displayText: 'Bermain Lagi 🔄' }, type: 1 }
 ];
 
 let mentions = [realPlayerX, realPlayerO];
 if (isWin) {
     mentions.push(realWinner); 
 }

 const finalMessage = {
 text: plainTextStr,
 footer: 'Klik tombol untuk bermain lagi',
 buttons: finalButtons,
 headerType: 1, 
 contextInfo: {
     mentionedJid: mentions
 }
 };
 
 if (room.x !== room.o) {
 await this.sendMessage(room.x, finalMessage, { quoted: fkontak });
 }
 await this.sendMessage(room.o, finalMessage, { quoted: fkontak });
 
 if (!users[room.game.playerX]) users[room.game.playerX] = {};
 if (!users[room.game.playerO]) users[room.game.playerO] = {};
 users[room.game.playerX].exp += playScore
 users[room.game.playerO].exp += playScore
 users[room.game.playerX].ttt_ties = (users[room.game.playerX].ttt_ties || 0)
 users[room.game.playerX].ttt_wins = (users[room.game.playerX].ttt_wins || 0)
 users[room.game.playerX].ttt_losses = (users[room.game.playerX].ttt_losses || 0)
 users[room.game.playerO].ttt_ties = (users[room.game.playerO].ttt_ties || 0)
 users[room.game.playerO].ttt_wins = (users[room.game.playerO].ttt_wins || 0)
 users[room.game.playerO].ttt_losses = (users[room.game.playerO].ttt_losses || 0)

 if (isWin) {
 users[winner].exp += winScore - playScore
 let loser = (winner === room.game.playerX) ? room.game.playerO : room.game.playerX;
 users[winner].ttt_wins += 1;
 users[loser].ttt_losses += 1;
 } else if (isTie) {
 users[room.game.playerX].ttt_ties += 1;
 users[room.game.playerO].ttt_ties += 1;
 }


 if (debugMode)
 m.reply('[DEBUG]\n' + format(room))
 delete this.game[room.id]

 } else {

 const nativeFlowRows = [];
 for (let i = 1; i <= 9; i++) {
    if (/\d/.test(arr[i-1])) {
        nativeFlowRows.push({
            header: "",
            title: `Pilih Kotak ${i}`,
            description: `Klik untuk mengisi kotak ${i}`,
            id: `${i}`
        });
    }
 }
 nativeFlowRows.push({
    header: "",
    title: 'Menyerah 🏳️',
    description: 'Keluar dari permainan',
    id: 'nyerah'
 });
 
 let msgBody = `${board}\n\n${status}\n*❌:* @${realPlayerX.split('@')[0]}\n*⭕:* @${realPlayerO.split('@')[0]}\n*🆔 Room ID:* ${room.id}`;
 let footerText = `➡️ Tekan tombol di bawah untuk melangkah.`;

 let mentionedJids = [realPlayerX, realPlayerO, realCurrentTurn];
 
   const interactiveMessagePayload = {
    viewOnceMessage: {
        message: {
            interactiveMessage: {
                body: { text: msgBody },
                footer: { text: footerText },
                header: {
                    title: "Tic Tac Toe ✖️⭕",
                    subtitle: "Giliranmu!",
                    hasMediaAttachment: false
                },
                nativeFlowMessage: {
                    buttons: [{
                        name: "single_select",
                        buttonParamsJson: JSON.stringify({
                            title: "Pilih Langkahmu",
                            sections: [{
                                title: "Pilihan Kotak Tersedia",
                                rows: nativeFlowRows
                            }]
                        })
                    }]
                },
                contextInfo: {
                    mentionedJid: mentionedJids
                }
            }
        }
    }
 };

 if (room.x !== room.o) {
    let msgX = await generateWAMessageFromContent(room.x, interactiveMessagePayload, { quoted: fkontak });
    await this.relayMessage(room.x, msgX.message, { messageId: msgX.key.id });
 }
 let msgO = await generateWAMessageFromContent(room.o, interactiveMessagePayload, { quoted: fkontak });
 await this.relayMessage(room.o, msgO.message, { messageId: msgO.key.id });
 }
 }
 return !0
}