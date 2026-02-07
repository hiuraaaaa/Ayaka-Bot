// plugins/truthordare.js
const truths = [
  "Apa rahasia terbesarmu yang belum kamu ceritakan ke siapa pun?",
  "Siapa orang terakhir yang kamu stalking?",
  "Pernah naksir teman sendiri? Siapa?",
  "Apa kebohongan terbesar yang pernah kamu katakan?",
  "Siapa orang yang paling kamu rindukan saat ini?",
  "Pernah pacaran diam-diam dari orang tua?",
  "Apa hal paling memalukan yang pernah kamu lakukan?",
  "Siapa nama mantan yang masih ada di pikiranmu?",
  "Pernah ghosting seseorang? Kenapa?",
  "Apa hal yang paling kamu sesali?",
  "Siapa teman yang paling kamu percaya?",
  "Pernah suka sama pacar teman sendiri?",
  "Kalau kamu jadi lawan jenismu, hal pertama yang akan kamu lakukan?",
  "Kapan terakhir kamu bohong dan kenapa?",
  "Apa bagian tubuhmu yang paling kamu suka?",
  "Pernah suka sama guru/dosen?",
  "Siapa orang yang paling kamu benci saat ini?",
  "Pernah mimpi basah? Ceritain dikit dong.",
  "Hal teraneh yang pernah kamu lakukan waktu sendirian?",
  "Kalau mantanmu minta balikan, apa yang kamu lakukan?",
  "Siapa yang terakhir kali kamu chat sebelum tidur?",
  "Apa panggilan sayang paling absurd yang pernah kamu pakai?",
  "Apa ketakutan terbesarmu?",
  "Kalau kamu bisa ubah satu hal di masa lalu, apa itu?",
  "Apa mimpi teraneh yang pernah kamu alami?"
];

const dares = [
  "Kirim pesan 'aku sayang kamu' ke kontak acak.",
  "Ucapkan pantun secara spontan sekarang juga!",
  "Nyanyikan lagu favoritmu 10 detik.",
  "Buat suara kucing lalu kirim sebagai VN.",
  "Ketik 'Aku suka kamu' dan kirim ke teman sejenis.",
  "Ganti nama profil jadi 'Aku Lagi Malu' selama 10 menit.",
  "Chat mantanmu dan bilang 'Aku masih sayang'.",
  "Tirukan suara bayi dalam VN.",
  "Buat status 'Aku baper' dan diamkan 5 menit.",
  "Gambar hati dan kirim ke grup.",
  "Rekam video gaya alay dan kirim ke teman.",
  "Ketik 3 kalimat tanpa huruf vokal.",
  "Lompat 3 kali dan bilang 'Aku suka kamu'.",
  "Pura-pura jadi robot selama 1 menit.",
  "Ketik nama gebetan lalu hapus, ulangi 3x.",
  "Kirim emoji paling random ke 5 kontak.",
  "Nyanyi lagu anak-anak dengan gaya sedih.",
  "Ketik 'Sayang kamu' 10x nonstop.",
  "Berakting jadi penjual bakso di VN.",
  "Ketik nama lengkapmu pakai huruf besar semua.",
  "Teriak 'Aku jomblo bahagia!' (VN).",
  "Gambar wajah sendiri dan kirim ke grup.",
  "Ganti bio WA: 'Cari jodoh nih' selama 5 menit.",
  "Chat seseorang dan ajak nikah (bercanda).",
  "VN: Ngaku dosa terbesar kamu (pura-pura boleh)."
];

const handler = async (m, { conn, command }) => {
  const type = command.toLowerCase();
  const isTruth = type === 'truth';
  const list = isTruth ? truths : dares;
  const result = list[Math.floor(Math.random() * list.length)];

  await conn.sendMessage(m.chat, {
    text: `*${isTruth ? 'Truth' : 'Dare'}:*\n${result}`,
    footer: 'Ubed Bot • Truth or Dare',
    buttons: [
      {
        buttonId: `.Truth`,
        buttonText: { displayText: `Jawab Truth` },
        type: 1
      },
      {
        buttonId: `.Dare`,
        buttonText: { displayText: `Jawab Dare` },
        type: 1
      }
    ],
    headerType: 1,
    viewOnce: true
  }, { quoted: m });
};

handler.help = ['truth', 'dare'];
handler.tags = ['game'];
handler.command = /^truth|dare$/i;
handler.register = true;

export default handler;