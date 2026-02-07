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
              text: `*Ingin Melakukan Pembayaran?*`
            },
            carouselMessage: {
              cards: [
                {
                  header: proto.Message.InteractiveMessage.Header.create({
                    ...(await prepareWAMessageMedia({ image: {url:'https://c.termai.cc/a78/aeZcaJh.jpg'} }, { upload: conn.waUploadToServer })),
                    title: '',
                    gifPlayback: true,
                    subtitle: author,
                    hasMediaAttachment: false
                  }),
                  body: { text: `✨ *Furina Menerima Berbagai Metode Pembayaran!* ✨  
> 💳 *Dana* : 083870750111
> 💸 *Gopay* : 083870750111
> 🏦 *Transfer Bank*  
> 📲 *QRIS (semua e-wallet)*  
> 🛍️ *Pembayaran Otomatis 24 Jam*  
> ✅ *Konfirmasi Otomatis & Manual*` },
                  nativeFlowMessage: {
                    buttons: [
								{
									"name": "cta_url",
									"buttonParamsJson": `{"display_text":"Bayar Sekarang","url":"https://wa.me/18254873441","merchant_url":"https://wa.me/18254873441"}`
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
                  body: { text: `❓ *Bingung Cara Pembayaran? Kami Siap Bantu!* 

> 📝 *_CATATAN:_*  
> - Hubungi owner untuk panduan pembayaran  
> - Kirim bukti transfer (jika manual)  
> - Atau klik tombol di bawah untuk chat langsung!` },
                  nativeFlowMessage: {
                    buttons: [
								{
									"name": "cta_url",
									"buttonParamsJson": `{"display_text":"Hubungi Owner","url":"https://wa.me/18254873441","merchant_url":"https://wa.me/18254873441"}`
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
                  body: { text: `⚠️ *Konfirmasi & Aktivasi Cepat!* ⚠️  
> ⏱️ Aktivasi kurang dari 5 menit  
> ✨ Bot langsung aktif dan bisa digunakan  
> 🔧 Layanan support full 24 jam!` },
                  nativeFlowMessage: {
                    buttons: [
								{
									"name": "cta_url",
									"buttonParamsJson": `{"display_text":"Konfirmasi Pembayaran","url":"https://wa.me/18254873441","merchant_url":"https://wa.me/18254873441"}`
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

handler.help = ['payment'];
handler.tags = ['main'];
handler.command = /^(payment|pay)$/i;
handler.private = false;

export default handler;