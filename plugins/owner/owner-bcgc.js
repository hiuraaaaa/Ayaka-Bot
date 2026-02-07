import moment from 'moment-timezone';

let handler = async (m, { conn, isOwner, isROwner, text }) => {
  const fcon = {
    key: { participant: `0@s.whatsapp.net`, ...(m.chat ? { remoteJid: `status@broadcast` } : {}) },
    message: { contactMessage: { displayName: `© ${global.namebot}` } }
  };

  const delay = (ms) => new Promise(res => setTimeout(res, ms));

  let pesan = m.quoted || m;
  if (!pesan) throw 'Kirim atau reply pesan yang ingin dibroadcast.';

  let getGroups = await conn.groupFetchAllParticipating();
  let groups = Object.entries(getGroups).map(entry => entry[1]);
  let anu = groups.map(v => v.id);

  m.reply(`Broadcast ke ${anu.length} grup...\nEstimasi: ${anu.length * 5} detik`);

  for (let id of anu) {
    try {
      if (pesan.mtype === 'imageMessage') {
        let media = await pesan.download();
        await conn.sendMessage(id, { image: media, caption: pesan.text || text || '' }, { quoted: fcon });
      } else if (pesan.mtype === 'audioMessage') {
        let media = await pesan.download();
        await conn.sendMessage(id, { audio: media, mimetype: 'audio/mp4', ptt: true }, { quoted: fcon });
      } else {
        let content = pesan.text || text;
        await conn.sendMessage(id, { text: content }, { quoted: fcon });
      }
    } catch (e) {
      console.log(`Gagal kirim ke ${id}`, e);
    }
    await delay(5000); // delay 5 detik
  }

  m.reply(`Selesai broadcast ke ${anu.length} grup.`);
};

handler.help = ['bcgc'];
handler.tags = ['owner'];
handler.command = /^(bcgc|broadcastgc)$/i;
handler.owner = true;

export default handler;