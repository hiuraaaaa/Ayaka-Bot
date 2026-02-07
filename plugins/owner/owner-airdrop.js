let handler = async (m, { text, conn, usedPrefix, command, isMods, participants }) => {
  conn.airdrop = conn.airdrop || {}
  let gid = m.chat
  let airdrop = conn.airdrop[gid]

  if (!airdrop) {
    let id = Math.floor(Math.random() * 80000000000)
    let capOwn = `Sukses Menurunkan *🎁Airdrop*`

    conn.reply(m.chat, capOwn, flok, { 
      contextInfo: { mentionedJid: [m.sender] }
    })

    let capAir = `🎊🎁 AirDrop turun nih!, dapatkan hadiah spesial dari AirDrop, AirDrop akan hilang/expired dalam 5 menit\n\nKetik: *!buka* untuk membukanya, dan reply pesan ini\n\n*-ID:* ${id}`

    let msg = await conn.sendMessage(gid, {
      text: capAir,
      contextInfo: {
        mentionedJid: participants.map(a => a.id),
        externalAdReply: {
          showAdAttribution: false,
          title: `[ 🎁 𝖠𝗂𝗋𝖣𝗋𝗈𝗉 ]`,
          body: '',
          thumbnailUrl: 'https://telegra.ph/file/c27eee40140de58ffdd24.png',
          sourceUrl: '',
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: flok })

    conn.airdrop[gid] = {
      id: id,
      msg: msg,
      users: []
    }

    setTimeout(() => {
      conn.sendMessage(gid, { delete: { 
        remoteJid: gid, 
        fromMe: true, 
        id: msg.key.id, 
        participant: msg.key.participant 
      }})
      delete conn.airdrop[gid]
    }, 5 * 60 * 1000)

  } else {
    return m.reply(`AirDrop udh turun lann`)
  }
}

handler.command = /^(airdrop)$/i
handler.mods = true

export default handler