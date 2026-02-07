const handler = async (m, { conn, text, command, args, usedPrefix }) => {
  if (!text) {
    return m.reply(`📌 Contoh pemakaian:\n${usedPrefix + command} 628xx|Udin`);
  }

  const [nomor, nama] = text.split('|');

  if (!nomor || !nama) {
    return m.reply(`❌ Format salah!\nContoh:\n${usedPrefix + command} 628xx|Udin`);
  }

  const nomorTujuan = nomor.replace(/[^0-9]/g, '') + '@s.whatsapp.net';

  const prankList = [
    `😱 Hai ${nama}, saldo kamu habis karena transfer ke nomor tak dikenal.`,
    `📢 Perhatian! ${nama} telah memenangkan hadiah 1 Miliar! Hubungi 666 sekarang.`,
    `😈 ${nama}, kamu ketahuan ngintip WA orang lain!`,
    `📸 Foto rahasiamu telah diunggah ke publik! Klik https://mampus.lu/${nama}`,
    `🚨 Warning! Kamu sedang dipantau oleh FBI.`,
    `🤖 Robot AI telah mengkloning wajah ${nama}!`
  ];

  const prankMessage = prankList[Math.floor(Math.random() * prankList.length)];

  try {
    await conn.sendMessage(nomorTujuan, { text: prankMessage });
    m.reply(`✅ Prank berhasil dikirim ke *${nama}* (${nomor})`);
  } catch (e) {
    m.reply(`❌ Gagal mengirim ke nomor tersebut.\n📌 Pastikan nomor sudah pernah chat bot.`);
  }
};

handler.help = ['prankto <nomor>|<nama>'];
handler.tags = ['fun'];
handler.command = /^prankto$/i;

export default handler;