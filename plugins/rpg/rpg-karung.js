let handler = async (m, { conn }) => {
    let user = global.db.data.users[m.sender] || {}

    let botol   = Number(user.botol   || 0).toLocaleString()
    let kardus  = Number(user.kardus  || 0).toLocaleString()
    let kaleng  = Number(user.kaleng  || 0).toLocaleString()
    let gelas   = Number(user.gelas   || 0).toLocaleString()
    let plastik = Number(user.plastik || 0).toLocaleString()

    const tag = '@' + m.sender.split`@`[0]

    let teks = `
===== *ISI KARUNG MU* =====

👤 *User:* ${tag}

🍼 *Botol:* ${botol}
📦 *Kardus:* ${kardus}
🍾 *Kaleng:* ${kaleng}
🍶 *Gelas:* ${gelas}
🥡 *Plastik:* ${plastik}
`.trim()

    // WAJIB PAKAI INI (biar respon normal)
    await conn.sendMessage(m.chat, { 
        text: teks,
        mentions: [m.sender]
    })
}

handler.help = ['karung']
handler.tags = ['rpg']
handler.command = /^(karung)$/i

export default handler