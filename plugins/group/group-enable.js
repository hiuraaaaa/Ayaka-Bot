let handler = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin, isROwner }) => {
  let isEnable = /true|enable|(turn)?on|1/i.test(command)
  let chat = global.db.data.chats[m.chat]
  let user = global.db.data.users[m.sender]
  let bot = global.db.data.settings[conn.user.jid] || {}
  let type = (args[0] || '').toLowerCase()
  let isAll = false, isUser = false
  
  switch (type) {
    case 'welcome':
      if (!m.isGroup) {
        if (!isOwner) {
          global.dfail('group', m, conn)
          throw false
        }
      } else if (!isAdmin) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.welcome = isEnable
      break
      
    case 'detect':
      if (!m.isGroup) {
        if (!isOwner) {
          global.dfail('group', m, conn)
          throw false
        }
      } else if (!isAdmin) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.detect = isEnable
      break
      
    case 'delete':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.delete = isEnable
      break
      
    case 'clear':
      isAll = true
      if (!isOwner) {
        global.dfail('owner', m, conn)
        throw false
      }
      bot.clear = isEnable
      break
      
    case 'viewonce':
    case 'antiviewonce':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.viewonce = isEnable
      break
      
    case 'desc':
      if (!m.isGroup) {
        if (!isOwner) {
          global.dfail('group', m, conn)
          throw false
        }
      } else if (!(isAdmin || isOwner)) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.descUpdate = isEnable
      break
      
    case 'antidelete':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.delete = !isEnable
      break
      
    case 'autodelvn':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.autodelvn = isEnable
      break
      
    case 'document':
      chat.useDocument = isEnable
      break
      
    case 'public':
      isAll = true
      if (!isROwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      global.opts['self'] = !isEnable
      break
      
    case 'bcjoin':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.bcjoin = isEnable
      break
      
    case 'antilink':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiLink = isEnable
      break
      
    case 'antibokep':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiBokep = isEnable
      break
      
    case 'antifoto':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiFoto = isEnable
      break
      
    case 'antilinkall':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiLinkAll = isEnable
      break
      
    case 'antivideo':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiVideo = isEnable
      break
      
    case 'antiaudio':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiAudio = isEnable
      break
      
    case 'antisticker':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiSticker = isEnable
      break
      
    case 'antibot':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiBot = isEnable
      break
      
    case 'yue':
      if (!isROwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      chat.chatbot = isEnable
      break
      
    case 'autopresence':
      if (!isROwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      chat.autoPresence = isEnable
      break
      
    case 'autoreply':
      if (!isROwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      chat.autoReply = isEnable
      break
      
    case 'autosticker':
      if (!isROwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      chat.autoSticker = isEnable
      break
      
    case 'autojoin':
      if (!isROwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      chat.autoJoin = isEnable
      break
      
    case 'autoupnews':
      if (!isROwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      chat.updateAnimeNews = isEnable
      break
      
    case 'autoupnime':
      if (!isROwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      chat.updateAnime = isEnable
      break
      
    case 'toxic':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiToxic = !isEnable
      break
      
    case 'antitoxic':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiToxic = isEnable
      break
      
    case 'antispam':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiSpam = isEnable
      break
      
    case 'backupsc':
      if (!isOwner) {
        global.dfail('owner', m, conn)
        throw false
      }
      chat.backupsc = isEnable
      break;
      
    case 'anticall':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiCall = isEnable
      break
      
    case 'autolevelup':
      isUser = true
      user.autolevelup = isEnable
      break
      
    case 'mycontact':
    case 'mycontacts':
    case 'whitelistcontact':
    case 'whitelistcontacts':
    case 'whitelistmycontact':
    case 'whitelistmycontacts':
      if (!isOwner) {
        global.dfail('owner', m, conn)
        throw false
      }
      conn.callWhitelistMode = isEnable
      break
      
    case 'restrict':
      isAll = true
      if (!isOwner) {
        global.dfail('owner', m, conn)
        throw false
      }
      bot.restrict = isEnable
      break
      
    case 'nyimak':
      isAll = true
      if (!isROwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      global.opts['nyimak'] = isEnable
      break
      
    case 'autoread':
      isAll = true
      if (!isROwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      global.opts['autoread'] = isEnable
      break
      
    case 'simi':
      if (!isROwner) {
        return await conn.reply(m.chat, '⚠️ *Hanya pemilik asli yang dapat menggunakan perintah ini!*', m);
      }
      chat.simi = isEnable;
      break;
      
    case 'pconly':
    case 'privateonly':
      isAll = true
      if (!isROwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      global.opts['pconly'] = isEnable
      break;
      
    case 'gconly':
    case 'grouponly':
      isAll = true
      if (!isROwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      global.opts['gconly'] = isEnable
      break;
      
    case 'getmsg':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) return global.dfail('admin', m, conn)
      }
      chat.getmsg = isEnable
      break;
      
    case 'swonly':
    case 'statusonly':
      isAll = true
      if (!isROwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      global.opts['swonly'] = isEnable
      break;
      
    case 'antipolling':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiPoll = isEnable
      break;
      
    case 'antitag':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antitag = isEnable
      break;
      
    case 'antitagsw':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiTagStatus = isEnable
      break;
      
    default:
      if (!/[01]/.test(command)) return m.reply(`📝 *Opsi Pengaturan Bot*:

🔒 *Admin Commands:*
- _welcome_
- _Ayaka_
- _delete_
- _antilink_
- _antilinkall_
- _antibokep_
- _anticall_
- _antifoto_
- _antivideo_
- _antidelete_
- _antibot_
- _antiviewonce_
- _antitoxic_
- _antisticker_
- _antiaudio_
- _autodelvn_
- _antipolling_
- _antitag_
- _antitagsw_
- _detect_
- _desc_

👑 *Owner Commands:*
- _clear_
- _simi_
- _autoupnime_
- _autolevelup_
- _restrict_
- _pconly_
- _gconly_
- _autoread_
- _autoreply_

💡 *Contoh Mengaktifkan:*
- *${usedPrefix}on welcome* _(Untuk Mengaktifkan)_

💡 *Contoh Menonaktifkan:*
- *${usedPrefix}off welcome* _(Untuk Menonaktifkan)_

`.trim())
      throw false;
  }

  conn.reply(m.chat, `✨ *Pengaturan Bot*:
🔍 *Tipe*: ${type}
📌 *Status*: ${isEnable ? 'Aktif ✅' : 'Nonaktif ❌'}
🎯 *Untuk*: ${isAll ? 'Bot Ini' : isUser ? 'Pengguna Ini' : 'Grup Ini'}

🔄 *Perubahan berhasil dilakukan!*`, flok)
}
handler.help = ['enable', 'disable']
handler.tags = ['group', 'owner']
handler.command = /^((en|dis)able|(tru|fals)e|(turn)?o(n|ff)|[01])$/i

handler.group = true
handler.admin = true

export default handler