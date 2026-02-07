import similarity from 'similarity'
import {
    proto
} from '@adiwajshing/baileys'

const threshold = 0.72
export async function before(m) {
    let id = m.chat
    if (!m.quoted || !m.quoted.fromMe || !m.text || !/Ketik.*hgam/i.test(m.quoted.text) || /.*hgam/i.test(m.text))
        return !0
    this.tebakingambar = this.tebakingambar ? this.tebakingambar : {}
    if (!(id in this.tebakingambar))
        return this.reply(m.chat, '❗Soal itu telah berakhir', m)
    if (m.quoted.id == this.tebakingambar[id][0].id) {
        let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text)
        if (isSurrender) {
            let json = JSON.parse(JSON.stringify(this.tebakingambar[id][1])) // Ambil jawaban sebelum menghapus
            clearTimeout(this.tebakingambar[id][3])
            let jawaban = json.jawaban // Simpan jawaban ke variabel
            delete this.tebakingambar[id]
            const buttons = [{
                buttonId: '.tebakgambar',
                buttonText: {
                    displayText: 'Main Lagi 🔄'
                },
                type: 1
            }]
            const buttonMessage = {
                text: `*☹️ Yah Menyerah ❗*\nJawabannya adalah *${jawaban}*`,
                footer: 'Klik tombol dibawah untuk bermain lagi!',
                buttons: buttons,
                headerType: 4
            }
            return await this.sendMessage(m.chat, buttonMessage, {
                quoted: m
            })
        }
        let json = JSON.parse(JSON.stringify(this.tebakingambar[id][1]))
        // m.reply(JSON.stringify(json, null, '\t'))
        if (m.text.toLowerCase() == json.jawaban.toLowerCase().trim()) {
            global.db.data.users[m.sender].exp += this.tebakingambar[id][2]

            // Modifikasi disini untuk menampilkan button saat jawaban benar
            const buttons = [{
                buttonId: '.tebakgambar',
                buttonText: {
                    displayText: 'Main Lagi 🔄'
                },
                type: 1
            }]
            const buttonMessage = {
                text: `🎉 *Benar!*🎉\n➕${this.tebakingambar[id][2]} ✨XP`,
                footer: 'Klik tombol dibawah untuk bermain lagi!',
                buttons: buttons,
                headerType: 4
            }
            clearTimeout(this.tebakingambar[id][3])
            delete this.tebakingambar[id]
            return await this.sendMessage(m.chat, buttonMessage, {
                quoted: m
            })

        } else if (similarity(m.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold)
            m.reply(`*❗Dikit Lagi!*`)
        else
            this.reply(m.chat, `❌ *Salah!*`, m)
    }
    return !0
}
export const exp = 0