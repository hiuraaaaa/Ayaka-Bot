export async function before(m, { conn }) {
  let chat = global.db.data.chats[m.chat];

  // Pastikan fitur antiBot diaktifkan
  if (chat?.antiBot) {
    // Jika pesan berasal dari bot (Baileys) dan bukan dari bot sendiri
    if (m.isBaileys && m.sender !== conn.user.id) {
      await conn.sendMessage(m.chat, {  
        text: "Bot Terdeteksi!",  
      }, { quoted: m });

      // Hapus bot lain dari grup
      await conn.groupParticipantsUpdate(m.chat, [m.sender], "remove");
    }
  }
}