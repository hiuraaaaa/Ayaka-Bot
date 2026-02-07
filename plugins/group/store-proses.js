import fs from "fs";

const dbPath = "./src/prosesdone.json";
if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify({}));

let handler = async (m, { conn, command, text }) => {

  if (!m.chat.endsWith("@g.us"))
    return conn.sendMessage(
      m.chat,
      { text: "❌ Fitur ini hanya bisa digunakan di grup." },
      { quoted: m }
    );

  if (!text)
    return conn.sendMessage(
      m.chat,
      {
        text: `⚙️ *Contoh penggunaan:*\n\n` +
          `• *.setproses* 🌟 *TRANSAKSI PENDING*\n\n👤 @user\n📅 @tanggal\n⏰ @jam WIB\n\nPesanan kamu sedang *diproses*!\n\n` +
          `• *.setdone* ✅ *TRANSAKSI SELESAI*\n\n👤 @user\n📅 @tanggal\n⏰ @jam WIB\n\nPesanan kamu telah *selesai*!`,
      },
      { quoted: m }
    );

  let db = JSON.parse(fs.readFileSync(dbPath));
  let id = m.chat;
  if (!db[id]) db[id] = { proses: "", done: "" };

  let template = text.trim();

  if (/setproses/i.test(command)) {
    db[id].proses = template;
    await conn.sendMessage(
      m.chat,
      { text: "✅ Template *proses* berhasil diperbarui!" },
      { quoted: m }
    );
  } else if (/setdone/i.test(command)) {
    db[id].done = template;
    await conn.sendMessage(
      m.chat,
      { text: "✅ Template *done* berhasil diperbarui!" },
      { quoted: m }
    );
  }

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
};

handler.help = ['setproses','setdone'];
handler.tags = ['group'];
handler.command = /^setproses|setdone$/i;
handler.admin = true;

export default handler;