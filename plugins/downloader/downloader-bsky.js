import fetch from 'node-fetch';

const handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) throw `Contoh:\n${usedPrefix + command} https://bsky.app/profile/kajiprostudio.bsky.social/post/3l74fucjo3a2f`;

  // Reaksi loading
  await conn.sendMessage(m.chat, {
    react: {
      text: '⏳',
      key: m.key
    }
  });

  try {
    const api = `https://fastrestapis.fasturl.cloud/downup/blueskydown?url=${encodeURIComponent(args[0])}`;
    const res = await fetch(api);
    const json = await res.json();

    if (!json || json.status !== 200 || !json.result) throw 'Gagal mengambil data BlueSky.';

    const { type, urls, author, post } = json.result;

    const caption = `*${author.name}* (@${author.handle})\n\n${post.caption}\n\n🗓️ ${new Date(post.publish).toLocaleString()}\n❤️ ${post.likeCount}   🔁 ${post.repostCount}   💬 ${post.replyCount}`;

    if (type === 'photo') {
      await conn.sendFile(m.chat, urls, 'bsky.jpg', caption, m);
    } else {
      throw 'Tipe konten belum didukung.';
    }

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
    throw 'Terjadi kesalahan saat mengambil data dari BlueSky.';
  }
};

handler.help = ['bsky <url>'];
handler.tags = ['downloader'];
handler.command = /^bsky$/i;

export default handler;