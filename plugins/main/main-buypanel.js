import fetch from 'node-fetch'
const {
  proto,
  generateWAMessageFromContent,
  prepareWAMessageMedia,
  downloadContentFromMessage
} = (await import('@adiwajshing/baileys')).default

export const pendingOrders = {}

function toRupiah(number) {
  return Number(number).toLocaleString("id-ID")
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}


function getImageBuffer(msg) {
  return new Promise(async (resolve, reject) => {
    try {
      const type = Object.keys(msg.message || {})[0]
      const content = msg.message[type]
      const stream = await downloadContentFromMessage(content, 'image')
      let buffer = Buffer.from([])
      for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk])
      }
      resolve(buffer)
    } catch (e) {
      reject(e)
    }
  })
}

let handler = async (m, { text, args, conn, command, usedPrefix }) => {
  const isOwner = m.sender === global.nomorwa + "@s.whatsapp.net"
  const lowerCmd = command?.toLowerCase?.()

  if ((m.message?.imageMessage || m.message?.viewOnceMessage?.message?.imageMessage) && pendingOrders[m.sender]) {
    let imgMsg = m.message?.imageMessage || m.message?.viewOnceMessage?.message?.imageMessage
    let buffer = await getImageBuffer({ message: { imageMessage: imgMsg } })
    const order = pendingOrders[m.sender]

    await conn.sendMessage(global.nomorwa + "@s.whatsapp.net", {
      image: buffer,
      caption: `*Bukti Transfer Masuk!*\n\n• Dari: @${m.sender.split("@")[0]}\n• Username: ${order.username}\n• Paket: ${order.ram == "0" ? "Unlimited" : order.ram / 1000 + "GB"}\n• Harga: Rp${toRupiah(order.harga)}\n\nSilakan cek dan lanjut proses order.`,
      mentions: [m.sender]
    })

    return m.reply("Bukti transfer berhasil dikirim ke owner. Tunggu konfirmasi.")
  }

  if (lowerCmd === "kirimbukti") {
    if (!pendingOrders[m.sender]) return m.reply("Kamu belum melakukan transaksi pembelian panel.")
    if (!m.quoted || !m.quoted.message?.imageMessage) return m.reply("Balas gambar bukti transfer dengan caption *.kirimbukti*.")

    let buffer = await getImageBuffer(m.quoted)
    const order = pendingOrders[m.sender]

    await conn.sendMessage(global.nomorwa + "@s.whatsapp.net", {
      image: buffer,
      caption: `*Bukti Transfer Masuk!*\n\n• Dari: @${m.sender.split("@")[0]}\n• Username: ${order.username}\n• Paket: ${order.ram == "0" ? "Unlimited" : order.ram / 1000 + "GB"}\n• Harga: Rp${toRupiah(order.harga)}\n\nSilakan cek dan lanjut proses order.`,
      mentions: [m.sender]
    })

    return m.reply("Bukti transfer berhasil dikirim ke owner. Tunggu konfirmasi.")
  }

  if (lowerCmd === "belipanel") {
  if (m.isGroup) return m.reply("Hanya bisa digunakan di private chat.");
  if (!text) return m.reply(`Contoh: .${command} username`);
  if (args.length > 1) return m.reply("Username tidak boleh mengandung spasi.");
  if (pendingOrders[m.sender]) return m.reply("Masih ada transaksi aktif. Ketik *.batalbeli* untuk membatalkan.");

  if (!text.includes("|")) {
    const usn = text.toLowerCase();

    const media = await prepareWAMessageMedia(
      { image: { url: "https://files.catbox.moe/adrh30.jpg" } },
      { upload: conn.waUploadToServer }
    );

    const data = {
      title: "Pilih Paket RAM",
      sections: [
        {
          title: "List Paket Panel",
          rows: Object.entries({
            "1GB": "1000MB RAM, 1GB Disk, 40% CPU",
            "2GB": "2000MB RAM, 2GB Disk, 60% CPU",
            "3GB": "3000MB RAM, 3GB Disk, 70% CPU",
            "4GB": "4000MB RAM, 4GB Disk, 80% CPU",
            "5GB": "5000MB RAM, 5GB Disk, 90% CPU",
            "6GB": "6000MB RAM, 6GB Disk, 100% CPU",
            "7GB": "7000MB RAM, 7GB Disk, 110% CPU",
            "8GB": "8000MB RAM, 8GB Disk, 120% CPU",
            "9GB": "9000MB RAM, 9GB Disk, 130% CPU",
            "10GB": "10000MB RAM, 10GB Disk, 140% CPU",
            "Unlimited": "Tanpa batas RAM, Disk, dan CPU"
          }).map(([title, desc]) => ({
            title,
            description: desc,
            id: `.belipanel ${title.toLowerCase()}|${usn}`
          }))
        }
      ]
    };

    const msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2
          },
          interactiveMessage: proto.Message.InteractiveMessage.create({
            body: proto.Message.InteractiveMessage.Body.create({
              text: `*Hai ${usn}*, silakan pilih paket panel yang kamu inginkan di bawah ini:`
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: "Rijalganzz Panel Store"
            }),
            header: proto.Message.InteractiveMessage.Header.create({
              hasMediaAttachment: true,
              ...media
            }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
              buttons: [
                {
                  name: "single_select",
                  buttonParamsJson: JSON.stringify(data)
                }
              ]
            })
          })
        }
      }
    }, { quoted: m });

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
    return;
  }

  const [pkg, username] = text.split("|").map(x => x.trim().toLowerCase());
  const ramOptions = {
    "1gb": { ram: "1000", disk: "1000", cpu: "40", harga: "1000" },
    "2gb": { ram: "2000", disk: "2000", cpu: "60", harga: "2000" },
    "3gb": { ram: "3000", disk: "3000", cpu: "70", harga: "3000" },
    "4gb": { ram: "4000", disk: "4000", cpu: "80", harga: "4000" },
    "5gb": { ram: "5000", disk: "5000", cpu: "90", harga: "5000" },
    "6gb": { ram: "6000", disk: "6000", cpu: "100", harga: "6000" },
    "7gb": { ram: "7000", disk: "7000", cpu: "110", harga: "7000" },
    "8gb": { ram: "8000", disk: "8000", cpu: "120", harga: "8000" },
    "9gb": { ram: "9000", disk: "9000", cpu: "130", harga: "9000" },
    "10gb": { ram: "10000", disk: "10000", cpu: "140", harga: "10000" },
    "unlimited": { ram: "0", disk: "0", cpu: "0", harga: "11000" }
  };

  const selected = ramOptions[pkg];
  if (!selected) return m.reply("Pilihan RAM tidak valid.");

  pendingOrders[m.sender] = {
    buyer: m.sender,
    username,
    ...selected
  };

  await m.reply(`Silakan lakukan pembayaran terlebih dahulu sebelum menunggu konfirmasi owner.

*Detail Pembayaran*
• Nama: Rijalganzz Store
• Nominal: Rp${toRupiah(selected.harga)}
• Dana: ${global.pdana}
• Gopay: ${global.pgopay}
• Qris: https://files.catbox.moe/qjkkn9.jpg

Setelah membayar:
• Kirim bukti transfer
• Kirim foto bukti dengan *.kirimbukti*
• Untuk batalkan: *.batalbeli*`);

  const teks = `
*Permintaan Buypanel Masuk!*

• Dari : @${m.sender.split("@")[0]}
• Username : ${username}
• Paket : ${pkg.toUpperCase()}
• Harga : Rp${toRupiah(selected.harga)}

Note: Tunggu Bukti Transfer Dari User! 

Jika Sudah silakan ketik:
.accpanel ${username} untuk menyetujui dan membuat panel.
`.trim();

  await conn.sendMessage(global.nomorwa + "@s.whatsapp.net", {
    text: teks,
    mentions: [m.sender]
  });
}

  if (lowerCmd === "batalbeli") {
    if (!pendingOrders[m.sender]) return m.reply("Tidak ada transaksi yang sedang berlangsung.")
    delete pendingOrders[m.sender]
    return m.reply("Transaksi berhasil dibatalkan.")
  }

  if (lowerCmd === "accpanel") {
  if (!isOwner) return m.reply("Khusus untuk owner.");
  if (!text) return m.reply("Masukkan username user.\nContoh: .accpanel username");

  const usernameInput = text.toLowerCase();

  const orderEntry = Object.entries(pendingOrders).find(([_, order]) => order.username === usernameInput);
  if (!orderEntry) return m.reply("Transaksi tidak ditemukan atau sudah kadaluarsa.");

  const [userJid, order] = orderEntry;

  const username = order.username;
  const password = username + "001";
  const email = username + "@gmail.com";
  const name = capitalize(username) + " Server";
  const desc = new Date().toLocaleString("id-ID");

    try {
      let userRes = await fetch(global.domain + "/api/application/users", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + global.apikey
        },
        body: JSON.stringify({
          email,
          username: username.toLowerCase(),
          first_name: name,
          last_name: "Server",
          language: "en",
          password
        })
      })

      let userData = await userRes.json()
      if (userData.errors) return m.reply(JSON.stringify(userData.errors[0], null, 2))
      let user = userData.attributes

      let nest = await fetch(global.domain + `/api/application/nests/${global.nestid}/eggs/${global.egg}`, {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + global.apikey
        }
      })
      let startup = (await nest.json()).attributes.startup

      let serverRes = await fetch(global.domain + "/api/application/servers", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + global.apikey
        },
        body: JSON.stringify({
          name,
          description: desc,
          user: user.id,
          egg: parseInt(global.egg),
          docker_image: "ghcr.io/parkervcp/yolks:nodejs_20",
          startup,
          environment: {
            INST: "npm",
            USER_UPLOAD: "0",
            AUTO_UPDATE: "0",
            CMD_RUN: "npm start"
          },
          limits: {
            memory: order.ram,
            swap: 0,
            disk: order.disk,
            io: 500,
            cpu: order.cpu
          },
          feature_limits: {
            databases: 5,
            backups: 5,
            allocations: 5
          },
          deploy: {
            locations: [parseInt(global.loc)],
            dedicated_ip: false,
            port_range: []
          }
        })
      })

      let server = await serverRes.json()
      if (server.errors) return m.reply(JSON.stringify(server.errors[0], null, 2))

      let teksPanel = `
*Data Akun Panel Kamu 📦*

• ID Server: ${server.attributes.id}
• Username : ${user.username}
• Password : ${password}
• Created : ${user.created_at.split("T")[0]}

*Spesifikasi Server*
• RAM : ${order.ram == "0" ? "Unlimited" : order.ram / 1000 + "GB"}
• Disk : ${order.disk == "0" ? "Unlimited" : order.disk / 1000 + "GB"}
• CPU : ${order.cpu == "0" ? "Unlimited" : order.cpu + "%"}
• Panel : ${global.domain}

Simpan data ini baik-baik!
Garansi 15 hari. Klaim harus disertai bukti pembelian.
      `.trim()

      await conn.sendMessage(userJid, { text: teksPanel })
      delete pendingOrders[userJid]
      m.reply("Panel berhasil dibuat dan dikirim.")
    } catch (err) {
      console.log(err)
      m.reply("Terjadi kesalahan saat membuat panel.")
    }
  }
}

handler.help = ["belipanel","batalbeli","accpanel","kirimbukti"]
handler.tags = ["panel","main"]
handler.command = /^belipanel|batalbeli|accpanel|kirimbukti$/i

export default handler