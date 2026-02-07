import fetch from 'node-fetch'
import cheerio from 'cheerio'
import path from 'path'

let timeout = 120000
let poin = 4999

let handler = async (m, { conn, command, usedPrefix }) => {
    conn.tebakhewan = conn.tebakhewan || {}
    let id = m.chat

    if (id in conn.tebakhewan) {
        conn.reply(m.chat, '❗ Masih ada soal yang belum terjawab di chat ini.', conn.tebakhewan[id][0])
        throw false
    }

    let src = await tebakHewan()
    if (!src.length) {
        return conn.reply(m.chat, '❌ Gagal mengambil data hewan. Silakan coba lagi nanti.', m)
    }

    let json = src[Math.floor(Math.random() * src.length)]
    let caption = `*${command.toUpperCase()}*
🦁 Hewan apakah ini?
⏱️ Timeout: *${(timeout / 1000).toFixed(0)} detik*
💡 Bantuan: ketik *${usedPrefix}hhew*
🎁 Bonus: *${poin} XP*`.trim()

    conn.tebakhewan[id] = [
        await conn.sendFile(m.chat, json.url, '', caption, m),
        json,
        poin,
        setTimeout(() => {
            if (conn.tebakhewan[id]) {
                conn.reply(m.chat, `⏰ Waktu habis!\nJawabannya adalah *${json.title}*`, conn.tebakhewan[id][0])
                delete conn.tebakhewan[id]
            }
        }, timeout)
    ]
}

handler.help = ['tebakhewan']
handler.tags = ['game']
handler.command = /^tebakhewan$/i

export default handler

// Function pencari gambar hewan dari situs rimbakita
async function tebakHewan() {
    const randomPageNumber = Math.floor(Math.random() * 20) + 1
    const url = `https://rimbakita.com/daftar-nama-hewan-lengkap/${randomPageNumber}/`

    try {
        const response = await fetch(url)
        const html = await response.text()
        const $ = cheerio.load(html)

        let hasil = []

        $('div.entry-content.entry-content-single img[class*=wp-image-]').each((_, element) => {
            const src = $(element).attr('data-src') || $(element).attr('src')
            if (!src) return

            const alt = path.basename(src, path.extname(src)).replace(/-/g, ' ')
            const title = alt.charAt(0).toUpperCase() + alt.slice(1)

            hasil.push({ title, url: src })
        })

        return hasil
    } catch (error) {
        console.error('❌ Gagal scraping:', error.message)
        return []
    }
}