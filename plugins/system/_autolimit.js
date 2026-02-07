async function checkLimitChange(m, conn, user, oldLimit) {
  if (user.limit < oldLimit) {
    await conn.sendMessage(m.chat, {
      text: `🔔 *Limit Kamu Berkurang!*\n📉 Sisa Limit: *${user.limit}*`,
      mentions: [m.sender]
    }, { quoted: m })
  }
}