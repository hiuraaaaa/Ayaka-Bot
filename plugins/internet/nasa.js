let handler = async(m, { conn, text, usedPrefix, command }) => {
let pp = await conn.profilePictureUrl(m.chat).catch(_ => null)

let krtu = `Terimakasih, sudah membaca info terbaru kami!!! 🚀
`
conn.reply(m.chat, krtu, m)
}

handler.command = ['tqnasa']

export default handler