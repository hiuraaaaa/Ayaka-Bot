import axios from "axios";

let handler = async (m, { conn, args }) => {
  const text = args.length >= 1 ? args.join(" ") : m.quoted?.text || m.quoted?.caption || m.quoted?.description || null;
  if (!text) return await m.reply("Masukkan teks");

  try {
    // Memberikan notifikasi bahwa pencarian dimulai
    await m.reply("🔍 Sedang mencari jawaban...");

    // Variasi kecil pada prompt agar hasilnya berbeda
    const variations = [
      `${text} - Detail lebih lanjut`,
      `${text} - Fakta tambahan`,
      `${text} - Kesimpulan singkat`
    ];

    // Panggil fungsi gpt4 untuk mendapatkan 3 hasil berbeda
    const responses = await Promise.all(variations.map(variation => gpt4(variation)));

    // Gabungkan tiga hasil dan kirimkan sebagai balasan
    const finalResponse = responses.map((res, i) => `Hasil ${i + 1}:\n${res.response}`).join("\n\n");

    // Memberikan notifikasi bahwa pencarian selesai
    await m.reply("✅ Jawaban telah ditemukan:\n\n" + finalResponse);
  } catch (e) {
    // Memberikan notifikasi jika terjadi kesalahan
    await m.reply("❌ Terjadi kesalahan: " + e.message);
  }
}

handler.help = ["questionai"];
handler.tags = ["ai"];
handler.command = /^(questionai)$/i;

export default handler;

async function gpt4(prompt) {
  try {
    const token = Math.random().toString(32).substring(2);
    const d = process.hrtime();

    await axios.post("https://thobuiq-gpt-4o.hf.space/run/predict?__theme=light", {
      data: [{ text: prompt, files: [] }],
      event_data: null,
      fn_index: 3,
      session_hash: token,
      trigger_id: 18,
    }, {
      headers: {
        Origin: "https://thobuiq-gpt-4o.hf.space",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
      },
    });

    await axios.post("https://thobuiq-gpt-4o.hf.space/queue/join?__theme=light", {
      data: [null, null, "idefics2-8b-chatty", "Greedy", 0.7, 4096, 1, 0.9],
      event_data: null,
      fn_index: 5,
      session_hash: token,
      trigger_id: 18,
    }, {
      headers: {
        Origin: "https://thobuiq-gpt-4o.hf.space",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
      },
    });

    const stream = await axios.get("https://thobuiq-gpt-4o.hf.space/queue/data?" +
      new URLSearchParams({
        session_hash: token,
      }), {
      headers: {
        Accept: "text/event-stream",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
      },
      responseType: "stream",
    });

    return new Promise((resolve, reject) => {
      stream.data.on("data", (chunk) => {
        const data = JSON.parse(chunk.toString().split("data: ")[1]);
        if (data.msg === "process_completed") {
          const stop = process.hrtime(d);
          const r = data.output.data[0][0][1] || "";
          if (!r) return reject(new Error("Gagal mendapatkan respons"));
          resolve({
            prompt,
            response: r,
            duration: stop[0] + " s",
          });
        }
      });
    });
  } catch (e) {
    throw e;
  }
}