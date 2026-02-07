import axios from 'axios';

let handler = async (m, { conn, text, args, command }) => {
    const url = 'https://samehadaku.mba';
    const inputDay = text.trim();

    if (!inputDay) {
        return conn.reply(m.chat, `Contoh penggunaan:\n.samehadaku sabtu\n.samehadaku all`, m);
    }

    const days = [
        { id: 'Senin', en: 'monday' },
        { id: 'Selasa', en: 'tuesday' },
        { id: 'Rabu', en: 'wednesday' },
        { id: 'Kamis', en: 'thursday' },
        { id: 'Jumat', en: 'friday' },
        { id: 'Sabtu', en: 'saturday' },
        { id: 'Minggu', en: 'sunday' }
    ];

    try {
        if (inputDay.toLowerCase() === 'all') {
            let textOutput = '*Jadwal Rilis Anime di Samehadaku*\n\n';

            for (const day of days) {
                const res = await axios.get(`${url}/wp-json/custom/v1/all-schedule`, {
                    params: { perpage: 20, day: day.en },
                    headers: {
                        'User-Agent': 'Mozilla/5.0'
                    }
                });

                if (res.data.length > 0) {
                    textOutput += `*${day.id}:*\n`;
                    res.data.forEach(item => {
                        textOutput += `• ${item.title} (${item.east_time})\n`;
                    });
                    textOutput += '\n';
                } else {
                    textOutput += `*${day.id}:* Tidak ada jadwal.\n\n`;
                }
            }

            return conn.reply(m.chat, textOutput.trim(), m);
        }

        const dayObj = days.find(d => d.id.toLowerCase() === inputDay.toLowerCase());
        if (!dayObj) {
            return conn.reply(m.chat, `Hari "${inputDay}" tidak valid!\nPilih: Senin, Selasa, Rabu, Kamis, Jumat, Sabtu, Minggu, atau all.`, m);
        }

        const res = await axios.get(`${url}/wp-json/custom/v1/all-schedule`, {
            params: { perpage: 20, day: dayObj.en },
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });

        if (res.data.length === 0) {
            return conn.reply(m.chat, `Tidak ada jadwal rilis anime untuk hari *${dayObj.id}*`, m);
        }

        let textOutput = `*Jadwal Anime di Samehadaku - ${dayObj.id}*\n\n`;
        res.data.forEach(item => {
            textOutput += `• *${item.title}* (${item.east_time})\n`;
            textOutput += `  Genre: ${item.genre}\n`;
            textOutput += `  Type: ${item.east_type} | Score: ${item.east_score}\n`;
            textOutput += `  [Link](${item.url})\n\n`;
        });

        return conn.reply(m.chat, textOutput.trim(), m, { linkPreview: false });
    } catch (e) {
        console.error(e);
        return conn.reply(m.chat, `Gagal mengambil jadwal Samehadaku. Coba lagi nanti.`, m);
    }
};

handler.command = /^samehadaku$/i;
handler.help = ['samehadaku <hari/all>'];
handler.tags = ['anime'];
handler.limit = 1;

export default handler;