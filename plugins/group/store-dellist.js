import fs from 'fs';

let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) throw "Gunakan *" + usedPrefix + "list* Untuk Melihat Daftar List Yang Tersimpan.";

  let groupId = m.chat;
  const storeFilePath = './store-data.json';

  let storeData = {};
  if (fs.existsSync(storeFilePath)) {
    storeData = JSON.parse(fs.readFileSync(storeFilePath, 'utf8'));
  }

  if (!storeData[groupId] || !(text in storeData[groupId].msgs)) {
    throw "[ " + text + " ] Tidak Terdaftar Di Daftar List.";
  }

  delete storeData[groupId].msgs[text];

  fs.writeFileSync(storeFilePath, JSON.stringify(storeData, null, 2));

  return m.reply("Berhasil Menghapus Pesan Di Daftar List Dengan Nama >\n" + text);
}
handler.help = ["dellist"];
handler.tags = ["group"];
handler.command = ["dellist"];
handler.admin = true;
export default handler;