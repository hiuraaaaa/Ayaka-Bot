import fetch from 'node-fetch';
import FormData from 'form-data';
import { fileTypeFromBuffer } from 'file-type';
import pkg from '@adiwajshing/baileys';
const { proto } = pkg;

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}


// --- FUNGSI UPLOADER UNTUK SETIAP LAYANAN ---

// 1. Catbox
async function uploadToCatbox(buffer) {
    const { ext, mime } = await fileTypeFromBuffer(buffer) || { ext: 'bin', mime: 'application/octet-stream' };
    const form = new FormData();
    form.append('reqtype', 'fileupload');
    form.append('fileToUpload', buffer, { filename: `file.${ext}`, contentType: mime });
    const res = await fetch('https://catbox.moe/user/api.php', { method: 'POST', body: form });
    if (!res.ok) throw new Error(`Catbox Gagal: ${res.statusText}`);
    const text = await res.text();
    if (!text.startsWith('http')) throw new Error('Catbox Gagal: Respons tidak valid');
    return text;
}

// 2. Yupra
async function uploadToYupra(buffer, filename) {
  const form = new FormData();
  form.append('files', buffer, { filename });
  const res = await fetch('https://cdn.yupra.my.id/upload', { method: 'POST', body: form, headers: { ...form.getHeaders() } });
  if (!res.ok) throw new Error(`Yupra Gagal: ${res.statusText}`);
  const json = await res.json();
  if (!json.success || !json.files?.[0]) throw new Error('Yupra Gagal: Respons tidak valid');
  return `https://cdn.yupra.my.id${json.files[0].url}`;
}

// 3. Cloudku
async function uploadToCloudku(buffer) {
    const { ext, mime } = await fileTypeFromBuffer(buffer) || { ext: 'bin', mime: 'application/octet-stream' };
    const form = new FormData();
    form.append('file', buffer, { filename: `file.${ext}`, contentType: mime });
    const res = await fetch('https://cloudkuimages.guru/upload.php', { method: 'POST', body: form });
    if (!res.ok) throw new Error(`Cloudku Gagal: HTTP ${res.status}`);
    const json = await res.json();
    if (!json?.status || !json?.data?.url) throw new Error('Cloudku Gagal: Respons tidak valid');
    return json.data.url;
}

// 4. Zenzxz
async function uploadToZenzxz(buffer, filename) {
    const form = new FormData();
    form.append('file', buffer, filename);
    const res = await fetch('https://uploader.zenzxz.dpdns.org/upload', { method: 'POST', body: form });
    if (!res.ok) throw new Error(`Zenzxz Gagal: ${res.statusText}`);
    const html = await res.text();
    const match = html.match(/href="(https?:?:\/\/uploader\.zenzxz\.dpdns\.org\/uploads\/[^"]+)"/);
    if (!match) throw new Error('Zenzxz Gagal: Tidak dapat menemukan URL');
    return match[1];
}

// 5. Top4Top
async function uploadToTop4Top(buffer) {
    const { ext } = await fileTypeFromBuffer(buffer) || {};
    if (!ext) throw new Error('Top4Top Gagal: Tidak dapat mendeteksi tipe file');
    const form = new FormData();
    form.append('file_1_', buffer, { filename: `file-${Date.now()}.${ext}` });
    form.append('submitr', '[ رفع الملفات ]');
    const res = await fetch('https://top4top.io/index.php', { method: 'POST', body: form });
    if (!res.ok) throw new Error(`Top4Top Gagal: ${res.statusText}`);
    const html = await res.text();
    const matches = html.matchAll(/<input readonly="readonly" class="all_boxes" onclick="this.select\(\);" type="text" value="(.+?)" \/>/g);
    const downloadUrl = Array.from(matches).map(v => v[1]).find(v => v.endsWith(ext));
    if (!downloadUrl) throw new Error('Top4Top Gagal: Tidak dapat menemukan URL');
    return downloadUrl;
}

// 6. Uguu
async function uploadToUguu(buffer) {
    const { ext, mime } = await fileTypeFromBuffer(buffer) || { ext: 'bin', mime: 'application/octet-stream' };
    const filename = `file-${Date.now()}.${ext}`;
    
    const form = new FormData();
    form.append('files[]', buffer, { filename, contentType: mime });
    const res = await fetch('https://uguu.se/upload.php', { method: 'POST', body: form });
    if (!res.ok) throw new Error(`Uguu upload failed: ${res.status}`);
    const json = await res.json();
    if (!json.files?.[0]?.url) throw new Error('Uguu response invalid');
    return json.files[0].url;
}

// 7. Lunara
async function uploadToLunara(buffer, filename) {
    const form = new FormData();
    form.append('file', buffer, { filename }); 
    form.append("permanent", "true"); 
    const res = await fetch('https://lunara.drizznesiasite.biz.id/upload', { 
        method: 'POST', 
        body: form,
        headers: { ...form.getHeaders() } 
    });
    
    if (!res.ok) throw new Error(`Lunara Gagal: ${res.statusText} (Status: ${res.status})`);
    
    const json = await res.json();
    
    if (!json?.file_url) throw new Error('Lunara Gagal: Respons tidak valid (URL tidak ditemukan)');
    
    return json.file_url;
}

