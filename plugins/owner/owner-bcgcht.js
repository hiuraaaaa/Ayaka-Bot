import moment from 'moment-timezone'

const delay = time => new Promise(res => setTimeout(res, time))

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // --- Bagian Pengecekan Media ---
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mediaType || ''
    let isMedia = /image|video|sticker|audio/.test(mime)
    
    // --- Bagian Footer Otomatis ---
    let d = new Date(new Date + 3600000)
    let locale = 'id'
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
    let wktuwib = moment.tz('Asia/Jakarta').format('HH:mm:ss')
    
    let link = global.link.ch
    let thumb = global.thumb

    let pesan_footer = `\n\n⻝ 𝗗𝗮𝘁𝗲: ${week} ${date}\n⻝ 𝗧𝗶𝗺𝗲: ${wktuwib} WIB`
    
    // --- Logika Utama ---
    let getGroups = await conn.groupFetchAllParticipating()
    let groups = Object.values(getGroups).map(v => v.id)
    let anu = groups
    
    let pesan_user = text
    
    if (!pesan_user && !isMedia) {
        return m.reply(`Teks atau media untuk hidetag-nya mana, Senpai? 🤔\n\nContoh:\n- \`${usedPrefix + command} Info penting!\`\n- Reply gambar/video lalu ketik \`${usedPrefix + command} Teksnya\``)
    }

    let broadcast_text = `${pesan_user || ''}${pesan_footer}`

    m.reply(`✅ Oke, memulai broadcast hidetag ke ${anu.length} grup.\nEstimasi waktu selesai: ${anu.length * 3} detik.`)

    let broadcastCount = 0
    for (let id of anu) {
        try {
            // Ambil anggota grup untuk di-tag
            let metadata = await conn.groupMetadata(id)
            let participants = metadata.participants.map(v => v.id)

            if (isMedia) {
                let media = await q.download()
                let caption = broadcast_text
                
                if (/image/.test(mime)) {
                    await conn.sendMessage(id, { image: media, caption: caption, mentions: participants })
                } else if (/video/.test(mime)) {
                    await conn.sendMessage(id, { video: media, caption: caption, mentions: participants })
                }
            } else {
                await conn.sendMessage(id, { text: broadcast_text, mentions: participants })
            }
            broadcastCount++
        } catch (e) {
            console.error(`Gagal mengirim hidetag ke grup ${id}:`, e)
        }
        await delay(3000) // Delay 3 detik untuk hidetag agar lebih aman
    }
    
    m.reply(`✨ Hidetag broadcast selesai, Senpai! ✨\n\nBerhasil terkirim ke ${broadcastCount} dari ${anu.length} grup.`)
}

handler.help = ['bcgcht <teks>']
handler.tags = ['owner']
handler.command = /^(broadcastgrouphidetag|bcgcht)$/i
handler.owner = true

export default handler