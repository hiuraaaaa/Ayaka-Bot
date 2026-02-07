import fetch from 'node-fetch';

let handler = async (m, { text, conn, command }) => {
  if (!text) throw `Contoh penggunaan:\n.${command} burung\nTambahkan mode opsional:\n.${command} burung --realistic`;

  // Kirim emoji reaksi saat memproses
  await conn.sendMessage(m.chat, {
    react: {
      text: '⏳',
      key: m.key
    }
  });

  // Cek apakah ada opsi mode: --anime / --realistic / --art / dst
  let mode = 'animated';
  let prompt = text;
  if (text.includes('--')) {
    let parts = text.split('--');
    prompt = parts[0].trim();
    mode = parts[1].trim().toLowerCase();
  }

  try {
    let url = `https://fastrestapis.fasturl.cloud/aiimage/meta?prompt=${encodeURIComponent(prompt)}&mode=${mode}`;
    let res = await fetch(url);
    if (!res.ok) throw 'Gagal menghubungi API';

    let json = await res.json();
    if (json.status !== 200 || !json?.result?.animated_media?.length) {
      throw 'Gagal mendapatkan hasil dari model yang dipilih.';
    }

    let videos = json.result.animated_media;

    for (let video of videos) {
      try {
        await conn.sendFile(m.chat, video.url, 'result.mp4', `Prompt: *${video.prompt}*\nMode: *${mode}*`, m);
      } catch (e) {
        await conn.sendMessage(m.chat, {
          text: `✅ Prompt: *${video.prompt}*\nMode: *${mode}*\n📎 [Klik untuk lihat video](${video.url})`,
          contextInfo: {
            externalAdReply: {
              title: "Hasil AI",
              body: video.prompt,
              mediaType: 2,
              mediaUrl: video.url,
              sourceUrl: video.url
            }
          }
        }, { quoted: m });
      }
    }
  } catch (err) {
    console.error(err);
    throw typeof err === 'string' ? err : 'Terjadi kesalahan saat memproses.';
  }

  await conn.sendMessage(m.chat, {
    react: {
      text: '✅',
      key: m.key
    }
  });
};

handler.command = /^metavid|metavideo$/i;
handler.help = ['metavid <prompt> [--mode]'];
handler.tags = ['ai'];

export default handler;