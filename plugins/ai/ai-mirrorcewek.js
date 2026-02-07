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
        conversation: "AI Mirror Cewek ♀️"
    }
};

const getPrompts = (name) => [{
    name: "Lip Gloss Mirror 💄",
    prompt: `Buat foto saya dalam bidikan hangat dan jujur seorang wanita muda dengan rambut cokelat tua panjang bergelombang, dilihat dari dada ke atas, mengoleskan lip gloss di cermin kamar mandi. Bayangannya terlihat di latar depan di sebelah kiri, menunjukkan bagian belakang kepala dan bahunya. Wanita dalam pantulan itu menatap bibirnya dengan saksama sambil mengoleskan gloss dengan tongkat. Dia memiliki tampilan riasan alami dengan fokus pada mata yang tegas dan bibir yang lembut dan penuh. Kulitnya bersih dengan cahaya yang sehat. Dia mengenakan atasan gelap sederhana, mungkin tank top atau kamisol, memperlihatkan bahunya yang telanjang. Di lengan kirinya, dia memakai gelang halus dan cincin di jari manisnya. Pengaturan kamar mandi remang-remang dengan cahaya sekitar yang hangat, memberikan gambar yang lembut, sedikit kasar, dan intim. Cermin memiliki bingkai gelap, dan di belakangnya di latar belakang, tidak fokus, ada ubin gelap dan beberapa perlengkapan mandi di rak atau meja, termasuk botol kecil yang dia pegang di tangan kirinya, mungkin lebih banyak riasan atau minuman. Estetika keseluruhan alami, santai, dan sedikit retro karena kualitas seperti film. Jaga detail wajah dengan benar. Tolong jangan mengubah fitur wajah saya dan biarkan posisi kepala seperti pada pantulan dan tampilan utama.`
}, {
    name: "Hoodie Streetwear Swafoto 🤳",
    prompt: `Buatkan foto Karakter tanpa mengubah referensi wajah, sedang mengambil swafoto di depan cermin dengan menggunakan ponsel. Ia mengenakan hoodie hitam dengan tudung yang menutupi sebagian rambutnya, berpose dari samping sambil memegang ponsel dengan satu tangan. Pantulan cahaya flash dari kamera ponsel menciptakan efek sinar yang memancar secara diagonal, menambah kesan dramatis pada foto.
Tanpa mengubah referensi rambut, rambut jatuh di dahi dan menutupi sebagian wajah. Di tangannya terdapat satu cincin di jari telunjuk yang memberi kesan edgy dan stylish.
Tulisan (${name}) berukuran besar berwarna putih terlihat di bagian belakang hoodie, menciptakan kontras kuat dengan warna hitam pekat kain.
Latar belakang menunjukkan interior ruangan modern dengan dinding putih, meja kayu, dan jendela besar yang memancarkan cahaya lembut dari luar.
pose:
Karakter berdiri membelakangi arah cermin, tapi tubuhnya sedikit miring ke samping kiri.
Wajahnya hanya terlihat dari samping (profil kiri) karena ia memegang ponsel di depan wajah untuk selfie.
Tangan kiri memegang ponsel di depan wajah dengan posisi agak tinggi (sejajar dengan mata).
Jari-jari tangan membentuk posisi santai namun kuat — sebagian menutupi bagian bawah wajah.
Tangan kanan tidak terlihat jelas, kemungkinan berada di sisi tubuh.
Bahunya agak naik sedikit karena posisi tangan mengangkat ponsel.
Pose secara keseluruhan terlihat santai tapi bergaya, memunculkan aura cool, misterius, dan sedikit edgy.
Gaya pencahayaan: Hd kontras tinggi, dengan efek flare cahaya dari kamera.
Nuansa foto: misterius, cool, minimalis, modern, dan bergaya urban streetwear.
Gaya visual: fotografi reflektif artistik, potret bergaya mirror selfie, komposisi sinematik, tone lembut tapi kontras, realistik dengan detail pakaian dan cahaya yang jelas.`
}, {
    name: "Gamer Flash Selfie 📸",
    prompt: `Buatlah gambar Karakter dengan wajah, mata, hidung, dan mulut yang sama. Yang asli dilarang (98%). Gambar sudut lebar, melihat seluruh tubuh, satu tangan menyisir rambut. Riasan: warna natural, kulit putih bersih, pipi merah jambu, bibir merah jambu. Bulu mata merah dan panjang saat tidur

Foto potret Karakter Mengambil selfie di cermin/sama Nyalakan ponsel cerdas Anda dengan lampu kilat yang terang, dan sorot lampu dari ruangan di wajah dan tubuh Anda agar menonjol. Detail orang:

Pakaian yang dia kenakan sesuai dengan gambar terlampir.
Memegang smartphone (kemungkinan iPhone baru), abu-abu tua/perak. 

Postur tubuh: Duduk atau setengah duduk Di kursi, ambil foto selfie di cermin dengan mengangkat Ponsel muncul dan menyalakan lampu kilat kamera. Ciptakan wajah yang menawan dan melamun. Detail latar belakang/lingkungan:

Latar belakangnya adalah kamar pribadi/kamar tidur/ruang permainan di malam hari. Di bagian belakang terdapat kursi gaming besar berwarna pink/merah dengan logo. Sisi kiri terdapat rak terbuka. Ada banyak item yang dipajang. Seperti gambar, model, barang koleksi kecil, dan perlengkapan elektronik (seperti lampu LED, kabel). Cahaya pada gambar terlihat lembut/sedikit terang.

Filter kamera bergaya flash-in-the-dark
Detail kamera: Menggunakan kamera Canon EOS R5, RF`
}, {
    name: "Gaya Awal 2000-an 🧑‍🎤",
    prompt: `Foto gaya awal tahun 2000-an yang menampilkan Karakter (TANPA MERUBAH WAJAH DAN SELURUH POSTUR TUBUH!) dengan rambut panjang diikat longgar di sanggul yang diikat dengan klip hitam. Merah Chom Phra Ruea, bening, set terlampir. Dibidik dengan kamera digital berkualitas rendah, gaya tahun 2000-an, lampu kilat langsung dengan efek cahaya menyebar lembut, lampu kilat tersebar, sorotan sedikit berlebihan, tekstur sedikit berbintik. Emosi gambar yang mentah dan alami, suasana digital vintage, rasio aspek 4:3, gambar diam bergaya film. Fotografi Mode Editorial 8K, sebuah mahakarya Karakter realistis yang terpantul di layar komputer, duduk di kursi komputer di ruangan gelap, tangan mengambil foto selfie dengan iPhone, gambar yang only terlihat di layar komputer, gaya rambut asli, rambut diikat longgar, pipi merah muda, senyum manis, lidah gemetar, ekspresi imut, memakai kacamata dan pantulan lembut. dan sedikit kabur pada layar laptop Pada layar Anda akan melihat ikon desktop, taskbar, dan jendela program. Terasa seperti era komputer, awal tahun 2000an. Foto bagian depan. Beberapa tepi layar terlihat. Sidik jari dan pantulan cahaya ponsel yang mengenai wajah terlihat. Nada hangat, sedikit berbintik, gaya kamera digital tahun 2000-an. Warna pastel dan lembut.`
}, {
    name: "Kamar Tidur Artistik 🛏️",
    prompt: `Sebuah foto cermin yang diambil di dalam kamar tidur. Seorang karakter (tanpa merubah apapun dalam diri karakter), memegang botol kaca. Kamar tersebut didekorasi dengan gaya modern, dindingnya dipenuhi poster film dan musik. Di belakangnya terlihat sebuah tempat tidur dengan seprai putih dan dua gitar akustik digantung di dinding. Di bagian bawah cermin, ada rak berisi berbagai botol parfum dan kosmetik. Pencahayaan ruangan berwarna biru keunguan, menciptakan suasana yang intim dan artistik.`
}, {
    name: "Mall Mirror Flash 🔦",
    prompt: `Buatlah foto ini sedang berfoto mirror dikaca dengan menggunakan hp iphone 13 pro max dengan flash, sehingga menghasilkan foto yang aestetic

UNTUK FOTO UTAMA

buatlah gambar yang diambil dengan seperti foto biasa, tanpa subjek atau properti yang jelas. foto tersebut harus memiliki sedikit efek blur dan sumber cahaya yang konsisten, seperti lampu kilat dari ruangan gelap, yang tersebar di seluruh foto. jangan ubah wajah foto tersebut. ganti latar belakang dengan tempat shopping baju di mall. serta menggunakan baju tank top warna hitam dan celana jeans vcurt bray warna abu abu, buatlah sedikit membentuk body yang bagus dan langsing`
}, {
    name: "Y2K City Flash Selfie 🤳",
    prompt: `Buat potret realistis (100% mirip wajah, jangan diedit) Foto gaya awal tahun 2000-an seorang gadis dengan rambut panjang, rambut tergerai, riasan tipis, bibir merah dan merah muda, mengenakan set terlampir untuk membuat selfie realistis gaya 2000 (wajah terlihat 100% sama, tidak boleh diedit) 

Foto wajah sudut tinggi close-up. Seorang gadis cantik dan bergaya sedang mengambil selfie menggunakan flash wajah. 
Suasana di dalam ruangan, background ruangan berwarna hitam abu-abu, dengan cermin yang mencerminkan suasana kota di malam hari. 
Kuncir kuda tinggi berwarna gelap, diikat dengan jepit rambut besar di belakang, diikat sedikit di depan, rambut tergerai alami sesuai postur, tidak boleh mengubah wajah. 
Wajah dan kulitnya terlihat mulus dan bercahaya, mencolok dengan cahaya lembut ruangan. 
Mengenakan kemeja terpasang, dia duduk di samping tempat tidur. Cahaya redup dan redup membuatnya tampak kesepian. Dia menyalakan lampu kilat difusi cahaya, membuatnya tampak anggun. Dia berpose seksi dan melamun. Fokus pada wajah dan tunjukkan ekspresi wajah sesuai isyarat tanpa mengubah wajah. Rasanya seperti mengambil selfie dengan kamera. 

Pegang kamera tinggi-tinggi, gunakan flash secara langsung dengan efek cahaya menyebar yang lembut, menonjolkan cahaya yang agak terlalu terang dan tekstur gambar yang cukup kasar. 

Diambil dengan kamera digital kualitas rendah, gaya tahun 2000-an. 

Gunakan flash lurus dengan efek cahaya menyebar yang lembut (soft diffused glow), cahaya flash yang menyebar, highlight yang sedikit over-slighted, dan tekstur yang sedikit grainy. 

Suasana gambar mentah, alam, suasana vintage digital, rasio 4:3, gambar diam, gambar sinematik, foto fesyen, editor 8K, mahakarya. Salin wajah asli dari gambar yang saya unggah.`
}, {
    name: "Sensual Gold Mirror ✨",
    prompt: `A stunning woman (face reference only) sitting in front

of a large mirror, her reflection clearly visible and perfectly aligned. She poses in a sensual and confident way, gazing into the mirror with a deep, mysterious expression. Her look conveys intensity and allure - a mix of confidence and seduction. She wears a dark off-shoulder dress with elegant draped fabric around her arms, showing her smooth shoulders and legs. The lighting is warm and golden, coming from a vertical tube light beside the mirror, softly illuminating her face and creating a glowing highlight on her cheek and collarbone. The rest of the room is dimly lit, emphasizing the contrast between light and shadow. Her hair is styled to look slightly messy on top, giving a natural but sexy volume, with a few loose strands falling across her forehead and cheek, catching the light beautifully. The reflection in the mirror shows both her front and her back from the side, enhancing the depth and elegance of the composition. The background wall is in a loft-style texture, mixed with a marble or stone finish in brown tones, accentuated with gold metallic details. A dark wooden frame surrounds the mirror, adding warmth and contrast to the luxurious setting. The overall tone of the image is intimate, glamorous,

and cinematic - perfect balance between elegance

and sensuality`
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
        return conn.reply(m.chat, '⏳ Fitur AI *Mirror Cewek* sedang digunakan oleh pengguna lain. Mohon tunggu sebentar...', m, {
            quoted: fkontak
        });
    }
    if (isCooldown) {
        return conn.reply(m.chat, '⏳ Fitur *Mirror Cewek* baru saja selesai digunakan. Mohon tunggu 10 detik sebelum mencoba lagi.', m, {
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
                            text: `*Berikut adalah ${carouselCards.length} hasil AI Mirror Cewek:*`
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

handler.help = ["mirrorcewek <nama>"];
handler.tags = ["ai"];
handler.command = ["mirrorcewek"];
handler.limit = true;
handler.register = true;

export default handler;