import similarity from 'similarity'
const threshold = 0.72;

export async function before(m) {
    let id = 'tebakanml-' + m.chat;
    if (!m.quoted || !m.quoted.fromMe || !m.text || !/Ketik.*tekml/i.test(m.quoted.text) || /.*tekml/i.test(m.text))
        return true;
    
    this.game = this.game ? this.game : {};
    
    if (!(id in this.game))
        return m.reply('🚩 Soal itu telah berakhir');
    
    if (m.quoted.id == this.game[id][0].id) {
        let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text);
        
        if (isSurrender) {
            let json = JSON.parse(JSON.stringify(this.game[id][1])); // Ambil jawaban sebelum menghapus game
            clearTimeout(this.game[id][3]);
            let answer = json.jawaban
            delete this.game[id];

            // Membuat Tombol
            let buttons = [
                {buttonId: '.tebakheroml', buttonText: {displayText: 'Main Lagi 🔄'}, type: 1}
            ];
            let buttonMessage = {
                text: `*☹️ Yah Menyerah❗*\nJawabannya Adalah *${answer}*`,
                buttons: buttons,
                footer: 'Klik tombol dibawah untuk bermain lagi!',
                headerType: 4,
            };

            await this.sendMessage(m.chat, { 
                ...buttonMessage, 
                viewOnce: true, // Tambahkan ini agar pesan hanya bisa dilihat sekali
                quoted: m,
                mentions: [m.sender] 
            });            
            return true;
        }

        let json = JSON.parse(JSON.stringify(this.game[id][1]));
        
        if (m.text.toLowerCase() == json.jawaban.toLowerCase().trim()) {
            global.db.data.users[m.sender].exp += this.game[id][2];
           // Membuat Tombol untuk Jawaban Benar
           let buttons = [
            {buttonId: '.tebakheroml', buttonText: {displayText: 'Main Lagi 🔄'}, type: 1}
        ];

        let buttonMessage = {
            text: `🎉 *Benar!* 🎉\n➕ ${this.game[id][2]} ✨XP`,
            buttons: buttons,
            footer: 'Klik tombol dibawah untuk bermain lagi!',
            headerType: 4,
        }

        await this.sendMessage(m.chat, { 
            ...buttonMessage,
            viewOnce: true, // Tambahkan ini agar pesan hanya bisa dilihat sekali
            quoted: m,
            mentions: [m.sender]
        });            
        
            clearTimeout(this.game[id][3]);
            delete this.game[id];

            return true;
        } else if (similarity(m.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold) {
            m.reply(`*💢 Dikit Lagi*`);
        } else {
            m.reply(`*❌ Salah*`);
        }
    }

    return true;
}

export const exp = 0