import axios from "axios"

let saa = async (m, { conn, text, usedPrefix, command }) => {
  if (!text)
    return m.reply(
      `🚨 *Masukkan ID Free Fire kamu!*\n\nContoh:\n${usedPrefix + command} idmu`
    )

  try {
    const params = new URLSearchParams(
      Object.entries({
        productId: "3",
        itemId: "353",
        catalogId: "376",
        paymentId: "1252",
        gameId: text,
        product_ref: "CMS",
        product_ref_denom: "REG",
      })
    )

    const response = await axios.post(
      "https://api.duniagames.co.id/api/transaction/v1/top-up/inquiry/store",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Referer: "https://www.duniagames.co.id/",
          Accept: "application/json",
        },
      }
    )

    const nickname = response.data?.data?.gameDetail?.userName
    if (!nickname) throw new Error("Nickname tidak ditemukan")

    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } })
    m.reply(`🎮 *Free Fire Stalker*\n\n🆔 ID: ${text}\n👤 Nickname: *${nickname}*`)
  } catch {
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } })
    m.reply(`❌ *User ID tidak ditemukan!*`)
  }
}

saa.help = ['stalkff <uid>']
saa.tags = ['tools', 'internet']
saa.command = /^(stalkff|stalkfreefire)$/i
saa.limit = 2
saa.register = true

export default saa