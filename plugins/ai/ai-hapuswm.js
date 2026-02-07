import axios from 'axios'
import fetch from 'node-fetch'
import crypto from 'crypto'
import FormData from 'form-data'
import fs from 'fs'
import path from 'path'

function generateCookie() {
  const distinctId = crypto.randomUUID().replace(/-/g, '')
  const timestamp = Date.now()
  const sensors = {
    distinct_id: distinctId,
    first_id: '',
    props: {
      $latest_traffic_source_type: '自然搜索流量',
      $latest_search_keyword: '未取到值',
      $latest_referrer: 'https://yandex.com/'
    },
    $device_id: distinctId
  }
  const sensorsEncoded = encodeURIComponent(JSON.stringify(sensors))
  const gaMain = `GA1.1.${Math.floor(1e9 + Math.random() * 1e9)}.${timestamp}`
  const gaSub = `GS2.1.s${timestamp}$o2$g0$t${timestamp + 1000}$j58$l0$h0`
  const gclAu = `1.1.${Math.floor(1e9 + Math.random() * 1e9)}.${timestamp}`
  const cfBm = crypto.randomBytes(32).toString('base64url').slice(0, 64)

  return [
    'locale=en_US',
    'clientLocale=en_US',
    `sensorsdata2015jssdkcross=${sensorsEncoded}`,
    `_gcl_au=${gclAu}`,
    `_ga=${gaMain}`,
    `__cf_bm=${cfBm}-${timestamp}-1.0.1.1-${crypto.randomBytes(16).toString('base64url')}`,
    `_ga_7HXB45DMZS=${gaSub}`
  ].join('; ')
}

const baseHeaders = {
  'accept': 'application/json, text/plain, */*',
  'accept-language': 'id-ID',
  'origin': 'https://www.pxbee.com',
  'referer': 'https://www.pxbee.com/',
  'user-agent':
    'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Mobile Safari/537.36',
  'x-app-id': 'app-pxbee-web'
}

async function scrapeTextRemover(imageUrl) {
  const cookie = generateCookie()
  const headers = { ...baseHeaders, cookie }

  const submitRes = await fetch('https://api.pxbee.com/task/submit', {
    method: 'POST',
    headers: { ...headers, 'content-type': 'application/json;charset=UTF-8' },
    body: JSON.stringify({
      type: 'textremover',
      method: 'free',
      data: { userImageUrl: imageUrl }
    })
  })
  const submitJson = await submitRes.json()

  if (submitJson.code !== '000') {
    return {
      success: false,
      message: submitJson.msg || 'Submit gagal'
    }
  }

  const taskId = submitJson.data[0].taskId
  const start = Date.now()

  while (true) {
    const pollRes = await fetch(`https://api.pxbee.com/task/get?ids=${taskId}&taskId=${taskId}`, { headers })
    const pollJson = await pollRes.json()

    if (pollJson.code !== '000') {
      return {
        success: false,
        message: pollJson.msg || 'Polling gagal'
      }
    }

    const task = pollJson.data[0]
    if (task.status === 1) {
      return {
        success: true,
        resultUrl: task.result.url,
        key: taskId,
        message: 'Berhasil hapus watermark 🎉'
      }
    }
    if (task.status === 2) {
      return { success: false, message: 'Task gagal di server' }
    }
    if (Date.now() - start > 30000) {
      return { success: false, message: 'Timeout nunggu hasil' }
    }

    await new Promise(r => setTimeout(r, 2000))
  }
}

async function uploadToUguu(filePath) {
  const form = new FormData()
  form.append('files[]', fs.createReadStream(filePath))
  const res = await axios.post('https://uguu.se/upload.php', form, {
    headers: form.getHeaders()
  })
  return res.data
}

let saa = async (m, { conn, usedPrefix, command }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!mime.startsWith('image/')) throw `Kirim gambar atau balas gambar dengan perintah ${usedPrefix}${command}`

  try {
    let media = await q.download()
    const tmpFile = path.join('/tmp', `image_${Date.now()}.${mime.split('/')[1]}`)
    fs.writeFileSync(tmpFile, media)

    await conn.sendMessage(m.chat, { react: { text: '🧽', key: m.key } })

    const upload = await uploadToUguu(tmpFile)
    const imageUrl = upload.files[0].url

    const result = await scrapeTextRemover(imageUrl)
    fs.unlinkSync(tmpFile)

    if (!result.success) throw new Error(result.message)
    await conn.sendFile(m.chat, result.resultUrl, 'nowm.png', result.message, m)
    await conn.sendMessage(m.chat, { react: { text: null, key: m.key } })
  } catch (e) {
    m.reply(`❌ Error: ${e.message}`)
  }
}

saa.help = ['removewm']
saa.tags = ['tools','ai']
saa.command = /^(removewm|rmwm|removewatermark|remwm)$/i
saa.limit = 10
saa.register = true
saa.premium = true

export default saa