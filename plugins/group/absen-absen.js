import fs from 'fs';
import moment from 'moment-timezone';
const FILE_PATH = './src/absen.json';

function loadAbsenData() {
  if (!fs.existsSync(FILE_PATH)) fs.writeFileSync(FILE_PATH, '{}');
  return JSON.parse(fs.readFileSync(FILE_PATH));
}

function saveAbsenData(data) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
}

const handler = async (m, { conn, command, isAdmin }) => {
  const jid = m.sender;
  const groupId = m.chat;
  const today = moment().tz('Asia/Jakarta').format('YYYY-MM-DD');
  const data = loadAbsenData();

  if (!data[today]) data[today] = {};
  if (!data[today][groupId]) data[today][groupId] = { status: false, list: {} };

  const absen = data[today][groupId];

  switch (command) {
    case 'absenstart':
      if (!isAdmin) return m.reply('⛔ *Hanya admin yang bisa membuka absen!*');
      absen.status = true;
      absen.list = {};
      saveAbsenData(data);
      m.reply(`✅ *Absen dibuka!*\nTanggal: ${today}\nSilakan ketik *.absen* untuk check-in.`);
      break;

    case 'resetabsen':
      if (!isAdmin) return m.reply('⛔ *Hanya admin yang bisa mereset absen!*');
      absen.status = false;
      absen.list = {};
      saveAbsenData(data);
      m.reply(`♻️ *Absen direset!*\nSemua data absensi hari ini (${today}) untuk grup ini telah dihapus.`);
      break;

    case 'absen':
      if (!absen.status) return m.reply('🕒 *Absen belum dibuka oleh admin.*');
      if (absen.list[jid]) {
        return m.reply(`ℹ️ *Kamu sudah absen hari ini*\nWaktu: ${absen.list[jid]}`);
      }
      const waktu = moment().tz('Asia/Jakarta').format('HH:mm');
      absen.list[jid] = waktu;
      saveAbsenData(data);
      m.reply(`✅ *Absen berhasil!*\nWaktu tercatat: ${waktu}`);
      break;

    case 'absensi':
      if (!absen.status) return m.reply('🕒 *Absen belum dibuka.*');
      const entries = Object.entries(absen.list || {});
      const list = entries.map(([jid, time], i) => `${i + 1}. @${jid.split('@')[0]} 🕒 ${time}`).join('\n') || '📭 Belum ada yang absen hari ini.';
      conn.sendMessage(m.chat, {
        text: `📋 *Daftar Absensi (${today}):*\n\n${list}`,
        mentions: entries.map(([jid]) => jid)
      }, { quoted: m });
      break;
  }
};

handler.help = ['absen', 'absensi', 'absenstart', 'resetabsen'];
handler.tags = ['group'];
handler.command = ['absen', 'absensi', 'absenstart', 'resetabsen'];
handler.group = true;

export default handler;