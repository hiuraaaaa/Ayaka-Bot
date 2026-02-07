import { createHash } from 'crypto';

let handler = async function (m, { text, usedPrefix, command }) {
  let otpDB = global.db.data.otp = global.db.data.otp || {};
  let backupDB = global.db.data.backupUsers = global.db.data.backupUsers || {};
  let user = global.db.data.users[m.sender];
  const pp = await conn.profilePictureUrl(m.sender, "image").catch(() => "https://telegra.ph/file/ee60957d56941b8fdd221.jpg");

  if (command === 'ganti-nomor') {
    if (!text || !text.match(/^\d{10,15}$/)) {
      return m.reply('Masukkan nomor baru yang valid (10–15 digit).');
    }

    if (!user?.registered) {
      return m.reply('Anda belum terdaftar. Gunakan perintah *daftar* terlebih dahulu.');
    }

    let nomorBaru = text.trim().replace(/^0/, '62');
    let jidBaru = nomorBaru + '@s.whatsapp.net';

    let otp = Math.floor(100 + Math.random() * 900).toString();

    otpDB[otp] = {
      oldJid: m.sender,
      newJid: jidBaru,
      createdAt: Date.now()
    };

    return conn.reply(m.chat, `Kode OTP Anda: *${otp}*\nSilakan kirim dari nomor baru Anda:\n*${usedPrefix}perif ${otp}*`, m);
  }

  if (command === 'perif') {
    if (!text) return m.reply(`Masukkan kode OTP.\nFormat: *${usedPrefix}perif <kodeotp>*`);
    let otp = text.trim();
    let data = otpDB[otp];
    if (!data) return m.reply('Kode OTP salah atau tidak ditemukan.');

    if (Date.now() - data.createdAt > 5 * 60 * 1000) {
      delete otpDB[otp];
      return m.reply('Kode OTP sudah kadaluarsa. Gunakan *ganti-nomor* kembali.');
    }

    if (m.sender !== data.newJid) {
      return m.reply(`Kode ini hanya berlaku untuk nomor: ${data.newJid.split('@')[0]}`);
    }

    // Backup data lama
    if (global.db.data.users[data.oldJid]) {
      backupDB[data.oldJid] = JSON.parse(JSON.stringify(global.db.data.users[data.oldJid]));
    }

    global.db.data.users[m.sender] = {
      ...(global.db.data.users[data.oldJid] || {})
    };

    delete global.db.data.users[data.oldJid];
    delete otpDB[otp];

    let cap = `
*I N F O R M A S I*

*Nomor Lama:* ${data.oldJid.split('@')[0]}
*Nomor Baru:* ${data.newJid.split('@')[0]}
*Status:* _Berhasil diganti dan data dipindahkan_
`.trim();

    await conn.sendMessage(m.chat, {
      text: cap,
      contextInfo: {
        externalAdReply: {
          title: "Pembaruan Nomor Berhasil",
          mediaType: 1,
          thumbnailUrl: pp,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });
  }
};

handler.help = ['ganti-nomor <nomor>', 'perif <kodeotp>'];
handler.tags = ['main'];
handler.command = /^(ganti-nomor|perif)$/i;

export default handler;