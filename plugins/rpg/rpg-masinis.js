let handler = async (m, { conn, command, args }) => {
    let user = global.db.data.users[m.sender]
    let name = conn.getName(m.sender)
    let time = global.db.data.users[m.sender].udahperjalanan + 3000000
    if (new Date - global.db.data.users[m.sender].udahperjalanan < 3000000) throw `Tunggu Selama ${msToTime(time - new Date())} Lagi`

    if (!user.masinis) {
        user.masinis = {
            license: false,
            tripCount: 0,
            stations: [],
            earnings: 0,
            currentTrain: null,
            fuel: 100,
        }
    }

    switch (command) {
        case 'masinis':
            showMasinisStatus(m, conn, user, name)
            break

        case 'buatsimmasinis':
            if (user.masinis.license) {
                conn.reply(m.chat, `Kamu sudah memiliki SIM Masinis!`, m)
            } else if (user.money < 300000) {
                conn.reply(m.chat, `Uang kamu tidak cukup untuk membuat SIM Masinis. Dibutuhkan Rp 300.000.`, m)
            } else {
                user.money -= 300000
                user.masinis.license = true
                conn.reply(m.chat, `Selamat! Kamu berhasil membuat SIM Masinis dan siap menjalankan kereta.`, m)
            }
            break

        case 'perjalanan':
            if (!user.masinis.license) {
                conn.reply(m.chat, `Kamu belum memiliki SIM Masinis. Gunakan perintah *buatSIMmasinis* untuk membuat.`, m)
            } else if (!user.masinis.currentTrain) {
                conn.reply(m.chat, `Kamu belum memiliki kereta. Gunakan *kereta beli <nama_kereta>* untuk membeli.`, m)
            } else if (user.masinis.fuel < 20) {
                conn.reply(m.chat, `Bahan bakar kereta tidak cukup. Isi ulang bahan bakar sebelum melakukan perjalanan.`, m)
            } else {
                let stations = [
                    { name: 'Stasiun Gambir', duration: 2, reward: 10000 },
                    { name: 'Stasiun Bandung', duration: 4, reward: 20000 },
                    { name: 'Stasiun Surabaya', duration: 6, reward: 30000 },
                    { name: 'Stasiun Medan', duration: 8, reward: 40000 },
                    { name: 'Stasiun Yogyakarta', duration: 5, reward: 25000 },
                    { name: 'Stasiun Semarang', duration: 3, reward: 15000 },
                    { name: 'Stasiun Malang', duration: 7, reward: 35000 },
                ]
                let station = stations[Math.floor(Math.random() * stations.length)]
                let risks = [
                    { message: 'Kereta terlambat sedikit, perjalanan berjalan baik.', effect: 0 },
                    { message: 'Penumpang memberikan bonus tips.', effect: 5000 },
                    { message: 'Kerusakan kecil, biaya perbaikan dibutuhkan.', effect: -5000 },
                    { message: 'Cuaca buruk, membutuhkan tambahan bahan bakar.', effect: -2000 },
                    { message: 'Perjalanan berjalan lancar tanpa kendala.', effect: 0 },
                ]
                let risk = risks[Math.floor(Math.random() * risks.length)]

                let fuelCost = station.duration * 5 // Mengurangi bahan bakar sesuai durasi
                user.masinis.fuel -= fuelCost

                // Delay perjalanan
                let key = await conn.sendMessage(m.chat, { text: '🚂 Menjalankan kereta...' }, { quoted: m })
                await delay(station.duration * 1000) // Delay sesuai durasi perjalanan dalam detik

                // Update data setelah delay
                user.money += station.reward + risk.effect
                user.masinis.tripCount += 1
                user.masinis.stations.push(station.name)
                user.masinis.earnings += station.reward
                global.db.data.users[m.sender].udahperjalanan = new Date * 1

                let message = `
🚂 **Perjalanan Selesai!**
Stasiun Tujuan: ${station.name}
Durasi: ${station.duration} jam
Hasil: ${risk.message}
Pendapatan: Rp ${toRupiah(station.reward + risk.effect)}
Bahan Bakar Tersisa: ${user.masinis.fuel}%
Total Pendapatan: Rp ${toRupiah(user.masinis.earnings)}
`.trim()

                conn.sendMessage(m.chat, { text: message, edit: key.key }, { quoted: m })
            }
            break

        case 'kereta':
            let trains = {
                'Commuter': { pAyaka: 1000000, fuelEfficiency: 5 },
                'LRT': { pAyaka: 3000000, fuelEfficiency: 7 },
                'MRT': { pAyaka: 5000000, fuelEfficiency: 10 },
                'KRL': { pAyaka: 8000000, fuelEfficiency: 12 },
                'Shinkansen': { pAyaka: 12000000, fuelEfficiency: 15 },
            }

            if (args[0] === 'beli') {
                let train = args[1]
                if (!train || !trains[train]) {
                    conn.reply(
                        m.chat,
                        `Gunakan format *kereta beli <nama_kereta>*.\nKereta tersedia: ${Object.keys(trains).join(', ')}.`,
                        m
                    )
                } else if (user.money < trains[train].pAyaka) {
                    conn.reply(
                        m.chat,
                        `Uang kamu tidak cukup untuk membeli kereta ${train}. Harga: Rp ${toRupiah(trains[train].pAyaka)}.`,
                        m
                    )
                } else {
                    user.money -= trains[train].pAyaka
                    user.masinis.currentTrain = train
                    conn.reply(m.chat, `Selamat! Kamu berhasil membeli kereta ${train}.`, m)
                }
            } else {
                let trainInfo = user.masinis.currentTrain
                    ? `Kereta Aktif: ${user.masinis.currentTrain}`
                    : 'Kamu belum memiliki kereta. Gunakan *kereta beli <nama_kereta>* untuk membeli.'

                conn.reply(m.chat, trainInfo, m)
            }
            break

        case 'isibbmkereta':
            if (!user.masinis.currentTrain) {
                conn.reply(m.chat, `Kamu belum memiliki kereta untuk mengisi bahan bakar.`, m)
            } else if (user.money < 10000) {
                conn.reply(m.chat, `Uang kamu tidak cukup untuk membeli bahan bakar.`, m)
            } else {
                user.money -= 10000
                user.masinis.fuel = 100
                conn.reply(m.chat, `Bahan bakar kereta berhasil diisi penuh.`, m)
            }
            break

        default:
            conn.reply(m.chat, `Perintah tidak ditemukan.`, m)
            break
    }
}

