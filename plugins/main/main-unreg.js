import { createHash } from 'crypto';

let handler = async function (m, { args }) {
  let user = global.db.data.users[m.sender];

  if (user.limit < 15) throw '❌ Limit kamu kurang! Minimal 15 untuk unreg.';
  if (user.money < 15000) throw '❌ Money kamu kurang! Minimal 15.000 untuk unreg.';

  if (!args[0]) throw 'Masukkan Serial Number kamu!\nKalau tidak tahu, ketik *.ceksn*';

  let inputSn = args[0].trim();

  // Cek apakah input adalah URL atau SN langsung
  const urlMatch = inputSn.match(/https:\/\/pontaceksn\.com\/sn\/([a-f0-9]{32})/i);
  if (urlMatch) inputSn = urlMatch[1]; // Ekstrak SN dari URL

  const sn = createHash('md5').update(m.sender).digest('hex');

  if (inputSn !== sn) throw '❌ Serial Number salah atau tidak cocok. Ketik *.ceksn* untuk melihat SN kamu.';

  user.registered = false;
  user.limit -= 1;
  user.money -= 5;

  m.reply(`✅ *Berhasil Unregister!*\n\n• Limit: -1\n• Money: -5`);
};

handler.help = ['unregister'];
handler.tags = ['main'];
handler.command = /^unreg(ister)?$/i;
handler.register = true;

export default handler;