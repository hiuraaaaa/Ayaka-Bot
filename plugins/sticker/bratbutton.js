// brat.mjs — plugin ESM

var handler = async (m, { conn, args, text, usedPrefix, command }) => {

  // 🎯 Pesan kontak sebagai quoted
  const fkontak = {
    key: { 
      participant: '0@s.whatsapp.net', 
      remoteJid: 'status@broadcast' 
    },
    message: {
      contactMessage: {
        displayName: "Brat Menu 💫",
        vcard: `
BEGIN:VCARD
VERSION:3.0
N:Brat;Menu;;;
FN:Brat Menu
END:VCARD
        `.trim()
      }
    }
  }

  if (!text) throw `⚠️ Masukkan teks setelah perintah!\n\nContoh:\n${usedPrefix + command} Halo Bang`

  // 📦 Struktur menu pilihan Brat
  const params = {
    title: '✨ Pilih Mode Brat',
    sections: [
      {
        title: "🔥 List Mode Brat",
        highlight_label: "🧠 Brat System v2",
        rows: [
          { title: "🖼️ Brat Image", description: "Mode Image", id: `.bratimg ${text}` },
          { title: "🖼️✨ Brat Image No BG", description: "Tanpa Background", id: `.bratimgnobg ${text}` },
          { title: "🎥 Brat Video", description: "Mode Video Output", id: `.bratvid ${text}` },
          { title: "🖼️🔍 Brat HD", description: "Image High Quality", id: `.brathd ${text}` },
          { title: "🖼️💎 Brat HD No BG", description: "HD Tanpa Background", id: `.brathdnobg ${text}` },
          { title: "🌸 Brat Anime", description: "Anime Style", id: `.animebrat ${text}` },
          { title: "🌸✨ Brat Anime v2", description: "Anime Style V2", id: `.animebrat2 ${text}` },
          { title: "👧 Brat Cewek", description: "Girl Style", id: `.cewekbrat ${text}` }
        ]
      }
    ]
  }

  // 🔘 Button Reply + Native Flow
  await conn.sendMessage(
    m.chat,
    {
      text: '🎀 *Hai Kak!* Silakan pilih tipe *Brat Mode* yang kamu mau.\nKlik tombol di bawah ya! 👇',
      footer: `© 2025 ${global.namebot} • Brat System`,
      buttons: [
        {
          buttonId: 'open_brat',
          buttonText: { displayText: '🚪 Buka Pilihan Brat' },
          type: 4,
          nativeFlowInfo: {
            name: 'single_select',
            paramsJson: JSON.stringify(params)
          }
        }
      ],
      headerType: 1,
      viewOnce: true
    },
    { quoted: fkontak }
  )
}

handler.command = ['brat']
handler.tags = ['sticker']
handler.help = ['brat <teks>']
handler.register = true

export default handler