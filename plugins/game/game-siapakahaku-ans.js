import similarity from 'similarity'
const threshold = 0.72

export async function before(m) {
    let id = m.chat
    if (!m.quoted || !m.quoted.fromMe || !m.text || !/Ketik.*who/i.test(m.quoted.text) || /.*who/i.test(m.text))
        return !0
    this.siapakahaku = this.siapakahaku ? this.siapakahaku : {}
    if (!(id in this.siapakahaku))
        return this.reply(m.chat, '🚩 Soal itu telah berakhir', m)
    if (m.quoted.id == this.siapakahaku[id][0].id) {
        let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text)
        if (isSurrender) {
            let json = JSON.parse(JSON.stringify(this.siapakahaku[id][1]))
            let jawaban = json.jawaban;

            clearTimeout(this.siapakahaku[id][3])
            delete this.siapakahaku[id]

            // Tambahkan tombol "Main Lagi"
            let buttonMessage = {
                text: `*☹️ Yah Menyerah❗*\nJawabannya adalah *${jawaban}*`,
                footer: 'Klik tombol dibawah untuk bermain lagi!',
                buttons: [
                    { buttonId: '.siapakahaku', buttonText: { displayText: 'Main Lagi 🔄' }, type: 1 }
                ],
                headerType: 4
            }

            await this.sendMessage(m.chat, buttonMessage, { quoted: m })
            return !0 // Penting untuk menghentikan eksekusi lebih lanjut
        }
        let json = JSON.parse(JSON.stringify(this.siapakahaku[id][1]))
        // m.reply(JSON.stringify(json, null, '\t'))
        if (m.text.toLowerCase() == json.jawaban.toLowerCase().trim()) {
            global.db.data.users[m.sender].exp += this.siapakahaku[id][2]

            // Simpan nilai exp sebelum menghapus tebaktebakan
            let expAmount = this.siapakahaku[id][2];

            clearTimeout(this.siapakahaku[id][3])
            delete this.siapakahaku[id]

              let buttonMessage = {
                text: `🎉 *Benar!* 🎉\n➕ ${expAmount} ✨XP`, // Gunakan nilai exp yang disimpan
                footer: 'Klik tombol dibawah untuk bermain lagi!',
                buttons: [
                    { buttonId: '.siapakahaku', buttonText: { displayText: 'Main Lagi 🔄' }, type: 1 }
                ],
                headerType: 4
            }

            await this.sendMessage(m.chat, buttonMessage, { quoted: m })
              return !0 // Penting untuk menghentikan eksekusi lebih lanjut
        } else if (similarity(m.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold)
            m.reply(`💢 *Dikit Lagi!*`)
        else
            this.reply(m.chat, `❌ *Salah!*`, m)
    }
    return !0
}
export const exp = 0