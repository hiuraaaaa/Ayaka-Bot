import { areJidsSameUser } from '@adiwajshing/baileys';
import { createHash } from 'crypto';

const db = global.db || global.DATABASE || {};

let handler = async (m, { conn }) => {
  try {

    const ownerJid = '18254873441@s.whatsapp.net';

    const who =
      m.mentionedJid?.[0] ||
      (m.fromMe ? conn.user.jid : m.sender);

    if (areJidsSameUser(who, ownerJid) && !areJidsSameUser(m.sender, ownerJid))
      return m.reply('*[❕]* Gak boleh liat profile dia 😾');

    db.data.users[who] = db.data.users[who] || {};
    const user = db.data.users[who];

    // fallback cepat
    Object.assign(user, {
      name: user.name || await safeName(conn, who),
      umur: user.umur || "-",
      ttl: user.ttl || "-",
      jk: user.jk || "-",
      agama: user.agama || "-",
      hobi: user.hobi || "-",
      kota: user.kota || "-",
      negara: user.negara || "-",
      level: user.level || 1,
      money: user.money || 0,
      bank: user.bank || 0,
      cash: user.cash || 0,
      exp: user.exp || 0,
      premium: user.premium || false,
      limit: user.limit || 10,
      pasangan: user.pasangan || null,
      pernikahan: user.pernikahan || "Tidak Menikah",
      jumlahAnak: user.jumlahAnak || 0,
      sahabat: Array.isArray(user.sahabat) ? user.sahabat : [],
      channel: user.channel || "-",
      facebook: user.facebook || "-",
      instagram: user.instagram || "-",
      tiktok: user.tiktok || "-",
      premiumTime: user.premiumTime || 0,
    });

    const sn = createHash('md5').update(m.sender).digest('hex');
    const now = Date.now();

    let pasanganTxt = user.pasangan ? `@${user.pasangan.split('@')[0]} ❤️` : "Belum punya 💔";
    let sahabatTxt = user.sahabat.length
      ? user.sahabat.map(j => '@' + j.split('@')[0]).join(', ')
      : "Tidak punya sahabat 😿";

    const date = new Date().toLocaleDateString("id-ID", {
      weekday: "long", year: "numeric", month: "long", day: "numeric"
    });
    const time = new Date().toLocaleTimeString("id-ID");

    const caption = `
*──「 👤 PROFILE 」──*

📝 *Nama:* ${user.name}
🎂 *Umur:* ${user.umur}
📅 *Tanggal Lahir:* ${user.ttl}
⚧️ *Gender:* ${user.jk}
🛐 *Agama:* ${user.agama}
🎨 *Hobi:* ${user.hobi}
🌆 *Kota:* ${user.kota}
🌍 *Negara:* ${user.negara}

⭐ *Level:* ${user.level}
💸 *Saldo:* Rp ${user.money.toLocaleString('id-ID')}
🏦 *Bank:* Rp ${user.bank.toLocaleString('id-ID')}
💰 *Cash:* Rp ${user.cash.toLocaleString('id-ID')}
⚡ *Exp:* ${user.exp}

💑 *Pasangan:* ${pasanganTxt}
💍 *Status:* ${user.pernikahan}
👶 *Jumlah Anak:* ${user.jumlahAnak}
👯‍♂️ *Sahabat:* ${sahabatTxt}

📺 *Channel:* ${user.channel}
📱 *Facebook:* ${user.facebook}
📸 *Instagram:* ${user.instagram}
🎵 *TikTok:* ${user.tiktok}

👑 *Premium:*\n${user.premiumTime > now ? clockString(user.premiumTime - now) : "Expired 🚫"}

*──「 📊 STATS 」──*
📆 *Tanggal:* ${date}
⏰ *Waktu:* ${time}
🔐 SN: ${sn}

▬▬▬▬▬▬▬▬▬▬▬▬▬`;

    let pp;
    try {
      pp = await conn.profilePictureUrl(who, 'image');
    } catch {
      pp = "https://c.termai.cc/a89/kNIgN.jpg";
    }

    await conn.sendMessage(m.chat, {
      image: { url: pp },
      caption,
      mentions: [
        ...(user.sahabat || []),
        user.pasangan,
      ].filter(Boolean),
      footer: "⚡ Fast Profile System",
      buttons: [
        {
          buttonId: '.editprofile',
          buttonText: { displayText: '✏️ Edit Profile' },
          type: 1
        },
        {
          buttonId: '.menu',
          buttonText: { displayText: '📂 Menu Utama' },
          type: 1
        }
      ]
    }, { quoted: m });
    
  await conn.sendMessage(m.chat, {
  audio: { url: 'https://c.termai.cc/a95/PXiKad.opus' },
  mimetype: 'audio/mpeg',
  ptt: true
}, { quoted: flok })

  } catch (err) {
    console.error(err);
    m.reply("⚠️ Terjadi error kecil, tapi fitur tetap aman.");
  }
};

handler.help = ['profile'];
handler.tags = ['main'];
handler.command = /^(profile|profil|me|my)$/i;

export default handler;

// ===============================
async function safeName(conn, who) {
  try { return await conn.getName(who); }
  catch { return "User"; }
}

function clockString(ms) {
  let d = Math.floor(ms / 86400000);
  let h = Math.floor(ms / 3600000) % 24;
  let m = Math.floor(ms / 60000) % 60;
  let s = Math.floor(ms / 1000) % 60;
  return `${d}H ${h}J ${m}M ${s}D`;
}