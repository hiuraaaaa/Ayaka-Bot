/*
* Nama Fitur : Game Tebak Kalimat
* Type : Plugins ESM
* Sumber : https://whatsapp.com/channel/0029Vb6p7345a23vpJBq3a1h
* Channel Testimoni : https://whatsapp.com/channel/0029Vb6B91zEVccCAAsrpV2q
* Group Bot : https://chat.whatsapp.com/CBQiK8LWkAl2W2UWecJ0BG
* Author : 𝐅𝐚𝐫𝐢𝐞l
* Nomor Author : https://wa.me/6282152706113
*/

import fetch from 'node-fetch';

let timeout = 100000;
let poin = 500;

let Lann4you = async (m, { conn, usedPrefix }) => {
  conn.tebakkalimat = conn.tebakkalimat || {};
  let id = m.chat;

  if (id in conn.tebakkalimat) {
    conn.reply(m.chat, '❗Masih ada soal belum terjawab di chat ini', conn.tebakkalimat[id][0]);
    return;
  }

  const imageLinks = [
    "https://files.catbox.moe/fzxpik.jpg",
    "https://files.catbox.moe/jj0qix.jpg",
    "https://files.catbox.moe/mtjogq.jpg",
    "https://files.catbox.moe/nnm0fx.jpg",
    "https://files.catbox.moe/flxxo8.jpg"
  ];
  const randomImageLink = imageLinks[Math.floor(Math.random() * imageLinks.length)];

  try {
    let res = await fetch(`${global.APIs.botcahx}/api/game/tebakkalimat?apikey=${global.botcahx}`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    let src = await res.json();

    if (!Array.isArray(src)) {
      console.error("Data dari API bukan array:", src);
      return m.reply("Terjadi kesalahan: Data dari API tidak sesuai format yang diharapkan.");
    }

    if (src.length === 0) {
      return m.reply("Tidak ada soal tebak kalimat yang tersedia saat ini.");
    }

    let json = src[Math.floor(Math.random() * src.length)];

    if (!json || !json.soal || !json.jawaban) {
      console.error("Format JSON tidak sesuai:", json);
      return m.reply("Terjadi kesalahan: Format data dari API tidak sesuai.");
    }

    let caption = `
${json.soal}

┌─⊷ *TEBAK KALIMAT*
⏳ Timeout *${(timeout / 1000).toFixed(2)} detik*
💬 Ketik *${usedPrefix}tela* untuk bantuan
💬 Ketik *nyerah* Untuk Menyerah
➕ Bonus: *${poin} Kredit sosial*
⚠️ *Balas/ REPLY soal ini untuk menjawab*
└──────────────
`.trim();

    conn.tebakkalimat[id] = [
      await conn.sendFile(m.chat, randomImageLink, 'soal.jpg', caption, m), 
      json,
      poin,
      setTimeout(() => {
        if (conn.tebakkalimat[id]) {
            const buttons = [
                { buttonId: '.tebakkalimat', buttonText: { displayText: 'Main Lagi 🔄' }, type: 1 }
            ]
            const buttonMessage = {
                text: `🚩 *Waktu habis!*\nJawabannya adalah *${json.jawaban}*`,
                footer: 'Klik tombol dibawah untuk bermain lagi!',
                buttons: buttons,
                headerType: 4
            }
            conn.sendMessage(m.chat, buttonMessage, { quoted: conn.tebakkalimat[id][0] })
            delete conn.tebakkalimat[id];
        }
      }, timeout)
    ];
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    m.reply(`Terjadi kesalahan: ${error.message}`); 
  }
};

Lann4you.help = ['tebakkalimat'];
Lann4you.tags = ['game'];
Lann4you.command = /^tebakkalimat/i;
Lann4you.register = false;
Lann4you.group = true;
Lann4you.premium = true;

export default Lann4you;

/*
* Nama Fitur : Game Tebak Kalimat
* Type : Plugins ESM
* Sumber : https://whatsapp.com/channel/0029Vb6p7345a23vpJBq3a1h
* Channel Testimoni : https://whatsapp.com/channel/0029Vb6B91zEVccCAAsrpV2q
* Group Bot : https://chat.whatsapp.com/CBQiK8LWkAl2W2UWecJ0BG
* Author : 𝐅𝐚𝐫𝐢𝐞l
* Nomor Author : https://wa.me/6282152706113
*/