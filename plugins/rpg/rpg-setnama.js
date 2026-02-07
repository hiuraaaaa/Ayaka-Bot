const handler = async (m, { conn, text }) => {
  if (!text) {
    throw 'Silakan masukkan nama baru yang ingin kamu gunakan!';
  }

  const newName = text.trim(); // Hilangkan spasi di awal dan akhir
  if (newName.length > 30) {
    throw 'Nama terlalu panjang! Maksimal 30 karakter.'; // Optional: Batasi panjang nama
  }

  global.db.data.users[m.sender].name = newName; // Simpan nama baru ke database

  const buttons = [
    { buttonId: '.pilihumur', buttonText: { displayText: 'Lanjut ke Umur✨' }, type: 1 }
  ];

  const buttonMessage = {
    text: `Nama kamu berhasil diubah menjadi: *${newName}*`,
    buttons: buttons,
    headerType: 1
  };

  await conn.sendMessage(m.chat, buttonMessage, { quoted: m });
};

handler.help = ['setnama <nama baru>'];
handler.tags = ['rpg'];
handler.command = ['setnama', 'setname', 'ubahnama', 'gantinama']; // Multiple commands

export default handler;