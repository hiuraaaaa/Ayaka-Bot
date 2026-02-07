import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command, args }) => {
  let _args = args && args.length ? args : text.split(" ").filter(v => v);
  
  if (_args.length < 2)
    return m.reply(`Format perintah salah.\nContoh: .stalkbutton 085794161086 dana`);

  const number = _args[0].trim();
  const bank = _args[1].toLowerCase();

  const apiUrl = `https://fastrestapis.fasturl.cloud/stalk/bank?number=${number}&bank=${bank}`;
  
  try {
    const response = await fetch(apiUrl);
    const result = await response.json();

    if (result.status !== 200 || !result.result || !result.result.data) {
      return m.reply(`Gagal mendapatkan data atau bank tidak valid.\n${result.error || ''}\n\nDaftar Bank:\n${result.banks || ''}`);
    }

    const data = result.result.data;
    if (!data.account_number)
      return reply("Data pemain tidak ditemukan.");

    let caption = `「 BANK STALKER 」\n\n`;
    caption += `*• Nomor Rekening:* ${data.account_number}\n`;
    caption += `*• Nama:* ${data.name}\n`;
    caption += `*• Bank:* ${data.bank_code}\n`;

    await conn.sendMessage(m.chat, {
      text: caption,
      footer: global.namebot,
      headerType: 1,
      contextInfo: { mentionedJid: [m.sender] }
    }, { quoted: m });
    
  } catch (error) {
    console.error(error);
    return m.reply("Terjadi kesalahan saat memproses permintaan.");
  }
};

handler.help = ['stalkbutton <nomor> <bank>'];
handler.tags = ['internet','tools'];
handler.command = ['stalkbutton'];
export default handler;;