let handler = async (m, { conn }) => {
    conn.question = conn.question ? conn.question : {}
    let id = m.chat
    if (!(id in conn.question)) throw false
    let json = conn.question[id][1]
    conn.reply(m.chat, 'Hintnya: ```' + json.results[0].correct_answer.replace(/[AIUEOaiueo]/ig, '_') + '```\n\n*_Jangan Balas Pesan Ini, Tetapi Balas Soalnya❗_*', m)
}
handler.command = /^hquest$/i

handler.limit = true

export default handler