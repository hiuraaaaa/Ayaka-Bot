const delay = time => new Promise(res => setTimeout(res, time))

let handler = async (m, { conn, text }) => {
    // Cek apakah user me-reply sebuah media
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mediaType || ''
    if (!/image|video|audio|sticker|document/.test(mime)) {
        return m.reply('Media tidak ditemukan! 😩\n\nReply media (gambar/video/dokumen/dll) yang ingin di-broadcast dengan perintah ini, Senpai.')
    }
    
    if (!text) text = '' // Caption bisa kosong

    let getGroups = await conn.groupFetchAllParticipating()
    let groups = Object.values(getGroups).map(v => v.id)
    
    m.reply(`✅ Oke, memulai broadcast media ke ${groups.length} grup.\nEstimasi waktu selesai: ${groups.length * 3} detik.`)
    
    let media = await q.download() // Download media dari pesan yang di-reply
    
    let broadcastCount = 0;
    for (let i of groups) {
        try {
            // Membuat pesan media dengan caption
            await conn.sendMessage(i, {
                [mime.split('/')[0]]: media, // Tipe media (image, video, etc.)
                caption: text,
                mimetype: mime
            })
            broadcastCount++;
        } catch (e) {
            console.error(`Gagal mengirim media ke grup ${i}:`, e)
        }
        // Delay 3 detik untuk broadcast media
        await delay(3000) 
    }

    m.reply(`✨ Broadcast media selesai, Senpai! ✨\n\nBerhasil terkirim ke ${broadcastCount} dari ${groups.length} grup.`)
}

handler.help = ['bcgcmedia <teks>']
handler.tags = ['owner']
handler.command = /^(bcgcmedia)$/i
handler.owner = true

export default handler