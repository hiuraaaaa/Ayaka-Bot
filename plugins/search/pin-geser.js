const { generateWAMessageFromContent, prepareWAMessageMedia, proto } = (await import("@adiwajshing/baileys")).default;
import axios from "axios";
import https from "https";

let handler = async (m, { text, command, conn }) => {
    if (!text) throw "Masukkan kata kunci pencarian!";

    try {
        await conn.sendMessage(m.chat, { react: { text: "🔍", key: m.key } });

        // Mendapatkan cookies yang diperlukan
        const cookies = await getCookies(); // Fungsi untuk mendapatkan cookies dari Pinterest
        if (!cookies) throw "Gagal mendapatkan data dari Pinterest!";

        const url = 'https://www.pinterest.com/resource/BaseSearchResource/get/';
        const params = {
            source_url: `/search/pins/?q=${encodeURIComponent(text)}`,
            data: JSON.stringify({
                options: {
                    isPrefetch: false,
                    query: text,
                    scope: "pins",
                    no_fetch_context_on_resource: false
                },
                context: {}
            }),
            _: Date.now()
        };

        const headers = {
            'accept': 'application/json, text/javascript, */*, q=0.01',
            'accept-encoding': 'gzip, deflate',
            'accept-language': 'en-US,en;q=0.9',
            'cookie': cookies,
            'dnt': '1',
            'referer': 'https://www.pinterest.com/',
            'sec-ch-ua': '"Not(A:Brand";v="99", "Microsoft Edge";v="133", "Chromium";v="133"',
            'sec-ch-ua-full-version-list': '"Not(A:Brand";v="99.0.0.0", "Microsoft Edge";v="133.0.3065.92", "Chromium";v="133.0.6943.142"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-model': '""',
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua-platform-version': '"10.0.0"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0',
            'x-app-version': 'c056fb7',
            'x-pinterest-appstate': 'active',
            'x-pinterest-pws-handler': 'www/[username]/[slug].js',
            'x-pinterest-source-url': '/hargr003/cat-pictures/',
            'x-requested-with': 'XMLHttpRequest'
        };

        // Membuat agent untuk https
        const agent = new https.Agent({ keepAlive: true });

        // Mendapatkan data dari Pinterest
        const { data } = await axios.get(url, { httpsAgent: agent, headers, params });

        if (!data || !data.resource_response || !data.resource_response.data || !data.resource_response.data.results) {
            throw "Gambar tidak ditemukan di Pinterest!";
        }

        let results = data.resource_response.data.results.slice(0, 10); // Ambil maksimal 10 gambar
        let push = [];

        for (let img of results) {
            const media = await prepareWAMessageMedia(
                { image: { url: img.images.orig.url } },
                { upload: conn.waUploadToServer }
            );

            push.push({
                header: proto.Message.InteractiveMessage.Header.fromObject({
                    title: `🔎 ${text}`,
                    hasMediaAttachment: true,
                    ...media
                }),
                body: proto.Message.InteractiveMessage.Body.fromObject({
                    text: "Klik tombol di bawah untuk melihat gambar di Pinterest"
                }),
                footer: proto.Message.InteractiveMessage.Footer.fromObject({
                    text: "Pinterest Search"
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                    buttons: [
                        {
                            name: "cta_url",
                            buttonParamsJson: JSON.stringify({
                                display_text: "🔗 Kunjungi Gambar",
                                url: `https://id.pinterest.com/pin/${img.id}`
                            })
                        }
                    ]
                })
            });
        }

        const msg = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2
                    },
                    businessMessageForwardInfo: { businessOwnerJid: conn.decodeJid(conn.user.id) },
                    forwardingScore: 256,
                    interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                        body: proto.Message.InteractiveMessage.Body.create({
                            text: `🔎 *Hasil pencarian untuk:* ${text}`
                        }),
                        footer: proto.Message.InteractiveMessage.Footer.create({
                            text: "Pinterest Search"
                        }),
                        carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                            cards: [...push]
                        })
                    })
                }
            }
        }, { userJid: m.chat, quoted: m });

        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

    } catch (e) {
        console.error("Error:", e);
        await conn.sendMessage(m.chat, { text: "Terjadi kesalahan! Coba lagi nanti." });
    }
};

// Fungsi untuk mendapatkan cookies Pinterest
async function getCookies() {
    try {
        const response = await axios.get('https://www.pinterest.com/csrf_error/');
        const setCookieHeaders = response.headers['set-cookie'];
        if (setCookieHeaders) {
            const cookies = setCookieHeaders.map(cookieString => {
                const cookieParts = cookieString.split(';');
                return cookieParts[0].trim();
            });
            return cookies.join('; ');
        }
        return null;
    } catch (error) {
        console.error("Gagal mendapatkan cookies:", error);
        return null;
    }
}

handler.help = ["pinterest <query>"];
handler.tags = ["internet"];
handler.command = /^(pinterestgeser|pingeser)$/i;

export default handler;