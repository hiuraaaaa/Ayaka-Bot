import axios from "axios";
import FormData from "form-data";
import crypto from "node:crypto";
import {
    fileTypeFromBuffer
} from "file-type";
const {
    generateWAMessageFromContent,
    prepareWAMessageMedia,
    proto
} = (await import('@adiwajshing/baileys')).default;

let isProcessing = false;
let isCooldown = false;
const fkontak = {
    key: {
        participant: "0@s.whatsapp.net",
        remoteJid: "0@s.whatsapp.net",
        fromMe: false,
        id: "Hello"
    },
    message: {
        conversation: "AI Mirror Cowok ♂️"
    }
};

const getPrompts = (name) => [{
    name: "Toilet Barcelona Hoodie 🚽",
    prompt: `Buatkan gambar Mirror selfie seorang pria (tanpa mengubah bentuk wajah, bentuk lekuk tubuh tinggi badan berat badan dan postur tubuh agar tetap sesuai dengan gambar) di dalam toilet bergaya modern. la mengenakan Hoodie berwana hitam oversize lengkap dengan gambar logo Barcelona dan memakai earbud putih di telinga. Tangan kanan memegang ponsel iPhone 16 promax berwarna hitam, mengambil gambar ke arah cermin. pertahankan wajah asli pada gambar tersebut tanpa berubah sedikit pun. Latar belakang menunjukkan dinding abu- abu gelap dan pintu bilik toilet, dengan pola lantai kotak-kotak hitam putih. Bagian atas dinding dihiasi ubin berpola seperti sisik ikan berwarna abu-abu, serta lampu neon panjang yang memantul di cermin, menambah kesan industrial dan kontemporer pada ruangan.`
}, {
    name: "Kamar Tidur Berotot 🎸",
    prompt: `Sebuah foto cermin yang diambil di dalam kamar tidur. Seorang pria berotot bertelanjang dada sedang berpose (tanpa merubah bentuk wajah karakter pada foto tetapi rubah warna wajah karakter dengan warna yang sama seperti warna tubuhnya), memegang botol kaca. Kamar tersebut didekorasi dengan gaya modern, dindingnya dipenuhi poster film dan musik. Di belakangnya terlihat sebuah tempat tidur dengan seprai putih dan dua gitar akustik digantung di dinding. Di bagian bawah cermin, ada rak berisi berbagai botol parfum dan kosmetik. Pencahayaan ruangan berwarna biru keunguan, menciptakan suasana yang intim dan artistik.`
}, {
    name: "Denim Black Stylish 😎",
    prompt: `Karakter (tanpa mengubah bentuk wajah, bentuk lekuk tubuh tinggi badan berat badan dan postur tubuh agar tetap sesuai dengan gambar) bergaya dengan fitur wajah [gambar referensi], berdiri di kamar mandi mengambil selfie cermin. Dia memakai kacamata hitam persegi panjang yang ramping, dimiringkan sedikit ke bawah sehingga matanya mengintip dari atas, menambah kesan percaya diri dan ceria. 
Pakaian: jaket denim hitam oversized di atas kaos hitam pas badan, dipadukan dengan jeans hitam dan ikat pinggang hitam dengan gesper metalik. Asesorisnya termasuk kalung rantai perak tebal dan cincin perak. Dia memegang smartphone di satu tangan sementara tangan lainnya bersandar santai di dekat ikat pinggangnya. 
Latar Belakang: dinding kamar mandi ubin marmer krem ​​​​muda dengan pintu kayu di belakangnya. Pencahayaan realistis, bidikan kamera ponsel vertikal, suasana dalam ruangan alami.`
}, {
    name: "Black Tee Aesthetic 🖤",
    prompt: `Buatlah foto karakter (tanpa mengubah bentuk wajah, bentuk lekuk tubuh, tinggi badan, berat badan, dan postur tubuh agar tetap sesuai dengan gambar tetapi abaikan semua aksesoris pada gambar seperti benda, piala, dan lain lain) sedang berfoto miror di kaca dengan menggunakan hp iPhone 17 Pro Max tanpa flash, sehingga menghasilkan foto yang aesthetic

UNTUK FOTO UTAMA

buat lah gambar yang di ambil dengan seperti foto biasa, tanpa subjek atau properti yang jelas. foto tersebut harus memiliki sumber cahaya yang konsisten, seperti lampu kilat dan ruangan gelap, yang tersebar di seluruh foto, jangan rubah wajah foto terseebut. ganti latar belakang, di belakang orang tersebut dengan kaca yang sangat bersih, serta menggunakan kaos warna hitam dan model rambut nya jangan di ubah`
}, {
    name: "Y2K Fish-Eye Selfie 🤳",
    prompt: `Selfie cermin cembung yang terinspirasi retro Y2K di dalam kamar tidur eklektik yang unik di malam hari. karakter (Karakter adalah cowok, tanpa mengubah bentuk wajah, bentuk lekuk tubuh tinggi badan berat badan dan postur tubuh agar tetap seduai dengan gambar senyuman lembut dan ceria) ditangkap melalui cermin cembung bulat besar berbingkai merah, menciptakan pantulan melengkung bergaya mata ikan. Membingkai dirinya menghadapi dengan elegan.`
}, {
    name: "Parfum Mist Warmth 🧴",
    prompt: `buatlah foto karakter cowok (tanpa mengubah bentuk wajah, bentuk lekuk tubuh, tinggi badan, berat badan, dan postur tubuh agar tetap seduai dengan gambar), dilihat dari dada ke atas, memegang parfum di cermin kamar mandi. Bayangannya terlihat di latar depan di sebelah kiri, menunjukkan bagian belakang kepala dan bahunya. Karakter dalam pantulan itu menatap Parfumnya dengan saksama sambil semprot parfumnya (dengan detail terdapat asap atau percikan dari parfum). Dia memiliki tampilan riasan alami dengan fokus pada mata yang tegas dan bibir yang lembut dan penuh. Kulitnya bersih dengan cahaya yang sehat. Dia mengenakan atasan gelap sederhana. Di lengan kirinya, dia memakai gelang halus dan cincin di jari manisnya. Pengaturan kamar mandi remang-remang dengan cahaya sekitar yang hangat, memberikan gambar yang lembut, sedikit kasar, dan intim. Cermin memiliki bingkai gelap, dan di belakangnya di latar belakang, tidak fokus, ada ubin gelap dan beberapa perlengkapan mandi di rak atau meja, termasuk botol kecil yang dia pegang di tangan kirinya, mungkin lebih banyak riasan atau minuman. Estetika keseluruhan alami, santai, dan sedikit retro karena kualitas seperti film. Jaga detail wajah dengan benar. Tolong jangan mengubah fitur wajah saya dan biarkan posisi kepala seperti pada pantulan dan tampilan utama.`
}];

