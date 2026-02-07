import axios from 'axios';

const fkontak = {
    key: {
        participant: '0@s.whatsapp.net',
        remoteJid: "0@s.whatsapp.net",
        fromMe: false,
        id: "Halo",
    },
    message: {
        conversation: `Video Facebook pilihanmu siap diputar ✅`
    }
};
async function getToken() {
    const url = "https://fbdownloader.to/id";
    const { data: html } = await axios.get(url, {
        headers: {
            "User-Agent": "Mozilla/5.0",
            "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7"
        }
    });

    const regex = /k_exp="(.*?)".*?k_token="(.*?)"/s;
    const match = html.match(regex);
    if (!match) throw new Error("Token tidak ditemukan");

    return { k_exp: match[1], k_token: match[2] };
}

async function fbDownloader(fbUrl) {
    const { k_exp, k_token } = await getToken();

    const payload = new URLSearchParams({
        k_exp,
        k_token,
        p: "home",
        q: fbUrl,
        lang: "id",
        v: "v2",
        W: ""
    });

    const { data } = await axios.post(
        "https://fbdownloader.to/api/ajaxSearch",
        payload,
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "User-Agent": "Mozilla/5.0",
                "X-Requested-With": "XMLHttpRequest",
                "Origin": "https://fbdownloader.to",
                "Referer": "https://fbdownloader.to/id"
            }
        }
    );

    if (!data?.data) throw new Error("Gagal mengambil data");

    const html = data.data;
    const results = [];
    const rowRegex = /<td class="video-quality">(.*?)<\/td>[\s\S]*?(?:href="(.*?)"|data-videourl="(.*?)")/g;
    let match;
    while ((match = rowRegex.exec(html)) !== null) {
        const quality = match[1].trim();
        const url = match[2] || match[3];
        if (quality && url) results.push({ quality, url });
    }

    return results;
}

const handler = async (m, { conn, text }) => {

    if (!text) return conn.reply(m.chat, 'Silakan masukkan URL Facebook.', m, { quoted: fkontak });

    try {
        await conn.reply(m.chat, `${global.wait}`, m, { quoted: fkontak });

        const videos = await fbDownloader(text);
        if (!videos || videos.length === 0) return conn.reply(m.chat, 'Gagal mengambil video. Pastikan URL benar.', m, { quoted: fkontak });

        const videoData = videos.find(v => v.quality.toUpperCase() === 'HD') || videos[0];
        if (!videoData?.url) return conn.reply(m.chat, 'Gagal mendapatkan link video.', m, { quoted: fkontak });

        const caption = `✅ *Konten Facebook berhasil diunduh!*\n\n📽️ Nikmati kontennya langsung dari bot ini.\n❤️ Dukung terus bot ini dengan donasi agar tetap aktif dan berkembang!`;

        await conn.sendMessage(m.chat, { video: { url: videoData.url }, caption }, { quoted: fkontak });

    } catch (error) {
        console.error(error);

        conn.reply(m.chat, '❌ Terjadi kesalahan saat mengambil atau mengunduh video.', m, { quoted: fkontak });
    }
};

handler.help = ['facebook'];
handler.tags = ['downloader'];
handler.command = /^(facebook|fb|fbdl)$/i;
handler.limit = true;
handler.daftar = true;

export default handler;