import similarity from 'similarity'
const threshold = 0.72
export async function before(m) {
    let id = m.chat
    if (!m.quoted || !m.quoted.fromMe  || !m.text || !/Ketik.*quest/i.test(m.quoted.text) || /.*quest/i.test(m.text))
        return !0
    this.question = this.question ? this.question : {}
    if (!(id in this.question))
        return this.reply(m.chat, '🚩 Soal itu telah berakhir', m)
    if (m.quoted.id == this.question[id][0].id) {
        let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text)
        if (isSurrender) {
            clearTimeout(this.question[id][3])
            let jawaban = JSON.parse(JSON.stringify(this.question[id][1])).results[0].correct_answer;
            delete this.question[id]

            // Tambahkan tombol "Main Lagi"
            let buttonMessage = {
                text: `*☹️ Yah Menyerah❗*\nJawabannya adalah *${jawaban}*`,
                footer: 'Klik tombol dibawah untuk bermain lagi!',
                buttons: [
                    { buttonId: '.question', buttonText: { displayText: 'Main Lagi 🔄' }, type: 1 }
                ],
                headerType: 4
            }

            await this.sendMessage(m.chat, buttonMessage, { quoted: m })
            return !0 // Penting untuk menghentikan eksekusi lebih lanjut
        }
        let json = JSON.parse(JSON.stringify(this.question[id][1]))
        // m.reply(JSON.stringify(json, null, '\t'))
        if (m.text.toLowerCase() == json.results[0].correct_answer.toLowerCase().trim()) {
            global.db.data.users[m.sender].exp += this.question[id][2]

             // Simpan nilai exp sebelum menghapus question
             let expAmount = this.question[id][2];

            clearTimeout(this.question[id][3])
            delete this.question[id]

             let buttonMessage = {
                text: `*🎉Benar!🎉*\n➕${expAmount} ✨XP`,
                footer: 'Klik tombol dibawah untuk bermain lagi!',
                buttons: [
                    { buttonId: '.question', buttonText: { displayText: 'Main Lagi 🔄' }, type: 1 }
                ],
                headerType: 4
            }

            await this.sendMessage(m.chat, buttonMessage, { quoted: m })
            return !0 // Penting untuk menghentikan eksekusi lebih lanjut

        } else if (similarity(m.text.toLowerCase(), json.results[0].correct_answer.toLowerCase().trim()) >= threshold)
            m.reply(`💢 *Dikit Lagi!*`)
        else
            this.reply(m.chat, `❌ *Salah!*`, m)
    }
    return !0
}
export const exp = 0