const { proto, generateWAMessageFromContent, prepareWAMessageMedia } = (await import('@adiwajshing/baileys')).default;
import uploadImage from '../lib/uploadImage.js';

async function handler(m, { conn, command, text }) {
    conn.pending = conn.pending || {}
    conn.topup = conn.topup || {}
    let proses = conn.topup[m.chat];
    let nuy = '18254873441@s.whatsapp.net'
    let waiting = conn.pending['18254873441@s.whatsapp.net'];
    if (m.isPrivate) {
    m.reply('Fitur khusus di group')
    delete conn.topup[m.chat]
    } else if (proses && m.sender === proses.buyer) {
    if (command === 'satu') {
    let cap = `\`Transaksi Pembelian:\`
* 💰 Cash: 1,500
* 🛒 Harga: Rp.1,000

\`Metode Transfer:\`
* Gopay: 083870750111
* Dana: 083870750111
* Qris: Klik Button Dibawah

\`BACA INI!\`
> Transfer sebelum 5 menit, melalui E-Wallet atau Qris, Kirim foto/screenshot bukti transfer, Lalu reply buktinya ketik: transaksi`
    let msg = generateWAMessageFromContent(m.chat, {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: {
                                deviceListMetadata: {},
                                deviceListMetadataVersion: 2
                            },
                            interactiveMessage: proto.Message.InteractiveMessage.create({
                                body: proto.Message.InteractiveMessage.Body.create({
                                    text: cap,
                                }),
                                footer: proto.Message.InteractiveMessage.Footer.create({
                                    text: "*© Rijalganzz!*"
                                }),
                                header: proto.Message.InteractiveMessage.Header.create({
                                    title: "\t[ 🛍️ *PAYMENT* ]\n",
                                    subtitle: "",
                                    hasMediaAttachment: false
                                }),
                                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                    buttons: [
                                        {
                                            name: "quick_reply",
                                            buttonParamsJson: "{\"display_text\":\"🛒 QRIS\",\"id\":\"qris\"}"
                                        },
                                        {
                                            name: "quick_reply",
                                            buttonParamsJson: "{\"display_text\":\"❔ Contoh TF\",\"id\":\"contoh\"}"
                                        },
                                    ],
                                })
                            })
                        },
                    }
                }, {});
                await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
                proses.status = 'pending'
                proses.nominal = 1000
                proses.cash = 1500
    } else if (command === 'dua') {
    let cap = `\`Transaksi Pembelian:\`
* 💰 Cash: 2,500
* 🛒 Harga: Rp.2,000

\`Metode Transfer:\`
* Gopay: 083870750111
* Dana: 083870750111
* Ovo: 083870750111
* Qris: Klik Button Dibawah

\`BACA INI!\`
> Transfer sebelum 5 menit, melalui E-Wallet atau Qris, Kirim foto/screenshot bukti transfer, Lalu reply buktinya ketik: transaksi`
    let msg = generateWAMessageFromContent(m.chat, {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: {
                                deviceListMetadata: {},
                                deviceListMetadataVersion: 2
                            },
                            interactiveMessage: proto.Message.InteractiveMessage.create({
                                body: proto.Message.InteractiveMessage.Body.create({
                                    text: cap,
                                }),
                                footer: proto.Message.InteractiveMessage.Footer.create({
                                    text: "*© Rijalganzz!*"
                                }),
                                header: proto.Message.InteractiveMessage.Header.create({
                                    title: "\t[ 🛍️ *PAYMENT* ]\n",
                                    subtitle: "",
                                    hasMediaAttachment: false
                                }),
                                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                    buttons: [
                                        {
                                            name: "quick_reply",
                                            buttonParamsJson: "{\"display_text\":\"🛒 QRIS\",\"id\":\"qris\"}"
                                        },
                                        {
                                            name: "quick_reply",
                                            buttonParamsJson: "{\"display_text\":\"❔ Contoh TF\",\"id\":\"contoh\"}"
                                        },
                                    ],
                                })
                            })
                        },
                    }
                }, {});
                await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
                proses.status = 'pending'
                proses.nominal = 2000
                proses.cash = 2500
    } else if (command === 'lima') {
    let cap = `\`Transaksi Pembelian:\`
* 💰 Cash: 6,000
* 🛒 Harga: Rp.5,000

\`Metode Transfer:\`
* Gopay: 083870750111
* Dana: 083870750111
* Ovo: 083870750111
* Qris: Klik Button Dibawah

\`BACA INI!\`
> Transfer sebelum 5 menit, melalui E-Wallet atau Qris, Kirim foto/screenshot bukti transfer, Lalu reply buktinya ketik: transaksi`
    let msg = generateWAMessageFromContent(m.chat, {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: {
                                deviceListMetadata: {},
                                deviceListMetadataVersion: 2
                            },
                            interactiveMessage: proto.Message.InteractiveMessage.create({
                                body: proto.Message.InteractiveMessage.Body.create({
                                    text: cap,
                                }),
                                footer: proto.Message.InteractiveMessage.Footer.create({
                                    text: "*© Rijalganzz!*"
                                }),
                                header: proto.Message.InteractiveMessage.Header.create({
                                    title: "\t[ 🛍️ *PAYMENT* ]\n",
                                    subtitle: "",
                                    hasMediaAttachment: false
                                }),
                                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                    buttons: [
                                        {
                                            name: "quick_reply",
                                            buttonParamsJson: "{\"display_text\":\"🛒 QRIS\",\"id\":\"qris\"}"
                                        },
                                        {
                                            name: "quick_reply",
                                            buttonParamsJson: "{\"display_text\":\"❔ Contoh TF\",\"id\":\"contoh\"}"
                                        },
                                    ],
                                })
                            })
                        },
                    }
                }, {});
                await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
                proses.status = 'pending'
                proses.nominal = 5000
                proses.cash = 6000
    } else if (command === 'sepu') {
    let cap = `\`Transaksi Pembelian:\`
* 💰 Cash: 12,000
* 🛒 Harga: Rp.10,000

\`Metode Transfer:\`
* Gopay: 083870750111
* Dana: 083870750111
* Ovo: 083870750111
* Qris: Klik Button Dibawah

\`BACA INI!\`
> Transfer sebelum 5 menit, melalui E-Wallet atau Qris, Kirim foto/screenshot bukti transfer, Lalu reply buktinya ketik: transaksi`
    let msg = generateWAMessageFromContent(m.chat, {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: {
                                deviceListMetadata: {},
                                deviceListMetadataVersion: 2
                            },
                            interactiveMessage: proto.Message.InteractiveMessage.create({
                                body: proto.Message.InteractiveMessage.Body.create({
                                    text: cap,
                                }),
                                footer: proto.Message.InteractiveMessage.Footer.create({
                                    text: "*© Rijalganzz!*"
                                }),
                                header: proto.Message.InteractiveMessage.Header.create({
                                    title: "\t[ 🛍️ *PAYMENT* ]\n",
                                    subtitle: "",
                                    hasMediaAttachment: false
                                }),
                                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                    buttons: [
                                        {
                                            name: "quick_reply",
                                            buttonParamsJson: "{\"display_text\":\"🛒 QRIS\",\"id\":\"qris\"}"
                                        },
                                        {
                                            name: "quick_reply",
                                            buttonParamsJson: "{\"display_text\":\"❔ Contoh TF\",\"id\":\"contoh\"}"
                                        },
                                    ],
                                })
                            })
                        },
                    }
                }, {});
                await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
                proses.status = 'pending'
                proses.nominal = 10000
                proses.cash = 12000
    } else if (command === 'libel') {
    let cap = `\`Transaksi Pembelian:\`
* 💰 Cash: 18,000
* 🛒 Harga: Rp.15,000

\`Metode Transfer:\`
* Gopay: 083870750111
* Dana: 083870750111
* Ovo: 083870750111
* Qris: Klik Button Dibawah

\`BACA INI!\`
> Transfer sebelum 5 menit, melalui E-Wallet atau Qris, Kirim foto/screenshot bukti transfer, Lalu reply buktinya ketik: transaksi`
    let msg = generateWAMessageFromContent(m.chat, {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: {
                                deviceListMetadata: {},
                                deviceListMetadataVersion: 2
                            },
                            interactiveMessage: proto.Message.InteractiveMessage.create({
                                body: proto.Message.InteractiveMessage.Body.create({
                                    text: cap,
                                }),
                                footer: proto.Message.InteractiveMessage.Footer.create({
                                    text: "*© Rijalganzz!*"
                                }),
                                header: proto.Message.InteractiveMessage.Header.create({
                                    title: "\t[ 🛍️ *PAYMENT* ]\n",
                                    subtitle: "",
                                    hasMediaAttachment: false
                                }),
                                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                    buttons: [
                                        {
                                            name: "quick_reply",
                                            buttonParamsJson: "{\"display_text\":\"🛒 QRIS\",\"id\":\"qris\"}"
                                        },
                                        {
                                            name: "quick_reply",
                                            buttonParamsJson: "{\"display_text\":\"❔ Contoh TF\",\"id\":\"contoh\"}"
                                        },
                                    ],
                                })
                            })
                        },
                    }
                }, {});
                await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
                proses.status = 'pending'
                proses.nominal = 15000
                proses.cash = 18000
    } else if (command === 'dupu') {
    let cap = `\`Transaksi Pembelian:\`
* 💰 Cash: 25,000
* 🛒 Harga: Rp.20,000

\`Metode Transfer:\`
* Gopay: 083870750111
* Dana: 083870750111
* Ovo: 083870750111
* Qris: Klik Button Dibawah

\`BACA INI!\`
> Transfer sebelum 5 menit, melalui E-Wallet atau Qris, Kirim foto/screenshot bukti transfer, Lalu reply buktinya ketik: transaksi`
    let msg = generateWAMessageFromContent(m.chat, {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: {
                                deviceListMetadata: {},
                                deviceListMetadataVersion: 2
                            },
                            interactiveMessage: proto.Message.InteractiveMessage.create({
                                body: proto.Message.InteractiveMessage.Body.create({
                                    text: cap,
                                }),
                                footer: proto.Message.InteractiveMessage.Footer.create({
                                    text: "*© Rijalganzz!*"
                                }),
                                header: proto.Message.InteractiveMessage.Header.create({
                                    title: "\t[ 🛍️ *PAYMENT* ]\n",
                                    subtitle: "",
                                    hasMediaAttachment: false
                                }),
                                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                    buttons: [
                                        {
                                            name: "quick_reply",
                                            buttonParamsJson: "{\"display_text\":\"🛒 QRIS\",\"id\":\"qris\"}"
                                        },
                                        {
                                            name: "quick_reply",
                                            buttonParamsJson: "{\"display_text\":\"❔ Contoh TF\",\"id\":\"contoh\"}"
                                        },
                                    ],
                                })
                            })
                        },
                    }
                }, {});
                await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
                proses.status = 'pending'
                proses.nominal = 20000
                proses.cash = 25000
         }
     }
}


