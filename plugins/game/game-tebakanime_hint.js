let handler = async (m, { conn }) => {
    conn.tebakanime = conn.tebakanime ? conn.tebakanime : {}
    let id = m.chat
    if (!(id in conn.tebakanime)) throw false
    let json = conn.tebakanime[id][1]
    let ans = json.jawaban
    let clue = ans.replace(/[AIUEOaiueo]/g, '_')
    conn.reply(m.chat, '```' + clue + '```\n\n*_Jangan Balas Pesan Ini, Tetapi Balas Soalnya❗_*', conn.tebakanime[id][0])
}
handler.command = /^wa$/i
handler.limit = true
export default handler