let handler = async (m, { conn }) => {
  let id = m.chat
  global.kuis = global.kuis || {}

  if (id in global.kuis)
    return conn.reply(m.chat, '❌ Masih ada soal yang belum dijawab di chat ini!', global.kuis[id].pesan)

  let soal = pickRandom(Object.keys(global.kuisBank))
  let jawaban = global.kuisBank[soal]

  global.kuis[id] = {
    pesan: await conn.reply(m.chat, `「 *KUIS* 」\n\n*Pertanyaan:*\n${soal}\n\n⏳ Waktu: 120 Detik\n🎁 Bonus: 5000 XP`, m),
    jawaban,
    timeout: setTimeout(() => {
      if (global.kuis[id]) conn.reply(m.chat, `⏳ *Waktu habis!*\nJawaban yang benar adalah: *${jawaban}*`, m)
      delete global.kuis[id]
    }, 120000), // 120 detik
    answered: false, // Track apakah sudah dijawab
  }

  // Monitor pesan untuk jawaban
  conn.on('chat-update', async (message) => {
    if (!global.kuis[id]) return; // Pastikan kuis masih aktif

    let text = message.text.trim().toLowerCase()

    // Jika jawaban benar atau salah
    if (text && !global.kuis[id].answered) {
      if (text === global.kuis[id].jawaban.toLowerCase()) {
        conn.reply(m.chat, `✅ Jawaban Anda benar! 🎉`, m)
      } else {
        conn.reply(m.chat, `❌ Jawaban Anda salah, coba lagi!`, m)
      }
      global.kuis[id].answered = true; // Tandai bahwa sudah ada jawaban
    }
  })
}

handler.help = ['kuis']
handler.tags = ['game']
handler.command = /^kuis$/i
handler.limit = true
export default handler

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

