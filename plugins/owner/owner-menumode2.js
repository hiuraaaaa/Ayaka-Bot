import fs from 'fs'

const handler = async (m, { conn, args, command }) => {
    if (!global.db.data.settings) global.db.data.settings = {}
    if (!global.db.data.settings['default']) global.db.data.settings['default'] = {}

    const setting = global.db.data.settings['default']
    const name = m.pushName || 'User'
    const listMode = ['button', 'text', 'gambar', 'gif']

    // Jika ada argumen (contoh: .menumode text)
    if (args[0]) {
        const mode = args[0].toLowerCase()
        if (!listMode.includes(mode)) {
            return m.reply(`❌ Mode tidak valid!\n\nGunakan salah satu: ${listMode.join(', ')}`)
        }
        setting.menuMode = mode
        return m.reply(`✅ Mode menu berhasil diubah ke *${mode}*`)
    }

    // Kalau tidak ada argumen, tampilkan tombol pemilihan mode
    const caption = `⚙️ *Hai ${name}!*\n\nBerikut pilihan mode tampilan menu di *Nooriko Bot*:\n\nKlik salah satu opsi di bawah untuk mengganti mode tampilan menu.\n\n📌 Mode saat ini: *${setting.menuMode || 'button'}*`

    const rows = listMode.map(mode => ({
        title: mode.toUpperCase(),
        description: `Ubah menu menjadi mode ${mode}`,
        id: `.menumode ${mode}`
    }))

    const buttons = [
        {
            buttonId: 'menumode_list',
            buttonText: { displayText: '⚙️ Pilih Mode Menu' },
            type: 4,
            nativeFlowInfo: {
                name: 'single_select',
                paramsJson: JSON.stringify({
                    title: 'Mode Menu Bot',
                    sections: [
                        {
                            title: 'Pilih Tampilan Menu',
                            rows
                        }
                    ]
                })
            }
        }
    ]

    const imgPath = './thumbnail.jpg'
    if (!fs.existsSync(imgPath)) return m.reply('❌ File gambar tidak ditemukan!')

    await conn.sendMessage(m.chat, {
        image: fs.readFileSync(imgPath),
        caption,
        buttons,
        headerType: 1
    }, { quoted: m })
}

handler.command = ['menumode2']
handler.tags = ['owner']
handler.help = ['menumode2 [mode]']
handler.owner = true

export default handler