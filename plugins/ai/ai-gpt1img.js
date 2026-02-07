import fetch from 'node-fetch'

const gpt1image = async (prompt) => {
    if (!prompt) throw Error("Deskripsikan gambar yang ingin kamu buat.")

    const headers = {
        "content-type": "application/json",
        "referer": "https://gpt1image.exomlapi.com/",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36"
    }

    const body = JSON.stringify({
        prompt,
        n: 1,
        size: "1024x1024",
        is_enhance: true,
        response_format: "url"
    })

    const res = await fetch("https://gpt1image.exomlapi.com/v1/images/generations", {
        method: "POST",
        headers,
        body
    })

    if (!res.ok) throw Error(`Gagal fetch di ${res.url} (${res.status} ${res.statusText})`)

    const json = await res.json()
    const url = json?.data?.[0]?.url
    if (!url) throw Error("Fetch berhasil tapi tidak ada URL gambar.")
    return url
}

let handler = async (m, { conn, text }) => {
    if (!text) return m.reply('Contoh penggunaan:\n.gpt1 kucing astronot duduk di bulan, style kartun 3D')

    await conn.sendMessage(m.chat, { react: { text: '🎨', key: m.key } }) 

    try {
        const imgUrl = await gpt1image(text)
        const caption = `✨ *Hasil Kreasi Imajinasimu!* ✨\n\n📌 *Prompt:* ${text}\n📥 *Klik untuk memperbesar!*`
        await conn.sendFile(m.chat, imgUrl, 'gptimg.jpg', caption, m)
    } catch (e) {
        m.reply('❌ Gagal membuat gambar: ' + e.message)
    }
}

handler.command = /^gptimg|gpt1img|gpt1$/i
handler.help = ['gptimg <prompt>']
handler.tags = ['ai']
handler.register = true
handler.limit = 5

export default handler