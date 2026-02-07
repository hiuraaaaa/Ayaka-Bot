import axios from "axios";
import crypto from "crypto";

async function juliabot(input) {
  try {
    const url = "https://core.juliabot.com/api/v1/bot/JuliabotChat/";
    const data = {
      new_chat: true,
      message: input,
      include_search: false,
      language: "en",
      type: "chatAssistant"
    };
    const headers = {
      "sec-ch-ua-platform": "Android",
      "x-session-key": crypto.randomUUID(),
      "user-agent":
        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36",
      "sec-ch-ua": `"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"`,
      "content-type": "application/json",
      "sec-ch-ua-mobile": "?1",
      accept: "*/*",
      origin: "https://ai.juliabot.com",
      "sec-fetch-site": "same-site",
      "sec-fetch-mode": "cors",
      "sec-fetch-dest": "empty",
      referer: "https://ai.juliabot.com/",
      "accept-language": "id,en-US;q=0.9,en;q=0.8,zh-CN;q=0.7,zh;q=0.6",
      priority: "u=1, i"
    };
    const response = await axios.post(url, data, { headers });
    return response.data.data.aiResponse;
  } catch (error) {
    return `❌ Error: ${error.message}`;
  }
}

let handler = async (m, { conn, text }) => {
  if (!text) throw `Contoh: .juliabot hai`;

  await conn.sendMessage(m.chat, {
    react: {
      text: "⏳",
      key: m.key
    }
  });

  let reply = await juliabot(text);
  await m.reply(reply);

  await conn.sendMessage(m.chat, {
    react: {
      text: "✅",
      key: m.key
    }
  });
};

handler.help = ["juliabot <teks>"];
handler.tags = ["ai"];
handler.command = /^juliabot$/i;

export default handler;