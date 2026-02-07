import similarity from 'similarity'
const threshold = 0.72

export async function before(m) {
    let id = m.chat
    if (!m.quoted || !m.quoted.fromMe || !m.text || !/Ketik.*quizzh/i.test(m.quoted.text) || /.*quizzh/i.test(m.text))
        return true

    this.quizz = this.quizz || {}
    if (!(id in this.quizz))
        return this.reply(m.chat, '🚩 Soal itu telah berakhir', m)

    if (m.quoted.id === this.quizz[id][0].id) {
        let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text)

        if (isSurrender) {
            let jawaban = this.quizz[id][1][0].jawaban // Ambil jawaban sebelum menghapus
            clearTimeout(this.quizz[id][3])
            delete this.quizz[id]

            const buttonMessage = {
                text: `*☹️ Yah Menyerah❗*\nJawabannya adalah *${jawaban}*`,
                footer: 'Klik tombol dibawah untuk bermain lagi!',
                buttons: [
                    { buttonId: '.quizz', buttonText: { displayText: 'Main Lagi 🔄' }, type: 1 }
                ],
                headerType: 4,
                quoted: m // Pastikan ini ada
            }

            await this.sendMessage(m.chat, buttonMessage)
            return true
        }

        let json = JSON.parse(JSON.stringify(this.quizz[id][1][0])) // Ambil elemen pertama dari array
        if (m.text.toLowerCase() === json.jawaban.toLowerCase().trim()) {
            let expAmount = this.quizz[id][2]; // Simpan exp sebelum dihapus
            global.db.data.users[m.sender].exp += expAmount;

            clearTimeout(this.quizz[id][3]);
            delete this.quizz[id];

            const buttonMessage = {
                text: `🎉 *Benar!* 🎉\n➕ ${expAmount} ✨XP`,
                footer: 'Klik tombol dibawah untuk bermain lagi!',
                buttons: [
                    { buttonId: '.quizz', buttonText: { displayText: 'Main Lagi 🔄' }, type: 1 }
                ],
                headerType: 4,
                quoted: m // Pastikan ini ada
            };
            await this.sendMessage(m.chat, buttonMessage);

            return true;
        } else if (similarity(m.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold) {
            this.reply(m.chat, `💢 *Dikit Lagi!*`)
        } else {
            this.reply(m.chat, `❌ *Salah!*`)
        }
    }
    return true
}

export const exp = 0