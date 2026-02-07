import axios from 'axios';
import FormData from 'form-data'; // Pastikan ini sudah diimpor
import { Readable } from 'stream'; // Impor Readable untuk mengolah buffer menjadi stream

const handler = async (m, { conn, text, usedPrefix, command }) => {
    let pdfUrl = null;
    let query = null;

    // Ambil domain dan API Key Maelyn dari global.maelyn di config.js
    const maelynDomain = global.maelyn.domain;
    const maelynApiKey = global.maelyn.key;

    // Lakukan validasi dasar untuk memastikan konfigurasi ada
    if (!maelynDomain || !maelynApiKey) {
        throw 'API Key atau Domain Maelyn untuk Gemini PDF belum diatur di config.js! Mohon hubungi pemilik bot.';
    }

    // --- LOGIC UNTUK MENDAPATKAN URL PDF DAN QUERY ---
    // Cek apakah ada reply dokumen
    if (m.quoted && m.quoted.mimetype === 'application/pdf') {
        const quotedPdf = m.quoted;
        try {
            // Dapatkan buffer dari dokumen yang direply
            const buffer = await quotedPdf.download();

            // Ubah buffer menjadi Readable stream agar FormData bisa mengunggahnya
            const stream = Readable.from(buffer);

            // Unggah ke Catbox (atau layanan serupa) untuk mendapatkan URL publik
            const formData = new FormData();
            formData.append('reqtype', 'fileupload');
            // Gunakan stream di sini, dan berikan nama file serta contentType
            formData.append('fileToUpload', stream, {
                filename: 'document.pdf', // Nama file yang akan terlihat di server
                contentType: 'application/pdf', // Tipe konten file
            });

            const catboxResponse = await axios.post('https://catbox.moe/user/api.php', formData, {
                headers: formData.getHeaders(),
            });

            pdfUrl = catboxResponse.data;
            if (!pdfUrl || !pdfUrl.includes('catbox.moe')) {
                await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                throw 'Gagal mengunggah PDF ke Catbox untuk diproses. Mungkin masalah server Catbox atau response tidak valid.';
            }
            // Jika ada teks setelah command saat mereply, itu adalah query
            query = text || 'Ringkaskan Isi PDF ini'; // Default query jika tidak ada teks
        } catch (e) {
            console.error('Error saat memproses atau mengunggah PDF yang direply:', e);
            await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            throw `Gagal memproses PDF yang direply: ${e.message}`;
        }
    } else if (text) {
        // Jika tidak ada reply PDF, coba parsing dari teks
        const parts = text.split('|').map(s => s.trim());
        if (parts.length < 2) {
            throw `Format salah. Harap gunakan: *${usedPrefix}${command} [pertanyaan] | [URL_PDF]*\n\nContoh: *${usedPrefix}${command} Ringkaskan Isi PDF ini | https://example.com/dokumen.pdf*\n\nAtau reply dokumen PDF dengan caption *${usedPrefix}${command} [pertanyaan]*`;
        }
        query = parts[0];
        pdfUrl = parts[1];

        // Validasi URL sederhana
        if (!/^https?:\/\/.+\.pdf$/i.test(pdfUrl)) {
            throw 'URL yang diberikan bukan URL PDF yang valid. Pastikan URL dimulai dengan http/https dan berakhiran .pdf';
        }
    } else {
        // Jika tidak ada teks maupun reply PDF
        throw `Hai! Aku bisa meringkas isi PDF untukmu.\n\nContoh: *${usedPrefix}${command} Ringkaskan Isi PDF ini | https://example.com/dokumen.pdf*\n\nAtau reply dokumen PDF dengan caption *${usedPrefix}${command} [pertanyaan]*`;
    }

    await conn.sendMessage(m.chat, { react: { text: '🍏', key: m.key } }); // Reaksi loading

    try {
        // Encode query dan URL PDF untuk keamanan URL
        const encodedQuery = encodeURIComponent(query);
        const encodedPdfUrl = encodeURIComponent(pdfUrl);

        // Bangun URL API
        const apiUrl = `${maelynDomain}/api/gemini/pdf?q=${encodedQuery}&url=${encodedPdfUrl}&apikey=${maelynApiKey}`;

        // Kirim permintaan GET ke Maelyn API
        const response = await axios.get(apiUrl);
        const { status, result, code } = response.data;

        if (status === 'Success' && code === 200 && result) {
            await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } }); // Reaksi sukses
            m.reply(result); // Result langsung berupa string ringkasan
        } else {
            await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } }); // Reaksi gagal
            m.reply(`❌ Gagal mendapatkan ringkasan dari PDF. Respon API: ${JSON.stringify(response.data)}`);
        }
    } catch (e) {
        console.error(e);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } }); // Reaksi error
        m.reply(`Terjadi kesalahan saat menghubungi Gemini PDF API: ${e.message}`);
    }
};

handler.help = ['pdfsum', 'ringkaspd', 'geminipdf'];
handler.tags = ['ai', 'tools'];
handler.command = /^(pdfsum|ringkaspd|geminipdf)$/i; // Menggunakan regex untuk beberapa alias
handler.limit = true; // Batasi penggunaan jika perlu
handler.premium = false; // Hanya untuk pengguna non-premium jika perlu

export default handler;