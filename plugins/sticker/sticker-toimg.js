import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import os from 'os'

async function webp2png(buffer) {
  return new Promise((resolve, reject) => {
    const tmpDir = os.tmpdir()
    const inputPath = path.join(tmpDir, `input_${Date.now()}.webp`)
    const outputPath = path.join(tmpDir, `output_${Date.now()}.png`)
    fs.writeFileSync(inputPath, buffer)
    const ffmpeg = spawn('ffmpeg', ['-y', '-i', inputPath, outputPath])
    ffmpeg.on('close', () => {
      try {
        const result = fs.readFileSync(outputPath)
        fs.unlinkSync(inputPath)
        fs.unlinkSync(outputPath)
        resolve(result)
      } catch (e) {
        reject(e)
      }
    })
    ffmpeg.on('error', reject)
  })
}

var handler = async (m, { conn, usedPrefix, command }) => {
  if (!m.quoted) throw `Reply sticker dengan perintah *${usedPrefix + command}*`
  const q = m.quoted || m
  let name = await conn.getName(m.sender)
  let mime = q.mediaType || ''
  if (!/sticker/.test(mime)) throw `Reply sticker dengan perintah *${usedPrefix + command}*`
  
  let media = await q.download()
  let out = await webp2png(media).catch(_ => null) || Buffer.alloc(0)
  await conn.sendFile(m.chat, out, 'out.png', `Request by ${name}`, m)
}

handler.help = ['toimg (reply)']
handler.tags = ['sticker']
handler.command = ['toimg']

export default handler