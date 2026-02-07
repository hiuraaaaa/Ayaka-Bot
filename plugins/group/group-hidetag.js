let handler = async (m, { conn, text, participants }) => {
    let users = participants.map(u => u.id).filter(v => v !== conn.user.jid)
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''

    if (/image|video|audio|sticker|document/.test(mime)) {
        let media = await q.download()
        if (!media) throw '❌ Gagal mengunduh media'

        let caption = text || q.text || ''
        await conn.sendMessage(
            m.chat,
            { 
                [mime.split('/')[0]]: media,
                caption,
                mentions: users
            },
            { quoted: m }
        )

    } else if (text) {
        await conn.sendMessage(m.chat, { text, mentions: users }, { quoted: m })

    } else if (m.quoted) {
        await conn.sendMessage(m.chat, { forward: m.quoted.fakeObj, mentions: users })

    } else {
        throw '✳️ Kirim teks, media, atau reply pesan untuk ditag semua anggota'
    }
}

handler.help = ['hidetag']
handler.tags = ['group']
handler.command = /^(hidetag|ht|h)$/i

handler.admin = true
handler.group = true

export default handler