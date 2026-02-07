import fetch from 'node-fetch'

const handler = async (m, { text, conn, command }) => {
    if (!text) return m.reply('🌙 Masukkan mimpi kamu!\nContoh: .dreamyku aku terbang di kota masa depan yang hijau')

    try {
        const res = await fetch('https://safe-coast-53976-cd772af9b056.herokuapp.com/', {
            method: 'POST',
            headers: {
                'Accept-Encoding': 'gzip',
                'Connection': 'Keep-Alive',
                'Content-Type': 'application/json',
                'Host': 'safe-coast-53976-cd772af9b056.herokuapp.com',
                'User-Agent': 'okhttp/4.9.2'
            },
            body: JSON.stringify({
                text,
                isPremium: true
            })
        })

        const data = await res.json()

        if (!data || !data.result) throw '❌ Gagal menganalisis mimpi. Coba lagi nanti.'

        const result = `🌌 *Analisis Mimpi Kamu:*\n\n${data.result}`
        await conn.sendMessage(m.chat, { text: result }, { quoted: m })
    } catch (e) {
        console.error(e)
        m.reply('❌ Terjadi kesalahan saat menganalisis mimpi.')
    }
}

handler.command = ['dreamyku', 'mimpiku']
handler.help = ['dreamyku <teks mimpi>']
handler.tags = ['ai', 'fun']
handler.premium = false
handler.limit = true

export default handler