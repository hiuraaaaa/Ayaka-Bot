import { promises } from 'fs'
import { join } from 'path'
import moment from 'moment-timezone'
import os from 'os'
import { xpRange } from '../lib/levelling.js'
const { generateWAMessageFromContent, proto } = (await import('@adiwajshing/baileys')).default

const defaultMenu = {
  before: `\`Hai Kak👋🏻, %ucpn\`

*INFO BOT*
╭ ⌯ Nama Bot: %me
│ ⌯ Ping: ${performance.now().toFixed(4)}ms
╰ ⌯ Nomor Bot: ${global.botNumber}

*INFO USER*
╭ ⌯ Nama: %name
│ ⌯ Status: %prems
╰ ⌯ Limit: %limit Ⓛ

*INFO OWNER*
╭ ⌯ Owner: ${global.author}
│ ⌯ Contact: ${global.nomorwa}
╰ ⌯ Website: ${global.myweb}

_*Date:*_ %date %weton
_*Time:*_ %time
%readmore
`.trimStart(),

  header: '╭──⌯ _*%category*_ ⌯──╮',
  body: '│ ⌯ %cmd %islimit %isPremium',
  footer: '╰────────⌯',
  after: ``
}

let handler = async (m, { conn, usedPrefix: _p, __dirname, args, command }) => {

  /* ===============================
   *   ANTI DUPLICATE SESSION FIX
   * =============================== */
  global.menuSession = global.menuSession || {}

  const sessionId = `${m.sender}:${command}`
  const now = Date.now()

  if (global.menuSession[sessionId] && (now - global.menuSession[sessionId] < 1500)) {
    return // cegah double exec dari button
  }

  global.menuSession[sessionId] = now
  /* ================================= */

  let tags = {}

  if (/menuai/i.test(command)) tags = { ai: 'Fitur AI' }
  if (/menuanime/i.test(command)) tags = { anime: 'Fitur Anime' }
  if (/menuasupan/i.test(command)) tags = { asupan: 'Fitur Asupan' }
  if (/menuaudio/i.test(command)) tags = { audio: 'Fitur Audio' }
  if (/menudownloader/i.test(command)) tags = { downloader: 'Fitur Download' }
  if (/menugame/i.test(command)) tags = { game: 'Fitur Game' }
  if (/menufun/i.test(command)) tags = { fun: 'Fitur Fun' }
  if (/menuhavefun/i.test(command)) tags = { havefun: 'Fitur Have Fun' }
  if (/menuinfo/i.test(command)) tags = { info: 'Fitur Info' }
  if (/menuinternet/i.test(command)) tags = { internet: 'Fitur Internet' }
  if (/menumain/i.test(command)) tags = { main: 'Fitur Main' }
  if (/menumaker/i.test(command)) tags = { maker: 'Fitur Maker' }
  if (/menuowner/i.test(command)) tags = { owner: 'Fitur Owner' }
  if (/menupanel/i.test(command)) tags = { panel: 'Fitur Owner' }
  if (/menupremium/i.test(command)) tags = { premium: 'Fitur Khusus Prem' }
  if (/menupush/i.test(command)) tags = { pushkontak: 'Fitur PushKontak' }
  if (/menurpg/i.test(command)) tags = { rpg: 'Fitur Rpg' }
  if (/menusearch/i.test(command)) tags = { search: 'Fitur Search' }
  if (/menustiker/i.test(command)) tags = { sticker: 'Fitur Stiker' }
  if (/menutools/i.test(command)) tags = { tools: 'Fitur Tools' }
  if (/menuislamic/i.test(command)) tags = { islamic: 'Fitur Islamic' }
  if (/menuceramah/i.test(command)) tags = { ceramah: 'Ceramah Islamic' }
  if (/menulistv2/i.test(command)) tags = { castoAyakamenu: 'CastoAyaka Menu' }
  if (/menuquotes/i.test(command)) tags = { quotes: 'Fitur Quotes' }
  if (/menugc/i.test(command)) tags = { group: 'Fitur Group' }

  try {
   
    let dash = global.dashmenu
    let m1 = global.dmenut
    let m2 = global.dmenub
    let m3 = global.dmenuf
    let m4 = global.dmenub2

    let cc = global.cmenut
    let c1 = global.cmenuh
    let c2 = global.cmenub
    let c3 = global.cmenuf
    let c4 = global.cmenua

    let lprem = global.lopr
    let llim = global.lolm
    let tag = `@${m.sender.split('@')[0]}`

    let ucpn = `${ucapan()}`
    let d = new Date(new Date + 3600000)
    let locale = 'id'
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'Asia/Jakarta'
    })
    let time = d.toLocaleTimeString(locale, { timeZone: 'Asia/Jakarta' })
    let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]

    let _uptime = process.uptime() * 1000
    let uptime = clockString(_uptime)

    let { age, exp, limit, level, role } = global.db.data.users[m.sender]
    let { min, xp, max } = xpRange(level, global.multiplier)
    let name = await conn.getName(m.sender)
    let premium = global.db.data.users[m.sender].premiumTime
    let prems = `${premium > 0 ? 'Premium Ⓟ' : 'Free'}`
    let platform = os.platform()

    let help = Object.values(global.plugins)
      .filter(p => !p.disabled)
      .map(p => ({
        help: Array.isArray(p.help) ? p.help : [p.help],
        tags: Array.isArray(p.tags) ? p.tags : [p.tags],
        prefix: 'customPrefix' in p,
        limit: p.limit,
        premium: p.premium,
      }))

    let groups = {}
    for (let tag in tags) {
      groups[tag] = []
      for (let plugin of help)
        if (plugin.tags.includes(tag))
          if (plugin.help) groups[tag].push(plugin)
    }

    conn.menu = conn.menu ? conn.menu : {}
    let before = conn.menu.before || defaultMenu.before
    let header = conn.menu.header || defaultMenu.header
    let body = conn.menu.body || defaultMenu.body
    let footer = conn.menu.footer || defaultMenu.footer
    let after = conn.menu.after || defaultMenu.after

    let _text = [
      before,
      ...Object.keys(tags).map(tag => {
        return header.replace(/%category/g, tags[tag]) + '\n' + [
          ...help.filter(x => x.tags.includes(tag)).map(x => {
            return x.help.map(cmd =>
              body.replace(/%cmd/g, x.prefix ? cmd : _p + cmd)
                  .replace(/%islimit/g, x.limit ? '(Ⓛ)' : '')
                  .replace(/%isPremium/g, x.premium ? '(Ⓟ)' : '')
                  .trim()
            ).join('\n')
          }),
          footer
        ].join('\n')
      }),
      after
    ].join('\n')

    let replace = {
      '%': '%',
      _p: _p, 
      ucpn, time, date, week, weton,
      name, limit, level, role, prems,
      me: conn.getName(conn.user.jid),
      readmore: readMore,
      dash, m1, m2, m3, m4, cc, c1, c2, c3, c4, lprem, llim
    }

    let text = _text.replace(
      new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'),
      (_, name) => '' + replace[name]
    )

    let fkon = {
      key: {
        fromMe: false,
        participant: `${m.sender.split('@')[0]}@s.whatsapp.net`,
        ...(m.chat ? { remoteJid: '16504228206@s.whatsapp.net' } : {}),
      },
      message: {
        contactMessage: {
          displayName: `${name}`,
          vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:${name}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
        },
      },
    }

    await conn.sendMessage(m.chat, {
      image: { url: global.tfitur },
      caption: text,
      footer: `© ${global.namebot || 'Bot'} || ${global.author || 'Author'}`,
      buttons: [
        {
          buttonId: '.owner',
          buttonText: { displayText: '☎ Owner' },
          type: 1,
        }
      ],
      headerType: 1,
      viewOnce: true
    }, { quoted: fkon })

    // Audio menu - uncomment jika ingin aktifkan
    /*
    await conn.sendMessage(m.chat, {
      audio: { url: 'https://c.termai.cc/a45/6PnA.opus' },
      mimetype: 'audio/mpeg',
      ptt: true
    }, { quoted: fkon })
    */

  } catch (e) {
    conn.reply(m.chat, 'Maaf, menu sedang error.', m)
    throw e
  }
}

