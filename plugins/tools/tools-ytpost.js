import axios from "axios";
import cheerio from "cheerio";

async function postYoutube(url) {
  const response = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
  });

  const $ = cheerio.load(response.data);
  const script = $("script")
    .filter((i, el) => {
      return $(el).html()?.includes("var ytInitialData =");
    })
    .first()
    .html();

  if (!script) throw new Error("❌ Gagal mengambil data YouTube post");

  const jsonStr = script
    .replace("var ytInitialData = ", "")
    .replace(/;$/, "");
  const ytInitialData = JSON.parse(jsonStr);

  const postRenderer =
    ytInitialData.contents?.twoColumnBrowseResultsRenderer?.tabs?.[0]
      ?.tabRenderer?.content?.sectionListRenderer?.contents?.[0]
      ?.itemSectionRenderer?.contents?.[0]
      ?.backstagePostThreadRenderer?.post?.backstagePostRenderer;

  const likeCount =
    postRenderer?.voteCount?.simpleText ||
    postRenderer?.voteCount?.runs?.map((r) => r.text).join("") ||
    "N/A";

  const postText =
    postRenderer?.contentText?.runs?.map((r) => r.text).join("") || "N/A";

  const extractLargestThumbnail = (thumbnails = []) => {
    if (!thumbnails.length) return null;
    const sorted = thumbnails.sort((a, b) => (b.width || 0) - (a.width || 0));
    return sorted[0]?.url || null;
  };

  let imageUrls = [];

  const multiImages =
    postRenderer?.backstageAttachment?.postMultiImageRenderer?.images || [];
  multiImages.forEach((item) => {
    const thumbs = item?.backstageImageRenderer?.image?.thumbnails;
    if (thumbs) {
      const url = extractLargestThumbnail(thumbs);
      if (url) imageUrls.push(url);
    }
  });

  if (imageUrls.length === 0) {
    const singleImage =
      postRenderer?.backstageAttachment?.backstageImageRenderer?.image
        ?.thumbnails;
    if (singleImage) {
      const url = extractLargestThumbnail(singleImage);
      if (url) imageUrls.push(url);
    }
  }

  return {
    text: postText,
    likeCount,
    images: imageUrls,
  };
}

let handler = async (m, { conn, text }) => {
  if (!text) throw `Contoh: .ytpost https://m.youtube.com/post/UgkxMgupo-vauCJ-G9uK99G3jKlhU_YCaHxj`;

  await conn.sendMessage(m.chat, {
    react: { text: "⏳", key: m.key },
  });

  try {
    let result = await postYoutube(text);

    let caption = `📺 *YouTube Post*\n\n`;
    caption += `📝 Text: ${result.text}\n`;
    caption += `👍 Likes: ${result.likeCount}\n`;

    if (result.images.length > 0) {
      await conn.sendFile(m.chat, result.images[0], "ytpost.jpg", caption, m);
    } else {
      await m.reply(caption);
    }

    await conn.sendMessage(m.chat, {
      react: { text: "✅", key: m.key },
    });
  } catch (e) {
    await conn.sendMessage(m.chat, {
      react: { text: "❌", key: m.key },
    });
    throw `❌ Gagal ambil YouTube post.\n\n${e.message}`;
  }
};

handler.help = ["ytpost <link>"];
handler.tags = ["internet", "tools"];
handler.command = /^ytpost$/i;
handler.limit = 5;
handler.register = true;

export default handler;