class GridPlus {
    constructor() {
        this.ins = axios.create({
            baseURL: "https://api.grid.plus/v1",
            headers: {
                "user-agent": "Mozilla/5.0 (Android 15; Mobile; SM-F958; rv:130.0) Gecko/130.0 Firefox/130.0",
                "X-AppID": "808645",
                "X-Platform": "h5",
                "X-Version": "8.9.7",
                "X-SessionToken": "",
                "X-UniqueID": this.uid(),
                "X-GhostID": this.uid(),
                "X-DeviceID": this.uid(),
                "X-MCC": "id-ID",
                sig: `XX${this.uid() + this.uid()}`
            }
        });
    }

    uid() {
        return crypto.randomUUID().replace(/-/g, "");
    }

    form(dt) {
        const form = new FormData();
        Object.entries(dt).forEach(([key, value]) => {
            form.append(key, String(value));
        });
        return form;
    }

    async upload(buff, method) {
        try {
            if (!Buffer.isBuffer(buff)) throw new Error("Data is not a valid buffer!");

            const fileInfo = await fileTypeFromBuffer(buff);
            if (!fileInfo) throw new Error("❌ Unable to detect file type!");
            const {
                mime,
                ext
            } = fileInfo;

            const d = await this.ins.post("/ai/web/nologin/getuploadurl", this.form({
                    ext,
                    method
                }))
                .then(i => i.data);

            if (!d?.data?.upload_url || !d?.data?.img_url)
                throw new Error("Upload URL not received from server!");

            await axios.put(d.data.upload_url, buff, {
                headers: {
                    "content-type": mime
                }
            });

            return d.data.img_url;
        } catch (e) {
            console.error("UPLOAD ERROR:", e.message);
            throw new Error("Upload failed: " + e.message);
        }
    }

    async task({
        path,
        data,
        sl = () => false
    }) {
        const [start, interval, timeout] = [Date.now(), 3000, 60000]; // Waktu tunggu 60 detik
        return new Promise(async (resolve, reject) => {
            const check = async () => {
                if (Date.now() - start > timeout) {
                    return reject(new Error(`Polling timed out for path: ${path}`));
                }
                try {
                    const dt = await this.ins({
                        url: path,
                        method: data ? "POST" : "GET",
                        ...(data ? {
                            data
                        } : {})
                    });
                    if (!!dt.errmsg?.trim()) return reject(new Error(`Error message: ${dt.errmsg}`));
                    if (!!sl(dt.data)) return resolve(dt.data);
                    setTimeout(check, interval);
                } catch (error) {
                    reject(error);
                }
            };
            check();
        });
    }

