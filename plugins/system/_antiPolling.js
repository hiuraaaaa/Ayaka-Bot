const handler = m => m

handler.before = async function (m, { isAdmin, isBotAdmin }) {
  if (m.isBaileys && m.fromMe) return true
  
  const chat = global.db.data.chats[m.chat]
  const sender = global.db.data.chats[m.sender]
  const messageType = m.mtype
  const participant = m.key.participant
  const messageId = m.key.id
  
  if (chat.antiPoll && messageType === 'pollCreationMessageV3') {
    if (isAdmin || !isBotAdmin) { 
    } else {
      return this.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: messageId, participant: participant } })
    }
    return true
  }

  return true
}

export default handler