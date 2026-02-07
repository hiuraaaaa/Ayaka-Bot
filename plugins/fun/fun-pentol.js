import axios from 'axios'

let handler = async (m, { conn }) => {
    try {
        await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

        const apiUrl = `https://api.ubed.my.id/sticker/pentol?apikey=ubed2407`
        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' })

        await conn.sendFile(m.chat, response.data, 'pentol.jpg', 'Nih gambar pentolnya!', m)

        await conn.sendMessage(m.chat, { react: { text: '🥟', key: m.key } })
    } catch (error) {
        console.error(error)
        await conn.reply(m.chat, 'Gagal mengambil gambar pentol. Coba lagi nanti.', m)
    }
}

handler.help = ['pentol']
handler.tags = ['fun']
handler.command = /^pentol$/i
handler.limit = 3
handler.register = true

export default handler