import fs from 'fs';

const dbPath = './src/giveaway.json';
const delay = ms => new Promise(res => setTimeout(res, ms));

function loadDB() {
  if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, '{}');
  return JSON.parse(fs.readFileSync(dbPath));
}

function saveDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

const handler = async (m, { text, args, command, participants, isAdmin, isROwner }) => {
  if (!m.isGroup) return m.reply('Fitur ini hanya bisa digunakan dalam grup.');
  const groupId = m.chat;
  const db = loadDB();

  if (!db[groupId]) {
    db[groupId] = {
      participants: [],
      isActive: false,
      hasSpun: false
    };
  }

  const giveaway = db[groupId];

  switch ((args[0] || '').toLowerCase()) {
    case '':
      return m.reply(`
*Giveaway Bot Command Guide*

- *giveaway join*: Bergabung dengan giveaway jika aktif
- *giveaway buat*: Mulai event giveaway (admin only)
- *giveaway list*: Lihat daftar peserta (admin only)
- *giveaway spin*: Acak 3 pemenang (admin only, min 10 peserta)
- *giveaway hapus*: Hapus event giveaway (admin only)
      `.trim());

    case 'join':
      if (!giveaway.isActive) return m.reply('Tidak ada event giveaway yang aktif.');
      if (giveaway.hasSpun) return m.reply('Pendaftaran sudah ditutup.');
      if (giveaway.participants.includes(m.sender)) return m.reply('Kamu sudah terdaftar.');
      giveaway.participants.push(m.sender);
      saveDB(db);
      return m.reply('Kamu berhasil bergabung dalam event giveaway!');

    case 'buat':
      if (!isAdmin && !isROwner) return m.reply('Hanya admin yang bisa memulai giveaway.');
      if (giveaway.isActive) return m.reply('Event giveaway sudah berjalan.');
      giveaway.isActive = true;
      giveaway.hasSpun = false;
      giveaway.participants = [];
      saveDB(db);
      let all = participants.map(p => p.id);
      return m.reply(
        `🎉 *GIVEAWAY DIMULAI!* 🎉\n\nKetik *.giveaway join* untuk ikut!\n\nMinimal 10 peserta. 3 pemenang akan dipilih secara acak.`,
        null,
        { mentions: all }
      );

    case 'list':
      if (!isAdmin && !isROwner) return m.reply('Hanya admin yang bisa melihat daftar peserta.');
      if (!giveaway.isActive) return m.reply('Tidak ada event aktif.');
      if (!giveaway.participants.length) return m.reply('Belum ada peserta.');
      return m.reply(
        `*Peserta Giveaway:*\n${giveaway.participants.map((u, i) => `${i + 1}. @${u.split('@')[0]}`).join('\n')}`,
        null,
        { mentions: giveaway.participants }
      );

    case 'spin':
      if (!isAdmin && !isROwner) return m.reply('Hanya admin yang bisa melakukan spin.');
      if (!giveaway.isActive) return m.reply('Tidak ada event aktif.');
      if (giveaway.participants.length < 10) return m.reply('Minimal 10 peserta dibutuhkan untuk melakukan spin.');

      await m.reply('🎰 *SPIN GIVEAWAY DIMULAI!* 🎰\n\n🥁 Mengocok nama-nama peserta...');

      const animasi = [
        'Mengacak nama... 🎲',
        'Memutar undian... 🎰',
        'Menentukan pemenang... ⏳',
        'Siapakah yang beruntung...?'
      ];

      for (let i = 0; i < animasi.length; i++) {
        await delay(1500);
        await m.reply(animasi[i]);
      }

      for (let i = 0; i < 6; i++) {
        const randomName = giveaway.participants[Math.floor(Math.random() * giveaway.participants.length)];
        await m.reply(`🔄 @${randomName.split('@')[0]}`);
        await delay(500 + i * 100);
      }

      const shuffled = giveaway.participants.sort(() => 0.5 - Math.random());
      const winners = shuffled.slice(0, 3);

      giveaway.hasSpun = true;
      saveDB(db);

      await delay(1200);
      await m.reply('🥁🥁🥁🥁🥁');
      await delay(1200);

      return m.reply(
        `🎉 *PEMENANG GIVEAWAY!* 🎉\n\n` +
        winners.map((w, i) => `*${i + 1}.* @${w.split('@')[0]}`).join('\n') +
        `\n\nSelamat kepada para pemenang!`,
        null,
        { mentions: winners }
      );

    case 'hapus':
      if (!isAdmin && !isROwner) return m.reply('Hanya admin yang bisa menghapus giveaway.');
      if (!giveaway.isActive) return m.reply('Tidak ada event yang perlu dihapus.');
      giveaway.isActive = false;
      giveaway.hasSpun = false;
      giveaway.participants = [];
      saveDB(db);
      return m.reply('Event giveaway telah dihapus.');

    default:
      return m.reply('Perintah tidak dikenal.');
  }
};

handler.help = ['giveaway'];
handler.tags = ['group'];
handler.command = /^giveaway$/i;
handler.group = true;

export default handler;