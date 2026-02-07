import similarity from 'similarity'
const threshold = 0.72
export async function before(m) {
    let id = m.chat
    if (m.isBaileys || m.fromMe) return
    if (!m.quoted || !m.quoted.fromMe || !m.text || !/Ketik.*teman|ᴋᴇᴛɪᴋ.*ᴛᴇᴍᴀɴ/i.test(m.quoted.text) || /.*teman|.*ᴛᴇᴍᴀɴ/i.test(m.text))
        return !0
    this.tebakmakanan = this.tebakmakanan ? this.tebakmakanan : {}
    let setting = global.db.data.settings[conn.user.jid]
    if (setting.composing)
        await this.sendPresenceUpdate('composing', m.chat)
    if (setting.autoread)
        await this.readMessages([m.key])
    if (!(id in this.tebakmakanan))
        return m.reply('🚩 Soal itu telah berakhir')
    if (m.quoted.id == this.tebakmakanan[id][0].id) {
        let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text)
        if (isSurrender) {
            let json = JSON.parse(JSON.stringify(this.tebakmakanan[id][1])) // Ambil jawaban sebelum menghapus
            clearTimeout(this.tebakmakanan[id][4])
            let jawaban = json.jawaban //Simpan jawaban
            delete this.tebakmakanan[id]

            // Tambahkan button disini
            let buttons = [
                { buttonId: '.tebakmakanan', buttonText: { displayText: 'Main Lagi 🔄' }, type: 1 }
            ]
            let buttonMessage = {
                text: `*☹️ Yah Menyerah❗*\nJawabannya Adalah: *${jawaban}*`,
                footer: 'Klik tombol dibawah untuk bermain lagi!',
                buttons: buttons,
                headerType: 4
            }
            return await this.sendMessage(m.chat, buttonMessage, { quoted: m })
        }
        let json = JSON.parse(JSON.stringify(this.tebakmakanan[id][1]))
        if (m.text.toLowerCase() == json.jawaban.toLowerCase().trim()) {
            global.db.data.users[m.sender].exp += this.tebakmakanan[id][2]
            m.reply(`🎉 *Benar!*🎉\n➕${this.tebakmakanan[id][2]} ✨XP`)
            clearTimeout(this.tebakmakanan[id][4])
            delete this.tebakmakanan[id]
        } else if (similarity(m.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold) {
            m.reply(`*❗Dikit Lagi!*`)
        } else if (--this.tebakmakanan[id][3] == 0) {
            clearTimeout(this.tebakmakanan[id][4])
            delete this.tebakmakanan[id]

            // Tambahkan button disini
            let buttons = [
                { buttonId: '.tebakmakanan', buttonText: { displayText: 'Main Lagi 🔄' }, type: 1 }
            ]
            let buttonMessage = {
                text: `🚫 *Kesempatan habis!*\nJawaban: *${json.jawaban}*`,
                buttons: buttons,
                headerType: 4
            }
            return await this.sendMessage(m.chat, buttonMessage, { quoted: m })

        } else m.reply(`❌ *Jawaban Salah!*\nMasih ada ${this.tebakmakanan[id][3]} kesempatan`)
    }
    return !0
}
export const exp = 0