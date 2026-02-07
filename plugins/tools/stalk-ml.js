import axios from 'axios';

const getToken = async (url) => {
  try {
    const response = await axios.get(url);
    const cookies = response.headers["set-cookie"];
    const joinedCookies = cookies ? cookies.join("; ") : null;

    const csrfTokenMatch = response.data.match(/<meta name="csrf-token" content="(.*?)">/);
    const csrfToken = csrfTokenMatch ? csrfTokenMatch[1] : null;

    if (!csrfToken || !joinedCookies) {
      throw new Error("Gagal mendapatkan CSRF token atau cookie.");
    }

    return { csrfToken, joinedCookies };
  } catch (error) {
    console.error("❌ Error fetching cookies or CSRF token:", error.message);
    throw error;
  }
};

const mlStalk = async (userId, zoneId) => {
  try {
    const { csrfToken, joinedCookies } = await getToken("https://www.gempaytopup.com");

    const payload = {
      uid: userId,
      zone: zoneId,
    };

    const { data } = await axios.post(
      "https://www.gempaytopup.com/stalk-ml",
      payload,
      {
        headers: {
          "X-CSRF-Token": csrfToken,
          "Content-Type": "application/json",
          Cookie: joinedCookies,
        },
      }
    );

    return data;
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("Response:", error.response?.data || "No response data");
  }
};

let handler = async (m, {
  conn,
  args,
  text,
  usedPrefix,
  command
}) => {
  if (!text) return m.reply('Masukkan ID dan zona (contoh: 696964467 8770)');
  await m.reply(wait);
  const [id, zona] = text.split(' ');
  if (!id || !zona) return m.reply('Masukkan ID dan zona yang benar');
   mlStalk(id, zona).then(stalk => {
   const username = stalk.username;
   const region = stalk.region;
   m.reply(`✨ *🎮 Mobile Legends Player Info* ✨  
👤 *Username:* ${username}  
🌍 *Wilayah:* ${region}  
🆔 *User ID:* ${id}  
🔢 *Zone ID:* ${zona}  
✅ *Pencarian Berhasil!* 🎉
`);
}).catch(err => m.reply('Gagal mencari id'));
}

handler.command = handler.help = ['stalkml']
handler.tags = ['internet']
handler.limit = true

export default handler;