/*
* Nama Fitur : AI To Telanjang
* Type : Plugins ESM
* Sumber : https://whatsapp.com/channel/0029Vb6p7345a23vpJBq3a1h
* Channel Testimoni : https://whatsapp.com/channel/0029Vb6B91zEVccCAAsrpV2q
* Group Bot : https://chat.whatsapp.com/CBQiK8LWkAl2W2UWecJ0BG
* Author : 𝐅𝐚𝐫𝐢𝐞l
* Nomor Author : https://wa.me/6282152706113
*/

import axios from 'axios';
import { fileTypeFromBuffer } from 'file-type';
import FormData from 'form-data';
import fetch from 'node-fetch';

const fkontak = {
    key: { participant: '0@s.whatsapp.net', remoteJid: '0@s.whatsapp.net', fromMe: false, id: 'Halo' },
    message: { conversation: `AI To Telanjang 👙` }
};

async function uploadToZenzxz(buffer) {
    const { ext } = await fileTypeFromBuffer(buffer) || { ext: 'png' };
    const form = new FormData();
    form.append('file', buffer, `upload.${ext}`);
    const res = await fetch('https://uploader.zenzxz.dpdns.org/upload', { method: 'POST', body: form });
    if (!res.ok) throw new Error(`Gagal mengunggah ke Zenzxz: ${res.statusText}`);
    const html = await res.text();
    const match = html.match(/href="(https?:\/\/uploader\.zenzxz\.dpdns\.org\/uploads\/[^"]+)"/);
    if (!match) throw new Error('Gagal mendapatkan URL dari Zenzxz');
    return match[1];
}

let handler = async (m, { conn, usedPrefix, command }) => {
  const q = m.quoted ? m.quoted : m
  const mime = q.mimetype || ''
  if (!/image/.test(mime)) return conn.reply(m.chat, `📸 Balas/Reply gambar dengan caption *${usedPrefix + command}*`, m, { quoted: fkontak })

  await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

  try {
    const buffer = await q.download()
    if (!buffer) throw new Error('❌ Gagal mengunduh gambar')
    
    const sourceUrl = await uploadToZenzxz(buffer)
    const apiUrl = `https://api.nekolabs.my.id/tools/convert/remove-clothes?imageUrl=${encodeURIComponent(sourceUrl)}`
    const resApi = await axios.get(apiUrl, { timeout: 180000 })

    if (!resApi.data?.success || !resApi.data?.result) throw new Error('API gagal mengembalikan hasil')

    const resultUrl = resApi.data.result
    
    await conn.sendMessage(
      m.chat,
      { image: { url: resultUrl }, caption: `🩱 *Poster Telanjang Selesai*` },
      { quoted: fkontak }
    )

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
  } catch (e) {
    console.error(e)
    conn.reply(m.chat, `❌ Eror kak: ${e.message}`, m, { quoted: fkontak })
  }
}

handler.help = ['tobugil']
handler.tags = ['ai', 'premium', 'tools']
handler.command = /^(to(telanjang|bugil))$/i
handler.premium = true

export default handler