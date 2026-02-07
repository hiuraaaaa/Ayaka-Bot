let handler = async (m, { conn }) => {
    conn.game = conn.game ? conn.game : {};
    let id = 'tebakanml-' + m.chat;
    if (!(id in conn.game)) return;
    
    let json = conn.game[id][1];
    m.reply('Clue : ' + '```' + json.jawaban.replace(/[AIUEOaiueo]/ig, '_') + '```' + '\n\n_*Jangan Balas Chat Ini, Tapi Balas Soalnya❗*_');
};

handler.command = /^tekml$/i;
handler.limit = false;
handler.register = true

export default handler