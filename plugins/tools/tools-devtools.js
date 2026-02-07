import axios from 'axios'
import cheerio from 'cheerio'

let handler = async function (m, { conn, args, text }) {
  if (!text || !/^https?:\/\//i.test(args[1] || text)) return m.reply('📌 Kirim URL valid!\nContoh:\n.devtools https://example.com\n.devtools scrape https://example.com')

  const isScrape = args[0] === 'scrape'
  const url = isScrape ? args[1] : text

  if (isScrape) {
    try {
      const res = await axios.get(url)
      const $ = cheerio.load(res.data)

      const title = $('title').text().trim() || '-'
      const metaDescription = $('meta[name="description"]').attr('content') || '-'
      const metaKeywords = $('meta[name="keywords"]').attr('content') || '-'
      const ogTitle = $('meta[property="og:title"]').attr('content') || '-'
      const ogImage = $('meta[property="og:image"]').attr('content') || '-'

      const rawTags = []
      $('a').each((_, el) => {
        const tag = $.html(el).trim()
        if (tag) rawTags.push(tag)
      })
      $('h1,h2,h3').each((_, el) => {
        const tag = $.html(el).trim()
        if (tag) rawTags.push(tag)
      })

      const headings = []
      $('h1,h2,h3').each((_, el) => {
        headings.push($(el).text().trim())
      })

      const links = []
      $('a').each((_, el) => {
        const href = $(el).attr('href')
        if (href) links.push(href)
      })

      const images = []
      $('img').each((_, el) => {
        const src = $(el).attr('src')
        if (src) images.push(src)
      })

      let output = ''
      output += `🔎 *Scrape HTML Penuh:*\n\n`
      output += `📌 *Title:* ${title}\n`
      output += `📝 *Meta Description:* ${metaDescription}\n`
      output += `🔑 *Meta Keywords:* ${metaKeywords}\n`
      output += `🏷️ *OG Title:* ${ogTitle}\n`
      output += `🖼️ *OG Image:* ${ogImage}\n\n`
      if (headings.length) output += `📣 *Semua Heading (H1-H3):*\n${headings.map((h, i) => `${i + 1}. ${h}`).join('\n')}\n\n`
      if (links.length) output += `🔗 *Link (${links.length} total):*\n${links.slice(0, 10).map((l, i) => `${i + 1}. ${l}`).join('\n')}\n\n`
      if (images.length) output += `🖼️ *Gambar (${images.length} total):*\n${images.slice(0, 10).map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n`
      if (rawTags.length) {
        output += '`RECHARGE SUCCESSFUL`\n\n'
        rawTags.slice(0, 10).forEach(tag => output += `- ${tag}\n`)
      }

      return m.reply(output)
    } catch (e) {
      return m.reply(`❌ *Gagal scrape HTML!*\n\n${e.message}`)
    }
  }

  try {
    const res = await axios.get(url, { responseType: 'arraybuffer' })
    const contentType = res.headers['content-type'] || ''
    const isApk = /\.apk(\?.*)?$/.test(url) || /application\/vnd\.android\.package-archive/.test(contentType)

    if (/image|video|audio|application\/octet-stream/.test(contentType) || isApk) {
      let ext = isApk ? 'apk' : (contentType.split('/')[1].split(';')[0] || 'bin')
      let mediaMessageType = /image/.test(contentType)
        ? 'image'
        : /video/.test(contentType)
        ? 'video'
        : /audio/.test(contentType)
        ? 'audio'
        : 'document'

      return await conn.sendMessage(m.chat, {
        [mediaMessageType]: Buffer.from(res.data),
        mimetype: isApk ? 'application/vnd.android.package-archive' : contentType,
        fileName: `downloaded.${ext}`
      }, { quoted: m })
    }

    conn.pendingHttpSession = conn.pendingHttpSession || {}
    if (conn.pendingHttpSession[m.sender]) {
      clearTimeout(conn.pendingHttpSession[m.sender].timeout)
      delete conn.pendingHttpSession[m.sender]
    }

    const msg = await conn.sendMessage(m.chat, {
      text: `🔰 *REQUEST MODE*\nPilih tipe:\n(1) Ambil HTML Web\n(2) Request API (GET/POST)\n(3) Batal`
    }, { quoted: m })

    conn.pendingHttpSession[m.sender] = {
      step: 'select_mode',
      url,
      msg,
      timeout: setTimeout(() => {
        delete conn.pendingHttpSession[m.sender]
        conn.sendMessage(m.chat, {
          edit: msg.key,
          text: '⏳ Sesi berakhir setelah 1 menit.'
        })
      }, 60000)
    }
  } catch (e) {
    return m.reply(`❌ *Gagal akses URL!*\n\n${e.message}`)
  }
}

handler.before = async function (m, { conn }) {
  conn.pendingHttpSession = conn.pendingHttpSession || {}
  let session = conn.pendingHttpSession[m.sender]
  if (!session) return

  let input = m.text.trim()
  const url = session.url

  if (session.step === 'select_mode') {
    if (!['1', '2', '3'].includes(input)) return

    if (input === '3') {
      clearTimeout(session.timeout)
      delete conn.pendingHttpSession[m.sender]
      return conn.sendMessage(m.chat, {
        edit: session.msg.key,
        text: '❎ *Sesi dibatalkan.*'
      })
    }

    if (input === '1') {
      try {
        const res = await axios.get(url)
        let html = res.data
        if (typeof html !== 'string') html = JSON.stringify(html)
        html = html.length > 4000 ? html.slice(0, 4000) + '\n\n...(terpotong)' : html
        clearTimeout(session.timeout)
        delete conn.pendingHttpSession[m.sender]
        return conn.sendMessage(m.chat, {
          edit: session.msg.key,
          text: `🌐 *HTML Web Ditemukan:*\n\n${html}`
        })
      } catch (e) {
        clearTimeout(session.timeout)
        delete conn.pendingHttpSession[m.sender]
        return conn.sendMessage(m.chat, {
          edit: session.msg.key,
          text: `❌ *Gagal ambil HTML!*\n\n${e.message}`
        })
      }
    }

    session.step = 'method'
    return conn.sendMessage(m.chat, {
      edit: session.msg.key,
      text: `📡 *API REQUEST*\n\nPilih metode:\n(1) GET\n(2) POST\n(3) Batal`
    })
  }

  if (session.step === 'method') {
    if (!['1', '2', '3'].includes(input)) return
    if (input === '3') {
      clearTimeout(session.timeout)
      delete conn.pendingHttpSession[m.sender]
      return conn.sendMessage(m.chat, {
        edit: session.msg.key,
        text: '❎ *Sesi dibatalkan.*'
      })
    }

    session.method = input === '1' ? 'GET' : 'POST'
    session.step = input === '1' ? 'choose_get' : 'wait_body'

    if (input === '1') {
      return conn.sendMessage(m.chat, {
        edit: session.msg.key,
        text: `✅ Metode: GET\n\nPilih respon:\n(1) Response\n(2) Header\n(3) Status\n(4) Semua\n(5) Keluar`
      })
    } else {
      return conn.sendMessage(m.chat, {
        edit: session.msg.key,
        text: `📥 Kirim isi body POST-nya dalam format JSON.\nContoh:\n{ "nama": "Alicia", "usia": 21 }`
      })
    }
  }

  if (session.step === 'wait_body') {
    try {
      const body = JSON.parse(m.text)
      session.body = body
      session.step = 'choose_post'
      return conn.sendMessage(m.chat, {
        edit: session.msg.key,
        text: `✅ Body POST diterima.\nPilih respon:\n(1) Response\n(2) Header\n(3) Status\n(4) Semua\n(5) Keluar`
      })
    } catch (e) {
      return conn.sendMessage(m.chat, {
        edit: session.msg.key,
        text: `❌ Format JSON tidak valid!\n\n${e.message}`
      })
    }
  }

  if (session.step.startsWith('choose_')) {
    if (!/^[1-5]$/.test(input)) return
    if (input === '5') {
      clearTimeout(session.timeout)
      delete conn.pendingHttpSession[m.sender]
      return conn.sendMessage(m.chat, {
        edit: session.msg.key,
        text: '✅ *Sesi diakhiri.*'
      })
    }

    try {
      let res
      if (session.method === 'GET') {
        res = await axios.get(url)
      } else {
        res = await axios.post(url, session.body)
      }

      switch (input) {
        case '1':
          let data = res.data
          if (!data) return m.reply('⚠️ Tidak ada response.')
          if (typeof data === 'string' && /<html.*?>/i.test(data)) return m.reply('⚠️ Tidak ada response (halaman HTML terdeteksi)')
          return m.reply(jsonFormat(data))
        case '2':
          return m.reply(jsonFormat(res.headers))
        case '3':
          return m.reply(`📶 *Status Code:* ${res.status}`)
        case '4':
          let body = res.data
          if (!body || (typeof body === 'string' && /<html.*?>/i.test(body))) {
            body = '⚠️ Tidak ada response (halaman HTML terdeteksi)'
          } else {
            body = jsonFormat(body)
          }
          return m.reply(`📶 *Status:* ${res.status}\n\n📦 *Header:*\n${jsonFormat(res.headers)}\n\n📄 *Response:*\n${body}`)
      }
    } catch (err) {
      return m.reply(`❌ *Gagal ambil data!*\n\n${err.message}`)
    }
  }
}

handler.help = ['devtools', 'devtools scrape <url>']
handler.tags = ['owner']
handler.command = /^(devtools|dev)$/i
handler.owner = true

export default handler

function jsonFormat(obj) {
  return JSON.stringify(obj, null, 2).replace(/\\n/g, '\n')
}