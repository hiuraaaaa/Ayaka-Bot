/*
* Nama Fitur : Game Batu Gunting Kertas
* Type : Plugins ESM
* Sumber : https://whatsapp.com/channel/0029Vb6p7345a23vpJBq3a1h
* Channel Testimoni : https://whatsapp.com/channel/0029Vb6B91zEVccCAAsrpV2q
* Group Bot : https://chat.whatsapp.com/CBQiK8LWkAl2W2UWecJ0BG
* Author : 𝐅𝐚𝐫𝐢𝐞l
* Nomor Author : https://wa.me/6282152706113
*/

import db from '../lib/database.js'
const fkontak = {
 key: { participant: '0@s.whatsapp.net', remoteJid: '0@s.whatsapp.net', fromMe: false, id: 'Halo' },
 message: { conversation: `Game Batu Gunting Kertas ✨` }
};

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let poin = 300
    let reseqv = `✳️ Pilih *Batu*, *Gunting*, atau *Kertas*!`
    
    const userTag = `@${m.sender.split('@')[0]}`;
    const mentionedJid = [m.sender];

    if (!text) {
        const initialButtons = [
            { buttonId: usedPrefix + command + ' rock', buttonText: { displayText: 'Batu 🪨' }, type: 1 },
            { buttonId: usedPrefix + command + ' scissors', buttonText: { displayText: 'Gunting ✂️' }, type: 1 },
            { buttonId: usedPrefix + command + ' paper', buttonText: { displayText: 'Kertas 📄' }, type: 1 }
        ];

        const initialMessage = {
            text: reseqv,
            footer: 'Pilih salah satu tombol di bawah ini!',
            buttons: initialButtons,
            headerType: 1
        };

        return conn.sendMessage(m.chat, initialMessage, { quoted: fkontak });
    }

    text = text.trim().toLowerCase();
    
    if (!['rock', 'scissors', 'paper'].includes(text)) {
        throw reseqv
    }

    var astro = Math.random()

    if (astro < 0.34) {
        astro = 'rock'
    } else if (astro > 0.34 && astro < 0.67) {
        astro = 'scissors'
    } else {
        astro = 'paper'
    }

    let resultMessage = '';
    let isWin = false;
    let isTie = false;
    let xpChange = 0;
    
    if (text == astro) {
        isTie = true;
        xpChange = 100;
        resultMessage = `🤝 *𝗦𝗲𝗿𝗶!* 🤝`;
        global.db.data.users[m.sender].exp += xpChange;
    } else if (
        (text == 'rock' && astro == 'scissors') ||
        (text == 'scissors' && astro == 'paper') ||
        (text == 'paper' && astro == 'rock')
    ) {
        isWin = true;
        xpChange = poin;
        resultMessage = `🎉 *𝗠𝗲𝗻𝗮𝗻𝗴!* 🎉`;
        global.db.data.users[m.sender].exp += xpChange;
    } else {
        xpChange = poin;
        resultMessage = `😞 *𝗞𝗮𝗹𝗮𝗵!* 😞`;
        global.db.data.users[m.sender].exp -= xpChange;
    }
    
    const getEmoji = (pilihan) => {
        if (pilihan === 'rock') return '🪨 Batu';
        if (pilihan === 'scissors') return '✂️ Gunting';
        if (pilihan === 'paper') return '📄 Kertas';
        return pilihan;
    };
   
    let finalCaption = `${resultMessage}\n\n`
    finalCaption += `‣ ${userTag}: ${getEmoji(text)}\n`
    finalCaption += `‣ ${global.namebot}: ${getEmoji(astro)}\n\n`
    
    if (isTie) {
        finalCaption += `🎁 Poin: *➕${xpChange} ✨XP*`
    } else if (isWin) {
        finalCaption += `🎁 Poin: *➕${xpChange} ✨XP*`
    } else {
        finalCaption += `💔 Poin: *➖${xpChange} ✨XP*`
    }
    
    // Button "Main Lagi"
    const resultButtons = [
        { buttonId: usedPrefix + command, buttonText: { displayText: 'Main Lagi 🔄' }, type: 1 }
    ];

    const resultButtonMessage = {
        text: finalCaption,
        footer: 'Klik tombol dibawah untuk bermain lagi!',
        buttons: resultButtons,
        headerType: 1,
        contextInfo: {
            mentionedJid: mentionedJid
        }
    };
    conn.sendMessage(m.chat, resultButtonMessage, { quoted: fkontak });
}

handler.help = ['ppt <rock/paper/scissors>']
handler.tags = ['game']
handler.command = ['ppt'] 
handler.register = false

export default handler

/*
* Nama Fitur : Game Batu Gunting Kertas
* Type : Plugins ESM
* Sumber : https://whatsapp.com/channel/0029Vb6p7345a23vpJBq3a1h
* Channel Testimoni : https://whatsapp.com/channel/0029Vb6B91zEVccCAAsrpV2q
* Group Bot : https://chat.whatsapp.com/CBQiK8LWkAl2W2UWecJ0BG
* Author : 𝐅𝐚𝐫𝐢𝐞l
* Nomor Author : https://wa.me/6282152706113
*/