global.kuisBank = {
  'Ibu kota Indonesia?': 'Jakarta',
  '2 + 2 = ?': '4',
  'Planet terbesar di tata surya?': 'Jupiter',
  'Presiden pertama Indonesia?': 'Soekarno',
  'Lambang negara Indonesia?': 'Garuda Pancasila',
  'Warna bendera Indonesia?': 'Merah Putih',
  'Hewan tercepat di darat?': 'Cheetah',
  'Binatang berkaki delapan?': 'Laba-laba',
  'Apa ibukota Jepang?': 'Tokyo',
  'Negara dengan Menara Eiffel?': 'Prancis',
  'Kucing takut dengan?': 'Air',
  'Apa lawan kata gelap?': 'Terang',
  'Hewan apa yang suka melompat dan berkantong?': 'Kanguru',
  'Buah yang kulitnya berduri dan baunya tajam?': 'Durian',
  'Air dalam bentuk padat disebut?': 'Es',
  'Gigi digunakan untuk?': 'Mengunyah',
  'Satu minggu ada berapa hari?': '7',
  'Matahari terbit dari arah?': 'Timur',
  'Ayam bertelur atau beranak?': 'Bertelur',
  'Indonesia terletak di benua?': 'Asia',
  'Hewan bertubuh besar, belalai panjang?': 'Gajah',
  'Sayur yang bikin orang ketawa?': 'Sawi ketawa',
  'Binatang yang bisa ngeramal?': 'Dukun-dukun',
  'Yang selalu naik tapi tak pernah turun?': 'Umur',
  'Sapi naik motor jadi apa?': 'Jatuh',
  'Benda yang diinjak malah enak?': 'Rem',
  'Kapan mobil tidak bisa jalan?': 'Kalau nggak ada bannya',
  'Orang makin malam makin terang?': 'Orang bawa senter',
  'Apa yang kalau dibagi jadi besar?': 'Lubang',
  'Tukang bakso gak naik jabatan karena?': 'Muter-muter',
  'Burung yang bikin heboh kalau terbang?': 'Burung jatuh',
  'Pahlawan suka disko?': 'Cut Nyak Disco',
  'Roti bakar dibakar karena?': 'Namanya roti bakar',
  'Kipas dikasih roti jadi?': 'Kenyang',
  'Perbedaan rumah dan rumah sakit?': 'Rumah sakit banyak orang sakitnya',
  'Kenapa jomblo susah move on?': 'Gak ada yang ditinggalin',
  'Superman naik motor, siapa nyetir?': 'Tergantung SIM siapa',
  'Binatang bisa main HP?': 'Chipmunk',
  'Ayam nyebrang jalan karena?': 'Mau ke seberang',
  'Yang bisa ngebut tanpa motor?': 'Angin',
  'Semakin diisi makin ringan?': 'Balon',
  'Selalu tepat waktu tapi tak terlihat?': 'Bayangan',
  'Burung hantu matanya besar karena?': 'Sering lembur',
  'Buah dilempar gak sakit?': 'Buah tangan',
  'Koruptor gak lapar karena?': 'Kenyang uang rakyat',
  'Selalu basah walau panas?': 'Lidah',
  'Bisa dipegang tapi tak terlihat?': 'Janji',
  'Putih tapi suka dihitamkan?': 'Papan tulis',
  'Selalu berakhir malam?': 'Hari',
  'Kalau kamu lapar, kamu?': 'Makan',
  'Hewan berkaki dua dan bisa terbang?': 'Burung',
  'Benda yang digunakan untuk menulis?': 'Pulpen',
  'Tempat orang belajar?': 'Sekolah',
  'Minuman wajib tiap pagi?': 'Kopi',
  'Lagu kebangsaan Indonesia?': 'Indonesia Raya',
  'Buah yang rasanya asam dan kuning?': 'Lemon',
  'Buah merah kecil suka dibuat jus?': 'Stroberi',
  'Sayuran yang panjang dan hijau?': 'Kacang panjang',
  'Sayur berdaun hijau dan pahit?': 'Pare',
  'Binatang bersirip dan hidup di air?': 'Ikan',
  'Tempat tinggal ikan?': 'Laut',
  'Benda yang digunakan untuk melihat jauh?': 'Teropong',
  'Musim setelah kemarau?': 'Hujan',
  'Hewan kecil, suka manis, menyengat?': 'Lebah',
  'Benda bulat kecil untuk main bola?': 'Bola',
  'Warna daun yang sehat?': 'Hijau',
  'Air minum dari gunung?': 'Air mineral',
  'Satuan panjang terkecil?': 'Milimeter',
  'Negara tetangga Indonesia di selatan?': 'Australia',
  'Sungai terpanjang di dunia?': 'Amazon',
  'Gunung tertinggi di dunia?': 'Everest',
  'Yang kita hirup untuk hidup?': 'Oksigen',
  'Tempat dokter bekerja?': 'Rumah sakit',
  'Kendaraan di rel?': 'Kereta',
  'Tempat banyak buku?': 'Perpustakaan',
  'Benda kecil untuk menyalakan api?': 'Korek',
  'Tempat belanja kebutuhan?': 'Pasar',
  'Tanggal kemerdekaan RI?': '17 Agustus 1945',
  'Hewan berbisa panjang tanpa kaki?': 'Ular',
  'Lambang dari cinta?': 'Hati',
  'Negara terkenal pizza dan pasta?': 'Italia',
  'Negara asal kimchi?': 'Korea',
  'Tempat orang sholat berjamaah?': 'Masjid',
  'Kitab suci umat Islam?': 'Al-Qur\'an',
  'Kitab suci umat Kristen?': 'Alkitab',
  'Ibu kota Inggris?': 'London',
  'Nama mata uang Jepang?': 'Yen',
  'Benda hitam di langit malam?': 'Bulan',
  'Benda besar bercahaya di siang hari?': 'Matahari',
  'Tempat hewan-hewan hidup bebas?': 'Hutan',
  'Tempat wisata air buatan?': 'Kolam renang',
  'Musuh Batman?': 'Joker',
  'Nama superhero laba-laba?': 'Spiderman',
  'Film dinosaurus terkenal?': 'Jurassic Park',
  'Roti khas Italia dengan topping?': 'Pizza',
  'Kota mode dunia?': 'Paris',
  'Negara dengan bendera merah putih bulat?': 'Jepang',
  'Binatang yang bisa terbang di malam hari?': 'Kelelawar',
  'Pahlawan yang menulis Surat Wasiat?': 'Kartini',
}