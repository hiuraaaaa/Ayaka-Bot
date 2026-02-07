let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Format salah. Gunakan: ${usedPrefix + command} <nomor> <nama>\n\nContoh: ${usedPrefix + command} 6288705574039 Lann4you`

    let [nomor, ...namaArr] = text.split(' ')
    let nama = namaArr.join(' ').trim()

    if (!nomor || !nama) throw `Format salah. Pastikan Anda memasukkan nomor dan nama\n\nContoh: ${usedPrefix + command} 6288705574039 Lann4you`

    nomor = nomor.replace(/\D/g, '')

    if (!nomor) throw '❗Nomor yang Anda masukkan tidak valid.'

    if (global.owner.some(owner => owner[0] === nomor)) {
        throw '❗Nomor ini sudah terdaftar sebagai Owner!'
    }

    global.owner.push([nomor, nama, true])

    conn.reply(m.chat, `✅ Berhasil!\n\n*Nomor:* ${nomor}\n*Nama:* ${nama}\n\nSekarang telah ditambahkan sebagai Owner.`, m)
}

handler.help = ['addowner <nomor> <nama>']
handler.tags = ['owner']
handler.command = /^(add|tambah|\+)owner$/i
handler.rowner = true

export default handler