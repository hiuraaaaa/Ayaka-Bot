import similarity from 'similarity'
const threshold = 0.72
export async function before(m) {
    let id = m.chat
    if (!m.quoted || !m.quoted.fromMe  || !m.text || !/Ketik.*hlog/i.test(m.quoted.text) || /.*tebaklogo/i.test(m.text))
        return !0
    this.tebaklogo = this.tebaklogo ? this.tebaklogo : {}
    if (!(id in this.tebaklogo))
        return this.reply(m.chat, '🚩 Soal itu telah berakhir', m)
    if (m.quoted.id == this.tebaklogo[id][0].id) {
        let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text)
        if (isSurrender) {
            let json = JSON.parse(JSON.stringify(this.tebaklogo[id][1]))
            clearTimeout(this.tebaklogo[id][3])
            let jawaban = json.jawaban // Ambil jawaban yang benar
            delete this.tebaklogo[id]

            // Membuat Tombol
            let buttons = [
                {buttonId: '.tebaklogo', buttonText: {displayText: 'Main Lagi 🔄'}, type: 1}
            ]
            let buttonMessage = {
                text: `*☹️ Yah Menyerah❗*\nJawabannya Adalah: *${jawaban}*`,
                buttons: buttons,
                headerType: 4,
                footerText: 'Klik tombol dibawah untuk bermain lagi!',
            }
            return await this.sendMessage(m.chat, buttonMessage, { quoted: m })
        }
        let json = JSON.parse(JSON.stringify(this.tebaklogo[id][1]))
        if (m.text.toLowerCase() == json.jawaban.toLowerCase().trim()) {
            global.db.data.users[m.sender].exp += this.tebaklogo[id][2]

            // Membuat Tombol untuk Jawaban Benar
            let buttons = [
                {buttonId: '.tebaklogo', buttonText: {displayText: 'Main Lagi 🔄'}, type: 1}
            ]

            let buttonMessage = {
                text: `🎉 *Benar!*🎉\n➕${this.tebaklogo[id][2]} ✨XP`,
                buttons: buttons,
                headerType: 4,
                footerText: 'Klik tombol dibawah untuk bermain lagi!',
            }
            await this.sendMessage(m.chat, buttonMessage, { quoted: m })
            clearTimeout(this.tebaklogo[id][3])
            delete this.tebaklogo[id]
        } else if (similarity(m.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold)
            this.reply(m.chat,`*❗Dikit Lagi!*`)
        else
            this.reply(m.chat, `❌ *Salah!*`, m)
    }
    return !0
}
export const exp = 0