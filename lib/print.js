import { WAMessageStubType } from '@adiwajshing/baileys'
import PhoneNumber from 'awesome-phonenumber'
import chalk from 'chalk'
import moment from 'moment-timezone'
import { watchFile } from 'fs'

const terminalImage = global.opts['img'] ? require('terminal-image') : ''
const urlRegex = (await import('url-regex-safe')).default({ strict: false })

export default async function (m, conn = { user: {} }) {
  const _name = await conn.getName(m.sender)
  const sender = PhoneNumber('+' + m.sender.replace('@s.whatsapp.net', '')).getNumber('international') + (_name ? ' ~ ' + _name : '')
  const chat = await conn.getName(m.chat)
  const me = PhoneNumber('+' + (conn.user?.jid).replace('@s.whatsapp.net', '')).getNumber('international')
  const user = global.DATABASE.data.users[m.sender]
  let img

  try {
    if (global.opts['img'])
      img = /sticker|image/gi.test(m.mtype) ? await terminalImage.buffer(await m.download()) : false
  } catch (e) {
    console.error(e)
  }

  const filesize = calculateFileSize(m)
  const msgText = formatMessageContent(m)

  const divider = chalk.gray('│')
  const header = chalk.bold.cyanBright('╭──────────── 🧩  Ayaka MESSAGE LOGGER ─────────────')
  const footer = chalk.bold.cyanBright('╰────────────────────────────────────────────────')

  console.log('\n' + header)
  console.log(`${divider} ${chalk.blueBright('📩 Type')}       : ${chalk.whiteBright(m.mtype)}`)
  console.log(`${divider} ${chalk.greenBright('👤 Sender')}     : ${chalk.whiteBright(sender)}`)
  console.log(`${divider} ${chalk.magentaBright('💬 Chat')}       : ${chalk.whiteBright(chat || 'Unknown')}`)
  console.log(`${divider} ${chalk.yellowBright('⏰ Time')}       : ${chalk.whiteBright(formatTimestamp(m.messageTimestamp))}`)
  console.log(`${divider} ${chalk.cyanBright('📦 Size')}       : ${chalk.whiteBright(`${filesize} (${formatFileSize(filesize)})`)}`)
  console.log(`${divider} ${chalk.redBright('🧪 Exp/Level')}  : ${chalk.whiteBright(`${user?.exp ?? '?'} / ${user?.level ?? '?'}`)}`)
  console.log(`${divider} ${chalk.greenBright('🤖 Bot')}        : ${chalk.whiteBright(`${me} ~ ${conn.user.name}`)}`)

  if (msgText)
    console.log(`${divider} ${chalk.whiteBright('💌 Message')}    : ${chalk.gray(msgText.slice(0, 300))}${msgText.length > 300 ? chalk.gray(' ...') : ''}`)

  if (m.isGroup && Array.isArray(m.messageStubParameters) && m.messageStubParameters.length) {
    const mentions = m.messageStubParameters.map(jid => {
      jid = conn.decodeJid(jid)
      const name = conn.getName(jid)
      return name ? PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international') + ' ~ ' + name : null
    }).filter(Boolean).join(', ')
    if (mentions) console.log(`${divider} ${chalk.yellow('🧑‍🤝‍🧑 Mentioned')}  : ${chalk.whiteBright(mentions)}`)
  }

  if (/document/i.test(m.mtype))
    console.log(`${divider} ${chalk.blue('📄 Document')}   : ${chalk.whiteBright(m.msg.fileName || m.msg.displayName || 'Unknown')}`)
  else if (/contact/i.test(m.mtype))
    console.log(`${divider} ${chalk.green('👥 Contact')}    : ${chalk.whiteBright(m.msg.displayName || 'Unnamed Contact')}`)
  else if (/audio/i.test(m.mtype)) {
    const duration = m.msg.seconds
    console.log(`${divider} ${chalk.yellow('🔉 Audio')}      : ${chalk.whiteBright(`${m.msg.ptt ? 'Voice Note' : 'Audio'} (${formatDuration(duration)})`)}`)
  }

  console.log(footer)

  if (img) console.log('\n' + img.trimEnd())
}

// --- Utility Functions ---
function calculateFileSize(m) {
  return m.msg ?
    m.msg.vcard?.length ??
    m.msg.fileLength?.low ??
    m.msg.fileLength ??
    m.msg.axolotlSenderKeyDistributionMessage?.length ??
    m.text?.length ??
    0 :
    m.text?.length ?? 0
}

function formatTimestamp(timestamp) {
  const time = timestamp?.low ?? timestamp ?? Math.floor(Date.now() / 1000)
  return moment.unix(time).tz('Asia/Jakarta').format('HH:mm:ss')
}

function formatFileSize(size) {
  if (size === 0) return '0 B'
  const i = Math.floor(Math.log(size) / Math.log(1000))
  return (size / Math.pow(1000, i)).toFixed(1) + ['B', 'KB', 'MB', 'GB', 'TB'][i]
}

function formatMessageContent(m) {
  let text = m.text || m.caption || ''
  if (!text) return ''
  text = text.replace(/\u200e+/g, '').replace(urlRegex, url => chalk.underline.blue(url))
  const mdRegex = /(?<=(?:^|[\s\n])\S?)(?:([*_~])(.+?)\1|``````)(?=\S?(?:[\s\n]|$))/g
  return text.replace(mdRegex, (_, __, txt) => chalk.bold(txt))
}

function formatDuration(seconds) {
  return `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`
}

let file = global.__filename(import.meta.url)
watchFile(file, () => {
  console.log(chalk.gray("🔁 File 'lib/print.js' updated — changes reloaded automatically"))
})