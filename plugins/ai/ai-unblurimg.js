import axios from "axios";
import FormData from "form-data";
import crypto from "crypto";
import uploadImage from "../lib/uploadImage.js";

async function unblur(imageBuffer) {
  const randomFileName = crypto.randomBytes(8).toString("hex") + ".jpg";
  const form = new FormData();
  form.append("original_image_file", imageBuffer, randomFileName);

  const uploadResponse = await axios.post(
    "https://api.unblurimage.ai/api/imgupscaler/v2/ai-image-unblur/create-job",
    form,
    {
      headers: {
        ...form.getHeaders(),
        "sec-ch-ua-platform": "Android",
        authorization: "",
        "product-serial": "934359e62f07d8d6ab6b09fb162db2c9",
        "user-agent":
          "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36",
        "sec-ch-ua":
          '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
        "sec-ch-ua-mobile": "?1",
        accept: "*/*",
        origin: "https://unblurimage.ai",
        "sec-fetch-site": "same-site",
        "sec-fetch-mode": "cors",
        "sec-fetch-dest": "empty",
        referer: "https://unblurimage.ai/",
        "accept-language":
          "id,en-US;q=0.9,en;q=0.8,zh-CN;q=0.7,zh;q=0.6",
        priority: "u=1, i",
      },
    }
  );

  const jobId = uploadResponse.data.result.job_id;

  let outputUrl = null;
  while (!outputUrl) {
    const response = await axios.get(
      `https://api.unblurimage.ai/api/imgupscaler/v2/ai-image-unblur/get-job/${jobId}`,
      {
        headers: {
          "sec-ch-ua-platform": "Android",
          authorization: "",
          "product-serial": "934359e62f07d8d6ab6b09fb162db2c9",
          "user-agent":
            "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36",
          "sec-ch-ua":
            '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
          "sec-ch-ua-mobile": "?1",
          accept: "*/*",
          origin: "https://unblurimage.ai",
          "sec-fetch-site": "same-site",
          "sec-fetch-mode": "cors",
          "sec-fetch-dest": "empty",
          referer: "https://unblurimage.ai/",
          "accept-language":
            "id,en-US;q=0.9,en;q=0.8,zh-CN;q=0.7,zh;q=0.6",
          priority: "u=1, i",
        },
      }
    );

    const data = response.data;
    if (data.result && data.result.output_url && data.result.output_url.length > 0) {
      outputUrl = data.result.output_url[0];
    } else {
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }

  return outputUrl;
}

let handler = async (m, { conn }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || "";
  if (!mime || !mime.startsWith("image/"))
    throw `Reply/Kirim gambar dengan caption *.unblur*`;
    
  await conn.sendMessage(m.chat, { react: { text: "🎀", key: m.key } });

  let img = await q.download();
  let imageUrl = await uploadImage(img);

  let resultUrl = await unblur(img);

  await conn.sendFile(m.chat, resultUrl, "unblur.jpg", "Hasil unblur selesai!", m);

  await conn.sendMessage(m.chat, { react: { text: "🫧", key: m.key } });
};

handler.help = ["unblur"];
handler.tags = ["ai", "tools"];
handler.command = /^unblur$/i;
handler.limit = 5;
handler.register = true;

export default handler;