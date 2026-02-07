export async function before(m) {
    this.autosholat = this.autosholat || {};
    let id = m.chat;

    if (id in this.autosholat) return false;

    let jadwalSholat = global.waktuSholat;

    const date = new Date((new Date).toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const timeNow = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

    for (const [sholat, waktu] of Object.entries(jadwalSholat)) {
        if (timeNow === waktu) {
            try {
                await this.sendMessage(m.chat, {
                    audio: { url: 'https://files.catbox.moe/g5s9z6.opus' },
                    mimetype: 'audio/mpeg',
                    ptt: true,
                    contextInfo: {
                        externalAdReply: {
                            title: `Waktu Sholat ${sholat}`,
                            body: `🧸 Pengingat sholat untuk wilayah Bandung dan sekitarnya`,
                            thumbnailUrl: 'https://files.catbox.moe/epk5tl.jpg',
                            mediaType: 1,
                            renderLargerThumbnail: true,
                            sourceUrl: 'https://castoAyaka.my.id'
                        }
                    }
                }, { quoted: m });

                this.autosholat[id] = setTimeout(() => {
                    delete this.autosholat[id];
                }, 57000);
            } catch (e) {}
        }
    }
}

export const disabled = false;