    async edit(buff, prompt) {
        try {
            const up = await this.upload(buff, "wn_aistyle_nano");
            const dn = await this.ins.post("/ai/nano/upload", this.form({
                prompt,
                url: up
            })).then(i => i.data);
            if (!dn.task_id) throw new Error("taskId not found on request!");
            const res = await this.task({
                path: `/ai/nano/get_result/${dn.task_id}`,
                sl: (dt) => dt.code === 0 && !!dt.image_url
            });
            return res.image_url;
        } catch (e) {
            throw new Error("❌ Something error, message: " + e.message);
        }
    }
}
let handler = async (m, {
    conn,
    usedPrefix,
    command
}) => {
    if (isProcessing) {
        return conn.reply(m.chat, '⏳ Fitur AI *Mirror Cowok* sedang digunakan oleh pengguna lain. Mohon tunggu sebentar...', m, {
            quoted: fkontak
        });
    }
    if (isCooldown) {
        return conn.reply(m.chat, '⏳ Fitur *Mirror Cowok* baru saja selesai digunakan. Mohon tunggu 10 detik sebelum mencoba lagi.', m, {
            quoted: fkontak
        });
    }

    const text = m.text.slice(usedPrefix.length + command.length).trim();
    const name = text;

    if (!name) {
        return conn.reply(m.chat, `❗Harap masukkan nama Anda untuk menggunakan fitur AI To Mirror.\n\n*📝 Contoh:* ${usedPrefix + command} ${global.namebot}`, m, {
            quoted: fkontak
        });
    }

    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q.imageMessage || q.stickerMessage || q).mimetype || q.mediaType || "";
    if (!mime || !/image\/(jpe?g|png|webp)/.test(mime)) {
        return conn.sendMessage(m.chat, {
            text: `*❗Reply/Balas sebuah gambar dengan caption.*\n\n*📝 Contoh:* ${usedPrefix + command} ${global.namebot}`
        }, {
            quoted: fkontak
        });
    }

    try {
        isProcessing = true;
        const prompts = getPrompts(name);
        await conn.sendMessage(m.chat, {
            text: `⏳ Sedang membuat ${prompts.length} model AI *Solo Mirror*, mohon tunggu sebentar...\n> Ini mungkin memakan waktu beberapa menit.`
        }, {
            quoted: fkontak
        });
        let imgBuffer = await q.download();
        if (!imgBuffer) {
            throw new Error('❌ Gagal mengunduh gambar, silakan coba lagi.');
        }

        const grid = new GridPlus();
        const finalImageUrls = [];
        const finalConfigs = [];
        for (const config of prompts) {
            try {
                console.log(`Mencoba memproses prompt: ${config.name}...`);
                const resultUrl = await grid.edit(imgBuffer, config.prompt);
                finalImageUrls.push(resultUrl);
                finalConfigs.push(config);
                console.log(`Berhasil memproses prompt: ${config.name}`);
            } catch (error) {
                console.error(`Gagal memproses prompt ${config.name}:`, error.message);
                conn.reply(m.chat, `❌ Gagal memproses gaya "${config.name}". Melanjutkan...`, m);
            }
        }

        if (finalImageUrls.length === 0) {
            throw new Error('❌ Gagal memproses gambar di semua API. Silakan coba lagi nanti.');
        }
        let carouselCards = [];
        for (let i = 0; i < finalImageUrls.length; i++) {
            const url = finalImageUrls[i];
            const config = finalConfigs[i];
            const media = await prepareWAMessageMedia({
                image: {
                    url: url
                }
            }, {
                upload: conn.waUploadToServer
            });

            const card = {
                header: proto.Message.InteractiveMessage.Header.fromObject({
                    title: `${config.name}`,
                    hasMediaAttachment: true,
                    ...media
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                    buttons: [{
                        name: "cta_url",
                        buttonParamsJson: JSON.stringify({
                            display_text: "🔗 Lihat Gambar HD",
                            url: url
                        })
                    }]
                })
            };
            carouselCards.push(card);
        }
        const msg = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2
                    },
                    interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                        body: proto.Message.InteractiveMessage.Body.create({
                            text: `*Berikut adalah ${carouselCards.length} hasil AI Mirror Cowok:*`
                        }),
                        footer: proto.Message.InteractiveMessage.Footer.create({
                            text: "Geser untuk melihat hasil lainnya"
                        }),
                        carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                            cards: carouselCards
                        })
                    })
                }
            }
        }, {
            userJid: m.chat,
            quoted: m
        });

        await conn.relayMessage(m.chat, msg.message, {
            messageId: msg.key.id
        });

    } catch (e) {
        console.error("PLUGINS ERROR:", e);
        conn.sendMessage(m.chat, {
            text: `*ERROR:*\n\n${e.message}`
        }, {
            quoted: fkontak
        });

    } finally {
        isProcessing = false;
        isCooldown = true;
        console.log('Memulai jeda 10 detik...');
        setTimeout(() => {
            isCooldown = false;
            console.log('Jeda selesai. Fitur siap digunakan.');
        }, 10000);
    }
};

handler.help = ["mirrorcowok <nama>"];
handler.tags = ["ai"];
handler.command = ["mirrorcowok"];
handler.limit = true;
handler.register = true;

export default handler;