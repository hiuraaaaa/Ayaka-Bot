import fetch from "node-fetch";

let handler = async (m, { conn, text, command }) => {
  try {
    if (!text.includes("|")) throw "Harap gunakan format: `.xximg @tag|text`";

    let [tag, taggedText] = text.split("|").map((v) => v.trim());
    if (!taggedText) throw "Harap masukkan teks setelah `|`.";
    let who;
    if (m.isGroup) {
      if (m.mentionedJid && m.mentionedJid[0]) {
        who = m.mentionedJid[0];
      } else if (m.quoted) {
        who = m.quoted.sender;
      } else {
        who = m.sender;
      }
    } else {
      who = m.sender;
    }

    let avatarURL = await conn
      .profilePictureUrl(who, "image")
      .catch(() => "https://telegra.ph/file/24fa902ead26340f3df2c.png");

    let apiURL = `https://api.siputzx.my.id/api/canvas/xnxx?title=${encodeURIComponent(
      taggedText
    )}&image=${encodeURIComponent(avatarURL)}`;

    console.log("API URL:", apiURL);

    let response = await fetch(apiURL);
    if (!response.ok) throw `Error ${response.status}: ${response.statusText}`;
    let buffer = await response.buffer();

    let caption = `Nih Kak!`.trim();

    await conn.sendFile(m.chat, buffer, "xximg.jpg", caption, m);
  } catch (error) {
    console.error(error);
    m.reply(`Terjadi kesalahan: ${error.message || error}`);
  }
};

handler.help = ["xximg <@tag|text>"];
handler.tags = ["premium"];
handler.command = /^(xximg)$/i;
handler.premium = true;
handler.register = true;
handler.group = true;

export default handler;