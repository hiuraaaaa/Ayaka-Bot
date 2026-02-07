import fetch from 'node-fetch';
import uploadImage from '../lib/uploadImage.js';
let handler = async (m, { conn, usedPrefix, command, text }) => {
  let who =
    m.mentionedJid && m.mentionedJid[0]
      ? m.mentionedJid[0]
      : m.fromMe
      ? conn.user.jid
      : m.sender;
  let name = await conn.getName(who);
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || "";
  if (!mime) return m.reply("Kirim/Reply Gambar Dengan Caption .toreal")
  m.reply(wait)
  try {
    let media = await q.download()
    let url = await uploadImage(media);
    let agung = `https://api.agungny.my.id/api/toreal?url=${url}`;
    await conn.sendMessage(
      m.chat,
      {
        image: { url: agung },
        caption: "Nih Kak, Maaf Kalau Hasilnya Tidak Sesuai Keinginan",
      },
      { quoted: m }
    );
  } catch (e) {
    m.reply(`${e}`);
  }
};
handler.command = /^(jadinyata)$/i;
handler.limit = true
export default handler;;