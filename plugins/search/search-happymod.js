// ================== IMPORT ================== //
import axios from "axios";
import * as cheerio from "cheerio";
import fetch from "node-fetch";

const BASE_URL = "https://id.happymod.cloud";

async function downloadBuffer(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buff = await res.arrayBuffer();
    return Buffer.from(buff);
  } catch {
    return null;
  }
}

// ================== SCRAPER ================== //

/**
 * Search HappyMod (scraper asli)
 */
export async function searchHappyMod(query) {
  try {
    const payload = new URLSearchParams({ q: query });

    const { data } = await axios.post(`${BASE_URL}/search.html`, payload, {
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "origin": BASE_URL,
        "referer": `${BASE_URL}/`,
        "user-agent":
          "Mozilla/5.0 (Linux; Android 13; TECNO LH7n) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Mobile Safari/537.36",
        "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
      },
    });

    const $ = cheerio.load(data);
    const results = [];

    $("ul.list li.list-item").each((_, el) => {
      const box = $(el).find("a.list-box");
      const title = box.find(".list-info-title").text().trim();
      const href = box.attr("href");
      const link = href?.startsWith("http") ? href : BASE_URL + href;

      const img =
        box.find(".list-icon img").attr("data-src") ||
        box.find(".list-icon img").attr("src");

      const info1 = box.find(".list-info-text").first().find("span");
      const version = info1.eq(0).text().trim() || "-";
      const size = info1.eq(2).text().trim() || "-";

      const mod = box.find(".list-info-text").eq(1).find("span").text().trim() || "-";

      results.push({ title, version, size, mod, img, link });
    });

    return results;
  } catch {
    return [];
  }
}

/**
 * Detail dari halaman APK
 */
export async function happymodDetail(url) {
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);

  const name = $("h1").text().trim();
  const thumbnail = $("img.cover").attr("src");

  const version = $("div.info div:contains('Version')").next().text().trim() || "-";
  const size = $("div.info div:contains('Size')").next().text().trim() || "-";

  const download = $("a.download-btn").attr("href");

  return { name, thumbnail, version, size, download };
}

// ================== HANDLER ================== //

let handler = async (m, { conn, command, args }) => {
  const sub = args[0];

  // =====================================================
  // =============== SEARCH ===============================
  // =====================================================
  if (sub === "search") {
    const query = args.slice(1).join(" ");
    if (!query) return m.reply("Masukkan nama aplikasi!\nContoh: `.happymod search minecraft`");

    m.reply("🔍 Mencari di HappyMod...");

    const results = await searchHappyMod(query);
    if (!results.length) return m.reply("Tidak ditemukan.");

    const rows = results.slice(0, 12).map((item) => ({
      header: "HappyMod",
      title: item.title,
      description: `${item.version} • ${item.size}\nMOD: ${item.mod}`,
      id: `.happymod detail ${item.link}`,
    }));

    await conn.sendMessage(
      m.chat,
      {
        text: `🎯 *Hasil Pencarian:* ${query}`,
        footer: "Pilih salah satu untuk melihat detail",
        buttons: [
          {
            buttonId: "id1",
            buttonText: { displayText: "📚 Lihat Daftar" },
            type: 4,
            nativeFlowInfo: {
              name: "single_select",
              paramsJson: JSON.stringify({
                title: "Hasil HappyMod",
                sections: [
                  {
                    title: "Daftar Aplikasi",
                    highlight_label: "HappyMod",
                    rows,
                  },
                ],
              }),
            },
          },
        ],
        headerType: 1,
        viewOnce: true,
      },
      { quoted: m }
    );

    return;
  }

  // =====================================================
  // ================= DETAIL ============================
  // =====================================================
  if (sub === "detail") {
    const url = args[1];
    if (!url) return m.reply("URL tidak valid!");

    m.reply("📦 Mengambil detail...");

    const data = await happymodDetail(url);
    if (!data) return m.reply("Gagal mengambil detail!");

    const caption =
      `*📦 DETAIL APLIKASI*\n\n` +
      `*Nama:* ${data.name}\n` +
      `*Version:* ${data.version}\n` +
      `*Size:* ${data.size}\n`;

    const thumb = await downloadBuffer(data.thumbnail);

    await conn.sendMessage(
      m.chat,
      {
        image: thumb || undefined,
        caption,
        buttons: [
          {
            name: "quick_reply",
            buttonParamsJson: JSON.stringify({
              display_text: "📥 Download APK",
              id: `.happymod download ${data.download}`,
            }),
          },
        ],
      },
      { quoted: m }
    );

    return;
  }

  // =====================================================
  // ================= DOWNLOAD ==========================
  // =====================================================
  if (sub === "download") {
    const url = args[1];
    if (!url) return m.reply("Link download tidak ditemukan!");

    m.reply("⏳ Downloading…");

    try {
      const buff = await downloadBuffer(url);
      if (!buff) return m.reply("Gagal download file.");

      if (!url.endsWith(".apk")) return m.reply("❌ File bukan .apk");

      await conn.sendMessage(
        m.chat,
        {
          document: buff,
          fileName: "happymod.apk",
          mimetype: "application/vnd.android.package-archive",
          caption: "📥 _Download Berhasil_",
        },
        { quoted: m }
      );
    } catch {
      return m.reply("Gagal mengirim file!");
    }

    return;
  }

  // =====================================================
  // ================= HELP ==============================
  // =====================================================
  m.reply("Gunakan:\n.happymod search <query>\n.happymod detail <url>\n.happymod download <url>");
};

handler.command = ["happymod"];
handler.tags = ["search"];
handler.help = ["happymod search", "happymod detail", "happymod download"];

export default handler;