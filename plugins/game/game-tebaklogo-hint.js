let handler = async (m, { conn }) => {
    conn.tebaklogo = conn.tebaklogo || {};
    let id = m.chat;
    if (!(id in conn.tebaklogo)) return;
    let jawaban = conn.tebaklogo[id][1].jawaban;
    let hint = jawaban.replace(/[AIUEOaiueo]/ig, '_');
    conn.reply(m.chat, `\`\`\`${hint}\`\`\`\n\n*_Jangan Balas Pesan Ini, Tetapi Balas Soalnya ❗_*`, m);
};

handler.command = /^hlog$/i;
handler.limit = true;

export default handler;