// 8. Tmpfiles
async function uploadToTmpfiles(buffer, filename) {
    const form = new FormData();
    form.append('file', buffer, { filename });
    const res = await fetch('https://tmpfiles.org/api/v1/upload', { 
        method: 'POST', 
        body: form,
        headers: { ...form.getHeaders() }
    });
    if (!res.ok) throw new Error(`Tmpfiles Gagal: ${res.statusText}`);
    const json = await res.json();
    if (json.status !== 'success' || !json.data?.url) throw new Error('Tmpfiles Gagal: Respons tidak valid');
    return json.data.url; 
}

// 9. Vyzen
async function uploadToVyzen(buffer, filename) {
    const form = new FormData();
    form.append('file', buffer, { filename });
    const res = await fetch('https://vy-z.vercel.app/upload', { 
        method: 'POST', 
        body: form,
        headers: { ...form.getHeaders() } 
    });
    if (!res.ok) throw new Error(`Vyzen Gagal: ${res.statusText}`);
    
    const text = await res.text();
    try {
        const json = JSON.parse(text);
        if (json.url) return json.url;
    } catch (e) {
        if (text.startsWith('http')) return text;
    }
    throw new Error('Vyzen Gagal: Respons tidak valid');
}

// 10. Bahlil (c.termai.cc)
async function uploadToBahlil(buffer, filename) {
    const key = "AIzaBj7z2z3xBjsk";
    const domain = 'https://c.termai.cc';
    const apiUrl = `${domain}/api/upload?key=${key}`;

    const form = new FormData();
    form.append('file', buffer, { filename }); 

    const res = await fetch(apiUrl, { 
        method: 'POST', 
        body: form,
        headers: { ...form.getHeaders() } 
    });

    if (!res.ok) {
         const errorText = await res.text();
         throw new Error(`Bahlil Gagal: ${res.statusText} (Status: ${res.status}) - ${errorText}`);
    }
    
    const json = await res.json();
    
    if (!json.status || !json.path) {
        console.error('Bahlil Response:', JSON.stringify(json, null, 2));
        throw new Error('Bahlil Gagal: Respons tidak valid (URL/path tidak ditemukan)');
    }
    
    return json.path;
}

// 11. Ubed
async function uploadToUbed(buffer, filename) {
    const form = new FormData();
    form.append('file', buffer, { filename });
    const res = await fetch('https://apiku.ubed.my.id/api/upload', { 
        method: 'POST', 
        body: form,
        headers: { ...form.getHeaders() } 
    });
    if (!res.ok) throw new Error(`Ubed Gagal: ${res.statusText} (Status: ${res.status})`);
    
    const text = await res.text();
    try {
        const json = JSON.parse(text);
        if (json.url) return json.url;
    } catch (e) {
        if (text.startsWith('http')) return text;
    }
    throw new Error('Ubed Gagal: Respons tidak valid');
}

// 12. Deline
async function uploadToDeline(buffer, filename) {
    const form = new FormData();
    form.append('file', buffer, { filename });
    const res = await fetch('https://api.deline.web.id/uploader/', { 
        method: 'POST', 
        body: form,
        headers: { ...form.getHeaders() } 
    });
    if (!res.ok) throw new Error(`Deline Gagal: ${res.statusText} (Status: ${res.status})`);
    
    const text = await res.text();
    try {
        const json = JSON.parse(text);
        if (json.url) return json.url; 
        if (json.data?.url) return json.data.url;
        if (json.result?.url) return json.result.url;
        if (json.path) return json.path;
    } catch (e) {
        if (text.startsWith('http')) return text;
    }

    console.error('Deline Response:', text);
    throw new Error('Deline Gagal: Respons tidak valid');
}

// 13. Faa
async function uploadToFaa(buffer, filename) {
    const form = new FormData();
    form.append('file', buffer, { filename });
    const res = await fetch('https://api-faa.my.id/faa/tourl', { 
        method: 'POST', 
        body: form,
        headers: { 
            ...form.getHeaders(),
            'accept': 'application/json' 
        } 
    });
    
    if (!res.ok) {
         const errorText = await res.text();
         throw new Error(`Faa Gagal: ${res.statusText} (Status: ${res.status}) - ${errorText}`);
    }
    
    const json = await res.json();
    const url = json.url || json.path || json.data?.url; 

    if (!url) {
        console.error('Faa Response:', JSON.stringify(json, null, 2));
        throw new Error('Faa Gagal: Respons tidak valid (URL tidak ditemukan)');
    }
    return url;
}

