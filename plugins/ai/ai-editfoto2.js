import fetch from "node-fetch";
import fs from "fs";

const pontaEdit = async (imagePath, prompt) => {
  const image = fs.readFileSync(imagePath).toString("base64");
  const createBody = JSON.stringify({
    image: `data:image/jpeg;base64,${image}`,
    model: 1,
    prompt
  });

  const create = await fetch("https://aienhancer.ai/api/v1/r/image-enhance/create", {
    method: "POST",
    headers: {
      accept: "*/*",
      "accept-language": "id-ID",
      "content-type": "application/json",
      referer: "https://aienhancer.ai/?utm_source=toolify"
    },
    body: createBody
  });

  const { data } = await create.json();
  const taskId = data.id;

  while (true) {
    const result = await fetch("https://aienhancer.ai/api/v1/r/image-enhance/result", {
      method: "POST",
      headers: {
        accept: "*/*",
        "accept-language": "id-ID",
        "content-type": "application/json",
        referer: "https://aienhancer.ai/?utm_source=toolify"
      },
      body: JSON.stringify({ task_id: taskId })
    });

    const resData = await result.json();
    if (resData.data.status === "succeeded") return resData.data.output;
    if (resData.data.status === "failed") throw new Error(resData.data.error);
    await new Promise((r) => setTimeout(r, 3000));
  }
};

let handler = async (m, { conn, args }) => {
  try {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || "";
    if (!args.length)
      return conn.sendMessage(m.chat, { text: "⚠️ Kasih prompt dong, Senpai!" }, { quoted: m });

    if (!mime || !/image\/(jpe?g|png)/.test(mime))
      return conn.sendMessage(m.chat, { text: "📸 Kirim atau reply gambar dulu dong, Senpai~" }, { quoted: m });

    let prompt = args.join(" ");
    await conn.sendMessage(m.chat, { text: `⌛ Lagi edit fotonya yah\n🌱 Prompt: ${prompt}` }, { quoted: m });

    let buffer = await q.download();
    let tmpFile = `./tmp/edit_${Date.now()}.jpg`;
    fs.writeFileSync(tmpFile, buffer);

    let editedUrl = await pontaEdit(tmpFile, prompt);

    await conn.sendMessage(
      m.chat,
      { image: { url: editedUrl }, caption: `✅ Selesai edit!\n🌱 Prompt: ${prompt}` },
      { quoted: m }
    );

    fs.unlinkSync(tmpFile);
  } catch (e) {
    await conn.sendMessage(m.chat, { text: `❌ Error: ${e.message}` }, { quoted: m });
  }
};

handler.help = ["editfoto2 <prompt>"];
handler.tags = ["ai"];
handler.command = ["editfoto2", "editgambar2", "editimg2"];
handler.premium = true;

export default handler;