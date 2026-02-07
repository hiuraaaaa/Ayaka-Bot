const {
    proto,
    generateWAMessageFromContent,
    prepareWAMessageMedia
  } = (await import('@adiwajshing/baileys')).default
import fs from 'fs';

let handler = async (m, { conn, usedPrefix, text, args, command }) => {
  let player = global.db.data.users[m.sender];
  let mentionedJid = [m.sender];
  let pengirim = m.sender.split("@")[0];
  let __timers = (new Date - player.lastpemburu);
  let _timers = (1800000 - __timers);
  let timers = clockString(_timers);

  if (args[0] === "profile") {
    if (!player.pemburuLevel) player.pemburuLevel = 1;
    if (!player.pemburuProgres) player.pemburuProgres = 0;
    if (!player.pemburuTargetKilled) player.pemburuTargetKilled = 0;
    if (!player.pemburuTargetLoss) player.pemburuTargetLoss = 0;

    let profileMessage = `📊 *PROFIL PEMBURU*\n\n` +
      `👤 *Player*: @${pengirim}\n\n` +
      `🎯 *Jumlah Target Terbunuh*: ${player.pemburuTargetKilled}\n` +
      `❌ *Jumlah Target yang Kabur*: ${player.pemburuTargetLoss}\n\n` +
      `🎖️ *Level Pemburu*: ${player.pemburuLevel}\n` +
      `📊 *Progres Level*: ${player.pemburuProgres}%\n\n` +
      `_Teruslah berburu, Pemburu!_`;
      
    await conn.sendMessage(m.chat, {
      document: fs.readFileSync("./thumbnail.jpg"),
      fileName: `- Pemburu By Lann4you -`,
      fileLength: '1',
      mimetype: 'application/msword',
      jpegThumbnail: await conn.resize(fs.readFileSync('./src/bahan/ytta.jpg'), 350, 190),
      caption: profileMessage,
      contextInfo: {
        mentionedJid,
        forwardingScore: 99999999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363199602506586@newsletter',
          serverMessageId: null,
          newsletterName: `© ${global.namebot} || Lann4you`
        }
      }
    }, { quoted: m });
    return;
  }

  if (_timers > 0 && !player.pemburuTarget) {
    let cooldownMessage = `⏳ *Cooldown Aktif!*\n\nAnda harus menunggu ${timers} sebelum bisa menggunakan fitur pemburu lagi.\n\n_Sabar ya, Pemburu sejati selalu menunggu waktu yang tepat!_`;
    await conn.sendMessage(m.chat, {
      document: fs.readFileSync("./thumbnail.jpg"),
      fileName: `- Pemburu By Lann4you -`,
      fileLength: '1',
      mimetype: 'application/msword',
      jpegThumbnail: await conn.resize(fs.readFileSync('./src/bahan/ytta.jpg'), 350, 190),
      caption: cooldownMessage,
      contextInfo: {
        mentionedJid,
        forwardingScore: 99999999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363199602506586@newsletter',
          serverMessageId: null,
          newsletterName: `© ${global.namebot} || Lann4you`
        }
      }
    }, { quoted: m });
    return;
  }

  if (!args[0]) {
    if (!player.pemburuTarget) {
      let targetList = [/* daftar target yang kamu buat */];
      let target = targetList[Math.floor(Math.random() * targetList.length)];
      let coordinates = [
        { x: randomInt(100), y: randomInt(100), z: randomInt(100) },
        { x: randomInt(100), y: randomInt(100), z: randomInt(100) },
        { x: randomInt(100), y: randomInt(100), z: randomInt(100) }
      ];
      let correctIndex = Math.floor(Math.random() * 3);
      player.pemburuTarget = {
        name: target,
        coordinates,
        correctCoordinate: correctIndex
      };
      player.lastpemburu = new Date * 1;

      let pesan = `🎯 *TARGET DITEMUKAN!*\n\n` +
        `🔫 *Nama Target*: ${target}\n\n` +
        `📍 *Koordinat Target*: \n` +
        `X: ${coordinates[correctIndex].x}\n` +
        `Y: ${coordinates[correctIndex].y}\n` +
        `Z: ${coordinates[correctIndex].z}\n\n` +
        `🗺️ *Koordinat yang Tersedia*:\n` +
        `1. X: ${coordinates[0].x} | Y: ${coordinates[0].y} | Z: ${coordinates[0].z}\n` +
        `2. X: ${coordinates[1].x} | Y: ${coordinates[1].y} | Z: ${coordinates[1].z}\n` +
        `3. X: ${coordinates[2].x} | Y: ${coordinates[2].y} | Z: ${coordinates[2].z}\n\nPilih Koordinat Yang Benar!`;

      await conn.sendMessage(m.chat, {
        document: fs.readFileSync("./thumbnail.jpg"),
        fileName: `- Pemburu By Lann4you -`,
        fileLength: '1',
        mimetype: 'application/msword',
        jpegThumbnail: await conn.resize(fs.readFileSync('./src/bahan/ytta.jpg'), 350, 190),
        caption: pesan,
        footer: `${global.namebot} || Lann4you`,
        buttons: [
          {
            buttonId: 'action',
            buttonText: { displayText: 'CLICK' },
            type: 4,
            nativeFlowInfo: {
              name: 'single_select',
              paramsJson: JSON.stringify({
                title: 'Koordinat',
                sections: [
                  {
                    title: 'Pilih Kordinat',
                    rows: [
                      { title: 'Koordinat Pertama', description: `X: ${coordinates[0].x} | Y: ${coordinates[0].y} | Z: ${coordinates[0].z}`, id: '.pemburu tembak 1' },
                      { title: 'Koordinat Kedua', description: `X: ${coordinates[1].x} | Y: ${coordinates[1].y} | Z: ${coordinates[1].z}`, id: '.pemburu tembak 2' },
                      { title: 'Koordinat Ketiga', description: `X: ${coordinates[2].x} | Y: ${coordinates[2].y} | Z: ${coordinates[2].z}`, id: '.pemburu tembak 3' }
                    ]
                  }
                ]
              })
            }
          }
        ],
        headerType: 1,
        viewOnce: true,
        contextInfo: {
          mentionedJid,
          forwardingScore: 99999999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363199602506586@newsletter',
            serverMessageId: null,
            newsletterName: `© ${global.namebot} || Lann4you`
          }
        }
      }, { quoted: m });

      player.pemburuTimeout = setTimeout(() => {
        if (player.pemburuTarget) {
          player.pemburuTarget = null;
          player.pemburuTargetLoss = (player.pemburuTargetLoss || 0) + 1;
          conn.reply(m.chat, `⏳ *Waktu Habis!*\n\nAnda tidak memilih koordinat dalam waktu 2 menit. Target telah kabur.\n\n_Coba lagi lain kali!_`, m);
        }
      }, 120000);
    } else {
      conn.reply(m.chat, `🎯 *Target Aktif!*\n\nGunakan *${usedPrefix}pemburu tembak <nomor koordinat>* untuk menembak target aktif!`, m);
      return;
    }
  }

  if (args[0] === "tembak") {
    if (!player.pemburuTarget) {
      conn.reply(m.chat, `❌ *Tidak Ada Target!*\n\nGunakan *${usedPrefix}pemburu* untuk mencari target terlebih dahulu.`, m);
      return;
    }
    if (!args[1]) {
      conn.reply(m.chat, `❗ *Format Salah!*\n\nGunakan *${usedPrefix}pemburu tembak <nomor koordinat>*.`, m);
      return;
    }
    let pilihan = parseInt(args[1]) - 1;
    if (isNaN(pilihan) || pilihan < 0 || pilihan > 2) {
      conn.reply(m.chat, `❗ *Pilihan Koordinat Tidak Valid!*\n\nGunakan *1*, *2*, atau *3*.`, m);
      return;
    }
    clearTimeout(player.pemburuTimeout);
    if (pilihan == player.pemburuTarget.correctCoordinate) {
      player.pemburuTargetKilled = (player.pemburuTargetKilled || 0) + 1;
      player.pemburuProgres = (player.pemburuProgres || 0) + 20;
      if (player.pemburuProgres >= 100) {
        player.pemburuLevel += 1;
        player.pemburuProgres = 0;
      }
      conn.reply(m.chat, `🎯 *Tembakan Tepat Sasaran!*\n\nTarget berhasil dikalahkan.\n\n+20% progres level pemburu!`, m);
    } else {
      player.pemburuTargetLoss = (player.pemburuTargetLoss || 0) + 1;
      conn.reply(m.chat, `❌ *Tembakan Meleset!*\n\nTarget berhasil melarikan diri.\n\n_Semangat terus!_`, m);
    }
    player.pemburuTarget = null;
  }
};

handler.help = ['pemburu', 'pemburu profile', 'pemburu tembak <1/2/3>'];
handler.tags = ['game'];
handler.command = /^pemburu$/i;

export default handler;

function clockString(ms) {
  let h = Math.floor(ms / 3600000);
  let m = Math.floor(ms / 60000) % 60;
  let s = Math.floor(ms / 1000) % 60;
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
}

function randomInt(max) {
  return Math.floor(Math.random() * max);
}