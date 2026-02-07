import fs from "fs";
import moment from "moment-timezone";

const dbPath = "./src/prosesdone.json";
if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify({}));

let handler = async (m, { conn, command }) => {
  if (!m.chat.endsWith("@g.us"))
    return conn.sendMessage(
      m.chat,
      { text: "❌ Fitur ini hanya bisa digunakan di grup." },
      { quoted: m }
    );

  let db = JSON.parse(fs.readFileSync(dbPath));
  let id = m.chat;
  if (!db[id]) db[id] = { proses: "", done: "" };

  const jam = moment().tz("Asia/Jakarta").format("HH:mm");
  const tanggal = moment().tz("Asia/Jakarta").format("DD/MM/YYYY");

  let target = m.quoted ? m.quoted.sender : m.sender;
  let tagUser = `@${target.split("@")[0]}`;

  let caption;
  if (/proses/i.test(m.text)) {
    caption =
      db[id].proses ||
      `🌟 *TRANSAKSI PENDING*\n\n📅 @tanggal\n⏰ @jam WIB\n\nPesanan @user sedang *diproses*!`;
  } else if (/done/i.test(m.text)) {
    caption =
      db[id].done ||
      `✅ *TRANSAKSI SELESAI*\n\n📅 @tanggal\n⏰ @jam WIB\n\nPesanan @user telah *selesai*!`;
  } else return; 

  caption = caption
    .replace(/@tanggal/g, tanggal)
    .replace(/@jam/g, jam)
    .replace(/@user/g, tagUser);

  await conn.sendMessage(
    m.chat,
    {
      text: caption,
      mentions: [target],
    },
    { quoted: m }
  );
};

handler.help = ['proses','done'];
handler.tags = ['group'];
handler.customPrefix = /^(proses|done)$/i;
handler.command = new RegExp(); 
handler.admin = true;

export default handler;