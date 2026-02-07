let handler = async (m, { conn }) => {
    conn.tebaklirik = conn.tebaklirik ? conn.tebaklirik : {}
    let id = m.chat
    if (!(id in conn.tebaklirik)) throw false
    let json = conn.tebaklirik[id][1]
    let hint = json.jawaban.replace(/[AIUEOaiueo]/ig, '_')
    let caption = `*_Jangan Balas Pesan Ini, Tetapi Balas Soalnya❗_*\n\n` + '```' + hint + '```'
    conn.reply(m.chat, caption, m)
}
handler.command = /^hlir$/i

handler.limit = true

export default handler