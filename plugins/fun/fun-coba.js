let handler = async (m, { conn, command }) => {
  if (command === 'coba') {
    // Array berisi berbagai frasa yang akan dipilih secara acak
    let phrases = [
      'Aku Monyet', 'Aku Kera', 'Aku Tolol', 'Aku Kaya', 'Aku Dewa', 
      'Aku Anjing', 'Aku Dongo', 'Aku Raja', 'Aku Sultan', 'Aku Baik', 
      'Aku Hitam', 'Aku Suki'
    ];

    // Fungsi untuk memilih elemen acak dari array
    const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

    // Mengirimkan pesan dengan tombol interaktif
    await conn.sendMessage(m.chat, {
      text: 'Semoga Hoki😹', // Teks utama pesan
      buttons: [
        {
          buttonId: 'teshoki', // ID untuk tombol pertama
          buttonText: { displayText: pickRandom(phrases) }, // Teks tombol diambil secara acak
          type: 1 // Tipe tombol (respons interaktif)
        },
        {
          buttonId: 'cobacoba', // ID untuk tombol kedua
          buttonText: { displayText: pickRandom(phrases) }, // Teks tombol diambil secara acak
          type: 1
        }
      ],
      headerType: 1 // Tipe header pesan (opsional, bisa disesuaikan)
    });
  }
};

handler.command = ['coba']; // Mendefinisikan perintah yang akan memicu handler ini
handler.tags = ['fun']; // Menambahkan tag 'fun' karena ini adalah fitur hiburan
handler.help = ['coba']; // Bantuan penggunaan perintah

export default handler;