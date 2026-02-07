let handler = async (m, { args }) => {
    try {
        if (!m.quoted) return m.reply("Reply ke kode yang ingin dienkripsi!\n\n*Contoh:*\n.encrypt")

        let code = m.quoted.text
        let encrypted = Encrypt(code)

        return m.reply("Kode telah dienkripsi:\n\n" + encrypted)
    } catch (e) {
        await m.reply(e.message || "Terjadi kesalahan.")
    }
}

handler.help = ['encrypt']
handler.tags = ['tools']
handler.command = /^(encrypt|enc2)$/i
handler.limit = true
export default handler

// Fungsi Enkripsi Sederhana
function Encrypt(code) {
    let base64 = Buffer.from(code).toString("base64")  // Encode Base64
    let scrambled = base64.split("").reverse().join("") // Acak string
    return `eval(atob("${scrambled.split("").reverse().join("")}"))` // Gabungkan kembali
}