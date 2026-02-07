const { generateWAMessageFromContent, proto, prepareWAMessageMedia } = (await import("@adiwajshing/baileys")).default;
import fs from "fs";
import path from "path";
import { createCanvas, loadImage } from "canvas";

const dbPath = path.join(process.cwd(), "src", "struk.json");
const sessions = new Map();
const lastMsgId = new Map();

const handler = async (m, { conn, text, command }) => {
  try {

    if (lastMsgId.get(m.sender) === m.key.id) return;
    lastMsgId.set(m.sender, m.key.id);

    await conn.sendMessage(m.chat, { react: { text: "🧾", key: m.key } });

    if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify({}));
    const db = JSON.parse(fs.readFileSync(dbPath, "utf8"));
    const ownerId = m.sender;
    const now = Date.now();

    const packages = {
      update_no: { name: "UPDATE NO", pAyaka: "Rp.75.000", update: "Tidak", trial: "Tidak" },
      update_trial_yes: { name: "UPDATE TRIAL YES", pAyaka: "Rp.110.000", update: "6 Bulan", trial: "Ya" },
      update_permanen_yes: { name: "UPDATE PERMANEN YES", pAyaka: "Rp.250.000", update: "Permanen", trial: "Tidak" },
    };

    const pp =
      (await conn
        .profilePictureUrl(m.sender, "image")
        .catch(() => "https://telegra.ph/file/8904062b17875a2abanthocyan4.jpg")) ||
      "https://telegra.ph/file/8904062b17875a2abanthocyan4.jpg";

    const resizeImage = async (url, width, height) => {
      const img = await loadImage(url);
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      return canvas.toBuffer("image/jpeg");
    };

    const sendInteractive = async (bodyText, buttons) => {
      const msg = generateWAMessageFromContent(
        m.chat,
        {
          viewOnceMessage: {
            message: {
              interactiveMessage: {
                body: { text: bodyText },
                footer: { text: `© Lann4you` },
                header: {
                  hasMediaAttachment: true,
                  ...(await prepareWAMessageMedia(
                    {
                      document: { url: "https://chat.whatsapp.com/HxBHntSYbMoGdpY7tVqLuK" },
                      mimetype: "image/webp",
                      fileName: `[ Hello Sensei ]`,
                      pageCount: 2024,
                      jpegThumbnail: await resizeImage(pp, 400, 400),
                      fileLength: 2024000,
                    },
                    { upload: conn.waUploadToServer }
                  )),
                },
                nativeFlowMessage: { buttons },
              },
            },
          },
        },
        { quoted: m }
      );
      await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
    };

    const clearSession = (id) => {
      delete db[id];
      fs.writeFileSync(dbPath, JSON.stringify(db));
      sessions.delete(id);
    };

    const generateImageStruk = async (strukData) => {
      const width = 400;
      const height = 600;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);

      ctx.font = "bold 16px Arial";
      ctx.fillStyle = "#000000";
      ctx.textAlign = "center";
      ctx.fillText(`Lann4you`, width / 2, 30);
      ctx.font = "12px Arial";
      ctx.fillText("Jl. Japan No. 1, Kota Konoha", width / 2, 50);
      ctx.fillText(`Telp: ${global.nomorwa}`, width / 2, 70);

      ctx.beginPath();
      ctx.moveTo(20, 90);
      ctx.lineTo(width - 20, 90);
      ctx.stroke();

      ctx.textAlign = "left";
      ctx.font = "12px Arial";
      let y = 110;
      ctx.fillText(`Tanggal: ${strukData.date}`, 20, y);
      y += 20;
      ctx.fillText(`No. Transaksi: ${strukData.transactionId}`, 20, y);
      y += 20;
      ctx.fillText(`Kasir: Sensei`, 20, y);
      y += 30;

      ctx.fillText("Nama Produk:", 20, y);
      y += 20;
      ctx.fillText(`SC ${global.namebot} - ${strukData.packageName}`, 20, y);
      y += 20;
      ctx.fillText(`Harga: ${strukData.pAyaka}`, 20, y);
      y += 30;

      ctx.fillText(`Update: ${strukData.update}`, 20, y);
      y += 20;
      ctx.fillText(`Trial: ${strukData.trial}`, 20, y);
      y += 20;
      if (strukData.trialExtra) {
        ctx.fillText(`Perpanjang: Rp.45.000`, 20, y);
        y += 20;
      }

      ctx.beginPath();
      ctx.moveTo(20, y);
      ctx.lineTo(width - 20, y);
      ctx.stroke();
      y += 20;

      ctx.font = "bold 14px Arial";
      ctx.fillText(`TOTAL: ${strukData.pAyaka}`, 20, y);
      y += 20;
      ctx.font = "12px Arial";
      ctx.fillText(`Bayar (${strukData.payment}): ${strukData.pAyaka}`, 20, y);
      y += 20;
      ctx.fillText(`Kembali: Rp 0`, 20, y);
      y += 30;

      ctx.fillText("Terimakasih Telah Berbelanja", 20, y);
      y += 20;
      ctx.fillText(`Kontak Admin: ${global.nomorwa}`, 20, y);

      const tmpDir = path.join(process.cwd(), "tmp");
      if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
      const imagePath = path.join(tmpDir, "struk.png");
      fs.writeFileSync(imagePath, canvas.toBuffer("image/png"));
      return imagePath;
    };

    if (sessions.has(ownerId) && !/^(struk|struk_final|struk_output)$/i.test(command))
      return m.reply("Sensei, selesain dulu sesi struknya ya, ketik `.struk` buat lanjut!");

    if (command === "struk" && !text) {
      sessions.set(ownerId, setTimeout(() => clearSession(ownerId), 5 * 60 * 1000));
      db[ownerId] = { step: "select_package", timestamp: now };
      fs.writeFileSync(dbPath, JSON.stringify(db));

      const buttons = [
        {
          name: "single_select",
          buttonParamsJson: JSON.stringify({
            title: "Pilih Paket",
            sections: [
              {
                title: "List Paket",
                highlight_label: "Popular",
                rows: [
                  { header: "", title: "UPDATE NO", description: "PAyaka: Rp.75.000", id: ".struk update_no" },
                  { header: "", title: "UPDATE TRIAL YES", description: "PAyaka: Rp.110.000 (6 Bulan)", id: ".struk update_trial_yes" },
                  { header: "", title: "UPDATE PERMANEN YES", description: "PAyaka: Rp.250.000 (Permanen)", id: ".struk update_permanen_yes" },
                ],
              },
            ],
          }),
        },
      ];

      await sendInteractive(`Halo, Sensei! Mau struk kece dari Lann4you? Pilih paket dulu yuk~`, buttons);
      return;
    }

    const packageType = text.split(" ")[0];
    const selectedPackage = packages[packageType];

    if (command === "struk" && selectedPackage) {
      if (!db[ownerId] || db[ownerId].step !== "select_package") return;
      db[ownerId] = { step: "select_payment", package: packageType, timestamp: now };
      fs.writeFileSync(dbPath, JSON.stringify(db));

      const buttons = [
        {
          name: "single_select",
          buttonParamsJson: JSON.stringify({
            title: "Pilih Metode Pembayaran",
            sections: [
              {
                title: "Metode Pembayaran",
                highlight_label: "Pilih",
                rows: [
                  { header: "", title: "QRIS", description: "Pembayaran via QRIS", id: `.struk_final ${packageType} qris` },
                  { header: "", title: "Dana", description: "Pembayaran via Dana", id: `.struk_final ${packageType} dana` },
                  { header: "", title: "Ovo", description: "Pembayaran via Ovo", id: `.struk_final ${packageType} ovo` },
                  { header: "", title: "Gopay", description: "Pembayaran via Gopay", id: `.struk_final ${packageType} gopay` },
                  { header: "", title: "ShopeePay", description: "Pembayaran via ShopeePay", id: `.struk_final ${packageType} shopeepay` },
                  { header: "", title: "Bank", description: "Pembayaran via Transfer Bank", id: `.struk_final ${packageType} bank` },
                ],
              },
            ],
          }),
        },
      ];

      await sendInteractive(`Sensei pilih *${selectedPackage.name}* nih, lanjut pilih pembayaran ya!`, buttons);
      return;
    }

    if (command === "struk_final" && text) {
      if (!db[ownerId] || db[ownerId].step !== "select_payment") return;

      const [pkgType, paymentMethod] = text.split(" ");
      const selectedPkg = packages[pkgType];
      if (!selectedPkg) return;

      db[ownerId] = { step: "select_output", package: pkgType, payment: paymentMethod, timestamp: now };
      fs.writeFileSync(dbPath, JSON.stringify(db));

      const buttons = [
        {
          name: "single_select",
          buttonParamsJson: JSON.stringify({
            title: "Pilih Tipe Struk",
            sections: [
              {
                title: "Tipe Struk",
                rows: [
                  { header: "", title: "Teks", description: "Struk dalam bentuk teks", id: `.struk_output ${pkgType} ${paymentMethod} text` },
                  { header: "", title: "Gambar", description: "Struk dalam bentuk gambar", id: `.struk_output ${pkgType} ${paymentMethod} image` },
                ],
              },
            ],
          }),
        },
      ];

      await sendInteractive("Sensei, struknya mau dalam bentuk teks atau gambar nih?", buttons);
      return;
    }

    if (command === "struk_output" && text) {
      if (!db[ownerId] || db[ownerId].step !== "select_output") return;

      const [pkgType, paymentMethod, outputType] = text.split(" ");
      const selectedPkg = packages[pkgType];
      if (!selectedPkg) return;

      const payment = paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1);
      const date = new Date();
      const currentDate = date.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
      const dateCode = date.toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "2-digit" }).replace(/\//g, "");
      const transactionId = `#PS-${dateCode}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`;

      const strukData = {
        date: currentDate,
        transactionId,
        packageName: selectedPkg.name,
        pAyaka: selectedPkg.pAyaka,
        update: selectedPkg.update,
        trial: selectedPkg.trial,
        trialExtra: selectedPkg.trial === "Ya",
        payment,
      };

      if (outputType === "text") {
        const struk =
          `*[ Lann4you ]*\n*Struk Pembelian*\n\n` +
          `*Tanggal:* ${currentDate}\n*No. Transaksi:* ${transactionId}\n*Nama Produk:*\nSC ${global.namebot}\n\n` +
          `*Paket yang Dipilih:*\nPaket: ${selectedPkg.name}\nHarga: ${selectedPkg.pAyaka}\n\n` +
          `*Detail:*\nUpdate: ${selectedPkg.update}\nTrial: ${selectedPkg.trial}\n` +
          `${selectedPkg.trial === "Ya" ? "Perpanjang: Rp.45.000\n" : ""}\n` +
          `*Metode Pembayaran:* ${payment}\n\n*Total Pembayaran:* ${selectedPkg.pAyaka}\n\n` +
          `Kontak Admin: ${global.nomorwa}\nInstagram: @mycyll.7\n\n` +
          `_Produk digital tidak dapat direfund. Simpan struk ini sebagai bukti pembelian._`;

        await conn.sendMessage(m.chat, { text: struk }, { quoted: m });
      } else if (outputType === "image") {
        const imagePath = await generateImageStruk(strukData);
        await conn.sendMessage(
          m.chat,
          { image: { url: imagePath }, caption: "Ini struk gambarnya, Sensei! Keren, kan? Jangan lupa simpen ya~" },
          { quoted: m }
        );
        fs.unlinkSync(imagePath);
      }

      clearSession(ownerId);
      m.reply("Struk udah jadi, Sensei! Jangan lupa simpen ya~");
    }
  } catch (e) {
    console.error(e);
    m.reply(`Waduh, Sensei! Codingannya ngambek nih: ${e.message}`);
  }
};

handler.help = ["struk"];
handler.tags = ["store"];
handler.command = /^(struk|struk_final|struk_output)$/i;
handler.owner = true;

export default handler;