handler.help = [
  'menuai', 'menuanime', 'menuasupan',
  'menuaudio', 'menudownloader', 'menugame',
  'menufun', 'menuhavefun', 'menuinfo',
  'menuinternet', 'menumain', 'menumaker',
  'menuowner', 'menupanel', 'menupremium',
  'menupush', 'menurpg', 'menusearch',
  'menustiker', 'menutools', 'menuislamic',
  'menuceramah', 'menulistv2',
  'menuquotes', 'menugc'
]

handler.tags = ['Luminamenu']

handler.command = /^(menuai|menuanime|menuasupan|menuaudio|menudownloader|menugame|menufun|menuhavefun|menuinfo|menuinternet|menumain|menumaker|menuowner|menupanel|menupremium|menupush|menurpg|menusearch|menustiker|menutools|menuislamic|menuceramah|menulistv2|menuquotes|menugc)$/i

export default handler

function ucapan() {
  const time = moment.tz('Asia/Jakarta').format('HH')
  if (time >= 18) return "Malam Kak 🌙"
  if (time >= 15) return "Sore Kak 🌇"
  if (time >= 10) return "Siang Kak ☀️"
  if (time >= 4) return "Pagi Kak 🌄"
  return "Kok Belum Tidur Kak? 🥱"
}

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, ' H ', m, ' M ', s, ' S '].join('')
}
