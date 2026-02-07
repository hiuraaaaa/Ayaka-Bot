const { generateWAMessageContent, generateWAMessageFromContent, prepareWAMessageMedia, proto } = (await import('@adiwajshing/baileys')).default;

const handler = async (m, { conn }) => {
 
  const url = `${global.thumbmenu}`;
  async function image(url) {
    const { imageMessage } = await generateWAMessageContent({
      image: { url }
    }, {
      upload: conn.waUploadToServer
    });
    return imageMessage;
  }

  let msg = generateWAMessageFromContent(
    m.chat,
    {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            body: {
              text: `*Mau tau tentang Furina?*`
            },
            carouselMessage: {
              cards: [
                {
                  header: proto.Message.InteractiveMessage.Header.create({
                    ...(await prepareWAMessageMedia({ image: {url:`${global.thumbmenu}`} }, { upload: conn.waUploadToServer })),
                    title: '',
                    gifPlayback: true,
                    subtitle: author,
                    hasMediaAttachment: false
                  }),
                  body: { text: `✨ *Furina Punya 1000+ Fitur Keren! Ini Dia:* ✨  
> 📥 *Menu Download*  
> 🛒 *Menu Store*  
> 👥 *Menu Group*  
> 🛠️ *Menu Tools & Maker*  
> 🎮 *Menu Rpg & Game*  
> 🤖 *Menu AI*  
> 🎉 *Dan masih banyak menu menarik lainnya!* 💥` },
                  nativeFlowMessage: {
                    buttons: [
								{
									"name": "cta_url",
									"buttonParamsJson": `{"display_text":"Chat Owner","url":"https://wa.me/18254873441","merchant_url":"https://wa.me/18254873441"}`
								},
							],
                  },
                },
                {
                  header: proto.Message.InteractiveMessage.Header.create({
                    ...(await prepareWAMessageMedia({ image: {url:`${global.thumbmenu}`} }, { upload: conn.waUploadToServer })),
                    title: '',
                    gifPlayback: true,
                    subtitle: author,
                    hasMediaAttachment: false
                  }),
                  body: { text: `🎀 𝗟𝗜𝗦𝗧 𝗦𝗘𝗪𝗔 *Furina* 🎀

•🛒 1 Minggu = Rp.5.000
•🛒 2 Minggu = Rp.10.000
•🛒 1 Bulan = Rp.15.000
•🛒 3 Bulan = Rp.30.000
•🛒 8 Bulan = Rp.50.000
•🛒 Permanent = Rp.200.000` },
                  nativeFlowMessage: {
                    buttons: [
								{
									"name": "cta_url",
									"buttonParamsJson": `{"display_text":"Sewa Disini","url":"https://wa.me/18254873441","merchant_url":"https://wa.me/18254873441"}`
								},
							],
                  },
                },
                {
                  header: proto.Message.InteractiveMessage.Header.create({
                    ...(await prepareWAMessageMedia({ image: {url:`${global.thumbmenu}`} }, { upload: conn.waUploadToServer })),
                    title: '',
                    gifPlayback: true,
                    subtitle: author,
                    hasMediaAttachment: false
                  }),
                  body: { text: `🚀 *Punya Ide untuk Fitur Baru? Kami Buka untuk Request!* 🚀  

> 📝 *_CATATAN:_*  
> 👉 Kamu bisa request fitur apa saja, asal sesuai kebutuhanmu! Mari kita buat Furina semakin hebat bersama! 💡✨` },
                  nativeFlowMessage: {
                    buttons: [
								{
									"name": "cta_url",
									"buttonParamsJson": `{"display_text":"Request Fitur","url":"https://wa.me/18254873441","merchant_url":"https://wa.me/18254873441"}`
								},
							],
                  },
                },
                {
                  header: proto.Message.InteractiveMessage.Header.create({
                    ...(await prepareWAMessageMedia({ image: {url:`${global.thumbmenu}`} }, { upload: conn.waUploadToServer })),
                    title: '',
                    gifPlayback: true,
                    subtitle: author,
                    hasMediaAttachment: false
                  }),
                  body: { text: `🌟 *Furina Selalu Terawat dan Siap Update Fitur Setiap Hari! Jadi, kamu bisa nikmati pengalaman tanpa error dan bug!* 🌟  
> 🚨 Jika kamu menemukan error atau bug, jangan ragu untuk report, ya!  
> 🔥 Tekan tombol di bawah ini: 👇` },
                  nativeFlowMessage: {
                    buttons: [
								{
									"name": "cta_url",
									"buttonParamsJson": `{"display_text":"Report Bug","url":"https://wa.me/18254873441","merchant_url":"https://wa.me/18254873441"}`
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

  await conn.relayMessage(msg.key.remoteJid, msg.message, {
    messageId: msg.key.id,
  });
}

handler.help = ['sewabot', 'sewa'];
handler.tags = ['main'];
handler.command = /^(sewabot|sewa)$/i;
handler.private = false;

export default handler;