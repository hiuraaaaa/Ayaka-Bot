import axios from "axios";

const handler = async (m, { conn, text }) => {
  if (!text) {
    return m.reply("Masukkan judul, ide, dan slogan logo. Format: .createlogo Judul|Ide|Slogan");
  }

  const [title, idea, slogan] = text.split("|");

  if (!title || !idea || !slogan) {
    return m.reply("Format salah. Gunakan : .createlogo Judul|Ide|Slogan\n\n*Example :* .createlogo miyako|arul pedofil|Jangan lupa ewe yah");
  }

  try {
    const payload = {
      ai_icon: [333276, 333279],
      height: 300,
      idea,
      industry_index: "N",
      industry_index_id: "",
      pagesize: 4,
      session_id: "",
      slogan,
      title,
      whiteEdge: 80,
      width: 400
    };

    const { data } = await axios.post("https://www.sologo.ai/v1/api/logo/logo_generate", payload);
    
    if (!data.data.logoList || data.data.logoList.length === 0) {
      return m.reply("Gagal Membuat Logo");
    }

    const logos = data.data.logoList.slice(0, 4).map((logo, i) => ({
      image: { url: logo.logo_thumb },
      caption: `✨ Logo #${i + 1} untuk ${title.trim()}\n\nIde: ${idea.trim()}\nSlogan: "${slogan.trim()}"\n\nKesan profesional & unik langsung dari AI!`
    }));

    await conn.sendAlbumMessage(m.chat, logos);
  } catch (error) {
    console.error("Error generating logo:", error);
    await m.reply("Failed to Create Logo");
  }
};

handler.help = ['createlogo'];
handler.command = ['createlogo'];
handler.tags = ['tools'];

export default handler;