handler.help = ['masinis', 'buatSIMmasinis', 'perjalanan', 'kereta beli <nama_kereta>', 'isiBBMkereta']
handler.tags = ['rpg']
handler.command = /^(masinis|buatsimmasinis|perjalanan|kereta|isibbmkereta)$/i

handler.register = false
export default handler

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function showMasinisStatus(m, conn, user, name) {
    let masinis = user.masinis
    let caption = `
🚂 **Status Masinis**
Nama: ${user.registered ? user.name : name}
SIM Masinis: ${masinis.license ? 'Dimiliki' : 'Tidak Dimiliki'}
Jumlah Perjalanan: ${masinis.tripCount}
Total Pendapatan: Rp ${toRupiah(masinis.earnings)}
Kereta Aktif: ${masinis.currentTrain || 'Belum Memiliki'}
Stasiun Dikunjungi: ${masinis.stations.length > 0 ? masinis.stations.join(', ') : 'Belum Ada'}
Bahan Bakar: ${masinis.fuel}%
`.trim()

    conn.reply(m.chat, caption, m)
}

function toRupiah(angka) {
    let reverse = angka.toString().split('').reverse().join('')
    let ribuan = reverse.match(/\d{1,3}/g)
    ribuan = ribuan.join('.').split('').reverse().join('')
    return ribuan
}

function msToTime(duration) {
  var milliseconds = parseInt((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24),
    monthly = Math.floor((duration / (1000 * 60 * 60 * 24)) % 720)

  monthly  = (monthly < 10) ? "0" + monthly : monthly
  hours = (hours < 10) ? "0" + hours : hours
  minutes = (minutes < 10) ? "0" + minutes : minutes
  seconds = (seconds < 10) ? "0" + seconds : seconds

  return monthly + " Hari " +  hours + " Jam " + minutes + " Menit"
}