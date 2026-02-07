let handler = async(m, { text, conn, usedPrefix, command }) => {
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
  let khodam = [
    'Harimau Merah', 'Macan Putih', 'Belut Hitam', 'Nyi Brorong', 'Macan Tutul',
    'Tempe Goreng', 'Sayur Asem', 'Kucing Hitam', 'Cat Tembok', 'Pecel Lele',
    'Iwak Water', 'Asep Racing', 'Kunti Biang', 'Belalang Biru', 'Sendok',
    'Garpu', 'Ayam Jago', 'Nasi Goreng', 'Sate Padang', 'Bakso Urat',
    'Nasi Kucing', 'Mie Instan', 'Ayam Geprek', 'Es Cendol', 'Kopi Tubruk',
    'Cilok Bandung', 'Seblak', 'Rendang Lezat', 'Sambal Matah',
    'Sop Buntut', 'Bubur Ayam', 'Klepon Manis', 'Martabak Manis',
    'Keripik Singkong', 'Gorengan Renyah', 'Cendol Dawet', 'Cireng',
    'Batagor', 'Siomay', 'Es Dawet', 'Kue Lumpur', 'Kue Putu', 'Kue Ape',
    'Knalpot Racing', 'Ban', 'Spion', 'Velg Jari-jari', 'Karburator', 
    'Busi Panas', 'Rante Besi', 'Lampu LED', 'Klakson', 'Shockbreaker', 
    'Tromol Belakang', 'Rem Cakram', 'Tangki Bensin', 'Stang',
    'Batu Bata', 'Semen Gresik', 'Pasir', 'Genteng', 'Keramik',
    'Pintu', 'Jendela', 'Atap Seng', 'Cat Tembok', 'Kunci Inggris', 
    'Obeng Plus', 'Palang Besi', 'Paku Beton', 'Sekop Baja', 'Bor Listrik',
    'Kuntilanak', 'Pocong', 'Tuyul', 'Wewe Gombel', 'Genderuwo',
    'Sundel Bolong', 'Leak', 'Kuyang', 'Babi Ngepet', 'Jelangkung',
    'Monitor', 'Mouse', 'Keyboard', 'CPU', 'Hard Disk', 
    'RAM', 'Motherboard', 'Power Supply', 'Printer', 'Scanner', 
    'Router', 'Modem', 'VGA Card', 'SSD', 'USB Drive'
  ]
  let pilihan = pickRandom(khodam)
  let mentionedJid = [who]
  let teks = `\`Pemilik:\` @${who.replace(/@.+/, '')}\n\`Khodam:\` ${pilihan}`
  conn.reply(m.chat, teks, m, {contextInfo: { mentionedJid }})
}

handler.tags = ['fun']
handler.help = ['cekkodam']
handler.command = /^(cekkhodam|cekkodam|khodamcek|kodamcek)$/i

export default handler

function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())]
}