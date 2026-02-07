const handler = async (m, { conn, command, text }) => {
  if (!text) return conn.reply(m.chat, 'Masukkan teks pertanyaannya!', m);

  // Tambahkan delay 3 detik
  await new Promise(resolve => setTimeout(resolve, 3000));

  conn.reply(
    m.chat,
    `
*Pertanyaan:* ${command} ${text}
*Jawaban:* ${pickRandom(['di neraka', 'di surga', 'di mars', 'di tengah laut', 'di dada :v', 'di hatimu >///<'])}
`.trim(),
    m,
    m.mentionedJid ? {
      contextInfo: {
        mentionedJid: m.mentionedJid
      }
    } : {}
  );
};

handler.help = ['dimanakah <pertanyaan>'];
handler.tags = ['fun'];
handler.command = /^dimanakah$/i;
handler.limit = 4;

export default handler

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}