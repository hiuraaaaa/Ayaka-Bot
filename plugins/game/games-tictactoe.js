
import TicTacToe from '../lib/tictactoe.js'
import { generateWAMessageFromContent } from '@adiwajshing/baileys'

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

let handler = async (m, { conn, usedPrefix, command, text, participants }) => { 
    conn.game = conn.game ? conn.game : {}
    if (Object.values(conn.game).find(room => room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(m.sender))) throw '❗Kamu masih didalam game'
    let room = Object.values(conn.game).find(room => room.state === 'WAITING' && (text ? room.name === text : true))
    
    const fkontak = {
         key: { participant: '0@s.whatsapp.net', remoteJid: '0@s.whatsapp.net', fromMe: false, id: 'Halo' },
         message: { conversation: `Tic Tac Toe ✖️⭕` }
    };

    if (room) {
        m.reply('👥 Partner ditemukan!')
        room.o = m.chat
        room.game.playerO = m.sender
        room.state = 'PLAYING'
        room.participants = [...(room.participants || []), ...(participants || [])]
        let allParticipants = room.participants;
        let arr = room.game.render().map(v => {
            return {
                X: '❌', O: '⭕', 1: '1️⃣', 2: '2️⃣', 3: '3️⃣',
                4: '4️⃣', 5: '5️⃣', 6: '6️⃣', 7: '7️⃣', 8: '8️⃣', 9: '9️⃣',
            }[v]
        })

        let realPlayerX = getOriginalJid(room.game.playerX, allParticipants);
        let realPlayerO = getOriginalJid(room.game.playerO, allParticipants);
        let realCurrentTurn = getOriginalJid(room.game.currentTurn, allParticipants);
        
        let board = `${arr.slice(0, 3).join('')}\n${arr.slice(3, 6).join('')}\n${arr.slice(6).join('')}`;
        let status = `*⏳ Menunggu:* @${realCurrentTurn.split('@')[0]}`;
        
        let mentionedJids = [realPlayerX, realPlayerO, realCurrentTurn];
        let msgText = `${board}\n\n${status}\n*❌:* @${realPlayerX.split('@')[0]}\n*⭕:* @${realPlayerO.split('@')[0]}\n*🆔 Room ID:* ${room.id}`;
        let footerText = `➡️ Tekan tombol di bawah untuk melangkah.`;

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
        
        const interactiveMessagePayload = {
            viewOnceMessage: {
                message: {
                    interactiveMessage: {
                        body: { text: msgText },
                        footer: { text: footerText },
                        header: {
                            title: "Tic Tac Toe ✖️⭕",
                            subtitle: "Permainan Dimulai!",
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
            await conn.relayMessage(room.x, msgX.message, { messageId: msgX.key.id });
        }
        let msgO = await generateWAMessageFromContent(room.o, interactiveMessagePayload, { quoted: fkontak });
        await conn.relayMessage(room.o, msgO.message, { messageId: msgO.key.id });
    } else {
    
        room = {
            id: 'tictactoe-' + (+new Date),
            x: m.chat,
            o: '',
            game: new TicTacToe(m.sender, 'o'),
            state: 'WAITING',
            participants: participants || []
        }
        if (text) room.name = text

        let joinCommand = text ? `${usedPrefix + command} ${text}` : `${usedPrefix + command}`;
        let msgText = '⏳ Menunggu partner' + (text ? ` untuk join room "${text}"` : '');
        
        const initialButtons = [
            { buttonId: joinCommand, buttonText: { displayText: 'Join Room tic-tac-toe 📥' }, type: 1 }
        ];

        const initialMessage = {
            text: msgText,
            footer: 'Klik tombol di bawah untuk bergabung!',
            buttons: initialButtons,
            headerType: 1
        };

        conn.sendMessage(m.chat, initialMessage, { quoted: fkontak });

        conn.game[room.id] = room
    }
}

handler.help = ['tictactoe', 'ttt']
handler.tags = ['game']
handler.command = /^(tictactoe|t{3})$/

export default handler