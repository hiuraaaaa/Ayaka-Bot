/*
📌 Nama Fitur: Create Kalender
🏷️ Type : Plugin ESM
🔗 Sumber : https://whatsapp.com/channel/0029Vb91Rbi2phHGLOfyPd3N
🔗 Api : https://fastrestapis.fasturl.cloud
✍️ Convert By ZenzXD
*/

const handler = async (m, { text, conn }) => {
  const [month, year] = text.split(' ').map(Number);

  if (!month || !year || month < 1 || month > 12 || year < 1900)
    return m.reply('⚠️Format salah.\nContoh: *.ckalender 5 2025*');

  try {
    const url = `https://fastrestapis.fasturl.cloud/maker/calendar/advanced?month=${month}&year=${year}`;
    
    await conn.sendMessage(m.chat, {
      image: { url },
      caption: `✅ Kalender ${month}/${year}`
    }, { quoted: m });

  } catch (err) {
    console.error(err);
    m.reply('❌ Gagal mengambil gambar kalender.');
  }
};

handler.help = ['ckalender <bulan> <tahun>'];
handler.tags = ['maker'];
handler.command = /^ckalender|kalender$/i;

export default handler;

/* JANGAN HAPUS WM INI MEK!
SCRIPT BY © 𝐅𝐚𝐫𝐢𝐞𝐥
•• contacts: (6287872545804)
•• instagram: @Ayakaai__
*/