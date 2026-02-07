import fetch from 'node-fetch';

let handler = async (m, { text, command, conn }) => {
  if (!text.includes('|')) {
    return m.reply(`Contoh penggunaan:\n\n.${command} bandung|jakarta`);
  }

  let [from, to] = text.split('|').map(v => v.trim());

  await conn.sendMessage(m.chat, {
    react: {
      text: '✨',
      key: m.key
    }
  });

  let api = `https://api.vreden.my.id/api/tools/jarak?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
  try {
    let res = await fetch(api);
    let json = await res.json();

    if (!json.result?.status) throw 'Gagal mengambil data dari API.';

    let r = json.result;
    let caption = `📍 *Jarak dari ${r.asal.nama} ke ${r.tujuan.nama}*\n\n` +
                  `🏙️ *Asal:* ${r.asal.alamat}\n` +
                  `🎯 *Tujuan:* ${r.tujuan.alamat}\n` +
                  `📏 *Jarak:* ${r.detail.match(/jarak (.*?) km/)[1]} km\n` +
                  `⏱️ *Estimasi Waktu:* ${r.detail.match(/estimasi waktu (.*)\./)[1]}\n` +
                  `⛽ *BBM:* ${r.estimasi_biaya_bbm.total_liter} liter (${r.estimasi_biaya_bbm.total_biaya})\n\n` +
                  `🧭 *Langkah Awal Perjalanan:*\n`;

    for (let step of r.arah_penunjuk_jalan.slice(0, 5)) {
      caption += `➡️ ${step.langkah}. ${step.instruksi} (${step.jarak})\n`;
    }

    if (r.arah_penunjuk_jalan.length > 5) {
      caption += `\n…dan ${r.arah_penunjuk_jalan.length - 5} langkah lainnya.`;
    }

    let mapUrl = r.peta_statis + '&lang=id_ID';

    await conn.sendFile(m.chat, mapUrl, 'map.jpg', caption, m);

  } catch (err) {
    m.reply(`❌ Terjadi kesalahan:\n${err}`);
  }
};

handler.help = ['jarak <kota_asal>|<kota_tujuan>'];
handler.tags = ['tools'];
handler.command = /^jarak$/i;

export default handler;