// 14. Elrayy
async function uploadToElrayy(buffer, filename) {
    const form = new FormData();
    form.append('file', buffer, { filename });
    const res = await fetch('https://api.elrayyxml.web.id/upload', { 
        method: 'POST', 
        body: form,
        headers: { ...form.getHeaders() } 
    });
    if (!res.ok) {
         const errorText = await res.text();
         throw new Error(`Elrayy Gagal: ${res.statusText} (Status: ${res.status}) - ${errorText}`);
    }
    const json = await res.json();
    if (!json.url) {
        console.error('Elrayy Response:', JSON.stringify(json, null, 2));
        throw new Error('Elrayy Gagal: Respons tidak valid (URL tidak ditemukan)');
    }
    return json.url;
}

// 15. Qu.ax
async function uploadToQuAx(buffer, filename) {
    const form = new FormData();
    form.append('files[]', buffer, { filename }); // Key adalah 'files[]' berdasarkan snippet
    const res = await fetch('https://qu.ax/upload.php', { 
        method: 'POST', 
        body: form,
        headers: { ...form.getHeaders() } 
    });
    if (!res.ok) {
         const errorText = await res.text();
         throw new Error(`Qu.ax Gagal: ${res.statusText} (Status: ${res.status}) - ${errorText}`);
    }
    const json = await res.json();
    if (!json.files?.[0]?.url) {
         console.error('Qu.ax Response:', JSON.stringify(json, null, 2));
         throw new Error('Qu.ax Gagal: Respons tidak valid (URL tidak ditemukan)');
    }
    return json.files[0].url;
}


// --- HANDLER UTAMA ---

let handler = async (m, { conn, usedPrefix, command }) => {
    try {
        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || q.mediaType || '';

        if (!mime || mime === 'conversation') {
            return conn.reply(m.chat, `Kirim atau balas media (gambar, video, dokumen, stiker, dll) dengan perintah *${usedPrefix + command}*`, m);
        }

        await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

        const media = await q.download();
        if (!media) throw new Error("Gagal mengunduh media.");
        
        const fileSize = formatBytes(media.length); 

        const { ext } = await fileTypeFromBuffer(media) || { ext: 'bin' };
        const filename = `upload-${Date.now()}.${ext}`;

        // --- Tambahkan promise baru ke allSettled ---
        const results = await Promise.allSettled([
            uploadToCatbox(media),
            uploadToYupra(media, filename),
            uploadToCloudku(media),
            uploadToZenzxz(media, filename),
            uploadToTop4Top(media),
            uploadToUguu(media),
            uploadToLunara(media, filename),
            uploadToTmpfiles(media, filename),
            uploadToVyzen(media, filename),
            uploadToBahlil(media, filename),
            uploadToUbed(media, filename),
            uploadToDeline(media, filename),
            uploadToFaa(media, filename),
            uploadToElrayy(media, filename),
            uploadToQuAx(media, filename)
        ]);
        
        const serviceNames = [
            "Catbox", "Yupra", "Cloudku", "Zenzxz", "Top4Top", 
            "Uguu", "Lunara", "Tmpfiles", "Vyzen", "Bahlil", "Ubed",
            "Deline", "Faa", "Elrayy", "Qu.ax"
        ];

        let detailsText = "";
        let buttons = [];

        results.forEach((res, index) => {
            const name = serviceNames[index];
            if (res.status === 'fulfilled' && res.value) {
                const url = res.value;

                detailsText += `┌ • *${name}*\n`;
                detailsText += `├ › URL: ${url}\n`;
                detailsText += `├ › Size: ${fileSize}\n`; 
                const expired = (name === "Tmpfiles") ? "2 Hari" : "Permanen";
                detailsText += `└ › Expired: ${expired}\n\n`;
                
                buttons.push({
                    name: "cta_copy",
                    buttonParamsJson: JSON.stringify({
                        display_text: `📋 Salin URL ${name}`,
                        copy_code: url
                    })
                });
            } else if (res.status === 'rejected') {
                console.warn(`Gagal upload ke ${name}: ${res.reason?.message || res.reason}`);
                detailsText += `┌ • *${name}*\n`;
                detailsText += `└ › Status: Gagal ❌\n\n`;
            }
        });

        if (buttons.length === 0) {
            throw new Error("Gagal mengunggah ke semua layanan. Coba lagi nanti.");
        }
        
        const title = "Media berhasil diupload ✅\n";
        const bodyText = title + detailsText.trim();
        
        const msg = proto.Message.fromObject({
            interactiveMessage: {
                body: { text: bodyText },
                footer: { text: `© Multi-Uploader ${global.namebot}` },
                nativeFlowMessage: { buttons }
            }
        });

        await conn.relayMessage(m.chat, { viewOnceMessage: { message: msg } }, {});
        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (error) {
        console.error(error);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        conn.reply(m.chat, `Terjadi Kesalahan: ${error.message}`, m);
    }
};

handler.help = ['tourl2', 'upload2'];
handler.tags = ['tools'];
handler.command = /^(tourl2|upload2|unggah2)$/i;
handler.limit = true;

export default handler;