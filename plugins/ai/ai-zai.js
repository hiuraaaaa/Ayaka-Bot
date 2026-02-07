import axios from "axios"
import { v4 as uuidv4 } from "uuid"

async function ZaiAI(question, { model = "glm-4.5", system_prompt = null, search = false } = {}) {
  try {
    const _model = {
      "glm-4.5": "0727-360B-API",
      "glm-4.5-air": "0727-106B-API",
      "glm-4-32b": "main_chat",
      "glm-4.1v-9b-thinking": "GLM-4.1V-Thinking-FlashX",
      "z1-rumination": "deep-research",
      "z1-32b": "zero",
      "glm-4-flash": "glm-4-flash",
    }

    if (!question) throw new Error("Pertanyaan kosong")
    if (!_model[model]) throw new Error(`Model tersedia: ${Object.keys(_model).join(", ")}`)

    const ponta = await axios.get("https://chat.z.ai/api/v1/auths/")

    const { data } = await axios.post(
      "https://chat.z.ai/api/chat/completions",
      {
        messages: [
          ...(system_prompt
            ? [{ role: "system", content: system_prompt }]
            : []),
          { role: "user", content: question },
        ],
        ...(search ? { mcp_servers: ["deep-web-search"] } : {}),
        model: _model[model],
        chat_id: "local",
        id: uuidv4(),
        stream: true,
      },
      {
        headers: {
          authorization: `Bearer ${ponta.data.token}`,
          cookie: ponta.headers["set-cookie"].join("; "),
          "x-fe-version": "prod-fe-1.0.52",
        },
      }
    )

    let answer = data
      .split("\n\n")
      .filter((line) => line.startsWith("data: "))
      .map((line) => JSON.parse(line.substring(6)))
      .filter((line) => line?.data?.phase !== "thinking")
      .map((line) => line?.data?.delta_content || "")
      .join("")

    return answer || "⚠️ Tidak ada respon dari Zai"
  } catch (err) {
    console.error(err.response?.data || err.message)
    throw new Error("Gagal mengambil jawaban dari Zai")
  }
}

let zai = async (m, { text, usedPrefix, command, conn }) => {
  if (!text) return m.reply(`${usedPrefix + command} <pertanyaan>`)
  await conn.sendMessage(m.chat, { react: { text: "✳️", key: m.key } })
  try {
    const reply = await ZaiAI(text)
    await conn.sendMessage(m.chat, { text: reply }, { quoted: m })
  } catch (e) {
    await m.reply("❌ Gagal mengambil jawaban dari Zai.")
  }
  await conn.sendMessage(m.chat, { react: { text: "", key: m.key } })
}

zai.help = ["zai"]
zai.tags = ["ai"]
zai.command = /^(zai)$/i
zai.limit = 3
zai.register = true

export default zai