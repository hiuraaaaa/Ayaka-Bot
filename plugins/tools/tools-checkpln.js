import fetch from 'node-fetch';

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
  if (!text) throw `Contoh: ${usedPrefix + command} 520522604488`;

  const res = await fetch(`${global.APIs.aetherz}/api/cek-pln?id=${encodeURIComponent(text)}&apikey=${global.aetherz}`);
  if (!res.ok) throw 'Gagal mengambil data!';
  const data = await res.json();

  if (data.status !== 200) throw 'Data tidak ditemukan atau salah!';

  const {
    status,
    billType,
    customerNumber,
    customerName,
    tariffPower,
    month,
    meterReading,
    totalBill,
    adminFee,
    totalPayment,
    depositDeduction
  } = data.result;

  let teks = `*TAGIHAN LISTRIK PLN*\n\n`;
  teks += `•❀ *Status:* ${status}\n`;
  teks += `❀ *Tipe Tagihan:* ${billType}\n`;
  teks += `❀ *No Pelanggan:* ${customerNumber}\n`;
  teks += `❀ *Nama:* ${customerName}\n`;
  teks += `❀ *Tarif/Daya:* ${tariffPower}\n`;
  teks += `❀ *Periode:* ${month}\n`;
  teks += `❀ *Meter:* ${meterReading}\n`;
  teks += `❀ *Tagihan:* ${totalBill}\n`;
  teks += `❀ *Biaya Admin:* ${adminFee}\n`;
  teks += `❀ *Total Bayar:* ${totalPayment}\n`;
  teks += `❀ *Potongan Deposit:* ${depositDeduction}\n\n`;
  teks += `© ${global.namebot} 2025`; // Diubah nama apinya

  m.reply(teks);
};

handler.help = ['checkpln <idpel>'];
handler.tags = ['tools'];
handler.command = /^check|cek(pln)$/i;

export default handler;