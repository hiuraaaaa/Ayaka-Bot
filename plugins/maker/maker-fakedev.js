import axios from "axios";
import FormData from "form-data";
import fetch from "node-fetch";

const fkontak = {
 key: {
  participant: '0@s.whatsapp.net',
  remoteJid: '0@s.whatsapp.net',
  fromMe: false,
  id: 'Halo',
 },
 message: {
  conversation: 'Fake Developer 👑',
 },
};

let handler = async (m, {
 conn,
 text
}) => {
 try {
  if (!text) {
   await conn.sendMessage(m.chat, {
    text: '📝 Masukkan nama yang ingin dicantumkan.'
   }, {
    quoted: fkontak
   });
   return;
  }
  
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || '';

  if (!mime || !/image\/(jpe?g|png)/.test(mime)) {
   await conn.sendMessage(m.chat, {
    text: '❗Balas/Reply gambar yang ingin digunakan.'
   }, {
    quoted: fkontak
   });
   return;
  }

  await conn.sendMessage(m.chat, {
   react: {
    text: '👨🏻‍💻',
    key: m.key
   }
  });

  const buffer = await q.download?.();
  if (!buffer) {
   throw new Error("❌ Gagal mendapatkan buffer gambar.");
  }

  const form = new FormData();
  form.append("file", buffer, "image.jpg");
  let upload = await axios.post("https://tmpfiles.org/api/v1/upload", form, {
   headers: form.getHeaders(),
   timeout: 180000
  });
  let raw = upload.data.data.url;
  raw = raw.replace(/^http:\/\//, "https://");
  let id = raw.split("/")[3];
  let link = `https://tmpfiles.org/dl/${id}/image.jpg`;

  const api = `https://zelapioffciall.koyeb.app/imagecreator/fakedev?name=${encodeURIComponent(
   text
  )}&image=${encodeURIComponent(link)}`;

  const res = await fetch(api);
  const arrayBuffer = await res.arrayBuffer();
  const img = Buffer.from(arrayBuffer);

  await conn.sendMessage(
   m.chat, {
    image: img,
    caption: `Result For: ${text}`
   }, {
    quoted: fkontak
   }
  );
  await conn.sendMessage(m.chat, {
   react: {
    text: '✅',
    key: m.key
   }
  });

 } catch (e) {
  console.error("Error in fakedev handler:", e); 
  
  await conn.sendMessage(m.chat, {
   react: {
    text: '❗',
    key: m.key
   }
  });
  await conn.sendMessage(m.chat, {
   text: '*ERROR:* ' + e.message
  }, {
   quoted: fkontak
  });
 }
};

handler.help = ['fakedev'];
handler.tags = ['maker'];
handler.command = ['fakedevimage', 'fakedev', 'fakedevimg'];
handler.limit = true;
handler.register = true;

export default handler;