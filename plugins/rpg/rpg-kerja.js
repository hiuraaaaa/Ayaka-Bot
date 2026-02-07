let handler = async (m, { conn, command, args, usedPrefix }) => {
    let type = (args[0] || '').toLowerCase()
    let users = global.db.data.users[m.sender]
    let time = global.db.data.users[m.sender].lastkerja + 600000

    // Update gaji
    let uangm = Math.floor(Math.random() * 500000) + 250000
    let duit = Math.floor(Math.random() * 500000) + 250000
    let duitm = Math.floor(Math.random() * 500000) + 250000
    let duitd = Math.floor(Math.random() * 500000) + 250000
    let duitr = Math.floor(Math.random() * 500000) + 250000
    let duitk = Math.floor(Math.random() * 500000) + 250000
    let duitkk = Math.floor(Math.random() * 500000) + 250000
    let duiti = Math.floor(Math.random() * 500000) + 250000 // Insinyur
    let duitt = Math.floor(Math.random() * 500000) + 250000 // Tentara
    let duitj = Math.floor(Math.random() * 500000) + 250000 // Jurnalis
    let duita = Math.floor(Math.random() * 500000) + 250000 // Akuntan
    let duitn = Math.floor(Math.random() * 500000) + 250000 // Nelayan
    let duitg = Math.floor(Math.random() * 500000) + 250000 // Guru
    let duits = Math.floor(Math.random() * 500000) + 250000 // Sopir
    let duitke = Math.floor(Math.random() * 500000) + 250000 // Pilot
    let duitp = Math.floor(Math.random() * 500000) + 250000 // Pemadam Kebakaran
    let _timie = (new Date - (users.lastkerja * 1)) * 1
    if (_timie < 600000) return m.reply(`*[🤕]* Kamu sudah lelah bekerja saat ini, silahkan beristirahalah \n\nSelama ${clockString(1200000 - _timie)}`)

    let penumpan = ['mas mas', 'bapak bapak', 'cewe sma', 'bocil epep', 'emak emak', 'Lann4you ke pasar']
    let penumpang = penumpan[Math.floor(Math.random() * penumpan.length)]
    let daganga = ['wortel', 'sawi', 'selada', 'tomat', 'seledri', 'cabai', 'daging', 'ikan', 'ayam']
    let dagangan = daganga[Math.floor(Math.random() * daganga.length)]
    let pasie = ['Pasien sakit kepala', 'Pasien cedera', 'Pasien Yang terluka bakar', 'Pasien patah tulang', 'Lann4you yang sedang sakit hati']
    let pasien = pasie[Math.floor(Math.random() * pasie.length)]
    let pane = ['Wortel', 'Kubis', 'stowbery', 'teh', 'padi', 'jeruk', 'pisang', 'semangka', 'durian', 'rambutan', 'Hati Lann4you']
    let panen = pane[Math.floor(Math.random() * pane.length)]
    let bengke = ['mobil', 'motor', 'becak', 'bajai', 'bus', 'angkot', 'becak', 'sepeda', 'Hati Lann4you']
    let bengkel = bengke[Math.floor(Math.random() * bengke.length)]
    let ruma = ['Membangun Rumah', 'Membangun Gedung', 'Memperbaiki Rumah', 'Memperbaiki Gedung', 'Membangun Fasilitas Umum', 'Memperbaiki Fasilitas Umum', 'Membangun rumah tangga bersama Lann4you']
    let rumah = ruma[Math.floor(Math.random() * ruma.length)]
    let maka = ['Ayam Geprek', 'Sop Iga', 'Hamburger', 'Roti Bakar', 'Pizza', 'Kebab', 'Tahu Sabal', 'Cumi Rebus', 'Sop Udang', 'Tempe Goreng', 'Ayam Bakar', 'Sate Kambing', 'Sushi', 'Ayam Gulai']
    let makan = maka[Math.floor(Math.random() * maka.length)]
    let insinyur = ['merancang jembatan', 'mengawasi proyek bangunan', 'menganalisis struktur gedung']
    let tugasinsinyur = insinyur[Math.floor(Math.random() * insinyur.length)]
    let tugasmiliter = ['latihan perang', 'menjaga perbatasan', 'melakukan operasi penyelamatan']
    let militer = tugasmiliter[Math.floor(Math.random() * tugasmiliter.length)]
    let tugasjurnalis = ['menulis artikel', 'meliput berita', 'wawancara tokoh']
    let jurnalis = tugasjurnalis[Math.floor(Math.random() * tugasjurnalis.length)]
    let tugasakuntan = ['mengaudit laporan keuangan', 'membuat laporan pajak', 'mengelola pembukuan perusahaan']
    let akuntan = tugasakuntan[Math.floor(Math.random() * tugasakuntan.length)]
    let tugasnelayan = ['menangkap ikan', 'merawat perahu', 'membersihkan jaring']
    let nelayan = tugasnelayan[Math.floor(Math.random() * tugasnelayan.length)]
    let tugasguru = ['mengajar matematika', 'mengoreksi ujian', 'membimbing siswa']
    let guru = tugasguru[Math.floor(Math.random() * tugasguru.length)]
    let tugassopir = ['mengantar penumpang', 'mengirim barang', 'mengemudi truk']
    let sopir = tugassopir[Math.floor(Math.random() * tugassopir.length)]
    let tugaspolisi = ['menangkap penjahat', 'berpatroli', 'mengamankan acara']
    let polisi = tugaspolisi[Math.floor(Math.random() * tugaspolisi.length)]
    let tugaspilot = ['menerbangkan pesawat', 'memeriksa alat navigasi', 'mengikuti prosedur penerbangan']
    let pilot = tugaspilot[Math.floor(Math.random() * tugaspilot.length)]
    let tugasteknisi = ['memperbaiki mesin', 'merawat peralatan', 'melakukan troubleshooting']
    let teknisi = tugasteknisi[Math.floor(Math.random() * tugasteknisi.length)]
    let tugasdesainer = ['merancang logo', 'membuat poster', 'menggambar ilustrasi']
    let desainer = tugasdesainer[Math.floor(Math.random() * tugasdesainer.length)]
    let tugaspemadam = ['memadamkan api', 'menyelamatkan korban', 'membersihkan puing']
    let pemadam = tugaspemadam[Math.floor(Math.random() * tugaspemadam.length)]
    let tugasmusisi = ['menulis lagu', 'berlatih instrumen', 'mengadakan konser']
    let musisi = tugasmusisi[Math.floor(Math.random() * tugasmusisi.length)]
    let tugastukang = ['membuat furniture', 'memperbaiki atap', 'membangun tembok']
    let tukang = tugastukang[Math.floor(Math.random() * tugastukang.length)]
    let tugaspenulis = ['menulis novel', 'menyusun artikel', 'mengedit naskah']
    let penulis = tugaspenulis[Math.floor(Math.random() * tugaspenulis.length)]
    let tugassekretaris = ['mengatur jadwal', 'membuat laporan', 'mengatur pertemuan']
    let sekretaris = tugassekretaris[Math.floor(Math.random() * tugassekretaris.length)]

    let pppecat = ['Ruko Kebakaran', 'LO NGOCOK DIDEPAN UMUM', 'Males Malesan', 'Ngew istrinya yg punya ruko']
    let alasanpecat = pppecat[Math.floor(Math.random() * pppecat.length)]
    let ddppecat = ['Bakar Pasien', 'Jual Organ Dalem ke Lapak ilegal', 'serinv telat']
    let alasanpasien = ddppecat[Math.floor(Math.random() * ddppecat.length)]

    let _pecat = `${pickRandom(['1', '1', '1', '1'])}`
    let pecat = (_pecat * 1)
    let ppecat = `KAMU KENA PECAT KARNA KAMU ${alasanpecat}`
    let _dpecat = `${pickRandom(['1', '0', '0', '1'])}`
    let dpecat = (_dpecat * 1)
    let dppecat = `KAMU DI PECAT KARNA ${alasanpasien}`

    let kerjaanya = `*📢 List Profesi Kerja*
    
* 👨🏻‍🦱 Ojek
* 🤵🏻 Pedagang
* 👨🏻‍⚕️ Dokter
* 👨🏻‍🌾 Petani
* 👨🏻‍🔧 Montir
* 👷🏻‍♂️ Kuli
* 👨🏻‍🍳 Koki
* 👨‍🔬 Insinyur
* 🎖️ Tentara
* 📰 Jurnalis
* 📊 Akuntan
* 🎣 Nelayan
* 👨‍🏫 Guru
* 🚗 Sopir
* 👮‍♂️ Polisi
* ✈️ Pilot
* 🔧 Teknisi
* 🎨 Desainer
* 🚒 Pemadam Kebakaran
* 🎵 Musisi
* 🔨 Tukang
* 📝 Penulis
* 📋 Sekretaris

*Contoh:* ${usedPrefix + command} kuli
    `

    if (/kerjadulu|kerja|work/i.test(command)) {
        switch(type) {
            case 'ojek':
                global.db.data.users[m.sender].money += uangm
                global.db.data.users[m.sender].lastkerja = new Date() * 1
                m.reply(`👨🏻‍🦱 Kamu Sudah Mengantarkan *${penumpang}*\nDan Mendapatkan Uang Senilai *Rp.${uangm.toLocaleString()}*`)
                break
            case 'pedagang':
                global.db.data.users[m.sender].money += duit
                global.db.data.users[m.sender].lastkerja = new Date() * 1
                m.reply(`🤵🏻 Ada Pembeli Yang Membeli *${dagangan}*\nDan Mendapatkan Uang Senilai *Rp.${duit.toLocaleString()}*`)
                if (pecat > 1 ) {
                    global.db.data.users[m.sender].pedagang -= pecat * 1
                    m.reply(ppecat)
                }
                break
            case 'dokter':
                global.db.data.users[m.sender].money += duitm
                global.db.data.users[m.sender].lastkerja = new Date() * 1
                m.reply(`👨🏻‍⚕️ Kamu Menyembuhkan *${pasien}*\nDan Mendapatkan Uang Senilai *Rp.${duitm.toLocaleString()}*`)
                break
            case 'petani':
                global.db.data.users[m.sender].money += duitd
                global.db.data.users[m.sender].lastkerja = new Date() * 1
                m.reply(`👨🏻‍🌾 ${panen} Sudah Panen Dan Menjualnya\nHasil Menjual Mendapatkan Uang Senilai *Rp.${duitd.toLocaleString()}*`)
                break
            case 'montir':
                global.db.data.users[m.sender].money += duitr
                global.db.data.users[m.sender].lastkerja = new Date() * 1
                m.reply(`👨🏻‍🔧 Kamu Baru Saja Mendapatkan Pelanggan Dan Memperbaiki *${bengkel}*\nHasil Memperbaiki Mendapatkan Uang Senilai *Rp.${duitr.toLocaleString()}*`)
                break
            case 'kuli':
                global.db.data.users[m.sender].money += duitk
                global.db.data.users[m.sender].lastkerja = new Date() * 1
                m.reply(`👷🏻‍♂️ Kamu Baru Saja Selesai ${rumah}\nDan Mendapatkan Uang Senilai *Rp.${duitk.toLocaleString()}*`)
                break
            case 'koki':
                global.db.data.users[m.sender].money += duitkk
                global.db.data.users[m.sender].lastkerja = new Date() * 1
                m.reply(`👨🏻‍🍳 Kamu Baru Selesai Memasak ${makan} Untuk ${pickRandom(['*Nuy*','*Pelanggan*','*Boss*','*Tamu Spesial*'])}\nDan Mendapatkan Uang Senilai *Rp.${duitkk.toLocaleString()}*`)
                break
            case 'insinyur':
                global.db.data.users[m.sender].money += duiti
                global.db.data.users[m.sender].lastkerja = new Date() * 1
                m.reply(`👨‍🔬 Kamu Baru Saja ${tugasinsinyur}\nDan Mendapatkan Uang Senilai *Rp.${duiti.toLocaleString()}*`)
                break
            case 'tentara':
                global.db.data.users[m.sender].money += duitt
                global.db.data.users[m.sender].lastkerja = new Date() * 1
                m.reply(`🎖️ Kamu Baru Saja ${militer}\nDan Mendapatkan Uang Senilai *Rp.${duitt.toLocaleString()}*`)
                break
            case 'jurnalis':
                global.db.data.users[m.sender].money += duitj
                global.db.data.users[m.sender].lastkerja = new Date() * 1
                m.reply(`📰 Kamu Baru Saja ${jurnalis}\nDan Mendapatkan Uang Senilai *Rp.${duitj.toLocaleString()}*`)
                break
            case 'akuntan':
                global.db.data.users[m.sender].money += duita
                global.db.data.users[m.sender].lastkerja = new Date() * 1
                m.reply(`📊 Kamu Baru Saja ${akuntan}\nDan Mendapatkan Uang Senilai *Rp.${duita.toLocaleString()}*`)
                break
            case 'nelayan':
                global.db.data.users[m.sender].money += duitn
                global.db.data.users[m.sender].lastkerja = new Date() * 1
                m.reply(`🎣 Kamu Baru Saja ${nelayan}\nDan Mendapatkan Uang Senilai *Rp.${duitn.toLocaleString()}*`)
                break
            case 'guru':
                global.db.data.users[m.sender].money += duitg
                global.db.data.users[m.sender].lastkerja = new Date() * 1
                m.reply(`👨‍🏫 Kamu Baru Saja ${guru}\nDan Mendapatkan Uang Senilai *Rp.${duitg.toLocaleString()}*`)
                break
            case 'sopir':
                global.db.data.users[m.sender].money += duits
                global.db.data.users[m.sender].lastkerja = new Date() * 1
                m.reply(`🚗 Kamu Baru Saja ${sopir}\nDan Mendapatkan Uang Senilai *Rp.${duits.toLocaleString()}*`)
                break
            case 'polisi':
                global.db.data.users[m.sender].money += duitp
                global.db.data.users[m.sender].lastkerja = new Date() * 1
                m.reply(`👮‍♂️ Kamu Baru Saja ${polisi}\nDan Mendapatkan Uang Senilai *Rp.${duitp.toLocaleString()}*`)
                break
            case 'pilot':
                global.db.data.users[m.sender].money += duitp
                global.db.data.users[m.sender].lastkerja = new Date() * 1
                m.reply(`✈️ Kamu Baru Saja ${pilot}\nDan Mendapatkan Uang Senilai *Rp.${duitp.toLocaleString()}*`)
                break
            case 'teknisi':
                global.db.data.users[m.sender].money += duitt
                global.db.data.users[m.sender].lastkerja = new Date() * 1
                m.reply(`🔧 Kamu Baru Saja ${teknisi}\nDan Mendapatkan Uang Senilai *Rp.${duitt.toLocaleString()}*`)
                break
            case 'desainer':
                global.db.data.users[m.sender].money += duitd
                global.db.data.users[m.sender].lastkerja = new Date() * 1
                m.reply(`🎨 Kamu Baru Saja ${desainer}\nDan Mendapatkan Uang Senilai *Rp.${duitd.toLocaleString()}*`)
                break
            case 'pemadam':
                global.db.data.users[m.sender].money += duitp
                global.db.data.users[m.sender].lastkerja = new Date() * 1
                m.reply(`🚒 Kamu Baru Saja ${pemadam}\nDan Mendapatkan Uang Senilai *Rp.${duitp.toLocaleString()}*`)
                break
            case 'musisi':
                global.db.data.users[m.sender].money += duitm
                global.db.data.users[m.sender].lastkerja = new Date() * 1
                m.reply(`🎵 Kamu Baru Saja ${musisi}\nDan Mendapatkan Uang Senilai *Rp.${duitm.toLocaleString()}*`)
                break
            case 'tukang':
                global.db.data.users[m.sender].money += duitt
                global.db.data.users[m.sender].lastkerja = new Date() * 1
                m.reply(`🔨 Kamu Baru Saja ${tukang}\nDan Mendapatkan Uang Senilai *Rp.${duitt.toLocaleString()}*`)
                break
                break
            case 'penulis':
                global.db.data.users[m.sender].money += duitt
                global.db.data.users[m.sender].lastkerja = new Date() * 1
                m.reply(`📝 Kamu Baru Saja ${penulis}\nDan Mendapatkan Uang Senilai *Rp.${duitt.toLocaleString()}*`)
                break
            case 'sekretaris':
                global.db.data.users[m.sender].money += duits
                global.db.data.users[m.sender].lastkerja = new Date() * 1
                m.reply(`📋 Kamu Baru Saja ${sekretaris}\nDan Mendapatkan Uang Senilai *Rp.${duits.toLocaleString()}*`)
                break
            default:
                m.reply(kerjaanya)
                break
        }
    } else {
        m.reply(kerjaanya)
    }
}

handler.help = ['kerja <job>']
handler.tags = ['game']
handler.command = /^(kerja|kerjadulu|work)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = true
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

export default handler

function clockString(ms) {
    let d = Math.floor(ms / 86400000)
    let h = Math.floor(ms / 3600000) % 24
    let m = Math.floor(ms / 60000) % 60
    let s = Math.floor(ms / 1000) % 60
    return ['\n' + d, ' *Hari*\n ', h, ' *Jam*\n ', m, ' *Menit*\n ', s, ' *Detik* '].map(v => v.toString().padStart(2, 0)).join('')
}

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}