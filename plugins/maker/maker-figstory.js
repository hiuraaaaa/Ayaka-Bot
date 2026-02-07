/*
 
# Fitur : Fake IG Story
# Type : ESM
# Created by : https://whatsapp.com/channel/0029Vb2qri6JkK72MIrI8F1Z
# Api : Lokal Canvas
 
   ⚠️ _Note_ ⚠️
jangan hapus wm ini banggg
 
*/
 
import fetch from 'node-fetch'
import { createCanvas, loadImage } from 'canvas'
 
let handler = async (m, { conn, text, command }) => {
  try {
    let [username, caption] = text.split('|')
    if (!username || !caption) return m.reply(`Contoh:\n.${command} cewekjaksel23|lagi healing~`)
 
    const bgUrl = 'https://files.catbox.moe/3gwr1l.jpg'
    const bg = await loadImage(bgUrl)
 
    const userPP = await conn.profilePictureUrl(m.sender, 'image').catch(_ => 'https://i.ibb.co/2nqZj97/profile-default.jpg')
    const pp = await loadImage(userPP)
 
    const canvas = createCanvas(720, 1280)
    const ctx = canvas.getContext('2d')
 
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height)
 
    const ppX = 40
    const ppY = 250
    const ppSize = 70
 
    ctx.save()
    ctx.beginPath()
    ctx.arc(ppX + ppSize / 2, ppY + ppSize / 2, ppSize / 2, 0, Math.PI * 2)
    ctx.closePath()
    ctx.clip()
    ctx.drawImage(pp, ppX, ppY, ppSize, ppSize)
    ctx.restore()
 
    ctx.font = '28px Arial'
    ctx.fillStyle = '#FFFFFF'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
 
    const usernameX = ppX + ppSize + 15
    const usernameY = ppY + ppSize / 2
 
    ctx.fillText(username, usernameX, usernameY)
 
    ctx.font = 'bold 30px Arial'
    ctx.fillStyle = '#FFFFFF'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
 
    const captionX = canvas.width / 2
    const captionY = canvas.height - 650
    const maxWidth = canvas.width - 100
    const lineHeight = 42
 
    wrapTextCenter(ctx, caption, captionX, captionY, maxWidth, lineHeight)
 
    let buffer = canvas.toBuffer()
    await conn.sendFile(m.chat, buffer, 'fakestory.jpg', '✓ Done', m)
  } catch (e) {
    m.reply(`❌ Error\nLogs error : ${e.message}`)
  }
}
 
function wrapTextCenter(ctx, text, x, y, maxWidth, lineHeight) {
  let line = ''
  for (let i = 0; i < text.length; i++) {
    let testLine = line + text[i]
    let testWidth = ctx.measureText(testLine).width
    if (testWidth > maxWidth && line !== '') {
      ctx.fillText(line, x, y)
      line = text[i]
      y += lineHeight
    } else {
      line = testLine
    }
  }
  if (line) ctx.fillText(line, x, y)
}
 
handler.help = ['figstory usrname|teks']
handler.tags = ['maker']
handler.command = /^((fig|finstagram)story?)$/i
 
export default handler