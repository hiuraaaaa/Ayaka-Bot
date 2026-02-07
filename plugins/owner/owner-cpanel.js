import fs from "fs";
import path from "path";
import fetch from "node-fetch";

const sellerPath = path.resolve("./src/seller.json");

function capital(str) {
  return str.replace(/\b\w/g, char => char.toUpperCase());
}
function tanggal(ms) {
  const date = new Date(ms);
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function loadSellers() {
  try {
    let data = JSON.parse(fs.readFileSync(sellerPath));
    let now = Date.now();
    let active = data.filter(s => s.expire > now);
    if (active.length !== data.length) fs.writeFileSync(sellerPath, JSON.stringify(active, null, 2));
    return active;
  } catch {
    return [];
  }
}
function saveSellers(data) {
  fs.writeFileSync(sellerPath, JSON.stringify(data, null, 2));
}
function isSeller(jid) {
  return loadSellers().some(s => s.jid === jid);
}

const resourceMap = {
  "1gb": { ram: "1000", disk: "1000", cpu: "40" },
  "2gb": { ram: "2000", disk: "1000", cpu: "60" },
  "3gb": { ram: "3000", disk: "2000", cpu: "80" },
  "4gb": { ram: "4000", disk: "2000", cpu: "100" },
  "5gb": { ram: "5000", disk: "3000", cpu: "120" },
  "6gb": { ram: "6000", disk: "3000", cpu: "140" },
  "7gb": { ram: "7000", disk: "4000", cpu: "160" },
  "8gb": { ram: "8000", disk: "4000", cpu: "180" },
  "9gb": { ram: "9000", disk: "5000", cpu: "200" },
  "10gb": { ram: "10000", disk: "5000", cpu: "220" },
  "unlimited": { ram: "0", disk: "0", cpu: "0" },
  "unli": { ram: "0", disk: "0", cpu: "0" }
};

let handler = async (m, { conn, text, command, isOwner }) => {
  const sellers = loadSellers();

  if (command === "addseller") {
    if (!isOwner) return m.reply("Hanya owner yang bisa menambahkan seller.");
    let [no, hari] = text.split(" ");
    if (!no || !hari) return m.reply("Contoh: .addseller 628xxx 7");
    const jid = no.replace(/\D/g, "") + "@s.whatsapp.net";
    let days = parseInt(hari);
    if (isNaN(days) || days < 1) return m.reply("Jumlah hari tidak valid.");
    if (sellers.some(s => s.jid === jid)) return m.reply("Seller sudah terdaftar.");
    const expire = Date.now() + days * 24 * 60 * 60 * 1000;
    sellers.push({ jid, expire });
    saveSellers(sellers);
    return m.reply(`✅ Berhasil menambahkan seller: ${no}\n⏳ Aktif hingga: ${tanggal(expire)}`);
  }

  if (command === "delseller") {
    if (!isOwner) return m.reply("Hanya owner yang bisa menghapus seller.");
    const jid = text.replace(/\D/g, "") + "@s.whatsapp.net";
    const index = sellers.findIndex(s => s.jid === jid);
    if (index < 0) return m.reply("Seller tidak ditemukan.");
    sellers.splice(index, 1);
    saveSellers(sellers);
    return m.reply(`❌ Seller ${text} berhasil dihapus.`);
  }

  if (command === "listseller") {
    if (!isOwner) return m.reply("Hanya owner yang bisa melihat daftar seller.");
    if (!sellers.length) return m.reply("Belum ada seller terdaftar.");

    const list = sellers.map((s, i) => {
      const mention = s.jid;
      return `⭐ *${i + 1}.* @${mention.split('@')[0]} (📅 ${tanggal(s.expire)})`;
    }).join("\n");

    return conn.sendMessage(m.chat, {
      text: `*📋 Daftar Seller Aktif*\n\n${list}`,
      mentions: sellers.map(s => s.jid)
    }, { quoted: m });
  }

  if (!isOwner && !isSeller(m.sender)) {
    return m.reply(`❗ Fitur ini hanya untuk seller aktif.\nSilakan hubungi owner untuk menjadi seller.`);
  }

  if (!text) return m.reply("Contoh: username,628XXX");

  let nomor, usernem;
  const tek = text.split(",");
  if (tek.length > 1) {
    let [users, nom] = tek.map(t => t.trim());
    if (!users || !nom) return m.reply("Contoh: username,628XXX");
    nomor = nom.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    usernem = users.toLowerCase();
  } else {
    usernem = text.toLowerCase();
    nomor = m.isGroup ? m.sender : m.chat;
  }

  try {
    let onWa = await conn.onWhatsApp(nomor.split("@")[0]);
    if (onWa.length < 1) return m.reply("Nomor target tidak terdaftar di WhatsApp!");
  } catch (err) {
    return m.reply("Terjadi kesalahan saat mengecek nomor WhatsApp: " + err.message);
  }

  const { ram, disk, cpu } = resourceMap[command] || { ram: "0", disk: "0", cpu: "0" };
  const username = usernem.toLowerCase();
  const email = `${username}@gmail.com`;
  const name = `${capital(username)} Server`;
  const password = `${username}001`;

  try {
    const resUser = await fetch(`${domain}/api/application/users`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + apikey
      },
      body: JSON.stringify({
        email,
        username,
        first_name: name,
        last_name: "Server",
        language: "en",
        password
      })
    });

    const dataUser = await resUser.json();
    if (dataUser.errors) return m.reply("Error: " + JSON.stringify(dataUser.errors[0], null, 2));
    const user = dataUser.attributes;

    const resEgg = await fetch(`${domain}/api/application/nests/${nestid}/eggs/${egg}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + apikey
      }
    });

    const dataEgg = await resEgg.json();
    const startup_cmd = dataEgg.attributes.startup;

    const resServer = await fetch(`${domain}/api/application/servers`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + apikey
      },
      body: JSON.stringify({
        name,
        description: tanggal(Date.now()),
        user: user.id,
        egg: parseInt(egg),
        docker_image: "ghcr.io/parkervcp/yolks:nodejs_20",
        startup: startup_cmd,
        environment: {
          INST: "npm",
          USER_UPLOAD: "0",
          AUTO_UPDATE: "0",
          CMD_RUN: "npm start"
        },
        limits: { memory: ram, swap: 0, disk, io: 500, cpu },
        feature_limits: { databases: 5, backups: 5, allocations: 5 },
        deploy: { locations: [parseInt(loc)], dedicated_ip: false, port_range: [] }
      })
    });

    const dataServer = await resServer.json();
    if (dataServer.errors) return m.reply("Error: " + JSON.stringify(dataServer.errors[0], null, 2));

    const server = dataServer.attributes;

    if (m.isGroup) {
      await m.reply(`✅ Berhasil membuat akun panel\nData akun dikirim ke ${nomor === m.sender ? "private chat" : nomor.split("@")[0]}`);
    }

    const teks = `
*Berikut Detail Akun Panel Kamu 📦*

📡 *ID Server:* ${server.id}
👤 *Username:* ${user.username}
🔐 *Password:* ${password}
🗓️ *Tanggal:* ${tanggal(Date.now())}

🌐 *Spesifikasi Server*
• RAM: ${ram == "0" ? "Unlimited" : ram / 1000 + "GB"}
• Disk: ${disk == "0" ? "Unlimited" : disk / 1000 + "GB"}
• CPU: ${cpu == "0" ? "Unlimited" : cpu + "%"}
• ${global.domain}

📌 *Syarat & Ketentuan*
- Masa aktif: 1 bulan
- Simpan data baik-baik
- Garansi 15 hari (1x replace)
- Sertakan bukti chat saat claim garansi
`;

    await conn.sendMessage(nomor, { text: teks }, { quoted: m });

  } catch (err) {
    return m.reply("Terjadi kesalahan: " + err.message);
  }
};

handler.command = [...Object.keys(resourceMap), "addseller", "delseller", "listseller"];
handler.tags = ["panel"];
handler.help = handler.command;

export default handler;