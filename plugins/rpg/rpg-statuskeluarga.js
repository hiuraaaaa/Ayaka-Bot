import { createCanvas, loadImage } from 'canvas'
import fs from 'fs'

// Helper untuk ambil nama dengan fallback
async function getName(conn, jid) {
    try {
        return await conn.getName(jid)
    } catch {
        return 'Tidak Dikenal'
    }
}

let handler = async (m, { conn, args }) => {
    let sender = m.sender
    let user = global.db.data.users[sender]

    if (!user.isMarried) return m.reply('⚠️ Kamu harus menikah dulu untuk memiliki rumah dan anak bersama pasangan.')

    let pasangan = user.pasangan ? await getName(conn, user.pasangan) : 'Belum Menikah'
    let rumah = user.rumah || 'Tidak Punya Rumah'
    let anakList = (user.anak || []).join(', ') || 'Tidak Punya Anak'

    let pernikahanCaption = ''
    if (user.tanggalMenikah) {
        let tanggalMenikah = new Date(user.tanggalMenikah)
        let sekarang = new Date()
        let diffTime = Math.abs(sekarang - tanggalMenikah)
        let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays >= 30 && diffDays % 30 === 0) {
            let hadiah = 1000000
            user.money += hadiah
            return m.reply(`🎉 Selamat Anniversary! Kamu sudah menikah selama *${diffDays} hari* dan menerima hadiah sebesar Rp ${hadiah.toLocaleString()}`)
        }

        pernikahanCaption = `💍 Sudah menikah selama *${diffDays} hari*`
    }

    // Perintah beli rumah
    if (args[0] === 'beliRumah') {
        let hargaRumah = 100000000
        if (user.money < hargaRumah) return m.reply('⚠️ Uangmu tidak cukup untuk membeli rumah.')

        user.money -= hargaRumah
        user.rumah = 'Rumah Mewah'

        let pasanganData = global.db.data.users[user.pasangan]
        if (pasanganData) pasanganData.rumah = 'Rumah Mewah'

        return m.reply(`✅ Kamu telah membeli rumah! Rumah sekarang dimiliki oleh kamu dan pasangan.`)
    }

    // Perintah adopsi anak
    if (args[0] === 'adopsiAnak') {
        let anakBaru = args[1]
        if (!anakBaru) return m.reply('⚠️ Kamu harus menyebutkan nama anak yang akan diadopsi.')

        for (let jid in global.db.data.users) {
            let dataAnak = global.db.data.users[jid]
            if (dataAnak.namaAnak === anakBaru && dataAnak.orangtua) {
                return m.reply(`⚠️ Anak bernama *${anakBaru}* sudah diadopsi oleh orang lain.`)
            }
        }

        if (!user.anak) user.anak = []
        user.anak.push(anakBaru)

        let pasanganData = global.db.data.users[user.pasangan]
        if (pasanganData) {
            if (!pasanganData.anak) pasanganData.anak = []
            pasanganData.anak.push(anakBaru)
        }

        for (let jid in global.db.data.users) {
            let calonAnak = global.db.data.users[jid]
            let nama = await getName(conn, jid)
            if (nama.toLowerCase() === anakBaru.toLowerCase()) {
                calonAnak.orangtua = sender
                calonAnak.namaAnak = anakBaru
                break
            }
        }

        return m.reply(`✅ Kamu telah mengadopsi anak bernama *${anakBaru}*.`)
    }

    // Perintah buang anak
    if (args[0] === 'buangAnak') {
        let targetAnak = args[1]
        if (!targetAnak) return m.reply('⚠️ Sebutkan nama anak yang ingin dibuang.')

        if (!user.anak || !user.anak.includes(targetAnak)) return m.reply('⚠️ Anak tersebut tidak ada dalam daftar anakmu.')

        user.anak = user.anak.filter(nama => nama !== targetAnak)

        let pasanganData = global.db.data.users[user.pasangan]
        if (pasanganData && pasanganData.anak) {
            pasanganData.anak = pasanganData.anak.filter(nama => nama !== targetAnak)
        }

        for (let jid in global.db.data.users) {
            let calonAnak = global.db.data.users[jid]
            if (calonAnak.namaAnak === targetAnak && calonAnak.orangtua === sender) {
                delete calonAnak.namaAnak
                delete calonAnak.orangtua
                break
            }
        }

        return m.reply(`❌ Kamu telah membuang anak bernama *${targetAnak}*.`)
    }

    // Buat caption status keluarga
    let caption = `
🏡 *Status Keluarga* 🏡

💑 Pasangan: *${pasangan}*
🏠 Rumah: *${rumah}*
👶 Anak: *${anakList}*
💰 Uang: Rp ${user.money.toLocaleString()}
${pernikahanCaption}
`

    // Gambar profil & foto keluarga
    let userProfilePic = await conn.profilePictureUrl(sender, 'image').catch(() => 'https://files.catbox.moe/x980ic.jpg')
    let pasanganProfilePic = await conn.profilePictureUrl(user.pasangan, 'image').catch(() => 'https://files.catbox.moe/x980ic.jpg')

    const canvas = createCanvas(600, 350)
    const ctx = canvas.getContext('2d')
    const backgroundImage = await loadImage('https://files.catbox.moe/ia1934.jpg')
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height)

    ctx.strokeStyle = '#8B4513'
    ctx.lineWidth = 20
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20)

    const userImage = await loadImage(userProfilePic)
    const pasanganImage = await loadImage(pasanganProfilePic)

    ctx.drawImage(userImage, (canvas.width / 2) - 200, 100, 150, 150)
    ctx.drawImage(pasanganImage, (canvas.width / 2) + 50, 100, 150, 150)

    const buffer = canvas.toBuffer('image/png')
    fs.writeFileSync('./family-photo.png', buffer)

    await conn.sendMessage(m.chat, {
        image: { url: './family-photo.png' },
        caption
    }, { quoted: m })
}

handler.help = ['keluarga', 'beliRumah', 'adopsiAnak', 'buangAnak']
handler.tags = ['rpg']
handler.command = /^(keluarga|beliRumah|adopsiAnak|buangAnak)$/i

export default handler