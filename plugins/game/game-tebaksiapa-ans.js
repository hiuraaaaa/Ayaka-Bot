import similarity from 'similarity'
const threshold = 0.72
export async function before(m) {
    let id = m.chat
    if (!m.quoted || !m.quoted.fromMe  || !m.text || !/Ketik.*hsia/i.test(m.quoted.text) || /.*hsia/i.test(m.text))
        return !0
    this.tebaksiapa = this.tebaksiapa ? this.tebaksiapa : {}
    if (!(id in this.tebaksiapa))
        return conn.reply(m.chat, '🚩 Soal itu telah berakhir', m)
    if (m.quoted.id == this.tebaksiapa[id][0].id) {
        let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text)
        if (isSurrender) {
            let json = JSON.parse(JSON.stringify(this.tebaksiapa[id][1]))
            clearTimeout(this.tebaksiapa[id][3])
            let jawaban = json.jawaban // Ambil jawaban yang benar
            delete this.tebaksiapa[id]

            // Membuat Tombol
            let buttons = [
                {buttonId: '.tebaksiapa', buttonText: {displayText: 'Main Lagi 🔄'}, type: 1}
            ]
            let buttonMessage = {
                text: `*☹️ Yah Menyerah❗*\nJawabannya Adalah: *${jawaban}*`,
                buttons: buttons,
                headerType: 4,
                footerText: 'Klik tombol dibawah untuk bermain lagi!',
            }
            return await conn.sendMessage(m.chat, buttonMessage, { quoted: m })
        }
        let json = JSON.parse(JSON.stringify(this.tebaksiapa[id][1]))
        if (m.text.toLowerCase() == json.jawaban.toLowerCase().trim()) {
            global.db.data.users[m.sender].exp += this.tebaksiapa[id][2]

            // Membuat Tombol untuk Jawaban Benar
            let buttons = [
                {buttonId: '.tebaksiapa', buttonText: {displayText: 'Main Lagi 🔄'}, type: 1}
            ]

            let buttonMessage = {
                text: `🎉 *Benar!*🎉\n➕${this.tebaksiapa[id][2]} ✨XP`,
                buttons: buttons,
                headerType: 4,
                footerText: 'Klik tombol dibawah untuk bermain lagi!',
            }
            await conn.sendMessage(m.chat, buttonMessage, { quoted: m })
            clearTimeout(this.tebaksiapa[id][3])
            delete this.tebaksiapa[id]
        } else if (similarity(m.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold)
            m.reply(`*❗Dikit Lagi!*`)
        else
            conn.reply(m.chat, `❌ *Salah!*`, m)
    }
    return !0
}
export const exp = 0