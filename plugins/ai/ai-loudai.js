import fetch from "node-fetch"

let handler = async (m, { conn, args }) => {
  const inputText = args.length ? args.join(" ") : m.quoted?.text || m.quoted?.caption || m.quoted?.description || null
  if (!inputText) return await m.reply("Teksnya mana?")
  await m.reply(wait)

  const answer = await AcloudAi({ messages: [{ role: "user", content: inputText }] })
  if (answer.success) await conn.reply(m.chat, answer.answer, m)
  else await m.reply("Terjadi kesalahan dalam mendapatkan respon.")
}

handler.help = ["acloudai"]
handler.tags = ["ai"]
handler.command = /^(acloudai)$/i
handler.register = true;
handler.limit = 1;

export default handler

async function AcloudAi(options) {
  const payload = {
    model: "gemini-pro",
    messages: options?.messages,
    temperature: options?.temperature || 0.9,
    top_p: options?.top_p || 0.7,
    top_k: options?.top_k || 40
  }

  if (!payload.messages || !Array.isArray(payload.messages)) {
    return { success: false, errors: ["Invalid messages input payload!"] }
  }

  try {
    const response = await fetch("https://api.acloudapp.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "sk-gWT73FLyMiHwG24X70D1002302364f9c826368779b640fC3"
      },
      body: JSON.stringify(payload)
    })
    const data = await response.json()
    if (!data.choices[0]?.message?.content) throw new Error("Failed to get response message!")

    return { success: true, answer: data.choices[0].message.content }
  } catch (e) {
    return { success: false, errors: [e.message] }
  }
}