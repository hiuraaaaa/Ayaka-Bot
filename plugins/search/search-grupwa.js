import axios from "axios"
import cheerio from "cheerio"

async function searchGroups(keywords = "") {
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "Referer": "https://groupda1.link/add/group/search",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept": "text/html, */*; q=0.01",
    "Host": "groupda1.link",
    "Origin": "https://groupda1.link",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  }

  const results = []
  const keywordList = keywords.split(",")

  for (const name of keywordList) {
    const keyword = name.trim()
    let loop_count = 0

    while (loop_count < 3) {
      const data = new URLSearchParams({
        group_no: `${loop_count}`,
        search: true,
        keyword: keyword,
        category: "Any Category",
        country: "Indonesia",
        language: "Bahasa Apa Pun",
      })

      let response

      try {
        response = await axios.post(
          "https://groupda1.link/add/group/loadresult",
          data.toString(),
          { headers, timeout: 8000 }
        )
      } catch (e) {
        console.log("Scraper Error:", e.message)
        break
      }

      const html = response.data
      if (!html || html.length === 0) break

      const $ = cheerio.load(html)
      let found = false

      for (const maindiv of $(".maindiv").toArray()) {
        const tag = $(maindiv).find("a[href]")
        if (!tag.length) continue

        const link = tag.attr("href")
        const title = tag
          .attr("title")
          ?.replace("Whatsapp group invite link: ", "")
          ?.trim()

        const description =
          $(maindiv).find("p.descri").text().trim() || "Tidak ada deskripsi"

        const group_id = link.split("/").pop()
        const group_link = `https://chat.whatsapp.com/${group_id}`

        if (!results.some((g) => g.Code === group_id)) {
          results.push({
            Name: title,
            Code: group_id,
            Link: group_link,
            Description: description,
            Keyword: keyword,
          })
          found = true
        }
      }

      if (!found) break
      loop_count++
    }
  }

  return results
}

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply("❗ Masukkan keyword!\nContoh: *.carigrup anime*")

  await m.reply("🔍 *Sedang mencari grup... Mohon tunggu.*")

  let hasil

  try {
    hasil = await Promise.race([
      searchGroups(text),
      new Promise((res) =>
        setTimeout(() => res("timeout"), 15000)
      ),
    ])
  } catch {
    return m.reply("❌ Terjadi kesalahan pada scraper!")
  }

  if (hasil === "timeout") {
    return m.reply("⏳ Scraper terlalu lama merespon, coba ulangi.")
  }

  if (!hasil.length) {
    return m.reply(`❌ Tidak ada grup ditemukan untuk keyword *${text}*`)
  }

  let cap = `*Hasil Pencarian Grup WhatsApp*\nKeyword: *${text}*\n\n`

  hasil.forEach((g, i) => {
    cap += `*${i + 1}. ${g.Name}*\n`
    cap += `🔗 Link: ${g.Link}\n`
    cap += `📌 Deskripsi: ${g.Description}\n\n`
  })

  m.reply(cap)
}

handler.tags = ['internet', 'search']
handler.help = handler.command = ["carigrup", "carigroup", "findgroup"]
handler.limit = 5;

export default handler