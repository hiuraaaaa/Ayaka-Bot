import fs from 'fs';

export async function sendPonta(chat, caption, m, quoted) {
    let mentionedJid = [m.sender]; 
    
    this.sendMessage(chat, {
        document: fs.readFileSync("./thumbnail.jpg"),
        fileName: `- ${global.namebot} By ${global.author} -`,
        fileLength: '1',
        mimetype: 'application/msword',
        jpegThumbnail: await this.resize(fs.readFileSync('./src/bahan/ytta.jpg'), 350, 190),
        caption,
        contextInfo: {
            mentionedJid,
            forwardingScore: 99999999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363199602506586@newsletter',
                serverMessageId: null,
                newsletterName: `© ${global.namebot} || ${global.author}`
            }
        }
    }, { quoted });
}

export default function setupPonta(conn) {
    conn.sendPonta = sendPonta.bind(conn);
}