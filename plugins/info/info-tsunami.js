import axios from 'axios'

const handler = async (m, { conn }) => {
    try {
        const response = await axios.get('https://fastrestapis.fasturl.cloud/search/bmkgtsunami')

        const data = response.data

        if (data.code === 200 && data.result) {
            const latestInfo = data.result.latestInfo
            let reply = `🌊 *Informasi Tsunami Terbaru:*\n\n`
            reply += `🗓️ *Tanggal:* ${latestInfo.date}\n`
            reply += `⏰ *Waktu:* ${latestInfo.time}\n`
            reply += `🌍 *Lokasi:* ${latestInfo.location}\n`
            reply += `📍 *Koordinat:* ${latestInfo.coordinates}\n`
            reply += `💥 *Magnitudo:* ${latestInfo.magnitude}\n`
            reply += `📏 *Kedalaman:* ${latestInfo.depth}\n`
            reply += `⚠️ *Potensi Tsunami:* ${latestInfo.tsunamiPotential}\n\n`
            
            reply += `📋 *Daftar Informasi Tsunami Sebelumnya:*\n\n`
            data.result.infoList.forEach(item => {
                reply += `🔢 *Nomor:* ${item.number}\n`
                reply += `🗓️ *Tanggal/Waktu:* ${item.dateTime}\n`
                reply += `⚠️ *Potensi Tsunami:* ${item.tsunamiPotential}\n`
                reply += `💥 *Magnitudo:* ${item.magnitude}\n`
                reply += `📏 *Kedalaman:* ${item.depth}\n`
                reply += `🌍 *Lokasi:* ${item.location}\n`
                reply += `📍 *Koordinat:* ${item.coordinates}\n\n`
            })

            return conn.reply(m.chat, reply, m)
        } else {
            return m.reply('📍 *Tidak ada informasi tsunami terbaru.*')
        }
    } catch (error) {
        console.error(error)
        return m.reply('❌ Terjadi kesalahan saat mengambil informasi tsunami.')
    }
}

handler.command = ['tsunami']
handler.help = ['tsunami']
handler.tags = ['info']

export default handler