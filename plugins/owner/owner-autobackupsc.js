import fs from 'fs';
import archiver from 'archiver';
import moment from 'moment-timezone';

let backupInterval = null;
let isBackupActive = false;

async function backupAndSend(conn) {
  try {
    const timestamp = moment().tz('Asia/Jakarta').format('YYYYMMDD-HHmmss');
    const waktuBackup = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
    const backupName = `SC ${global.namebot} ${waktuBackup}.zip`;
    const output = fs.createWriteStream(backupName);
    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.pipe(output);

    archive.glob('**/*', {
      cwd: '/home/container',
      ignore: ['node_modules/**', 'sessions/', 'tmp/**', '.npm/**', backupName],
    });

    archive.finalize();

    output.on('close', async () => {
      const caption = `\`File Backup Bot Otomatis\`\n\n` +
        `*🗂 Nama File*: ${backupName}\n` +
        `*📊 Ukuran File*: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB\n` +
        `*⏰ Waktu Backup*: ${waktuBackup}`;

      const target = global.nomorwa + '@s.whatsapp.net';

      await conn.sendFile(target, backupName, backupName, caption, null);
      fs.unlinkSync(backupName);
    });

    archive.on('error', (err) => {
      console.error('Terjadi kesalahan saat membuat backup:', err);
    });
  } catch (error) {
    console.error('Error pada proses backup:', error);
  }
}

const handler = async (m, { conn, isROwner, command, args }) => {
  const isEnable = /^(on)$/i.test(args[0]);
  const isDisable = /^(off)$/i.test(args[0]);

  if (!isROwner) {
    global.dfail('rowner', m, conn);
    throw false;
  }

  switch (command) {
    case 'autobackupsc':
      if (isEnable) {
        if (isBackupActive) {
          m.reply('Backup otomatis sudah aktif sebelumnya.');
          return;
        }
        isBackupActive = true;
        backupInterval = setInterval(() => {
          backupAndSend(conn);
        }, 3600000); // 1 jam
        m.reply('Backup otomatis telah diaktifkan.');
      } else if (isDisable) {
        if (!isBackupActive) {
          m.reply('Backup otomatis tidak aktif.');
          return;
        }
        isBackupActive = false;
        clearInterval(backupInterval);
        m.reply('Backup otomatis telah dinonaktifkan.');
      } else {
        m.reply('Gunakan perintah:\n- *autobackupsc on* untuk mengaktifkan\n- *autobackupsc off* untuk menonaktifkan');
      }
      break;
    default:
      m.reply('Perintah tidak dikenal.');
      break;
  }
};

handler.help = ['autobackupsc'];
handler.tags = ['owner'];
handler.command = /^(autobackupsc)$/i;
handler.owner = true;

export default handler;