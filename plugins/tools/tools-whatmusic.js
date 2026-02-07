import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, usedPrefix, command }) => {
    try {
        let q = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || ''
        if (!/audio/.test(mime)) return m.reply(`*Contoh: reply audio dengan perintah ${usedPrefix + command}*`)
        await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

        let media = await q.download()
        let tmp = path.join('./tmp', `${Date.now()}.mp3`)
        fs.writeFileSync(tmp, media)

        let json = await aha_music(tmp)
        fs.unlinkSync(tmp)

        if (!json?.data?.title) return m.reply(`*🍂 Gagal Mendeteksi Musik*`)

        let hasil = `
*🎵 WHAT MUSIC DETECTED*
*🎤 Artist:* ${json.data.artists || 'Tidak Diketahui'}
*🎧 Title:* ${json.data.title || 'Tidak Diketahui'}
*🆔 Track ID:* ${json.data.acrid}
`.trim()

        await m.reply(hasil)
    } catch (e) {
        m.reply(`*🍂 Terjadi Kesalahan Saat Mendeteksi Musik*`)
    } finally {
        await conn.sendMessage(m.chat, { react: { text: '', key: m.key } })
    }
}

handler.help = ['whatmusic']
handler.tags = ['tools']
handler.command = /^(whatmusic|whatmusik|wmusic)$/i
handler.limit = true
handler.register = false

export default handler

async function aha_music(pathFile) {
    const form = new FormData()
    form.append('file', fs.readFileSync(pathFile), {
        filename: 'audio.mp3',
        contentType: 'audio/mp3'
    })
    form.append('sample_size', 118784)

    const { data } = await axios.post(
        'https://api.doreso.com/humming',
        form,
        {
            headers: {
                ...form.getHeaders(),
                'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36',
                accept: 'application/json, text/plain, */*',
                origin: 'https://www.aha-music.com',
                referer: 'https://www.aha-music.com/'
            },
            maxBodyLength: Infinity,
            maxContentLength: Infinity
        }
    )

    return data
}