let handler = async (m, { conn, text, command }) => {
  try {
    let who;
    if (m.isGroup)
      who = m.mentionedJid[0] ? m.mentionedJid[0] : (m.quoted ? m.quoted.sender : m.sender);
    else who = m.quoted ? m.quoted.sender : m.sender;

    let bioData = await conn.fetchStatus(who);

    let bio = Array.isArray(bioData) && bioData[0]?.status?.status 
      ? bioData[0].status.status 
      : bioData.status || "Bio tidak ditemukan 😅";

    m.reply(bio);
  } catch (e) {
    try {

      let bioData = await conn.fetchStatus(m.sender);
      let bio = Array.isArray(bioData) && bioData[0]?.status?.status 
        ? bioData[0].status.status 
        : bioData.status || "Bio tidak ditemukan 😅";
      m.reply(bio);
    } catch {
      throw `Bio Is Private! 😔`;
    }
  }
};

handler.help = ["getbio"];
handler.tags = ["tools"];
handler.command = /^(getb?io)$/i;
handler.limit = true;

export default handler;