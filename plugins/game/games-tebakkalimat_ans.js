/*
* Nama Fitur : Game Tebak Kalimat
* Type : Plugins ESM
* Sumber : https://whatsapp.com/channel/0029Vb6p7345a23vpJBq3a1h
* Channel Testimoni : https://whatsapp.com/channel/0029Vb6B91zEVccCAAsrpV2q
* Group Bot : https://chat.whatsapp.com/CBQiK8LWkAl2W2UWecJ0BG
* Author : 𝐅𝐚𝐫𝐢𝐞l
* Nomor Author : https://wa.me/6282152706113
*/

import similarity from 'similarity';
const threshold = 0.72;

let handler = m => m;

handler.before = async function (m) {
    let id = m.chat;

    if (!this.tebakkalimat || !(id in this.tebakkalimat)) {
        return !0;
    }

    const game = this.tebakkalimat[id];
    const questionMessage = game[0];
    let json = JSON.parse(JSON.stringify(game[1]));
    
    if (m.text && m.text.toLowerCase().trim() === 'nyerah') {
        let buttons = [
            { buttonId: '.tebakkalimat', buttonText: { displayText: 'Main Lagi 🔄' }, type: 1 }
        ];
        let buttonMessage = {
            text: `*☹️ Yah Menyerah❗*\nJawabannya Adalah: *${json.jawaban}*`,
            footer: 'Klik tombol dibawah untuk bermain lagi!',
            buttons: buttons,
            headerType: 4
        };

        await this.sendMessage(m.chat, buttonMessage, { quoted: questionMessage }); 
        clearTimeout(game[3]);
        delete this.tebakkalimat[id];
        return !0;
    }

    if (!m.quoted) {
        return !0;
    }

    if (m.quoted.id !== questionMessage.id) {
        return !0;
    }

    if (m.text && /^(tela|hint)$/i.test(m.text.trim())) {
        return !0; 
    }

    if (m.text.toLowerCase() == json.jawaban.toLowerCase().trim()) {
        global.db.data.users[m.sender].exp += game[2];
        let buttons = [
            { buttonId: '.tebakkalimat', buttonText: { displayText: 'Main Lagi 🔄' }, type: 1 }
        ];
        let buttonMessage = {
            text: `🎉 *Benar!*🎉\n➕${game[2]} Kredit sosial`,
            footer: 'Klik tombol dibawah untuk bermain lagi!',
            buttons: buttons,
            headerType: 4
        };
        await this.sendMessage(m.chat, buttonMessage, { quoted: m });
        clearTimeout(game[3]); 
        
        delete this.tebakkalimat[id]; 
        
    } else if (similarity(m.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold) {
        m.reply(`❗ *Dikit Lagi!*`);
    } else {
        m.reply(`❌ *Salah!*`);
    }
    
    return !0;
}

handler.exp = 0;

export default handler;

/*
* Nama Fitur : Game Tebak Kalimat
* Type : Plugins ESM
* Sumber : https://whatsapp.com/channel/0029Vb6p7345a23vpJBq3a1h
* Channel Testimoni : https://whatsapp.com/channel/0029Vb6B91zEVccCAAsrpV2q
* Group Bot : https://chat.whatsapp.com/CBQiK8LWkAl2W2UWecJ0BG
* Author : 𝐅𝐚𝐫𝐢𝐞l
* Nomor Author : https://wa.me/6282152706113
*/