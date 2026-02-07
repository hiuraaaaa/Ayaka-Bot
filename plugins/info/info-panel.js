import fs from 'fs'
let handler = async (m, { conn, args, command }) => {
  let name = conn.getName(m.sender)
  const sender = m.key.fromMe ? (conn.user.id.split(':')[0]+'@s.whatsapp.net' || conn.user.id) : (m.key.participant || m.key.remoteJid)
let sub = `*Hi @${sender.split("@")[0]} 👋*

*🌐LIST PANEL PRIVATE*

🛍️ RAM 1GB CPU 30% 2K
🛍️ RAM 2GB CPU 50% 3K
🛍️ RAM 3GB CPU 70% 4K
🛍️ RAM 4GB CPU 90% 5K
🛍️ RAM 5GB CPU 110% 6K
🛍️ RAM 6GB CPU 125% 7K
🛍️ RAM 7GB CPU 150% 8K
🛍️ RAM 8GB CPU 170% 9K
🛍️ RAM 9GB CPU 180% 10K
🛍️ RAM 10GB CPU 200% 11K
🛍️ RAM UNLI CPU UNLI 12K

\`NOTE : HARGA DIATAS UNTUK 1 BULAN\`📅\n\nApakah kamu tertarik dan Ingin membeli? Chat owner..\n\n• Nomer Owner: ${global.nomorwa}
• Power BY *Lann4youOffc*
▬▭▬▭▬▭▬▭▬▭▬▭▬`
 await conn.relayMessage(m.chat,  {
    requestPaymentMessage: {
      currencyCodeIso4217: 'IDR',
      amount1000: 7000 * 1000,
      requestFrom: '0@s.whatsapp.net',
      noteMessage: {
      extendedTextMessage: {
      text: sub,
      contextInfo: {
      mentionedJid: [m.sender],
      externalAdReply: {
      showAdAttribution: true
      }}}}}}, {})
  }

handler.help = ['panel']
handler.tags = ['info']
handler.command = /^(listpanel|panel)$/i;
export default handler