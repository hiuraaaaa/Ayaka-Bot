/*

# Fitur : fake-wa
# Type : Plugins ESM
# Created by : https://whatsapp.com/channel/0029VbBbGUiFcow4neaist0T
# Api : —

   ⚠️ _Note_ ⚠️
jangan hapus wm ini banggg

*/

import fs from 'fs'
import { createCanvas, loadImage } from 'canvas'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  try {
    if (!m.quoted || !/image/.test(m.quoted.mtype)) 
      return m.reply(`❌ Error\nReply foto yang mau dipake sebagai PP!`)

    let text = args.join(' ')
    if (!text) return m.reply(`❌ Error\nFormat salah!\n\nGunakan:\n${usedPrefix + command} nama|bio|nomor`)

    let [nama, bio, nomor] = text.split('|')
    if (!nama || !bio || !nomor)
      return m.reply(`❌ Error\nPastikan semua data terisi dengan benar.\n\nContoh:\n${usedPrefix + command} Lann4you|Hanya menerima pesan penting|628xxx`)

    let media = await m.quoted.download()
    if (!media) return m.reply(`❌ Error\nGagal download media dari reply.`)

    let pp = await loadImage(media)

    let templateUrl = 'https://uploader.zenzxz.dpdns.org/uploads/1757090672815.jpeg'
    let template = await loadImage(templateUrl)

    const canvas = createCanvas(template.width, template.height)
    const ctx = canvas.getContext('2d')

    ctx.drawImage(template, 0, 0)

    const ppSize = 160
    const ppX = 220
    const ppY = 93
    ctx.save()
    ctx.beginPath()
    ctx.arc(ppX + ppSize / 2, ppY + ppSize / 2, ppSize / 2, 0, Math.PI * 2, true)
    ctx.closePath()
    ctx.clip()
    ctx.drawImage(pp, ppX, ppY, ppSize, ppSize)
    ctx.restore()

    const textX = 75
    ctx.fillStyle = '#aaa'
    ctx.font = '16px roboto'
    ctx.fillText(nama, textX, 370)

    ctx.font = '16px roboto'
    ctx.fillStyle = '#aaa'
    ctx.fillText(bio, textX, 445)

    ctx.font = '16px roboto'
    ctx.fillStyle = '#aaa'
    ctx.fillText(nomor, textX, 530)

    let out = `./tmp/fwa-${Date.now()}.jpg`
    fs.writeFileSync(out, canvas.toBuffer())

    await conn.sendFile(m.chat, out, 'fwa.jpg', `✅ Fake WA berhasil dibuat!`, m)
    fs.unlinkSync(out)

  } catch (e) {
    console.error(e)
    m.reply(`❌ Error\nLogs error : ${e.message}`)
  }
}

handler.help = ['fwa', 'fakewa']
handler.tags = ['maker']
handler.command = ['fakewa', 'fwa', 'fakewhatsapp']

export default handler