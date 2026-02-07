import fetch from "node-fetch";
import crypto from "crypto";
import { FormData, Blob } from "formdata-node";
import { fileTypeFromBuffer } from "file-type";
const { generateWAMessageFromContent, proto, prepareWAMessageMedia } = (await import("@adiwajshing/baileys")).default

const Lann4you = async (m, { conn }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || "";
    if (!mime) return m.reply("No media found");
    
    await conn.sendMessage(m.chat, { react: { text: '✈️', key: m.key } });
    
    let media = await q.download();
    let link = await catbox(media);
    const { ext, mime: detectedMime } = await fileTypeFromBuffer(media) || { ext: 'unknown', mime: 'unknown' };

    let caption = `*\`T O U R L\`*\n
🎁 *L I N K:*   Klik Button
☘️ *S I Z E:*   ${formatBytes(media.length)}
🍁 *T Y P E:*   ${detectedMime} (.${ext})`;

    let buttonMessage = generateWAMessageFromContent(
    m.chat,
    {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            body: {
              text: `*Selesai kak silahkan di copy*`
            },
            carouselMessage: {
              cards: [
                {
                  header: proto.Message.InteractiveMessage.Header.create({
                    ...(await prepareWAMessageMedia({ image: {url:'https://files.catbox.moe/49g65u.jpg'} }, { upload: conn.waUploadToServer })),
                    title: '',
                    gifPlayback: true,
                    subtitle: global.wm,
                    hasMediaAttachment: false
                  }),
                  body: { text: caption },
                  nativeFlowMessage: {
                    buttons: [
                  {
                    "name": "cta_copy",
                    "buttonParamsJson": `{\"display_text\":\"Click to get link\",\"id\":\"123456789\",\"copy_code\":\"${link}\"}`
                  },
                ],
                  },
                },
                ],
				messageVersion: 1,		
			    },
			     },
        },
      },
    },
    { quoted:m }
  );

    await conn.relayMessage(m.chat, buttonMessage.message, {});
}

Lann4you.command = ['tourlv2', 'tolinkv2'];
Lann4you.tags = ['tools'];
Lann4you.limit = true;
export default Lann4you;

function formatBytes(bytes) {
    if (bytes === 0) return "0 B";
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`;
}

async function catbox(content) {
    const { ext, mime } = await fileTypeFromBuffer(content) || {};
    const blob = new Blob([content.toArrayBuffer()], { type: mime });
    const formData = new FormData();
    const randomBytes = crypto.randomBytes(5).toString("hex");
    formData.append("reqtype", "fileupload");
    formData.append("fileToUpload", blob, randomBytes + "." + ext);

    const response = await fetch("https://catbox.moe/user/api.php", {
        method: "POST",
        body: formData,
    });

    return await response.text();
}