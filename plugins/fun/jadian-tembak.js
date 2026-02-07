import fs from 'fs'
import { areJidsSameUser } from '@adiwajshing/baileys'

const DEBUG_LOG = './tembak-debug.log'
const appendLog = (txt) => {
  try {
    fs.appendFileSync(DEBUG_LOG, `${new Date().toISOString()} ${txt}\n`)
  } catch (e) { console.error('Debug log error:', e) }
}

let toM = a => '@' + (String(a).split('@')[0] || a)

async function safeParticipants(conn, m, participants, groupMetadata) {
  try {
    if (Array.isArray(participants)) {
      return participants.map(v => typeof v === 'string' ? v : (v.id || v.jid))
    }
    if (groupMetadata && Array.isArray(groupMetadata.participants)) {
      return groupMetadata.participants.map(p => p.id || p.jid)
    }
    if (conn && typeof conn.groupMetadata === 'function') {
      let gm = await conn.groupMetadata(m.chat).catch(() => null)
      if (gm && gm.participants) {
        return gm.participants.map(p => p.id || p.jid)
      }
    }
  } catch (e) {
    appendLog('safeParticipants ERR: ' + e)
  }
  return [m.sender]
}

let handler = async (m, { conn, usedPrefix, text, participants, groupMetadata }) => {
  try {

    // fallback DB aman
    if (!global.db) global.db = {}
    if (!global.db.data) global.db.data = {}
    if (!global.db.data.users) global.db.data.users = {}

    participants = await safeParticipants(conn, m, participants, groupMetadata)

    // MODE RANDOM
    if (!text) {
      const ps = participants.length ? participants : [m.sender]
      const a = ps[Math.floor(Math.random() * ps.length)]
      let b = a
      while (b === a && ps.length > 1) {
        b = ps[Math.floor(Math.random() * ps.length)]
      }
      const rnd = ktnmbk[Math.floor(Math.random() * ktnmbk.length)]
      return conn.reply(m.chat, `*Pesan Cinta...* ${toM(a)} ❤️ ${toM(b)}\n${rnd}`, m, {
        mentions: [a, b]
      })
    }

    // ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
    // Ambil nomor / tag
    // ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

    let number
    if (isNaN(text)) number = (text.split('@')[1] || '').trim()
    else number = text.trim()

    if (!number) return m.reply(`Masukkan nomor atau tag orangnya!`)
    if (isNaN(number)) return m.reply(`Format nomor tidak valid!`)
    if (number.length > 20) return m.reply(`Nomor terlalu panjang!`)

    // Tentukan JID target
    let user
    if (text.includes('@')) user = number + '@s.whatsapp.net'
    else if (m.quoted && m.quoted.sender) user = m.quoted.sender
    else if (m.mentionedJid && m.mentionedJid[0]) user = m.mentionedJid[0]
    else user = number + '@s.whatsapp.net'

    if (!user) return m.reply(`Target tidak ditemukan.`)

    // cek apakah user ada di grup
    const found = participants.find(v => areJidsSameUser(v, user))
    if (!found) return m.reply(`Target tidak ada di grup.`)

    // anti tembak diri sendiri / bot
    if (areJidsSameUser(user, m.sender)) return m.reply(`Gabisa tembak diri sendiri!`)
    if (conn.user && areJidsSameUser(user, conn.user.jid)) return m.reply(`Aku ga mau sama kamu :')`)

    // Inisialisasi user database aman
    if (!global.db.data.users[m.sender]) global.db.data.users[m.sender] = { pasangan: "" }
    if (!global.db.data.users[m.sender].pasangan) global.db.data.users[m.sender].pasangan = ""

    if (!global.db.data.users[user]) global.db.data.users[user] = { pasangan: "" }
    if (!global.db.data.users[user].pasangan) global.db.data.users[user].pasangan = ""

    // Ambil status pasangan
    const spac = global.db.data.users[m.sender].pasangan
    const pacar = global.db.data.users[user].pasangan

    // pengirim sudah punya pasangan mutual
    if (spac && global.db.data.users[spac] && global.db.data.users[spac].pasangan === m.sender && spac !== user) {
      return conn.reply(
        m.chat,
        `Kamu sudah pacaran dengan @${spac.split('@')[0]}!\nPutus dulu sebelum menembak orang lain.`,
        m,
        { mentions: [spac] }
      )
    }

    // target sudah punya pacar lain
    if (pacar && pacar !== m.sender) {
      return conn.reply(
        m.chat,
        `Maaf, @${user.split('@')[0]} sudah pacaran dengan @${pacar.split('@')[0]}`,
        m,
        { mentions: [user, pacar] }
      )
    }

    // jika target sudah suka sender → jadian!
    if (pacar === m.sender) {
      global.db.data.users[m.sender].pasangan = user
      global.db.data.users[user].pasangan = m.sender
      return conn.reply(
        m.chat,
        `SELAMAT!! Kamu dan @${user.split('@')[0]} resmi berpacaran 🥳`,
        m,
        { mentions: [user] }
      )
    }

    // jika belum → tembak (pending)
    global.db.data.users[m.sender].pasangan = user

    const rnd = ktnmbk[Math.floor(Math.random() * ktnmbk.length)]
    return conn.reply(
      m.chat,
      `${rnd}\n\nKamu baru saja menembak @${user.split('@')[0]}.\nTunggu jawabannya!\nGunakan *${usedPrefix}terima @user* atau *${usedPrefix}tolak @user*.`,
      m,
      { mentions: [user] }
    )

  } catch (e) {
    appendLog('ERR: ' + e)
    console.log(e)
    return m.reply(`❌ Terjadi kesalahan di fitur tembak.\nCek log: ${DEBUG_LOG}`)
  }
}

handler.help = ['tembak']
handler.tags = ['fun']
handler.command = /^(tembak|jadian)$/i
handler.group = true

export default handler


// Pesan random
const ktnmbk = [
  "Ada saat di mana aku nggak suka sendiri...",
  "Aku baru sadar ternyata selama ini kamu kaya!",
  "Terima kasih pada mataku yang menuntunku menemukanmu.",
  // bisa tambah lagi
]