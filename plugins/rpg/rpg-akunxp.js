let handler = async (m, { conn }) => {
  try {
    let user = global.db.data.users[m.sender];
    if (!user) {
      return conn.reply(m.chat, 'User data not found.', m);
    }

    const tag = '@' + m.sender.split('@')[0];
    let totalEksplorasi = user.sand || 0;
    let ekplorasiFormatted = totalEksplorasi.toLocaleString('en-US');
    
    let title = '';
    if (totalEksplorasi >= 1000) {
      title = 'Sang Legenda';
    } else if (totalEksplorasi >= 100) {
      title = 'Pecinta Alam';
    } else if (totalEksplorasi >= 25) {
      title = 'Penyelamat Alam';
    } else {
      title = 'Pemula';
    }

    let response = `📊 *Statistik Eksplorasi Anda* 📊
🧑🏻‍💻 *Petualang:* ${tag}
🌟 *Total Eksplorasi:* ${ekplorasiFormatted} kali
🏆 *Title:* ${title}`;

    return conn.reply(m.chat, response, m);
  } catch (error) {
    console.error(error);
    return conn.reply(m.chat, 'Terjadi kesalahan saat mengambil data eksplorasi Anda.', m);
  }
};

// Daftarkan handler .akunxp
handler.help = ['akunxp'];
handler.tags = ['rpg'];
handler.command = /^(akunxp|akunexp)$/i;
handler.register = true;
handler.group = true;

export default handler;