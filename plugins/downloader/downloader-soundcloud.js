import fetch from 'node-fetch';

const handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) throw `Contoh:\n${usedPrefix + command} https://soundcloud.com/username/judul-lagu`;

  // Reaksi proses
  await conn.sendMessage(m.chat, {
    react: {
      text: '⏳',
      key: m.key
    }
  });

  try {
    const api = `https://fastrestapis.fasturl.cloud/downup/soundclouddown?url=${encodeURIComponent(args[0])}`;
    const res = await fetch(api);
    const json = await res.json();

    if (!json || json.status !== 200 || !json.data?.file) throw 'Gagal mengambil data SoundCloud.';

    const { title, bitrate, file } = json.data;
    const caption = `🎵 *${title}*\n🎧 Bitrate: ${bitrate}`;

    await conn.sendFile(m.chat, file, `${title}.mp3`, caption, m);

    // Reaksi sukses
    await conn.sendMessage(m.chat, {
      react: {
        text: '✅',
        key: m.key
      }
    });
  } catch (e) {
    console.error(e);
    await conn.sendMessage(m.chat, {
      react: {
        text: '❌',
        key: m.key
      }
    });
    throw 'Terjadi kesalahan saat mengambil data dari SoundCloud.';
  }
};

handler.help = ['soundcloud <url>'];
handler.tags = ['downloader'];
handler.command = /^soundcloud$/i;

export default handler;