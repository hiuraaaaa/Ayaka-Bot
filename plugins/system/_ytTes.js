let handler = async(m, { text, conn, usedPrefix, command }) => {
  m.reply('Untuk yt anda bisa gunakan\n.ytmp3 (music)\n.ytmp4 (video)')
}
handler.command = /^(yt)$/i

export default handler