handler.command = /^(satu|dua|lima|sepu|libel|dupu)/i

function getContentType(message) {
    if (!message) return null;
    if (message.buttonsResponseMessage) return 'buttonsResponseMessage';
    if (message.templateButtonReplyMessage) return 'templateButtonReplyMessage';
    if (message.viewOnceMessage) return 'viewOnceMessage';
    return null;
}

handler.all = async function (m) {
    this.pending = this.pending || {};
    this.topup = this.topup || {};
    
    const nuy = '18254873441@s.whatsapp.net';
    const waiting = this.pending[nuy];
    const proses = Object.values(this.topup).find(proses => 
        proses.status === 'pending' && 
        proses.room && 
        proses.buyer === m.sender
    );

    const contentType = getContentType(m.message);
    if (!contentType) return;

    if (proses && /^(transaksi)/i.test(m.text)) {
        let q = m.quoted ? m.quoted : m;
        let mime = (q.message || q).mimetype || '';
        if (!mime) return m.reply(`Kirim Dahulu Bukti Transaksinya, Lalu Reply Fotonya Dan Ketik *Transaksi*`);

        let img = await q.download();
        let image = await uploadImage(img);
        
        let d = new Date(Date.now() + 3600000);
        let locale = 'id';
        let time = d.toLocaleTimeString(locale, { timeZone: 'Asia/Jakarta' }).replace(/[.]/g, ':');

        await conn.reply(m.chat, `[❕] *Transaksi Di Proses*\n* 💵 Nominal: Rp.${proses.nominal.toLocaleString()}\n* 💰 Cash: ${proses.cash.toLocaleString()}\n* 🛒 Status: Pending\n_Tunggu Respon Dari Owner!_`, m);

        let pen = `*Hai Saa👋🏻❤️*
Ada transaksi pending nih, Segera Konfirmasi.

\`Pembelian\`
* 💰 Cash: ${proses.cash}
* 🛍️ Harga: ${proses.nominal}
* 🛒 Proses: Pending 🕓

\`Time Transaksi\`
* Pada Jam: ${time}`;

        let msg = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2
                    },
                    interactiveMessage: proto.Message.InteractiveMessage.create({
                        body: proto.Message.InteractiveMessage.Body.create({ text: pen }),
                        footer: proto.Message.InteractiveMessage.Footer.create({ text: "© Rijalganzz!" }),
                        header: proto.Message.InteractiveMessage.Header.create({
                            title: '\t*🛍️ TRANSAKSI PENDING*\n',
                            subtitle: "",
                            hasMediaAttachment: true,
                            ...(await prepareWAMessageMedia({ image: { url: image } }, { upload: conn.waUploadToServer }))
                        }),
                        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                            buttons: [
                                {
                                    name: "quick_reply",
                                    buttonParamsJson: JSON.stringify({
                                        display_text: "✅ Terima Transaksi",
                                        id: "sukses"
                                    })
                                },
                                {
                                    name: "quick_reply",
                                    buttonParamsJson: JSON.stringify({
                                        display_text: "❌ Tolak Transaksi",
                                        id: "tidak"
                                    })
                                }
                            ]
                        })
                    })
                }
            }
        }, {});
        
        await conn.relayMessage(nuy, msg.message, { messageId: msg.key.id });
            this.pending[nuy] = {
                status: 'pending',
                buyer: conn.topup[m.chat].buyer,
                room: conn.topup[m.chat].room,
                nominal: proses.nominal,
                cash: proses.cash,
            };
            waiting = this.pending[nuy]
            delete conn.topup[m.chat];
       } else if (contentType === 'templateButtonReplyMessage') {
        let selectedButton = m.message.templateButtonReplyMessage.selectedId;
       if (waiting) {
       if (waiting && waiting.status == 'pending') {
        if (selectedButton === 'sukses') {
        let nuy = '18254873441@s.whatsapp.net';
            let sukses;
            if (waiting.nominal === 1000) {
                sukses = `*✅ Transaksi Berhasil*\n\n*Pembelian:* 💰 Cash: 1,500\n* 🛒 Harga: Rp.1,000\n* 💭 Status Transaksi: Sukses ✓\n\n*💌 Pesan Owner:*\n\`Terimakasih Sudah Berbelanja Melalui Bot Kami\``
            } else if (waiting.nominal === 2000) {
                sukses = `*✅ Transaksi Berhasil*\n\n*Pembelian:* 💰 Cash: 2,500\n* 🛒 Harga: Rp.2,000\n* 💭 Status Transaksi: Sukses ✓\n\n*💌 Pesan Owner:*\n\`Terimakasih Sudah Berbelanja Melalui Bot Kami\``
            } else if (waiting.nominal === 5000) {
                sukses = `*✅ Transaksi Berhasil*\n\n*Pembelian:* 💰 Cash: 6,000\n* 🛒 Harga: Rp.5,000\n* 💭 Status Transaksi: Sukses ✓\n\n*💌 Pesan Owner:*\n\`Terimakasih Sudah Berbelanja Melalui Bot Kami\``
            } else if (waiting.nominal === 10000) {
                sukses = `*✅ Transaksi Berhasil*\n\n*Pembelian:* 💰 Cash: 12,000\n* 🛒 Harga: Rp.10,000\n* 💭 Status Transaksi: Sukses ✓\n\n*💌 Pesan Owner:*\n\`Terimakasih Sudah Berbelanja Melalui Bot Kami\``
            } else if (waiting.nominal === 15000) {
                sukses = `*✅ Transaksi Berhasil*\n\n*Pembelian:* 💰 Cash: 18,000\n* 🛒 Harga: Rp.15,000\n* 💭 Status Transaksi: Sukses ✓\n\n*💌 Pesan Owner:*\n\`Terimakasih Sudah Berbelanja Melalui Bot Kami\``
            } else if (waiting.nominal === 20000) {
                sukses = `*✅ Transaksi Berhasil*\n\n*Pembelian:* 💰 Cash: 25,000\n* 🛒 Harga: Rp.20,000\n* 💭 Status Transaksi: Sukses ✓\n\n*💌 Pesan Owner:*\n\`Terimakasih Sudah Berbelanja Melalui Bot Kami\``
            }
            m.reply(`✅ *Transaksi Sukses*`)
            let buyer = global.db.data.users[waiting.buyer];
            buyer.cash += waiting.cash;
            await conn.reply(waiting.room, sukses, m);
            delete conn.pending[nuy];
        } else if (selectedButton === 'tidak') {
        let nuy = '18254873441@s.whatsapp.net';
            let tidak = `[❌] *Transaksi Gagal!*\n\n* 💰 Cash: ${waiting.cash.toLocaleString()}\n* 🛒 Harga: Rp.${waiting.nominal.toLocaleString()}\n* 💭 Status Transaksi: Gagal X\n*💬 Pesan Owner:*\n\`Maaf Transaksi Anda Kami Tolak, Di Karenakan Tidak Sesuai\``;
            m.reply(`❌ *Transaksi Gagal*`)
            await conn.reply(waiting.room, tidak, m);
            delete conn.pending[nuy];
        }
    }
   } else if (proses) {
            if (selectedButton == 'qris' && m.sender === proses.buyer) {
            m.reply(`*Mohon Tunggu.*`)
            await conn.sendFile(m.chat, 'https://telegra.ph/file/34257e96de4baa33189f6.jpg', 'nuy.jpg', `*Scan QR Ini*\n\nJika Sudah Transfer, Kirim Dahulu Bukti Transfer nya, Lalu Reply Fotonya Dan Ketik *Transaksi*`, m);
            } else if (selectedButton === 'contoh' && m.sender === proses.buyer) {
            m.reply('*Mohon Tunggu*')
             conn.sendFile(m.chat, 'https://telegra.ph/file/f01bdcdf8394d1cb101e6.jpg', 'contoh.jpg', `*Contoh Mengirim Bukti Transfer*`, m)
          }
        }
    }
  }

export default handler;