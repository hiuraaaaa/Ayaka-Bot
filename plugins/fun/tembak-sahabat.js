// persahabatan.mjs — Baileys ESM FULL FIX (reply normal)
// Commands: bersahabat, terimasahabat, tolaksahabat, putusahabat, ceksahabat

import { format as _format } from 'util'

let handler = async (m, { conn, text = '', usedPrefix = '' }) => {
  global.db = global.db || { data: { users: {} } }
  global.db.data = global.db.data || { users: {} }
  const usersDb = global.db.data.users

  const no = (s = '') => String(s).replace(/\s+/g, '').replace(/([@+-])/g, '')
  const format = (num) => {
    const n = String(num)
    const p = n.indexOf('.')
    return n.replace(/\d(?=(?:\d{3})+(?:\.|$))/g, (m, i) => (p < 0 || i < p ? `${m},` : m))
  }

  const rawCmd = (m.text || '').trim().split(/\s+/)[0] || ''
  const cmdName = rawCmd.startsWith(usedPrefix)
    ? rawCmd.slice(usedPrefix.length).toLowerCase()
    : rawCmd.toLowerCase()

  const parseTarget = () => {
    let number = ''
    const cleaned = no(text)

    if (cleaned) {
      if (isNaN(cleaned)) number = cleaned.split('@')[1] || ''
      else number = cleaned
    }
    if (!number && m.mentionedJid?.length) return m.mentionedJid[0]
    if (!number && m.quoted?.sender) return m.quoted.sender
    if (!number) return ''

    return number.includes('@') ? number : number + '@s.whatsapp.net'
  }

  const target = parseTarget()

  const ensureUser = (jid) => {
    if (!jid) return
    if (!usersDb[jid]) usersDb[jid] = { exp: 0, sahabat: '' }
    else {
      usersDb[jid].exp = usersDb[jid].exp || 0
      usersDb[jid].sahabat = usersDb[jid].sahabat || ''
    }
  }

  ensureUser(m.sender)
  if (target) ensureUser(target)

  const mention = (jid) => jid.split('@')[0]

  // ==========================
  //  REPLY FUNCTION BARU
  // ==========================
  const send = (txt, mentions = []) =>
    conn.sendMessage(
      m.chat,
      {
        text: txt,
        mentions: mentions
      },
      { quoted: m }
    )

  // ==========================
  //         SWITCH CMD
  // ==========================

  switch (cmdName) {
    case 'bersahabat': {
      if (!text && !m.quoted && (!m.mentionedJid || !m.mentionedJid.length))
        return send('Berikan nomor, tag atau reply chat target')

      if (!target) return send('Target atau Nomor tidak ditemukan')
      if (target === m.sender) return send('Tidak bisa berteman dengan diri sendiri')

      const senderObj = usersDb[m.sender]
      const targetObj = usersDb[target]

      // Jika sudah punya sahabat
      if (
        senderObj.sahabat &&
        usersDb[senderObj.sahabat] &&
        usersDb[senderObj.sahabat].sahabat == m.sender &&
        senderObj.sahabat != target
      ) {
        const denda = Math.ceil((senderObj.exp / 1000) * 20)
        senderObj.exp -= denda

        return send(
          `Kamu sudah bersahabat dengan @${mention(senderObj.sahabat)}\n\nSilahkan putus dulu ${usedPrefix}putus @user untuk bersahabat dengan @${mention(target)}\n\ndenda: ${format(denda)} (20%)`,
          [senderObj.sahabat, target]
        )
      }

      if (targetObj.sahabat != '') {
        const teman = targetObj.sahabat

        if (usersDb[teman] && usersDb[teman].sahabat == target) {
          const denda = Math.ceil((usersDb[m.sender].exp / 1000) * 20)
          usersDb[m.sender].exp -= denda

          return send(
            `@${mention(target)} sudah bersahabat dengan @${mention(teman)}\n\nCari sahabat lain.\nDenda: ${format(denda)} (10%)`,
            [target, teman]
          )
        } else {
          usersDb[m.sender].sahabat = target
          return send(
            `Kamu baru saja mengajak @${mention(target)} bersahabat.\n\nTunggu jawabannya.`,
            [target]
          )
        }
      }

      if (targetObj.sahabat == m.sender) {
        usersDb[m.sender].sahabat = target
        return send(
          `Selamat! Kamu resmi bersahabat dengan @${mention(target)} 🎉`,
          [target]
        )
      }

      usersDb[m.sender].sahabat = target
      return send(
        `Kamu mengajak @${mention(target)} bersahabat.\n\nTunggu jawabannya.`,
        [target]
      )
    }

    case 'terimasahabat': {
      if (!target) return send('Target tidak ditemukan.')

      if (usersDb[target].sahabat != m.sender)
        return send(`@${mention(target)} tidak sedang mengajakmu`, [target])

      usersDb[m.sender].sahabat = target

      return send(
        `🥳 Kamu resmi bersahabat dengan @${mention(target)}!`,
        [target, m.sender]
      )
    }

    case 'tolaksahabat': {
      if (!target) return send('Target tidak ditemukan.')

      if (usersDb[target].sahabat != m.sender)
        return send(`@${mention(target)} tidak mengajakmu`, [target])

      usersDb[target].sahabat = ''

      return send(`Kamu menolak ajakan @${mention(target)} 😔`, [target])
    }

    case 'putusahabat': {
      const me = usersDb[m.sender]
      if (!me.sahabat) return send('Kamu tidak memiliki sahabat.')

      const partner = me.sahabat
      const obj = usersDb[partner]

      me.sahabat = ''
      if (obj?.sahabat == m.sender) obj.sahabat = ''

      return send(
        `Kamu telah putus sahabat dengan @${mention(partner)} 😢`,
        [partner]
      )
    }

    case 'ceksahabat': {
      let t = target || m.sender
      ensureUser(t)

      const cur = usersDb[t]

      if (!cur.sahabat)
        return send(t === m.sender ? 'Kamu tidak memiliki sahabat.' : 'Dia tidak memiliki sahabat.')

      const partner = cur.sahabat

      if (!usersDb[partner] || usersDb[partner].sahabat != t)
        return send(`${mention(t)} sedang menunggu jawaban dari @${mention(partner)}`, [partner])

      return send(
        `${mention(t)} sedang bersahabat dengan @${mention(partner)} 🫂`,
        [partner]
      )
    }
  }
}

handler.help = ['bersahabat', 'terimasahabat', 'tolaksahabat', 'putusahabat', 'ceksahabat']
handler.tags = ['fun']
handler.command = /^(bersahabat|terimasahabat|tolaksahabat|putusahabat|ceksahabat)$/i
handler.group = true
handler.limit = true

export default handler