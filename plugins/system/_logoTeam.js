let handler = async(m, { conn, text }) => {


    if (m.chat !== '120363322679171544@g.us') return;
    let logo = 'https://telegra.ph/file/eab0e72f01d508f423ece.jpg'
    
    conn.sendFile(m.chat, logo, 'walun.jpg', `📢 Logo Nye\nTeam: *Yukii*`, m)

}
handler.customPrefix = /^(logo|walun)$/i
handler.command = new RegExp

export default handler